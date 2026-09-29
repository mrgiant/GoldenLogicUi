import { reactive } from "vue";

/**
 * The language the translate fields are editing, shared by every one of them.
 *
 * This replaces the DOM-scanning multilingual plugin as the single owner of
 * "which language is on screen". The plugin mirrored state into dataset
 * attributes and hidden inputs and read it back by element id, which meant any
 * field that was unmounted and remounted — a tab behind v-if, a repeater row —
 * silently detached from it. State in a reactive object outlives the DOM by
 * construction, so those cases stop being cases.
 *
 * A module-level store rather than provide/inject because the language selector
 * and the fields are siblings inside a form, not ancestor and descendant —
 * inject can only look up the tree. One selector on screen at a time is the
 * working assumption everywhere this library is used; two selectors would
 * simply stay in sync, which is also correct.
 */
export const glLocale = reactive({
  /** The locale currently being edited. */
  current: "",

  /** The application's default locale — the one validation reads. */
  default: "",

  /** Every locale the platform runs in. */
  locals: [],
});

/**
 * Seed the store from the locales endpoint.
 *
 * The current selection is only set when empty or no longer valid: a second
 * selector mounting (an edit modal opening next to an add modal) must not yank
 * the language out from under a form someone is already typing in.
 */
export function setGlLocales(locals, defaultLanguage) {
  glLocale.locals = Array.isArray(locals) ? locals : [];
  glLocale.default = defaultLanguage || glLocale.locals[0] || "";

  if (!glLocale.current || !glLocale.locals.includes(glLocale.current)) {
    glLocale.current = glLocale.default;
  }
}
