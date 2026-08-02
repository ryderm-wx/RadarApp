/**
 * @file Pure localStorage read/write for legend config + presets. No other
 * module should call `localStorage` directly for these keys — this keeps
 * persistence swappable (e.g. for a future backend settings API) without
 * touching the store or UI layers.
 */

import {
  LEGEND_EDITOR_CONFIG_STORAGE_KEY,
  LEGEND_EDITOR_PRESETS_STORAGE_KEY,
  LEGEND_EDITOR_DEFAULT_PRESET_NAME,
  DEFAULT_LEGEND_EDITOR_CONFIG,
  cloneLegendEditorConfig,
  mergeLegendEditorConfig,
} from "./schema.js";

/** @returns {Partial<import('./types.js').LegendConfig>} */
export function loadConfigFromStorage() {
  const defaults = cloneLegendEditorConfig(DEFAULT_LEGEND_EDITOR_CONFIG);
  try {
    const raw = localStorage.getItem(LEGEND_EDITOR_CONFIG_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return mergeLegendEditorConfig(defaults, parsed);
  } catch (error) {
    console.warn("Unable to restore legend editor config:", error);
    return defaults;
  }
}

export function saveConfigToStorage(config) {
  try {
    localStorage.setItem(LEGEND_EDITOR_CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (error) {
    console.warn("Unable to save legend editor config:", error);
  }
}

export function loadPresetsFromStorage() {
  const defaults = {
    [LEGEND_EDITOR_DEFAULT_PRESET_NAME]: cloneLegendEditorConfig(DEFAULT_LEGEND_EDITOR_CONFIG),
  };
  try {
    const raw = localStorage.getItem(LEGEND_EDITOR_PRESETS_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? { ...defaults, ...parsed } : defaults;
  } catch (error) {
    console.warn("Unable to restore legend presets:", error);
    return defaults;
  }
}

export function savePresetsToStorage(presets) {
  try {
    localStorage.setItem(LEGEND_EDITOR_PRESETS_STORAGE_KEY, JSON.stringify(presets));
  } catch (error) {
    console.warn("Unable to save legend presets:", error);
  }
}
