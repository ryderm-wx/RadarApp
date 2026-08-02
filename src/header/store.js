/**
 * @file Minimal state-management primitive (vanilla equivalent of a
 * Zustand/Context store), plus the domain-specific legend config store built
 * on top of it. This is the single path through which legend config is ever
 * read or mutated — no other module should touch persisted state directly.
 *
 * Every config mutation auto-persists to localStorage immediately (except the
 * initial hydration pass). `flushConfig()` commits any in-DOM inline edits and
 * writes once more — used on page hide / unload.
 *
 * @typedef {import('./types.js').LegendConfig} LegendConfig
 */

import {
  LEGEND_EDITOR_CONFIG_STORAGE_KEY,
  LEGEND_EDITOR_DEFAULT_PRESET_NAME,
  cloneLegendEditorConfig,
  mergeLegendEditorConfig,
  normalizeLegendEditorConfig,
  legendStudioPathNeedsRebuild,
  setLegendConfigAtPath,
  getLegendConfigAtPath,
  LEGEND_STUDIO_THEME_PRESETS,
} from "./schema.js";
import {
  loadConfigFromStorage,
  saveConfigToStorage,
  loadPresetsFromStorage,
  savePresetsToStorage,
} from "./persistence.js";

/**
 * Generic pub/sub store, independent of the legend domain.
 * @template T
 * @param {T} initialState
 */
export function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();

  return {
    getState() {
      return state;
    },
    setState(updater, meta) {
      state = typeof updater === "function" ? updater(state) : updater;
      listeners.forEach((listener) => listener(state, meta || {}));
      return state;
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    /** Subscribe to only the slice returned by `selector`; only notifies on change. */
    select(selector, listener) {
      let previous = selector(state);
      return this.subscribe((nextState) => {
        const next = selector(nextState);
        if (next !== previous) {
          previous = next;
          listener(next, nextState);
        }
      });
    },
  };
}

// --- Domain store: legend/header configuration -----------------------------

const configStore = createStore(/** @type {LegendConfig|null} */ (null));
let presets = null;
let dragging = null;

function persistConfig() {
  const config = configStore.getState();
  if (!config) return;
  saveConfigToStorage(config);
}

/** Copy any live title/subtitle text from the DOM into a config draft. */
function commitEditableLegendFields(draft) {
  const legendRoot = document.getElementById("radarLegend");
  if (!legendRoot) return draft;
  const titleEl = legendRoot.querySelector(".legend-strip__title");
  const subtitleEl = legendRoot.querySelector(".legend-strip__subtitle");
  if (titleEl) draft.header.customTitle = titleEl.textContent?.trim() || "";
  if (subtitleEl) draft.header.customSubtitle = subtitleEl.textContent?.trim() || "";
  return draft;
}

// Auto-save every config change immediately (skip the hydration-only init pass).
configStore.subscribe((_, meta) => {
  if (meta?.source === "init") return;
  persistConfig();
});

function ensureConfig() {
  if (configStore.getState()) return configStore.getState();
  const hadStored = Boolean(localStorage.getItem(LEGEND_EDITOR_CONFIG_STORAGE_KEY));
  const initial = normalizeLegendEditorConfig(loadConfigFromStorage());
  configStore.setState(initial, { source: "init" });
  if (!hadStored) persistConfig();
  return initial;
}

function ensurePresets() {
  if (presets) return presets;
  presets = loadPresetsFromStorage();
  return presets;
}

/** @returns {LegendConfig} a deep clone of the current config (safe to inspect). */
export function getConfig() {
  return cloneLegendEditorConfig(ensureConfig());
}

export function getConfigValue(path) {
  return getLegendConfigAtPath(ensureConfig(), path);
}

export function setConfigValue(path, value) {
  const draft = cloneLegendEditorConfig(ensureConfig());
  setLegendConfigAtPath(draft, path, value);
  configStore.setState(normalizeLegendEditorConfig(draft));
}

/**
 * Subscribe to config changes. Listener receives (config, meta), where
 * meta.rebuild indicates the DOM should be fully rebuilt vs. patched.
 */
export function subscribe(listener) {
  return configStore.subscribe(listener);
}

function isFreeformActive() {
  const cfg = ensureConfig();
  return !!cfg.editor?.headerEditMode || cfg.layout?.freeform === true;
}

export function finalizeEditSession() {
  let draft = cloneLegendEditorConfig(ensureConfig());
  draft = commitEditableLegendFields(draft);
  draft.layout.freeform = true;
  configStore.setState(normalizeLegendEditorConfig(draft));
}

/**
 * Central update path for the legend config. Mirrors the previous
 * `updateLegendStudioConfig` global function 1:1 in behavior.
 * @param {((draft: LegendConfig) => void) | Partial<LegendConfig>} updater
 * @param {{rebuild?: boolean, sync?: boolean}} [options]
 */
export function updateConfig(updater, options = {}) {
  const wasEditMode = !!ensureConfig().editor?.headerEditMode;
  const draft = cloneLegendEditorConfig(ensureConfig());
  if (typeof updater === "function") {
    updater(draft);
  } else if (updater && typeof updater === "object") {
    mergeLegendEditorConfig(draft, updater);
  }
  const normalized = normalizeLegendEditorConfig(draft);
  const isEditMode = !!normalized.editor?.headerEditMode;
  configStore.setState(normalized, { rebuild: Boolean(options.rebuild) });
  if (wasEditMode && !isEditMode) {
    finalizeEditSession();
  }
}

export function applyStudioPanelValue(path, rawValue, inputType = "text") {
  if (!path) return;
  let nextValue = rawValue;
  if (inputType === "checkbox") {
    nextValue = Boolean(rawValue);
  } else if (inputType === "range" || inputType === "number") {
    nextValue = Number.parseFloat(rawValue);
  }

  updateConfig(
    (draft) => {
      setLegendConfigAtPath(draft, path, nextValue);
      if (path === "header.backgroundImageUrl" && String(nextValue || "").trim()) {
        draft.header.useBackgroundImage = true;
        draft.header.backgroundImageData = "";
      }
      if (path === "header.logoUrl" && String(nextValue || "").trim()) {
        draft.visibility.logo = true;
      }
    },
    { rebuild: legendStudioPathNeedsRebuild(path) },
  );
}

export function applyTheme(themeKey) {
  const preset = LEGEND_STUDIO_THEME_PRESETS[themeKey];
  if (!preset) return;
  const merged = normalizeLegendEditorConfig(
    mergeLegendEditorConfig(cloneLegendEditorConfig(ensureConfig()), preset.config),
  );
  merged.theme = themeKey;
  configStore.setState(merged, { rebuild: true });
}

export function isLegendFreeformLayoutActive() {
  return isFreeformActive();
}

/** Commit live DOM edits and write config to localStorage (e.g. before unload). */
export function flushConfig() {
  let draft = cloneLegendEditorConfig(ensureConfig());
  draft = commitEditableLegendFields(draft);
  configStore.setState(normalizeLegendEditorConfig(draft));
  persistConfig();
}

// --- Presets -----------------------------------------------------------

export function getPresetNames() {
  return Object.keys(ensurePresets()).sort((a, b) => a.localeCompare(b));
}

export function getPreset(name) {
  return ensurePresets()[name];
}

export function savePreset(name) {
  if (!name) return;
  ensurePresets()[name] = cloneLegendEditorConfig(ensureConfig());
  savePresetsToStorage(presets);
}

export function loadPreset(name) {
  const preset = ensurePresets()[name];
  if (!preset) return;
  const merged = normalizeLegendEditorConfig(
    mergeLegendEditorConfig(
      cloneLegendEditorConfig(DEFAULT_LEGEND_EDITOR_CONFIG),
      cloneLegendEditorConfig(preset),
    ),
  );
  configStore.setState(merged, { rebuild: true });
}

export function deletePreset(name) {
  if (!name || name === LEGEND_EDITOR_DEFAULT_PRESET_NAME) return;
  delete ensurePresets()[name];
  savePresetsToStorage(presets);
}

// --- Drag/resize session state ------------------------------------------

export function getDragState() {
  return dragging;
}

export function setDragState(next) {
  dragging = next;
}

export function endDragSession() {
  if (!dragging) return;
  dragging = null;
  let draft = cloneLegendEditorConfig(ensureConfig());
  draft = commitEditableLegendFields(draft);
  if (draft.editor?.headerEditMode) {
    draft.layout.freeform = true;
  }
  configStore.setState(normalizeLegendEditorConfig(draft));
}
