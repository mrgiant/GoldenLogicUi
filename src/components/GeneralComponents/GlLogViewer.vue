<template>
  <section
    class="flex flex-col overflow-hidden border border-gray-200 rounded-xl dark:border-gray-700 bg-gray-950 text-gray-100"
    :aria-label="title || 'Log output'"
  >
    <header class="flex flex-wrap items-center gap-2 px-3 py-2 text-xs border-b border-white/10 bg-gray-900">
      <GlStatusBadge v-if="showStatus && hasStatus" :value="status" :domain="domain" size="xs" />
      <span v-if="title" class="font-semibold text-gray-200 truncate">{{ title }}</span>
      <span v-if="lineCount" class="text-gray-500">{{ lineCount }} {{ lineCount === 1 ? "line" : "lines" }}</span>
      <slot name="header"></slot>

      <div class="flex items-center gap-1 ms-auto">
        <button
          type="button"
          class="inline-flex items-center gap-1 px-2 py-1 rounded-md hover:bg-white/10 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary"
          :class="following ? 'text-green-300' : 'text-gray-300'"
          :aria-pressed="following ? 'true' : 'false'"
          :title="language?.follow_title ?? 'Auto-scroll to the newest line'"
          @click="toggleFollow"
        >
          <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7M19 3l-7 7-7-7M5 21h14" />
          </svg>
          <span class="hidden sm:inline">{{ language?.follow ?? "Follow" }}</span>
        </button>

        <button
          type="button"
          class="inline-flex items-center gap-1 px-2 py-1 text-gray-300 rounded-md hover:bg-white/10 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
          :title="language?.copy_title ?? 'Copy everything to the clipboard'"
          :disabled="!hasText"
          @click="copyAll"
        >
          <svg v-if="!copied" class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linejoin="round" stroke-width="2" d="M9 8v3a1 1 0 0 1-1 1H5m11 4h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-7a1 1 0 0 0-1 1v1m4 3v10a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7.13a1 1 0 0 1 .24-.65L7.7 8.35A1 1 0 0 1 8.46 8H13a1 1 0 0 1 1 1Z" />
          </svg>
          <svg v-else class="w-3.5 h-3.5 text-green-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 11.917 9.724 16.5 19 7.5" />
          </svg>
          <span class="hidden sm:inline">{{ copied ? (language?.copied ?? "Copied") : (language?.copy ?? "Copy") }}</span>
        </button>

        <button
          v-if="showDownload"
          type="button"
          class="inline-flex items-center gap-1 px-2 py-1 text-gray-300 rounded-md hover:bg-white/10 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-primary disabled:opacity-50"
          :title="language?.download_title ?? 'Download as .txt'"
          :disabled="!hasText"
          @click="download"
        >
          <svg class="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4" />
          </svg>
          <span class="hidden sm:inline">{{ language?.download ?? "Download" }}</span>
        </button>

        <slot name="actions"></slot>
      </div>
    </header>

    <div
      ref="scroller"
      class="overflow-auto font-mono text-xs leading-5 gl-log-viewer-body"
      :style="{ maxHeight: maxHeight, minHeight: minHeight }"
      tabindex="0"
      role="log"
      :aria-busy="loading ? 'true' : 'false'"
      @scroll="onScroll"
    >
      <div v-if="loading && !hasText" class="p-4 space-y-2 animate-pulse" role="status">
        <div class="w-2/3 h-3 rounded-sm bg-white/10"></div>
        <div class="w-1/2 h-3 rounded-sm bg-white/10"></div>
        <div class="w-3/4 h-3 rounded-sm bg-white/10"></div>
        <span class="sr-only">{{ language?.loading ?? "Loading output…" }}</span>
      </div>

      <div v-else-if="!hasText" class="flex items-center justify-center p-8 text-center text-gray-500">
        {{ emptyText || (language?.empty ?? "No output yet.") }}
      </div>

      <div v-else-if="lineNumbers" class="py-3">
        <div v-for="(line, index) in lineList" :key="index" class="flex px-4 hover:bg-white/5">
          <span class="pe-4 text-end text-gray-500 select-none shrink-0" :style="{ minWidth: gutterWidth }" aria-hidden="true">{{ index + 1 }}</span>
          <span class="whitespace-pre-wrap break-all">{{ line === "" ? "​" : line }}</span>
        </div>
      </div>

      <pre v-else class="px-4 py-3 whitespace-pre-wrap break-words">{{ normalized }}</pre>
    </div>
  </section>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import GlStatusBadge from "./GlStatusBadge.vue";

// CSI sequences (colours, cursor moves) and OSC sequences (titles, links).
// There is no ANSI-to-HTML converter in the library, so codes are stripped.
const ANSI_PATTERN = /\u001b\[[0-?]*[ -/]*[@-~]|\u001b\][^\u0007\u001b]*(?:\u0007|\u001b\\)|\u001b[@-Z\\-_]/g;

/**
 * Read-only log / command output viewer. Text is always rendered escaped.
 *
 * <gl-log-viewer :content="output" title="Deploy" />
 * <gl-log-viewer :lines="logLines" line-numbers max-height="20rem" v-model:follow="tail" />
 *
 * Props mirror the CloudPanel's RunOutput (text, title, status, domain,
 * loading, emptyText, filename, maxHeight, minHeight, autoFollow) where they
 * overlap.
 */
const props = defineProps({
  /** The whole log as one string. */
  content: { type: String, default: "" },
  /** Alias of `content` (RunOutput's name). */
  text: { type: String, default: "" },
  /** The log as an array of lines; used when no content/text is given. */
  lines: { type: Array, default: null },
  /** Keep scrolled to the newest line. Supports v-model:follow. */
  follow: { type: Boolean, default: true },
  /** Re-enable follow when the user scrolls back to the bottom. */
  autoFollow: { type: Boolean, default: true },
  lineNumbers: { type: Boolean, default: false },
  title: { type: String, default: "" },
  status: { type: [String, Number], default: "" },
  domain: { type: String, default: "run" },
  showStatus: { type: Boolean, default: true },
  loading: { type: Boolean, default: false },
  emptyText: { type: String, default: "" },
  showDownload: { type: Boolean, default: true },
  filename: { type: String, default: "log.txt" },
  maxHeight: { type: String, default: "32rem" },
  minHeight: { type: String, default: "8rem" },
  language: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["update:follow", "copy"]);

const scroller = ref(null);
const following = ref(props.follow && props.autoFollow);
const copied = ref(false);

const stripAnsi = (value) => String(value ?? "").replace(ANSI_PATTERN, "");

const normalized = computed(() => {
  const raw = props.content || props.text || (Array.isArray(props.lines) ? props.lines.map((line) => String(line ?? "")).join("\n") : "");

  return stripAnsi(raw).replace(/\r\n/g, "\n").replace(/\r(?!\n)/g, "\n");
});

const hasText = computed(() => normalized.value.trim().length > 0);
const lineList = computed(() => (hasText.value ? normalized.value.split("\n") : []));
const lineCount = computed(() => lineList.value.length);
const gutterWidth = computed(() => `${String(lineCount.value).length + 1}ch`);
const hasStatus = computed(() => props.status !== "" && props.status !== null && props.status !== undefined);

const scrollToEnd = () => {
  const el = scroller.value;

  if (el && following.value) {
    el.scrollTop = el.scrollHeight;
  }
};

const setFollowing = (value) => {
  if (following.value === value) {
    return;
  }

  following.value = value;
  emit("update:follow", value);
};

const toggleFollow = () => {
  setFollowing(!following.value);
  scrollToEnd();
};

const onScroll = () => {
  const el = scroller.value;

  if (!el) {
    return;
  }

  const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 24;

  if (!atBottom && following.value) {
    setFollowing(false);
  } else if (atBottom && !following.value && props.autoFollow) {
    setFollowing(true);
  }
};

const markCopied = () => {
  copied.value = true;
  emit("copy", normalized.value);
  setTimeout(() => (copied.value = false), 1500);
};

const fallbackCopy = () => {
  const area = document.createElement("textarea");
  area.value = normalized.value;
  area.setAttribute("readonly", "");
  area.style.position = "absolute";
  area.style.left = "-9999px";
  document.body.appendChild(area);
  area.select();

  try {
    if (document.execCommand("copy")) {
      markCopied();
    }
  } finally {
    document.body.removeChild(area);
  }
};

const copyAll = async () => {
  try {
    await navigator.clipboard.writeText(normalized.value);
    markCopied();
  } catch (error) {
    fallbackCopy();
  }
};

const download = () => {
  const blob = new Blob([normalized.value], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = props.filename.endsWith(".txt") ? props.filename : `${props.filename}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

watch(normalized, () => nextTick(scrollToEnd));

watch(
  () => props.follow,
  (value) => {
    following.value = value;
    nextTick(scrollToEnd);
  }
);

onMounted(() => nextTick(scrollToEnd));

defineExpose({ scrollToEnd, copyAll });
</script>

<style scoped>
.gl-log-viewer-body {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
}
</style>
