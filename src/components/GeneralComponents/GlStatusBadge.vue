<template>
  <span
    class="inline-flex items-center font-medium rounded-full ring-1 ring-inset whitespace-nowrap"
    :class="[colors.pill, sizeClass]"
    role="status"
    :title="title || text"
  >
    <span v-if="dot" class="relative flex w-2 h-2 shrink-0" aria-hidden="true">
      <span v-if="isPulsing" class="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping" :class="colors.dot"></span>
      <span class="relative inline-flex w-2 h-2 rounded-full" :class="colors.dot"></span>
    </span>
    <i v-else-if="show_icon && resolved.icon" :class="[resolved.icon, iconSize]" aria-hidden="true"></i>
    <span>{{ text }}</span>
  </span>
</template>

<script setup>
import { computed } from "vue";
import { resolveStatus, variantState, STATES } from "./glStatusMap.js";

/**
 * One status badge: icon (or dot) + word + colour, never colour alone.
 * Prop names match the CloudPanel's in-app gl-status-badge, so it is a
 * drop-in replacement.
 *
 * <gl-status-badge :value="server.status" domain="server" />
 * <gl-status-badge status="running" dot />
 * <gl-status-badge state="failed" label="3 alerts" />
 * <gl-status-badge label="Beta" variant="info" />
 */
const props = defineProps({
  /** Raw backend value; mapped through the vocabulary for the given domain. */
  value: { type: [String, Number, Boolean], default: null },
  /** Alias of `value`. */
  status: { type: [String, Number, Boolean], default: null },
  /** Domain table used to map the value (auto, general, server, availability, deployment, backup, restore, ai, invoice, toggle, docker, run). */
  domain: { type: String, default: "auto" },
  /** Force a vocabulary state directly (healthy|running|queued|attention|failed|disabled); wins over value/status. */
  state: { type: String, default: "" },
  /** Word to show instead of the mapped label. */
  label: { type: String, default: "" },
  title: { type: String, default: "" },
  /** xs | sm | md */
  size: { type: String, default: "sm" },
  /** Colour override: a state name or success|info|warning|danger|error|neutral|muted (and colour names). */
  variant: { type: String, default: "" },
  /** Show a dot instead of the icon. */
  dot: { type: Boolean, default: false },
  /** Pulse the dot; by default it pulses for running states. */
  pulse: { type: Boolean, default: null },
  /** Show the state icon (Font Awesome classes) when no dot is shown. */
  show_icon: { type: Boolean, default: true },
});

const rawValue = computed(() => (props.value !== null && props.value !== undefined ? props.value : props.status));

const resolved = computed(() => {
  if (props.state) {
    return resolveStatus(props.state);
  }

  // A badge with only a label and a variant has nothing to map.
  if ((rawValue.value === null || rawValue.value === undefined || rawValue.value === "") && props.variant) {
    const state = variantState(props.variant) || "queued";

    return { state, label: STATES[state].word, raw: null, ...STATES[state] };
  }

  return resolveStatus(rawValue.value, props.domain);
});

const colors = computed(() => {
  const state = props.variant ? variantState(props.variant) : null;

  return state ? STATES[state] : resolved.value;
});

const text = computed(() => props.label || resolved.value.label);

const isPulsing = computed(() => (props.pulse === null ? !!colors.value.pulse : props.pulse));

const sizeClass = computed(() => {
  if (props.size === "xs") {
    return "gap-1 px-2 py-0.5 text-xs";
  }

  if (props.size === "md") {
    return "gap-2 px-3 py-1.5 text-sm";
  }

  return "gap-1.5 px-2.5 py-1 text-xs";
});

const iconSize = computed(() => (props.size === "md" ? "text-sm" : "text-[11px]"));
</script>
