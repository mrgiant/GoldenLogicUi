import { computed, onMounted, ref, watch } from "vue";
import { glLocale } from "./localeStore";

/**
 * The state behind every translatable field.
 *
 * One object, keyed by locale, owned by the component. The visible control —
 * input, textarea, TinyMCE, CodeMirror — is a view of the entry for whichever
 * language the shared selector has chosen; switching language is a re-render,
 * not a DOM walk. This replaces the document-scanning multilingual plugin,
 * whose habit of holding DOM nodes meant any remounted field detached from it
 * and lost its text.
 *
 * Contract kept from the old engine, because forms and the Laravel side lean
 * on both halves of it:
 *
 *   - the parent is always handed a JSON *string*. Forms initialise the field
 *     as {} and submit whatever they hold; prepareTranslations() json_decodes
 *     it and throws on anything that is not a string.
 *   - every platform locale is present, empty string when untyped. The old
 *     plugin pre-filled them, and the backend indexes the default locale out
 *     of the array without checking.
 */
export function useTranslations(props, emit, onAdopt = null) {
  /** Per-locale text, e.g. { en: "Summer sale", ar: "تخفيضات الصيف" }. */
  const labels = ref({});

  const withAllLocales = (value) => {
    const filled = { ...value };

    glLocale.locals.forEach((locale) => {
      if (typeof filled[locale] !== "string") {
        filled[locale] = "";
      }
    });

    return filled;
  };

  /**
   * The prop arrives as an object from freshly initialised forms and as a JSON
   * string from records loaded off the API. Both normalise to an object;
   * anything unreadable normalises to empty rather than throwing mid-render.
   */
  const parseTranslations = (value) => {
    if (value && typeof value === "object") {
      return withAllLocales(value);
    }

    if (typeof value === "string" && value !== "") {
      try {
        const parsed = JSON.parse(value);

        return withAllLocales(parsed && typeof parsed === "object" ? parsed : {});
      } catch (error) {
        return withAllLocales({});
      }
    }

    return withAllLocales({});
  };

  const asJson = () => JSON.stringify(labels.value);

  const emitAll = (text) => {
    emit("update:modelValueTranslate", asJson());

    if (text !== undefined) {
      emit("update:modelValue", text);
    }
  };

  /**
   * Adopt the parent's value whenever it genuinely differs — an edit modal
   * populating its form, a reset after save. Comparing serialised forms is
   * what stops the adoption echoing back the emit that caused it.
   */
  watch(
    () => props.modelValueTranslate,
    (value) => {
      const incoming = parseTranslations(value);

      if (JSON.stringify(incoming) !== asJson()) {
        labels.value = incoming;

        if (onAdopt) {
          onAdopt();
        }
      }
    },
    { immediate: true }
  );

  /**
   * The locale list is fetched, so it can land after this field has mounted.
   * Backfill the new locales and hand the parent the widened string.
   */
  watch(
    () => glLocale.locals,
    () => {
      labels.value = withAllLocales(labels.value);
      emitAll();
    }
  );

  /**
   * The old engine stringified every field before save; forms submit whatever
   * they hold. Normalising at mount means an untouched field still submits
   * {"en":"","ar":""} rather than a raw object the backend cannot decode.
   */
  onMounted(() => {
    emitAll();
  });

  const currentText = computed(() => labels.value[glLocale.current] ?? "");

  /** The user typed: record it against the language on screen and tell the parent. */
  const setCurrent = (text) => {
    labels.value[glLocale.current] = text;
    emitAll(text);
  };

  return { glLocale, labels, parseTranslations, asJson, currentText, setCurrent, emitAll };
}
