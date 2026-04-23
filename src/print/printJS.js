/**
 * printJS — single-file print utility.
 *
 * Usage:
 *   import { printJS } from '/src/print/print.js'
 *
 *   printJS({ printable: data, type: 'json', properties, ... })
 *
 * Supported types: 'pdf', 'html', 'image', 'json', 'raw-html'
 *
 * Common options:
 *   printable            any      — data / element id / url to print
 *   type                 string   — print type (default: 'pdf')
 *   properties           array    — column definitions for JSON type [{ field, displayName }]
 *   documentTitle        string   — document title in print dialog
 *   header               string   — text or HTML injected above content
 *   footer               string   — text or HTML injected below content
 *   css                  string   — external CSS file URL(s)
 *   style                string   — raw CSS string injected into print frame
 *   gridHeaderStyle      string   — inline style for JSON table header cells
 *   gridStyle            string   — inline style for JSON table body cells
 *   repeatTableHeader    boolean  — repeat thead on every page (default: true)
 *   showModal            boolean  — show loading overlay while preparing
 *   modalMessage         string   — loading overlay text
 *   onLoadingStart       fn()     — called when print is triggered
 *   onLoadingEnd         fn()     — called when iframe is ready
 *   onPrintDialogClose   fn()     — called when print dialog closes
 *   onError              fn(err)  — called on error
 */

// ─── Browser detection ────────────────────────────────────────────────────────
const Browser = {
  isFirefox: () => typeof InstallTrigger !== 'undefined',
  getFirefoxMajorVersion: (ua = navigator.userAgent) => {
    const m = ua.toLowerCase().match(/firefox\/(\S+)/)
    return m ? parseInt(m[1]) : 0
  },
  isIE: () => navigator.userAgent.indexOf('MSIE') !== -1 || !!document.documentMode,
  isEdge: () => !Browser.isIE() && !!window.StyleMedia,
  isChrome: (ctx = window) => !!ctx.chrome,
  isSafari: () =>
    Object.prototype.toString.call(window.HTMLElement).indexOf('Constructor') > 0 ||
    navigator.userAgent.toLowerCase().indexOf('safari') !== -1,
}

// ─── Modal ────────────────────────────────────────────────────────────────────
const Modal = {
  show (params) {
    const modal = document.createElement('div')
    modal.id = 'printJS-Modal'
    modal.setAttribute('style',
      'font-family:sans-serif;display:table;text-align:center;font-weight:300;' +
      'font-size:30px;left:0;top:0;position:fixed;z-index:9990;color:#0460B5;' +
      'width:100%;height:100%;background-color:rgba(255,255,255,.9);transition:opacity .3s ease;'
    )
    const content = document.createElement('div')
    content.setAttribute('style', 'display:table-cell;vertical-align:middle;padding-bottom:100px;')
    const closeBtn = document.createElement('div')
    closeBtn.id = 'printClose'
    closeBtn.className = 'printClose'
    closeBtn.addEventListener('click', () => Modal.close())
    content.appendChild(closeBtn)
    const spinner = document.createElement('span')
    spinner.className = 'printSpinner'
    content.appendChild(spinner)
    content.appendChild(document.createTextNode(params.modalMessage))
    modal.appendChild(content)
    document.body.appendChild(modal)
  },
  close () {
    const modal = document.getElementById('printJS-Modal')
    if (modal) modal.parentNode.removeChild(modal)
  },
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function isRawHTML (raw) {
  return /<([A-Za-z][A-Za-z0-9]*)\b[^>]*>(.*?)<\/\1>/.test(raw)
}

function capitalize (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function collectStyles (element, params) {
  const win = document.defaultView || window
  let style = ''
  const computed = win.getComputedStyle(element, '')
  for (let i = 0; i < computed.length; i++) {
    const key = computed[i]
    const matchAll = params.targetStyles.indexOf('*') !== -1
    const matchStyle = params.targetStyle.indexOf(key) !== -1
    const matchPrefix = !matchAll && params.targetStyles.some(s => key.startsWith(s))
    if (matchAll || matchStyle || matchPrefix) {
      const val = computed.getPropertyValue(key)
      if (val) style += key + ':' + val + ';'
    }
  }
  return style
}

function addHeader (el, params) {
  const wrap = document.createElement('div')
  if (isRawHTML(params.header)) {
    wrap.innerHTML = params.header
  } else {
    const h = document.createElement('h1')
    h.appendChild(document.createTextNode(params.header))
    h.setAttribute('style', params.headerStyle)
    wrap.appendChild(h)
  }
  el.insertBefore(wrap, el.childNodes[0])
}

function addFooter (el, params) {
  const wrap = document.createElement('div')
  if (isRawHTML(params.footer)) {
    wrap.innerHTML = params.footer
  } else {
    const h = document.createElement('h1')
    h.appendChild(document.createTextNode(params.footer))
    h.setAttribute('style', params.footerStyle)
    wrap.appendChild(h)
  }
  el.insertBefore(wrap, el.childNodes[el.childNodes.length - 1])
}

// ─── Cleanup (called after print() — waits for dialog to close) ───────────────
function cleanUp (params, iframeWin) {
  if (params.showModal) Modal.close()
  if (params.onLoadingEnd) params.onLoadingEnd()
  if (params.showModal || params.onLoadingStart) {
    try { window.URL.revokeObjectURL(params.printable) } catch (e) {}
  }

  let done = false
  const finish = () => {
    if (done) return
    done = true
    window.removeEventListener('focus', focusHandler)
    if (params.onPrintDialogClose) params.onPrintDialogClose()
    const iframe = document.getElementById(params.frameId)
    if (iframe) {
      params.frameRemoveDelay
        ? setTimeout(() => iframe.remove(), params.frameRemoveDelay)
        : iframe.remove()
    }
  }

  // Primary: afterprint fires on the iframe window when the print dialog closes
  if (iframeWin) {
    iframeWin.addEventListener('afterprint', finish)
  }

  // Fallback: some browsers return focus to the parent window instead
  const focusHandler = () => finish()
  window.addEventListener('focus', focusHandler)
}

// ─── Core send + performPrint ─────────────────────────────────────────────────
function loadIframeImage (image) {
  return new Promise(resolve => {
    const poll = () => {
      !image || image.naturalWidth === 0 || !image.complete
        ? setTimeout(poll, 500)
        : resolve()
    }
    poll()
  })
}

function performPrint (iframeEl, params) {
  try {
    iframeEl.focus()
    if (Browser.isEdge() || Browser.isIE()) {
      try {
        iframeEl.contentWindow.document.execCommand('print', false, null)
      } catch (e) {
        setTimeout(() => iframeEl.contentWindow.print(), 1000)
      }
    } else {
      setTimeout(() => iframeEl.contentWindow.print(), 1000)
    }
  } catch (err) {
    params.onError(err)
  } finally {
    if (Browser.isFirefox() && Browser.getFirefoxMajorVersion() < 110) {
      iframeEl.style.visibility = 'hidden'
      iframeEl.style.left = '-1px'
    }
    cleanUp(params, iframeEl.contentWindow)
  }
}

function sendToFrame (params, printFrame) {
  document.body.appendChild(printFrame)
  const iframeEl = document.getElementById(params.frameId)

  iframeEl.onload = () => {
    if (params.type === 'pdf') {
      Browser.isFirefox() && Browser.getFirefoxMajorVersion() < 110
        ? setTimeout(() => performPrint(iframeEl, params), 1000)
        : performPrint(iframeEl, params)
      return
    }

    let doc = iframeEl.contentWindow || iframeEl.contentDocument
    if (doc.document) doc = doc.document
    doc.body.appendChild(params.printableElement)

    if (params.style) {
      const s = doc.createElement('style')
      s.innerHTML = params.style
      doc.head.appendChild(s)
    }

    const images = doc.getElementsByTagName('img')
    if (images.length > 0) {
      Promise.all(Array.from(images).map(img =>
        img.src && img.src !== window.location.href ? loadIframeImage(img) : Promise.resolve()
      )).then(() => performPrint(iframeEl, params))
    } else {
      performPrint(iframeEl, params)
    }
  }
}

// ─── Build iframe ─────────────────────────────────────────────────────────────
function buildFrame (params) {
  const existing = document.getElementById(params.frameId)
  if (existing) existing.parentNode.removeChild(existing)

  const frame = document.createElement('iframe')

  if (Browser.isFirefox()) {
    frame.setAttribute('style',
      'width:1px;height:100px;position:fixed;left:0;top:0;opacity:0;border-width:0;margin:0;padding:0;'
    )
  } else {
    frame.setAttribute('style',
      'visibility:hidden;height:0;width:0;position:absolute;border:0;'
    )
  }

  frame.setAttribute('id', params.frameId)

  if (params.type !== 'pdf') {
    let srcdoc = '<html><head><title>' + params.documentTitle + '</title>'
    if (params.css) {
      const files = Array.isArray(params.css) ? params.css : [params.css]
      files.forEach(f => { srcdoc += '<link rel="stylesheet" href="' + f + '">' })
    }
    srcdoc += '</head><body></body></html>'
    frame.srcdoc = srcdoc
  }

  return frame
}

// ─── Mobile print via window.open popup ──────────────────────────────────────
// Android Chrome bug: iframeWin.print() always opens the PARENT page's print
// dialog. The only fix is a real popup opened synchronously in the click handler.
// By the time we get here the window is already open — we just write HTML into it.
//
// We do NOT inline page CSS — for JSON/html-with-inline-styles types the content
// already carries its own inline styles. Inlining the full Tailwind stylesheet
// makes the popup document too large and causes the "problem printing" error.
function sendToMobile (params) {
  const pw = params.mobileWin

  // Guard: popup was blocked by the browser
  if (!pw || pw.closed) {
    if (params.onPrintDialogClose) params.onPrintDialogClose()
    return
  }

  const bodyHtml = params.printableElement ? params.printableElement.outerHTML : ''
  const html = [
    '<!DOCTYPE html><html>',
    '<head>',
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width,initial-scale=1">',
    `<title>${params.documentTitle || ''}</title>`,
    '<style>',
    'body{margin:16px;font-family:sans-serif;}',
    'table{border-collapse:collapse;width:100%;}',
    '@media print{body{margin:0;}}',
    '</style>',
    '</head>',
    `<body>${bodyHtml}</body>`,
    '</html>',
  ].join('')

  let printed = false
  let safety

  const cleanup = () => {
    clearTimeout(safety)
    if (params.onPrintDialogClose) params.onPrintDialogClose()
    // Delay close so Android finishes writing the PDF before we destroy the window
    setTimeout(() => { try { pw.close() } catch (e) {} }, 2000)
  }

  const doPrint = () => {
    if (printed) return
    printed = true
    pw.addEventListener('afterprint', cleanup)
    // Safety net: afterprint never fires on some Android WebViews
    safety = setTimeout(cleanup, 120000)
    pw.focus()
    pw.print()
  }

  // onload fires once pw.document.close() is called in most browsers
  pw.onload = () => { pw.onload = null; doPrint() }
  pw.document.open()
  pw.document.write(html)
  pw.document.close()
  // Fallback: onload doesn't fire on some Android WebViews after document.write
  setTimeout(doPrint, 2500)
}

// ─── Type handlers ────────────────────────────────────────────────────────────
function cloneElement (element, params) {
  const clone = element.cloneNode()
  Array.prototype.slice.call(element.childNodes).forEach(child => {
    if (params.ignoreElements.indexOf(child.id) === -1) {
      clone.appendChild(cloneElement(child, params))
    }
  })
  if (params.scanStyles && element.nodeType === 1) {
    clone.setAttribute('style', collectStyles(element, params))
  }
  if (element.tagName === 'SELECT') clone.value = element.value
  if (element.tagName === 'CANVAS') {
    try { clone.getContext('2d').drawImage(element, 0, 0) } catch (e) {}
  }
  return clone
}

function printHtml (params, frame) {
  const el = (typeof params.printable === 'object' && params.printable instanceof HTMLElement)
    ? params.printable
    : document.getElementById(params.printable)

  if (!el) { console.error('printJS: element not found:', params.printable); return }

  params.printableElement = cloneElement(el, params)
  if (params.header) addHeader(params.printableElement, params)
  if (params.footer) addFooter(params.printableElement, params)
  if (frame) sendToFrame(params, frame)
}

function printRawHtml (params, frame) {
  params.printableElement = document.createElement('div')
  params.printableElement.setAttribute('style', 'width:100%')
  params.printableElement.innerHTML = params.printable
  if (params.header) addHeader(params.printableElement, params)
  if (params.footer) addFooter(params.printableElement, params)
  if (frame) sendToFrame(params, frame)
}

function printImage (params, frame) {
  const srcs = Array.isArray(params.printable) ? params.printable : [params.printable]
  params.printableElement = document.createElement('div')
  srcs.forEach(src => {
    const img = document.createElement('img')
    img.setAttribute('style', params.imageStyle)
    img.src = Browser.isFirefox() ? new Image(0, 0).src = src || src : src
    const wrap = document.createElement('div')
    wrap.appendChild(img)
    params.printableElement.appendChild(wrap)
  })
  if (params.header) addHeader(params.printableElement, params)
  if (params.footer) addFooter(params.printableElement, params)
  if (frame) sendToFrame(params, frame)
}

function printJson (params, frame) {
  if (typeof params.printable !== 'object') throw new Error('Invalid JSON data.')
  if (!Array.isArray(params.properties)) throw new Error('Invalid properties for JSON.')

  params.properties = params.properties.map(p => ({
    field:       typeof p === 'object' ? p.field       : p,
    displayName: typeof p === 'object' ? p.displayName : p,
    columnSize:  typeof p === 'object' && p.columnSize
      ? p.columnSize + ';'
      : (100 / params.properties.length) + '%;',
  }))

  params.printableElement = document.createElement('div')
  if (params.header) addHeader(params.printableElement, params)

  let html = '<table style="border-collapse:collapse;width:100%;">'
  if (params.repeatTableHeader) html += '<thead>'
  html += '<tr>'
  params.properties.forEach(p => {
    html += `<th style="width:${p.columnSize};${params.gridHeaderStyle}">${capitalize(p.displayName)}</th>`
  })
  html += '</tr>'
  if (params.repeatTableHeader) html += '</thead>'
  html += '<tbody>'
  params.printable.forEach(row => {
    html += '<tr>'
    params.properties.forEach(p => {
      let val = row
      p.field.split('.').forEach(k => { val = val ? val[k] : '' })
      html += `<td style="width:${p.columnSize};${params.gridStyle}">${val ?? ''}</td>`
    })
    html += '</tr>'
  })
  html += '</tbody></table>'

  params.printableElement.innerHTML += html
  if (params.footer) addFooter(params.printableElement, params)
  if (frame) sendToFrame(params, frame)
}

function printPdf (params, frame) {
  if (Browser.isIE()) {
    try {
      const w = window.open(params.fallbackPrintable, '_blank')
      w.focus()
      params.onIncompatibleBrowser()
    } catch (e) { params.onError(e) }
    finally {
      if (params.showModal) Modal.close()
      if (params.onLoadingEnd) params.onLoadingEnd()
    }
    return
  }

  if (params.base64) {
    let b64 = params.printable
    if (b64.indexOf(',') !== -1) b64 = b64.split(',')[1]
    const bytes = Uint8Array.from(atob(b64), c => c.charCodeAt(0))
    const blob = new Blob([bytes], { type: 'application/pdf' })
    frame.setAttribute('src', URL.createObjectURL(blob))
    sendToFrame(params, frame)
    return
  }

  const url = /^(blob|http|\/\/)/i.test(params.printable)
    ? params.printable
    : window.location.origin + (params.printable.startsWith('/') ? '' : '/') + params.printable

  const xhr = new XMLHttpRequest()
  xhr.responseType = 'arraybuffer'
  xhr.addEventListener('error', () => { cleanUp(params); params.onError(xhr.statusText, xhr) })
  xhr.addEventListener('load', () => {
    if (![200, 201].includes(xhr.status)) { cleanUp(params); params.onError(xhr.statusText, xhr); return }
    const blob = new Blob([xhr.response], { type: 'application/pdf' })
    frame.setAttribute('src', URL.createObjectURL(blob))
    sendToFrame(params, frame)
  })
  xhr.open('GET', url, true)
  xhr.send()
}

// ─── Main printJS function ────────────────────────────────────────────────────
const PRINT_TYPES = ['pdf', 'html', 'image', 'json', 'raw-html']

function printJS (args, type) {
  const params = {
    printable: null, fallbackPrintable: null, type: 'pdf',
    header: null, headerStyle: 'font-weight:300;',
    footer: null, footerStyle: 'font-weight:300;',
    maxWidth: 800, properties: null,
    gridHeaderStyle: 'font-weight:bold;padding:5px;border:1px solid #dddddd;',
    gridStyle: 'border:1px solid lightgray;margin-bottom:-1px;',
    showModal: false, modalMessage: 'Retrieving Document...',
    onError: (err) => { throw err },
    onLoadingStart: null, onLoadingEnd: null,
    onPrintDialogClose: () => {}, onIncompatibleBrowser: () => {},
    mobileWin: null,
    frameId: 'printJS', frameRemoveDelay: null, printableElement: null,
    documentTitle: 'Document',
    targetStyle: ['clear', 'display', 'width', 'min-width', 'height', 'min-height', 'max-height'],
    targetStyles: ['border', 'box', 'break', 'text-decoration'],
    ignoreElements: [], repeatTableHeader: true,
    css: null, style: null, scanStyles: true, base64: false,
    imageStyle: 'max-width:100%;',
    // deprecated
    font: 'TimesNewRoman', font_size: '12pt',
    honorMarginPadding: true, honorColor: false,
  }

  if (args === undefined) throw new Error('printJS expects at least 1 argument.')

  if (typeof args === 'string') {
    params.printable = encodeURI(args)
    params.fallbackPrintable = params.printable
    params.type = type || params.type
  } else if (typeof args === 'object') {
    params.printable = args.printable
    params.fallbackPrintable = args.fallbackPrintable ?? params.printable
    if (args.base64) params.fallbackPrintable = `data:application/pdf;base64,${params.fallbackPrintable}`
    Object.keys(params).forEach(k => {
      if (k !== 'printable' && k !== 'fallbackPrintable' && args[k] !== undefined) {
        params[k] = args[k]
      }
    })
  } else {
    throw new Error('Unexpected argument type: ' + typeof args)
  }

  if (!params.printable) throw new Error('Missing printable.')
  if (!PRINT_TYPES.includes(params.type.toLowerCase())) {
    throw new Error('Invalid type. Available: ' + PRINT_TYPES.join(', '))
  }

  if (params.showModal) Modal.show(params)
  if (params.onLoadingStart) params.onLoadingStart()

  // Mobile: build the printable element first, then send to popup window
  if (params.mobileWin) {
    switch (params.type.toLowerCase()) {
      case 'html':     printHtml(params, null);    break
      case 'raw-html': printRawHtml(params, null); break
      case 'image':    printImage(params, null);   break
      case 'json':     printJson(params, null);    break
      default: break
    }
    sendToMobile(params)
    return
  }

  const frame = buildFrame(params)

  switch (params.type.toLowerCase()) {
    case 'pdf':      printPdf(params, frame);     break
    case 'html':     printHtml(params, frame);    break
    case 'raw-html': printRawHtml(params, frame); break
    case 'image':    printImage(params, frame);   break
    case 'json':     printJson(params, frame);    break
  }
}

// ─── Vue directive ────────────────────────────────────────────────────────────
export { printJS }

export default {
  directiveName: 'printJS',

  mounted (el, binding) {
    const vue = binding.instance

    el.addEventListener('click', () => {
      const val = binding.value

      // global print
      if (!val || (typeof val !== 'string' && !val.id)) {
        window.print()
        return
      }

      const rawId   = typeof val === 'string' ? val : val.id
      const cleanId = rawId.replace(/#/g, '')
      const opts    = typeof val === 'object' ? val : {}

      if (!document.getElementById(cleanId)) {
        console.error('v-print: element not found:', rawId)
        return
      }

      printJS({
        printable:          cleanId,
        type:               'html',
        documentTitle:      opts.popTitle         || '',
        header:             opts.header           || null,
        headerStyle:        opts.headerStyle       || 'font-weight:300;',
        footer:             opts.footer           || null,
        css:                opts.extraCss          || null,
        style:              opts.style             || null,
        scanStyles:         opts.scanStyles        !== false,
        targetStyles:       opts.targetStyles      || ['*'],
        targetStyle:        opts.targetStyle       || [],
        ignoreElements:     opts.ignoreElements    || [],
        maxWidth:           opts.maxWidth          || 800,
        frameId:            'printJS_' + cleanId,
        frameRemoveDelay:   opts.frameRemoveDelay  || null,
        showModal:          opts.showModal         || false,
        modalMessage:       opts.modalMessage      || 'Loading...',
        onError:            (err) => console.error('print error:', err),
        onLoadingStart:     opts.beforeOpenCallback ? () => opts.beforeOpenCallback(vue) : null,
        onLoadingEnd:       opts.openCallback       ? () => opts.openCallback(vue)       : null,
        onPrintDialogClose: opts.closeCallback      ? () => opts.closeCallback(vue)      : null,
      })
    })
  },
}
