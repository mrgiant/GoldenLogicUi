/**
 * The one status vocabulary shared by GlStatusBadge (ported from the
 * CloudPanel's statusMap.js so both stay interchangeable).
 *
 * Every raw value a backend hands us (server 0/1/2, deployment "Succeeded",
 * backup "uploading", invoice "overdue", …) is folded into one of six states.
 * Each state has an icon, a word and a colour; the word is always rendered
 * next to the colour so a state is never carried by colour alone.
 */
export const STATES = {
    healthy: {
        word: "Healthy",
        icon: "fas fa-check-circle",
        pill: "bg-green-50 text-green-700 ring-green-600/20 dark:bg-green-900/30 dark:text-green-300 dark:ring-green-400/30",
        dot: "bg-green-500",
        text: "text-green-600 dark:text-green-400",
        edge: "border-s-green-500",
        bar: "bg-green-500",
        pulse: false,
    },
    running: {
        word: "Running",
        icon: "fas fa-circle-notch fa-spin",
        pill: "bg-blue-50 text-blue-700 ring-blue-600/20 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-400/30",
        dot: "bg-blue-500",
        text: "text-blue-600 dark:text-blue-400",
        edge: "border-s-blue-500",
        bar: "bg-blue-500",
        pulse: true,
    },
    queued: {
        word: "Queued",
        icon: "fas fa-clock",
        pill: "bg-gray-100 text-gray-700 ring-gray-500/20 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-400/30",
        dot: "bg-gray-400",
        text: "text-gray-600 dark:text-gray-400",
        edge: "border-s-gray-400",
        bar: "bg-gray-400",
        pulse: false,
    },
    attention: {
        word: "Attention",
        icon: "fas fa-exclamation-triangle",
        pill: "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-400/30",
        dot: "bg-amber-500",
        text: "text-amber-600 dark:text-amber-400",
        edge: "border-s-amber-500",
        bar: "bg-amber-500",
        pulse: false,
    },
    failed: {
        word: "Failed",
        icon: "fas fa-times-circle",
        pill: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-900/30 dark:text-red-300 dark:ring-red-400/30",
        dot: "bg-red-500",
        text: "text-red-600 dark:text-red-400",
        edge: "border-s-red-500",
        bar: "bg-red-500",
        pulse: false,
    },
    disabled: {
        word: "Disabled",
        icon: "fas fa-ban",
        pill: "bg-slate-100 text-slate-600 ring-slate-500/20 dark:bg-slate-800 dark:text-slate-400 dark:ring-slate-400/30",
        dot: "bg-slate-400",
        text: "text-slate-500 dark:text-slate-400",
        edge: "border-s-slate-400",
        bar: "bg-slate-400",
        pulse: false,
    },
};

export const STATE_NAMES = Object.keys(STATES);

/** Order used when sorting "worst first". */
export const SEVERITY = { failed: 0, attention: 1, running: 2, queued: 3, disabled: 4, healthy: 5 };

/**
 * Per-domain tables: raw value (lower-cased string) -> { state, label? }.
 * A label overrides the vocabulary word when the domain needs its own wording
 * (e.g. a server at status 0 is "Provisioning", which is a queued state).
 */
const DOMAINS = {
    /** Common words; checked last when domain is "auto", so panel-known values resolve exactly as in the CloudPanel. */
    general: {
        queued: { state: "queued" },
        pending: { state: "queued", label: "Pending" },
        waiting: { state: "queued", label: "Waiting" },
        provisioning: { state: "queued", label: "Provisioning" },
        running: { state: "running" },
        in_progress: { state: "running", label: "In progress" },
        processing: { state: "running", label: "Processing" },
        success: { state: "healthy", label: "Success" },
        succeeded: { state: "healthy", label: "Succeeded" },
        successful: { state: "healthy", label: "Success" },
        completed: { state: "healthy", label: "Completed" },
        complete: { state: "healthy", label: "Completed" },
        done: { state: "healthy", label: "Done" },
        ok: { state: "healthy", label: "OK" },
        healthy: { state: "healthy" },
        active: { state: "healthy", label: "Active" },
        enabled: { state: "healthy", label: "Enabled" },
        online: { state: "healthy", label: "Online" },
        failed: { state: "failed" },
        failure: { state: "failed", label: "Failed" },
        error: { state: "failed", label: "Error" },
        errored: { state: "failed", label: "Error" },
        offline: { state: "failed", label: "Offline" },
        timed_out: { state: "failed", label: "Timed out" },
        warning: { state: "attention", label: "Warning" },
        attention: { state: "attention" },
        approval: { state: "attention", label: "Needs approval" },
        paused: { state: "attention", label: "Paused" },
        cancelled: { state: "disabled", label: "Cancelled" },
        canceled: { state: "disabled", label: "Cancelled" },
        disabled: { state: "disabled" },
        inactive: { state: "disabled", label: "Inactive" },
        skipped: { state: "disabled", label: "Skipped" },
    },
    server: {
        0: { state: "queued", label: "Provisioning" },
        1: { state: "healthy", label: "Active" },
        2: { state: "disabled", label: "Inactive" },
        provisioning: { state: "queued", label: "Provisioning" },
        active: { state: "healthy", label: "Active" },
        inactive: { state: "disabled", label: "Inactive" },
        online: { state: "healthy", label: "Online" },
        offline: { state: "failed", label: "Offline" },
        unreachable: { state: "failed", label: "Unreachable" },
        unmanaged: { state: "disabled", label: "Unmanaged" },
        unknown: { state: "queued", label: "Unknown" },
    },
    availability: {
        0: { state: "queued", label: "Unknown" },
        1: { state: "healthy", label: "Online" },
        2: { state: "failed", label: "Unreachable" },
    },
    deployment: {
        queued: { state: "queued" },
        pending: { state: "queued" },
        running: { state: "running" },
        approval: { state: "attention", label: "Needs approval" },
        success: { state: "healthy", label: "Success" },
        succeeded: { state: "healthy", label: "Success" },
        failed: { state: "failed" },
        cancelled: { state: "disabled", label: "Cancelled" },
        canceled: { state: "disabled", label: "Cancelled" },
        rollback: { state: "running", label: "Rolling back" },
    },
    backup: {
        queued: { state: "queued" },
        running: { state: "running" },
        uploading: { state: "running", label: "Uploading" },
        verifying: { state: "running", label: "Verifying" },
        success: { state: "healthy", label: "Success" },
        failed: { state: "failed" },
        timed_out: { state: "failed", label: "Timed out" },
    },
    restore: {
        queued: { state: "queued" },
        running: { state: "running" },
        success: { state: "healthy", label: "Restored" },
        failed: { state: "failed" },
        timed_out: { state: "failed", label: "Timed out" },
        rollback_running: { state: "running", label: "Rolling back" },
        rollback_success: { state: "healthy", label: "Rolled back" },
    },
    ai: {
        pending: { state: "queued", label: "Pending" },
        queued: { state: "queued" },
        running: { state: "running" },
        completed: { state: "healthy", label: "Completed" },
        success: { state: "healthy", label: "Completed" },
        failed: { state: "failed" },
        cancelled: { state: "disabled", label: "Cancelled" },
    },
    invoice: {
        paid: { state: "healthy", label: "Paid" },
        due: { state: "attention", label: "Due" },
        pending: { state: "queued", label: "Pending" },
        unpaid: { state: "attention", label: "Unpaid" },
        partial: { state: "running", label: "Partially paid" },
        overdue: { state: "failed", label: "Overdue" },
        cancelled: { state: "disabled", label: "Cancelled" },
        void: { state: "disabled", label: "Void" },
    },
    toggle: {
        0: { state: "disabled" },
        1: { state: "healthy", label: "Enabled" },
        false: { state: "disabled" },
        true: { state: "healthy", label: "Enabled" },
        enabled: { state: "healthy", label: "Enabled" },
        disabled: { state: "disabled" },
        active: { state: "healthy", label: "Active" },
        inactive: { state: "disabled", label: "Inactive" },
    },
    docker: {
        running: { state: "healthy", label: "Running" },
        up: { state: "healthy", label: "Up" },
        created: { state: "queued", label: "Created" },
        restarting: { state: "running", label: "Restarting" },
        paused: { state: "disabled", label: "Paused" },
        exited: { state: "failed", label: "Exited" },
        dead: { state: "failed", label: "Dead" },
    },
    run: {
        queued: { state: "queued" },
        pending: { state: "queued" },
        running: { state: "running" },
        uploading: { state: "running", label: "Uploading" },
        verifying: { state: "running", label: "Verifying" },
        approval: { state: "attention", label: "Needs approval" },
        success: { state: "healthy", label: "Success" },
        succeeded: { state: "healthy", label: "Success" },
        completed: { state: "healthy", label: "Completed" },
        done: { state: "healthy", label: "Done" },
        failed: { state: "failed" },
        error: { state: "failed" },
        timed_out: { state: "failed", label: "Timed out" },
        cancelled: { state: "disabled", label: "Cancelled" },
        canceled: { state: "disabled", label: "Cancelled" },
    },
};

/**
 * Resolve a raw value into { state, label, ...STATES[state] }.
 *
 * @param {string|number|boolean|null|undefined} raw
 * @param {string} domain one of the DOMAINS keys, or "auto"
 */
export function resolveStatus(raw, domain = "auto") {
    const key = raw === null || raw === undefined ? "" : String(raw).trim().toLowerCase();

    let hit = null;

    if (domain !== "auto" && DOMAINS[domain]) {
        hit = DOMAINS[domain][key] ?? null;
    }

    if (!hit && STATES[key]) {
        hit = { state: key };
    }

    if (!hit && domain === "auto") {
        for (const table of [DOMAINS.run, DOMAINS.toggle, DOMAINS.docker, DOMAINS.invoice, DOMAINS.general]) {
            if (table[key]) {
                hit = table[key];
                break;
            }
        }
    }

    const state = hit?.state && STATES[hit.state] ? hit.state : "queued";
    const base = STATES[state];
    const label = hit?.label ?? (key && !hit ? humanize(key) : base.word);

    return { state, label, raw, ...base };
}

export function statusState(raw, domain = "auto") {
    return resolveStatus(raw, domain).state;
}

export function worstState(states) {
    return [...states].sort((a, b) => SEVERITY[a] - SEVERITY[b])[0] ?? "healthy";
}

function humanize(value) {
    const text = String(value).replace(/[_-]+/g, " ").trim();

    return text.charAt(0).toUpperCase() + text.slice(1);
}

/** Colour-only names a badge `variant` may use, folded onto the six states. */
const VARIANT_ALIASES = {
    success: "healthy",
    green: "healthy",
    info: "running",
    primary: "running",
    blue: "running",
    neutral: "queued",
    gray: "queued",
    grey: "queued",
    warning: "attention",
    yellow: "attention",
    amber: "attention",
    danger: "failed",
    error: "failed",
    red: "failed",
    muted: "disabled",
    secondary: "disabled",
};

/** Map a variant (state name or colour alias) to a state, or null when unknown. */
export function variantState(variant) {
    const key = String(variant ?? "").trim().toLowerCase();

    if (STATES[key]) {
        return key;
    }

    return VARIANT_ALIASES[key] ?? null;
}

export default { STATES, STATE_NAMES, SEVERITY, resolveStatus, statusState, worstState, variantState };
