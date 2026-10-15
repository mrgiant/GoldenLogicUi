import { onBeforeUnmount, watch } from "vue";

const FOCUSABLE = [
  "a[href]",
  "area[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type=hidden])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "iframe",
  "[contenteditable=true]",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

// Open dialogs, innermost last. Only the top one handles keys, so Escape in a
// modal opened from another modal closes just the inner one.
const openTraps = [];

let idCounter = 0;

/** A document-unique id for aria-labelledby / aria-controls wiring. */
export const nextGlId = (prefix = "gl") => `${prefix}-${++idCounter}`;

/**
 * Keep keyboard focus inside a dialog while it is open, close it on Escape,
 * and hand focus back to whatever was focused before it opened.
 *
 * @param {import('vue').Ref<HTMLElement|null>} container element holding the dialog
 * @param {() => boolean} isOpen getter (or ref) for the open state
 * @param {{ onEscape?: () => void, closeOnEscape?: () => boolean, initialFocus?: () => HTMLElement|null }} options
 */
export function useGlFocusTrap(container, isOpen, options = {}) {
  const trap = {};
  let previouslyFocused = null;
  let active = false;

  const readOpen = () => (typeof isOpen === "function" ? isOpen() : isOpen.value);

  const focusables = () => {
    const root = container.value;

    if (!root) {
      return [];
    }

    return Array.from(root.querySelectorAll(FOCUSABLE)).filter(
      (el) => el.offsetParent !== null || el === document.activeElement
    );
  };

  const onKeydown = (event) => {
    if (!active || openTraps[openTraps.length - 1] !== trap) {
      return;
    }

    if (event.key === "Escape" || event.key === "Esc") {
      const allowed = options.closeOnEscape ? options.closeOnEscape() : true;

      if (allowed && options.onEscape) {
        event.preventDefault();
        event.stopPropagation();
        options.onEscape();
      }

      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const root = container.value;
    const items = focusables();

    if (!root) {
      return;
    }

    if (items.length === 0) {
      event.preventDefault();
      root.focus();

      return;
    }

    const first = items[0];
    const last = items[items.length - 1];
    const current = document.activeElement;

    if (event.shiftKey && (current === first || !root.contains(current))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (current === last || !root.contains(current))) {
      event.preventDefault();
      first.focus();
    }
  };

  const activate = () => {
    if (active) {
      return;
    }

    active = true;
    previouslyFocused = document.activeElement;
    openTraps.push(trap);
    document.addEventListener("keydown", onKeydown, true);

    requestAnimationFrame(() => {
      const root = container.value;

      if (!active || !root || root.contains(document.activeElement)) {
        return;
      }

      const target = options.initialFocus?.() || focusables()[0] || root;
      target?.focus?.();
    });
  };

  const deactivate = (restoreFocus = true) => {
    if (!active) {
      return;
    }

    active = false;
    document.removeEventListener("keydown", onKeydown, true);

    const index = openTraps.indexOf(trap);

    if (index !== -1) {
      openTraps.splice(index, 1);
    }

    if (restoreFocus && previouslyFocused && typeof previouslyFocused.focus === "function" && document.contains(previouslyFocused)) {
      previouslyFocused.focus();
    }

    previouslyFocused = null;
  };

  watch(
    readOpen,
    (open) => {
      if (open) {
        activate();
      } else {
        deactivate();
      }
    },
    { immediate: true, flush: "post" }
  );

  onBeforeUnmount(() => deactivate());

  return { activate, deactivate };
}

export default useGlFocusTrap;
