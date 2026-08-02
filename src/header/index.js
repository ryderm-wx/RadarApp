/**
 * @file Entry point for the Radar Legend "header" system. Wires the store,
 * renderer, toolbar, config panel, and responsive collapse together, injects
 * the module's CSS, and exposes a small bridge API on `window.RadarHeader`
 * for the legacy classic-script `app.js` to call into.
 */

import { renderForProduct, refreshPreview, ensureLegendVisible } from "./renderer.js";
import {
  bindLegendContextToolbarInteractions,
  bindGlobalPointerListeners,
  ensureLegendStudioChrome,
} from "./toolbar.js";
import { buildLegendEditorPanel, createLegendEditorToolButton, syncPanel } from "./configPanel.js";
import { initResponsiveCollapse } from "./responsive.js";
import { getConfig, getConfigValue, updateConfig, subscribe, flushConfig } from "./store.js";

function injectHeaderStyles() {
  if (document.getElementById("legendEditorStyles")) return;
  const style = document.createElement("style");
  style.id = "legendEditorStyles";
  style.textContent = `
    .legend-editor-panel {
      position: fixed;
      top: 96px;
      right: 14px;
      width: min(390px, calc(100vw - 20px));
      max-height: calc(100vh - 120px);
      overflow: hidden;
      border-radius: 14px;
      border: 1px solid rgba(148, 163, 184, 0.32);
      background: linear-gradient(160deg, rgba(8, 14, 27, 0.96), rgba(3, 7, 18, 0.96));
      color: #e2e8f0;
      box-shadow: 0 20px 50px rgba(2, 6, 23, 0.55);
      z-index: 1305;
      backdrop-filter: blur(12px);
    }
    .legend-editor-panel.is-hidden { display: none; }
    .legend-editor__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 12px;
      border-bottom: 1px solid rgba(148, 163, 184, 0.25);
    }
    .legend-editor__header div {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .legend-editor__header span {
      color: #94a3b8;
      font-size: 11px;
    }
    .legend-editor__header button,
    .legend-editor__preset-actions button {
      border: 1px solid rgba(148, 163, 184, 0.5);
      background: rgba(30, 41, 59, 0.55);
      color: #e2e8f0;
      border-radius: 8px;
      cursor: pointer;
      padding: 6px 8px;
      font-size: 12px;
    }
    .legend-editor__tabs {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      padding: 10px;
      border-bottom: 1px solid rgba(148, 163, 184, 0.22);
    }
    .legend-editor__tabs button {
      border: 1px solid rgba(148, 163, 184, 0.35);
      background: rgba(15, 23, 42, 0.7);
      color: #cbd5e1;
      border-radius: 999px;
      padding: 5px 8px;
      font-size: 11px;
      cursor: pointer;
    }
    .legend-editor__tabs button.active {
      background: rgba(56, 189, 248, 0.25);
      border-color: rgba(56, 189, 248, 0.65);
      color: #e0f2fe;
    }
    .legend-editor__body {
      max-height: calc(100vh - 210px);
      overflow: auto;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .legend-editor__body section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .legend-editor__body section.is-hidden { display: none; }
    .legend-editor__body .is-hidden { display: none !important; }
    .legend-editor__body label {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      color: #cbd5e1;
    }
    .legend-editor__body input[type="text"],
    .legend-editor__body select,
    .legend-editor__preset-actions input {
      width: 150px;
      border-radius: 8px;
      border: 1px solid rgba(148, 163, 184, 0.45);
      background: rgba(15, 23, 42, 0.82);
      color: #e2e8f0;
      padding: 5px 7px;
      font-size: 12px;
    }
    .legend-editor__body input[type="range"] {
      width: 148px;
      accent-color: #38bdf8;
    }
    .legend-editor__theme-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
    }
    .legend-theme-card {
      position: relative;
      min-height: 84px;
      text-align: left;
      border: 1px solid rgba(148, 163, 184, 0.28);
      background: rgba(15, 23, 42, 0.72);
      color: #e2e8f0;
      border-radius: 12px;
      padding: 10px;
      cursor: pointer;
      overflow: hidden;
    }
    .legend-theme-card.active {
      border-color: var(--theme-accent, #38bdf8);
      box-shadow: 0 0 0 1px color-mix(in srgb, var(--theme-accent, #38bdf8) 50%, transparent);
    }
    .legend-theme-card__swatch {
      display: block;
      width: 100%;
      height: 18px;
      border-radius: 999px;
      margin-bottom: 8px;
      background: linear-gradient(90deg, var(--theme-accent), rgba(255, 255, 255, 0.22));
    }
    .legend-theme-card strong,
    .legend-theme-card small {
      display: block;
    }
    .legend-theme-card small {
      margin-top: 3px;
      color: #94a3b8;
      line-height: 1.3;
    }
    .legend-editor__quick-row,
    .legend-editor__subgroup {
      border: 1px solid rgba(148, 163, 184, 0.22);
      border-radius: 10px;
      padding: 8px;
      background: rgba(2, 6, 23, 0.5);
    }
    .legend-editor__quick-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
    .legend-editor__quick-row button,
    .legend-anchor-grid button,
    .legend-editor__body section > button {
      border: 1px solid rgba(148, 163, 184, 0.35);
      background: rgba(15, 23, 42, 0.78);
      color: #dbeafe;
      border-radius: 10px;
      cursor: pointer;
      padding: 7px 8px;
      font-size: 12px;
    }
    .legend-anchor-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      padding: 8px;
      border: 1px solid rgba(148, 163, 184, 0.22);
      border-radius: 12px;
      background: rgba(2, 6, 23, 0.46);
    }
    .legend-anchor-grid button.active {
      border-color: #38bdf8;
      background: rgba(56, 189, 248, 0.18);
      color: #e0f2fe;
    }
    .legend-editor__subgroup p {
      margin: 0 0 6px;
      font-size: 11px;
      color: #93c5fd;
    }
    .legend-editor__hint {
      margin: 0;
      font-size: 11px;
      color: #94a3b8;
      line-height: 1.4;
    }
    .legend-editor__preset-actions {
      display: grid;
      grid-template-columns: 1fr 1fr repeat(3, auto);
      gap: 8px;
    }
    .legend-gradient-stop {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 6px;
      margin-bottom: 6px;
    }
    .legend-gradient-stop input[type="color"] {
      width: 28px;
      height: 24px;
      padding: 0;
      border: 1px solid rgba(148, 163, 184, 0.4);
      border-radius: 6px;
      background: transparent;
    }
    .legend-header-edit-mode [data-legend-target] {
      outline: 1px dashed rgba(56, 189, 248, 0.5);
      outline-offset: 2px;
      cursor: grab;
      user-select: none;
    }
    .legend-free-edit-mode .legend-strip {
      position: relative;
      display: block;
    }
    .legend-free-edit-mode .legend-strip__header {
      overflow: visible;
    }
    .legend-free-edit-mode .legend-strip__header-layer,
    .legend-free-edit-mode .legend-strip__text,
    .legend-free-edit-mode .legend-strip__gradient {
      display: contents;
    }
    .legend-free-edit-mode [data-legend-target] {
      position: absolute;
      cursor: grab;
    }
    .legend-header-edit-mode .legend-selected-target {
      outline-color: rgba(251, 191, 36, 0.95);
      box-shadow: 0 0 0 1px rgba(251, 191, 36, 0.7);
    }
    .legend-show-guides .legend-strip__header {
      box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.34);
      border-radius: 8px;
    }
    .legend-strip__header {
      position: relative;
      min-width: 0;
    }
    .legend-strip__header-layer {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      min-width: 0;
      position: relative;
      z-index: 2;
    }
    .legend-header-image-mode .legend-strip__header {
      overflow: hidden;
      border-radius: 10px;
    }
    .legend-header-image-mode .legend-strip__header-layer--overlay {
      position: absolute;
      inset: 0;
      display: block;
      pointer-events: none;
    }
    .legend-header-image-mode .legend-strip__header-layer--overlay [data-legend-target] {
      pointer-events: auto;
    }
    .legend-strip__header-canvas {
      position: absolute;
      inset: 0;
      z-index: 0;
      overflow: hidden;
      border-radius: inherit;
      pointer-events: none;
    }
    .legend-strip__header-bg {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      object-position: center;
    }
    .legend-strip__header-overlay {
      position: absolute;
      inset: 0;
      pointer-events: none;
    }
    .legend-header-edit-mode.legend-header-image-mode .legend-strip__header-canvas {
      pointer-events: none;
    }
    .legend-strip__logo-wrap {
      position: relative;
      overflow: hidden;
      flex: 0 0 auto;
      border: 1px solid rgba(148, 163, 184, 0.4);
      background: rgba(15, 23, 42, 0.76);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .legend-strip__logo-wrap img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
    .legend-strip__logo-placeholder {
      font-size: 11px;
      letter-spacing: 0.08em;
      font-weight: 700;
      color: #dbeafe;
    }
    .legend-strip__labels {
      display: flex;
      justify-content: space-between;
      margin-top: 6px;
      gap: 8px;
      font-size: 11px;
      color: rgba(226, 232, 240, 0.85);
    }
    #radarLegend {
      position: relative;
      width: var(--legend-width, 360px);
      min-height: var(--legend-min-height, 88px);
      padding: var(--legend-padding-y, 10px) var(--legend-padding-x, 14px);
      border-radius: var(--legend-radius, 14px);
      background: rgba(5, 8, 18, var(--legend-bg-opacity, 0.88));
      border: var(--legend-border-width, 1px) solid rgba(255, 255, 255, var(--legend-border-opacity, 0.16));
      backdrop-filter: blur(var(--legend-blur, 14px));
      box-shadow:
        0 10px 24px rgba(0, 0, 0, var(--legend-shadow-strength, 0.4)),
        0 0 20px rgba(99, 211, 255, var(--legend-glow-strength, 0.18));
    }
    #radarLegend::after {
      content: "";
      position: absolute;
      left: -24px;
      right: -24px;
      top: 100%;
      height: 48px;
      pointer-events: none;
      z-index: 1;
    }
    #radarLegend:hover::after,
    #radarLegend:focus-within::after {
      pointer-events: none;
    }
    #radarLegend .legend-strip {
      gap: var(--legend-gap, 10px);
      min-width: 0;
      max-width: 100%;
    }
    .legend-strip__gradient {
      width: 100%;
      max-width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }
    #radarLegend .legend-strip__title {
      color: var(--legend-title-color, #f8fafc);
      font-size: var(--legend-title-size, 14px);
      font-weight: var(--legend-title-weight, 700);
    }
    #radarLegend .legend-strip__subtitle {
      color: var(--legend-subtitle-color, rgba(226, 232, 240, 0.72));
      font-size: var(--legend-subtitle-size, 11px);
      font-weight: var(--legend-subtitle-weight, 500);
    }
    #radarLegend .legend-gradient__bar {
      height: var(--legend-gradient-height, 16px);
      border-radius: var(--legend-gradient-radius, 999px);
      width: 100%;
      max-width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }
    #radarLegend .legend-strip__labels {
      color: var(--legend-label-color, rgba(226, 232, 240, 0.84));
      font-size: var(--legend-label-size, 11px);
      width: 100%;
      max-width: 100%;
      min-width: 0;
      box-sizing: border-box;
    }
    .legend-strip__badges {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .legend-strip__badge {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 2px 6px;
      align-items: center;
      min-width: 0;
      padding: 5px 7px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      background: rgba(15, 23, 42, 0.58);
      color: #e5e7eb;
      font-size: 10px;
      line-height: 1.1;
    }
    .legend-strip__badge-dot {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: var(--badge-color, var(--legend-accent, #63d3ff));
      box-shadow: 0 0 10px var(--badge-color, var(--legend-accent, #63d3ff));
    }
    .legend-strip__badge strong {
      font-size: 10px;
      white-space: nowrap;
    }
    .legend-strip__badge span:last-child {
      grid-column: 2;
      color: rgba(226, 232, 240, 0.62);
      font-size: 9px;
      white-space: nowrap;
    }
    .legend-strip__footnote {
      margin: -2px 0 0;
      color: rgba(226, 232, 240, 0.62);
      font-size: 10px;
      line-height: 1.35;
    }
    .legend-context-toolbar {
      position: absolute;
      left: 50%;
      top: calc(100% + 8px);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 6px;
      border: 1px solid rgba(148, 163, 184, 0.28);
      border-radius: 14px;
      background: rgba(2, 6, 23, 0.9);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      opacity: 0;
      transform: translate(-50%, -4px);
      pointer-events: none;
      transition: opacity 0.15s ease, transform 0.15s ease;
      z-index: 12;
    }
    .legend-context-toolbar__main-row,
    .legend-context-toolbar__edit-row {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 6px;
    }
    .legend-context-toolbar__edit-row.is-hidden {
      display: none;
    }
    #radarLegend:hover,
    #radarLegend:focus-within {
      padding-bottom: calc(var(--legend-padding-y, 10px) + 52px);
    }
    #radarLegend:hover .legend-context-toolbar,
    #radarLegend:focus-within .legend-context-toolbar {
      opacity: 1;
      transform: translate(-50%, 0);
      pointer-events: auto;
    }
    .legend-context-toolbar button {
      border: 0;
      border-radius: 999px;
      background: rgba(15, 23, 42, 0.82);
      color: #dbeafe;
      cursor: pointer;
      font-size: 11px;
      padding: 5px 8px;
      white-space: nowrap;
    }
    .legend-context-toolbar button:hover,
    .legend-context-toolbar button.is-active {
      background: color-mix(in srgb, var(--legend-accent, #63d3ff) 22%, rgba(15, 23, 42, 0.82));
    }
    .legend-context-toolbar button.is-hidden {
      display: none;
    }
    .legend-context-toolbar button.is-active {
      color: #f8fafc;
    }
    .legend-header-edit-mode .legend-strip__logo-wrap {
      z-index: 3;
    }
    .legend-resize-handle {
      position: absolute;
      border: 2px solid rgba(255, 255, 255, 0.86);
      background: var(--legend-accent, #63d3ff);
      box-shadow: 0 0 0 4px rgba(2, 6, 23, 0.7);
      opacity: 0;
      transition: opacity 0.15s ease;
      z-index: 4;
      padding: 0;
    }
    .legend-resize-handle--scale {
      right: -6px;
      bottom: -6px;
      width: 14px;
      height: 14px;
      border-radius: 999px;
      cursor: nwse-resize;
    }
    .legend-resize-handle--width {
      top: 50%;
      right: -7px;
      width: 10px;
      height: 22px;
      border-radius: 999px;
      transform: translateY(-50%);
      cursor: ew-resize;
    }
    .legend-resize-handle--height {
      left: 50%;
      bottom: -7px;
      width: 22px;
      height: 10px;
      border-radius: 999px;
      transform: translateX(-50%);
      cursor: ns-resize;
    }
    #radarLegend:hover .legend-resize-handle--scale,
    #radarLegend.legend-studio-edit-active .legend-resize-handle,
    #radarLegend.legend-freeform-layout:hover .legend-resize-handle {
      opacity: 1;
    }
    .legend-target-edit-handles {
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 5;
    }
    .legend-edit-handle {
      position: absolute;
      border: 2px solid rgba(255, 255, 255, 0.9);
      background: var(--legend-accent, #63d3ff);
      box-shadow: 0 0 0 3px rgba(2, 6, 23, 0.72);
      pointer-events: auto;
      padding: 0;
    }
    .legend-edit-handle--e {
      right: -6px;
      top: 50%;
      width: 10px;
      height: 22px;
      transform: translateY(-50%);
      border-radius: 999px;
      cursor: ew-resize;
    }
    .legend-edit-handle--s {
      left: 50%;
      bottom: -6px;
      width: 22px;
      height: 10px;
      transform: translateX(-50%);
      border-radius: 999px;
      cursor: ns-resize;
    }
    .legend-edit-handle--se {
      right: -6px;
      bottom: -6px;
      width: 12px;
      height: 12px;
      border-radius: 999px;
      cursor: nwse-resize;
    }
    .legend-context-toolbar button:focus-visible,
    .legend-resize-handle:focus-visible,
    .legend-edit-handle:focus-visible,
    .legend-editor-panel button:focus-visible,
    .legend-editor-panel input:focus-visible,
    .legend-editor-panel select:focus-visible,
    .legend-collapse-toggle:focus-visible {
      outline: 2px solid #38bdf8;
      outline-offset: 2px;
    }
    .legend-collapse-toggle {
      display: none;
      position: absolute;
      inset: 0;
      width: 40px;
      height: 40px;
      margin: auto;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(148, 163, 184, 0.4);
      border-radius: 999px;
      background: rgba(5, 8, 18, 0.88);
      color: #e2e8f0;
      font-size: 16px;
      cursor: pointer;
      z-index: 6;
    }
    #radarLegend.legend-collapsed {
      width: 40px !important;
      min-height: 40px !important;
      height: 40px !important;
      padding: 0 !important;
      overflow: hidden;
    }
    #radarLegend.legend-collapsed .legend-strip,
    #radarLegend.legend-collapsed .legend-context-toolbar,
    #radarLegend.legend-collapsed .legend-resize-handle {
      display: none;
    }
  `;
  document.head.appendChild(style);
}

/**
 * Public bridge API for the legacy classic-script `app.js` to call into this
 * ES module. All radar/product knowledge stays in app.js; this module only
 * needs the resolved product info handed to it explicitly.
 */
const RadarHeader = {
  /**
   * @param {string} productCode
   * @param {Object} productInfo
   * @param {{isReflectivity?: boolean, precipTypeModeEnabled?: boolean}} [meta]
   */
  renderForProduct(productCode, productInfo, meta) {
    renderForProduct(productCode, productInfo, meta);
  },
  openConfigPanel() {
    createLegendEditorToolButton()?.click();
  },
  getConfig,
  getConfigValue,
  setConfig(updater, options) {
    updateConfig(updater, options);
  },
  refreshPreview,
  flushConfig,
};

function bindHeaderConfigLifecycleFlush() {
  const flush = () => flushConfig();
  window.addEventListener("beforeunload", flush);
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
  });
  window.addEventListener("pagehide", flush);
}

function initializeHeaderSystem() {
  injectHeaderStyles();
  buildLegendEditorPanel();
  createLegendEditorToolButton();
  bindLegendContextToolbarInteractions();
  bindGlobalPointerListeners();
  const legendRoot = document.getElementById("radarLegend");
  ensureLegendStudioChrome(legendRoot);
  initResponsiveCollapse(legendRoot);
  subscribe(() => syncPanel());
  bindHeaderConfigLifecycleFlush();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeHeaderSystem, { once: true });
} else {
  initializeHeaderSystem();
}

window.RadarHeader = RadarHeader;
