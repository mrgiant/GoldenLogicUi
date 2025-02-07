(function (window, document) {
  "use strict";

  var pluginName = "multilingual",
    defaults = {
      type: "normal",
      editing: false,

      transInputs: "input[data-i18n=true]",
      trans_selector_name: "i18n_selector",

      // langSelectors: 'input[name="i18n_selector"]'
      langSelectors: ".language-selector",
    };

  function Plugin(container, options) {
    this.container = container;
    this.element = document.querySelector(container);

    this.settings = Object.assign({}, defaults, options);
    this._defaults = defaults;
    this._name = pluginName;
    this.init();
  }

  Object.assign(Plugin.prototype, {
    init: function () {
      var language_selector = this.element.querySelector(
        this.settings.langSelectors
      );

      this.transInputs = this.element.querySelectorAll(
        this.settings.transInputs
      );

      this.langSelectors = language_selector.querySelectorAll("input");

      if (this.transInputs.length === 0 || this.langSelectors.length === 0) {
        return false;
      }

      this.setup();
      this.refresh();
    },

    setup: function () {
      var _this = this;

      this.locale = this.returnLocale();

      var js_language_labels =
        this.element.querySelectorAll(".js-language-label");

      if (js_language_labels) {
        js_language_labels.forEach(function (label) {
          label.textContent = this.locale;
        }, this);
      }

      this.langSelectors.forEach(function (btn) {
        btn.addEventListener("change", _this.selectLanguage.bind(_this));
      });
    },

    refresh: function () {
      var _this = this;

      /**
       * Setup translatable inputs
       */
      this.transInputs.forEach(function (inp) {
        var _inp = inp,
          inpUsr = _inp.nextElementSibling.classList.contains(
            _this.settings.editing ? "form-input-translation" : "input_tr_show"
          )
            ? _inp.nextElementSibling
            : null;

        if (inpUsr) {
          inpUsr.dataset.inp = _inp.id;
          _inp.dataset.inpUsr = inpUsr.id;
        }

        // Load and Save data in hidden input
        var $_data = _this.loadJsonField(_inp.value);
        if (_this.settings.editing) {
          _inp.value = JSON.stringify($_data);
        }

        _this.langSelectors.forEach(function (btn) {
          _inp.dataset[btn.value] = $_data[btn.value]; // Save translation in mem

          if (btn.value === _this.locale) {
            _this.loadLang(_inp, btn.value); // Load active locale
          }
        });
      });
    },

    findNextSibling: function (element, selector) {
      var nextSibling = element.nextElementSibling;

      while (nextSibling && !nextSibling.matches(selector)) {
        nextSibling = nextSibling.nextElementSibling;
      }

      return nextSibling;
    },

    loadJsonField: function (str) {
      var $_data = {};

      if (this.isJsonValid(str)) {
        $_data = JSON.parse(str);

        this.langSelectors.forEach(function (btn) {
          $_data[btn.value] = $_data[btn.value] || "";
        });

        return $_data;
      }

      this.langSelectors.forEach(function (btn) {
        $_data[btn.value] = "";
      });

      return $_data;
    },

    isJsonValid: function (str) {
      try {
        JSON.parse(str);
      } catch (ex) {
        return false;
      }
      return true;
    },

    returnLocale: function () {
      var selectedRadioButton = this.element.querySelector(
        'input[name="' + this.settings.trans_selector_name + '"]:checked'
      );

      return selectedRadioButton ? selectedRadioButton.value : "";
    },

    selectLanguage: function (e) {
      var _this = this,
        lang = e.target.value;

      this.transInputs.forEach(function (inp) {
        if (_this.settings.editing) {
          _this.updateInputCache(inp);
          var event = new Event("change");
          inp.dispatchEvent(event);
        }

        _this.loadLang(inp, lang);
      });

      this.locale = lang;

      var js_language_labels =
        this.element.querySelectorAll(".js-language-label");

      if (js_language_labels) {
        js_language_labels.forEach(function (label) {
          label.textContent = lang;
        }, this);
      }
    },

    prepareData: function () {
      var _this = this;
      this.transInputs.forEach(function (inp) {
        _this.updateInputCache(inp);

        var event = new Event("change");
        inp.dispatchEvent(event);
      });
    },

    updateInputCache: function (inp) {
      var _this = this;
      var inpUsr = inp.dataset.inpUsr;

      var $_val = document.getElementById(inpUsr).value;
      var $_data = {}; // Create new data

      if (document.getElementById(inpUsr).classList.contains("tiny")) {
        var $_mce = tinymce.get(document.getElementById(inpUsr).name);
        $_val = $_mce.getContent();
      }

      if (document.getElementById(inpUsr).classList.contains("CodeEditor")) {
        //let cmEditorElement = document.querySelector(".cm-editor") // Or whatever query you need
        let cmEditorElement = document.getElementById(inpUsr);
        let editorView =
          cmEditorElement.querySelector(".cm-content").cmView.view;

        let editorValue = editorView.state.doc.toString();

        $_val = editorValue;
      }

      /*
            if (document.querySelector(inpUsr).classList.contains('richTextBox')) {
                var $_mce = tinymce.get('richtext' + document.querySelector(inpUsr).name);
                $_val = $_mce.getContent();
            }

            if (document.querySelector(inpUsr).classList.contains('easymde')) {
                var $codemirror = document.querySelector(inpUsr).nextElementSibling.querySelector('.CodeMirror').CodeMirror;
                $_val = $codemirror.getDoc().getValue();
                $codemirror.save();
            }
            */

      _this.langSelectors.forEach(function (btn) {
        var lang = btn.value;
        $_data[lang] = _this.locale == lang ? $_val : inp.dataset[lang];
      });

      inp.value = JSON.stringify($_data);

      inp.dataset[_this.locale] = $_val; // Update single key Mem
    },

    loadLang: function (inp, lang) {
      var inpUsr = inp.dataset.inpUsr;
      var _val = inp.dataset[lang];

      if (!this.settings.editing) {
        if (this.settings.type === "tiny") {
          document.getElementById(inpUsr).innerHTML = _val;
        } else {
          document.getElementById(inpUsr).textContent = _val;
        }
      } else {
        // document.getElementById(inpUsr).value = _val;

        var _mce = tinymce.get(inpUsr);

        if (
          document.getElementById(inpUsr).classList.contains("tiny") &&
          _mce &&
          _mce.initialized
        ) {
          _mce.setContent(_val);
        } else if (
          document.getElementById(inpUsr).classList.contains("CodeEditor")
        ) {
          //let cmEditorElement = document.querySelector(".cm-editor") // Or whatever query you need
          let cmEditorElement = document.getElementById(inpUsr);
          let editorView =
            cmEditorElement.querySelector(".cm-content").cmView.view;

          // set the value of the editor
          editorView.dispatch({
            changes: { from: 0, to: editorView.state.doc.length, insert: _val },
          });
        } else {
          document.getElementById(inpUsr).value = _val;
        }
      }
    },
  });

  window.multilingual = Plugin;
})(window, document);

export default window.multilingual;
