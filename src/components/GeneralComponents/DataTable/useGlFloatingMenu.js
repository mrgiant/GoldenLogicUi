import { nextTick, onBeforeUnmount, ref } from "vue";

const GAP = 4;
const MARGIN = 8;

/**
 * A row menu that opens over the page instead of inside its table, so the
 * table's scroll box can't clip it. It sits under its button, or over it
 * when there is no room below, against the button's end edge (the left
 * edge in RTL). It closes on Escape, on resize and on any scroll, since a
 * fixed menu doesn't follow its button.
 *
 * Bind `menu` as the ref of the menu element, `style` as its style and
 * `toggle` to the button's click. The menu element takes `fixed`.
 */
export function useGlFloatingMenu() {
    const open = ref(false);
    const menu = ref(null);
    const style = ref({});
    let trigger = null;

    const onKeydown = (event) => {
        if (event.key === "Escape") {
            close();
        }
    };

    const bind = () => {
        window.addEventListener("scroll", close, true);
        window.addEventListener("resize", close);
        document.addEventListener("keydown", onKeydown);
    };

    const unbind = () => {
        window.removeEventListener("scroll", close, true);
        window.removeEventListener("resize", close);
        document.removeEventListener("keydown", onKeydown);
    };

    /**
     * Where the menu goes, from the size it rendered at. A transformed
     * ancestor (a modal, say) moves a fixed element with it, so the menu
     * is placed once, measured, and moved back by however far it landed
     * off the mark.
     */
    const place = async () => {
        if (!trigger || !menu.value) {
            return;
        }

        const button = trigger.getBoundingClientRect();
        const width = menu.value.offsetWidth;
        const height = menu.value.offsetHeight;
        const below = window.innerHeight - button.bottom;
        const openUp = below < height + GAP + MARGIN && button.top > below;
        const rtl = getComputedStyle(trigger).direction === "rtl";

        const top = openUp ? Math.max(MARGIN, button.top - height - GAP) : button.bottom + GAP;
        const left = Math.min(Math.max(MARGIN, rtl ? button.left : button.right - width), window.innerWidth - width - MARGIN);

        style.value = { top: `${top}px`, left: `${left}px`, visibility: "hidden" };
        await nextTick();

        if (!menu.value) {
            return;
        }

        const landed = menu.value.getBoundingClientRect();

        style.value = { top: `${2 * top - landed.top}px`, left: `${2 * left - landed.left}px` };
    };

    const show = (event) => {
        trigger = event.currentTarget;
        style.value = { top: "0px", left: "0px", visibility: "hidden" };
        open.value = true;
        bind();
        nextTick(place);
    };

    function close() {
        open.value = false;
        unbind();
    }

    const toggle = (event) => (open.value ? close() : show(event));

    onBeforeUnmount(unbind);

    return { open, menu, style, toggle, close };
}
