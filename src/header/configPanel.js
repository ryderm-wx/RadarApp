/**
 * @file The Legend Studio flyout config panel: 3 tabs (Style & Themes,
 * Branding & Header, Layout & Positioning), presets UI, and the gradient
 * stop editor. Implements the ARIA tablist pattern with arrow-key
 * navigation and a focus trap while open.
 */

import {
  LEGEND_STUDIO_THEME_PRESETS,
  LEGEND_EDITOR_TARGET_MAP,
  LEGEND_EDITOR_DEFAULT_PRESET_NAME,
  escapeLegendHtml,
} from "./schema.js";
import {
  getConfig,
  getConfigValue,
  setConfigValue,
  updateConfig,
  applyStudioPanelValue,
  applyTheme,
  getPresetNames,
  savePreset,
  loadPreset,
  deletePreset,
} from "./store.js";
import { applyConfigToDom, refreshPreview } from "./renderer.js";
import { syncLegendContextToolbar, handleLegendStudioQuickAction } from "./toolbar.js";

const TABS = [
  { id: "style", label: "Style & Themes" },
  { id: "branding", label: "Branding & Header" },
  { id: "layout", label: "Layout & Positioning" },
];

function clearLegendHeaderImage() {
  updateConfig((draft) => {
    draft.header.backgroundImageData = "";
    draft.header.backgroundImageUrl = "";
    draft.header.useBackgroundImage = false;
  }, { rebuild: true });
}

function readLegendHeaderImageFile(file) {
  if (!file || !file.type?.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = () => {
    const result = typeof reader.result === "string" ? reader.result : "";
    if (!result) return;
    updateConfig((draft) => {
      draft.header.backgroundImageData = result;
      draft.header.useBackgroundImage = true;
      draft.header.backgroundImageUrl = "";
    }, { rebuild: true });
  };
  reader.readAsDataURL(file);
}

function readLegendLogoFile(file) {
  if (!file || !file.type?.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = () => {
    const result = typeof reader.result === "string" ? reader.result : "";
    if (!result) return;
    updateConfig((draft) => {
      draft.header.logoUrl = result;
      draft.visibility.logo = true;
    }, { rebuild: true });
  };
  reader.readAsDataURL(file);
}

function gradientStopRowHtml(stop, index) {
  return `
    <div class="legend-gradient-stop" data-gradient-stop-index="${index}">
      <input type="color" data-gradient-stop-color value="${escapeLegendHtml(stop.color || "#63d3ff")}" aria-label="Gradient stop ${index + 1} color">
      <input type="range" min="0" max="100" step="1" data-gradient-stop-position value="${Number(stop.stop) || 0}" aria-label="Gradient stop ${index + 1} position">
      <button type="button" data-gradient-stop-remove aria-label="Remove gradient stop ${index + 1}">x</button>
    </div>
  `;
}

function renderGradientEditor(config) {
  const bg = config.header.background || { enabled: false, type: "linear", angle: 90, stops: [] };
  const stopsHtml = (bg.stops || []).map(gradientStopRowHtml).join("");
  return `
    <div class="legend-editor__subgroup" data-gradient-editor>
      <label><input type="checkbox" data-legend-path="header.background.enabled"> Gradient background</label>
      <label>Type
        <select data-legend-path="header.background.type">
          <option value="linear">Linear</option>
          <option value="radial">Radial</option>
        </select>
      </label>
      <label data-gradient-angle-row>Angle <input type="range" min="0" max="360" step="1" data-legend-path="header.background.angle"></label>
      <div data-gradient-stop-list>${stopsHtml}</div>
      <button type="button" data-legend-action="add-gradient-stop">Add Stop</button>
    </div>
  `;
}

function syncGradientEditor(panel) {
  const config = getConfig();
  const bg = config.header.background;
  if (!bg) return;
  const wrap = panel.querySelector("[data-gradient-editor]");
  if (!wrap) return;
  wrap.querySelector('[data-legend-path="header.background.enabled"]').checked = !!bg.enabled;
  wrap.querySelector('[data-legend-path="header.background.type"]').value = bg.type || "linear";
  wrap.querySelector('[data-legend-path="header.background.angle"]').value = bg.angle ?? 90;
  wrap.querySelector("[data-gradient-angle-row]").classList.toggle("is-hidden", bg.type === "radial");
  wrap.querySelector("[data-gradient-stop-list]").innerHTML = (bg.stops || [])
    .map(gradientStopRowHtml)
    .join("");
}

export function refreshPresetOptions() {
  const select = document.querySelector("[data-legend-preset-select]");
  if (!select) return;
  const previous = select.value;
  const names = getPresetNames();
  select.innerHTML = names
    .map((name) => {
      const label = name === LEGEND_EDITOR_DEFAULT_PRESET_NAME ? "Broadcast Default" : name;
      return `<option value="${escapeLegendHtml(name)}">${escapeLegendHtml(label)}</option>`;
    })
    .join("");
  if (names.includes(previous)) select.value = previous;
}

export function updateTargetInspectorControls() {
  const panel = document.getElementById("legendEditorPanel");
  if (!panel) return;
  const selectedTarget = getConfigValue("editor.selectedTarget");
  const targetMeta = LEGEND_EDITOR_TARGET_MAP[selectedTarget];
  const title = panel.querySelector("[data-editor-target-label]");
  const xInput = panel.querySelector("[data-editor-target-x]");
  const yInput = panel.querySelector("[data-editor-target-y]");
  const scaleInput = panel.querySelector("[data-editor-target-scale]");
  if (title) title.textContent = selectedTarget || "header-container";
  if (!targetMeta) return;
  if (xInput) xInput.value = getConfigValue(targetMeta.xPath) ?? 0;
  if (yInput) yInput.value = getConfigValue(targetMeta.yPath) ?? 0;
  if (scaleInput) scaleInput.value = getConfigValue(targetMeta.scalePath) ?? 1;
}

/** Moves focus to the given tab index, wrapping around, and activates it. */
function focusTab(panel, index) {
  const tabButtons = Array.from(panel.querySelectorAll("[data-legend-tab]"));
  const wrapped = (index + tabButtons.length) % tabButtons.length;
  const button = tabButtons[wrapped];
  button?.focus();
  const tab = button?.getAttribute("data-legend-tab");
  if (tab) {
    updateConfig((draft) => {
      draft.editor.activeTab = tab;
    }, { sync: true });
  }
}

export function buildLegendEditorPanel() {
  document.getElementById("legendEditorPanel")?.remove();
  const panel = document.createElement("aside");
  panel.id = "legendEditorPanel";
  panel.className = "legend-editor-panel is-hidden";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Broadcast Legend Studio");
  const config = getConfig();
  panel.innerHTML = `
    <div class="legend-editor__header">
      <div>
        <strong>Broadcast Legend Studio</strong>
        <span>Smart lower-third setup</span>
      </div>
      <button type="button" data-legend-action="close" aria-label="Close Legend Studio">x</button>
    </div>
    <div class="legend-editor__tabs" role="tablist" aria-label="Legend Studio sections">
      ${TABS.map(
        (tab, i) => `<button type="button" role="tab" id="legendTab-${tab.id}" aria-controls="legendPanel-${tab.id}" data-legend-tab="${tab.id}" tabindex="${i === 0 ? "0" : "-1"}">${tab.label}</button>`,
      ).join("")}
    </div>
    <div class="legend-editor__body">
      <section data-legend-section="style" id="legendPanel-style" role="tabpanel" aria-labelledby="legendTab-style">
        <div class="legend-editor__theme-grid">
          ${Object.entries(LEGEND_STUDIO_THEME_PRESETS)
            .map(
              ([key, preset]) => `
                <button type="button" class="legend-theme-card" data-legend-theme="${escapeLegendHtml(key)}" aria-pressed="${config.theme === key ? "true" : "false"}">
                  <span class="legend-theme-card__swatch" style="--theme-accent:${escapeLegendHtml(preset.accent)}"></span>
                  <strong>${escapeLegendHtml(preset.label)}</strong>
                  <small>${escapeLegendHtml(preset.description)}</small>
                </button>
              `,
            )
            .join("")}
        </div>
        <div class="legend-editor__subgroup">
          <label>Accent <input type="color" data-legend-path="palette.accentColor"></label>
          <label><input type="checkbox" data-legend-path="visibility.badges"> Auto metadata badges</label>
          <label><input type="checkbox" data-legend-path="visibility.footnote"> Product footnote</label>
          <label><input type="checkbox" data-legend-path="visibility.hoverReadout"> Hover readout</label>
          <label>Background <input type="range" min="0.3" max="1" step="0.01" data-legend-path="visuals.backgroundOpacity"></label>
          <label>Blur (glassmorphism) <input type="range" min="0" max="26" step="1" data-legend-path="visuals.blur"></label>
          <label>Shadow <input type="range" min="0" max="0.8" step="0.01" data-legend-path="visuals.shadowStrength"></label>
        </div>
        ${renderGradientEditor(config)}
        <div class="legend-editor__preset-actions">
          <select data-legend-preset-select aria-label="Saved presets"></select>
          <input type="text" data-legend-preset-name placeholder="Save custom layout" aria-label="New preset name">
          <button type="button" data-legend-action="save-preset">Save</button>
          <button type="button" data-legend-action="load-preset">Load</button>
          <button type="button" data-legend-action="delete-preset">Delete</button>
        </div>
      </section>
      <section data-legend-section="branding" id="legendPanel-branding" role="tabpanel" aria-labelledby="legendTab-branding" class="is-hidden">
        <div class="legend-editor__quick-row">
          <button type="button" data-legend-action="toggle-edit">Toggle Drag Edit</button>
          <button type="button" data-legend-action="toggle-header">Toggle Header</button>
          <button type="button" data-legend-action="swap-logo">Swap Logo</button>
        </div>
        <label>Header Height <input type="range" min="28" max="160" step="1" data-legend-path="header.height"></label>
        <label>Header Width <input type="range" min="0" max="680" step="1" data-legend-path="header.width" title="0 = full legend width"></label>
        <label>Header Image Height <input type="range" min="48" max="220" step="1" data-legend-path="header.canvasHeight"></label>
        <label><input type="checkbox" data-legend-path="editor.headerEditMode"> Drag-to-edit layout</label>
        <label><input type="checkbox" data-legend-path="editor.showGuides"> Show alignment guides</label>
        <label><input type="checkbox" data-legend-path="visibility.header"> Header visible</label>
        <label><input type="checkbox" data-legend-path="visibility.subtitle"> Subtitle visible</label>
        <label><input type="checkbox" data-legend-path="visibility.logo"> Logo visible</label>
        <label>Upload Logo <input type="file" accept="image/*" data-legend-logo-upload aria-label="Upload logo image"></label>
        <label>Logo URL <input type="text" data-legend-path="header.logoUrl" placeholder="https://..."></label>
        <label>Logo Placement <select data-legend-path="header.logoPlacement"><option value="left">Left</option><option value="right">Right</option></select></label>
        <label>Logo Size <input type="range" min="16" max="96" step="1" data-legend-path="header.logoSize"></label>
        <label>Custom Title <input type="text" data-legend-path="header.customTitle" placeholder="Use product title"></label>
        <label>Custom Subtitle <input type="text" data-legend-path="header.customSubtitle" placeholder="Use radar metadata"></label>
        <div class="legend-editor__subgroup">
          <label><input type="checkbox" data-legend-path="header.useBackgroundImage"> Header image</label>
          <label>Upload <input type="file" accept="image/*" data-legend-header-image-upload aria-label="Upload header background image"></label>
          <label>Image URL <input type="text" data-legend-path="header.backgroundImageUrl" placeholder="https://..."></label>
          <label>Image Fit <select data-legend-path="header.backgroundFit"><option value="cover">Cover</option><option value="contain">Contain</option><option value="fill">Fill</option></select></label>
          <label>Overlay <input type="range" min="0" max="1" step="0.01" data-legend-path="headerImage.overlayOpacity"></label>
          <button type="button" data-legend-action="clear-header-image">Clear Header Image</button>
        </div>
      </section>
      <section data-legend-section="layout" id="legendPanel-layout" role="tabpanel" aria-labelledby="legendTab-layout" class="is-hidden">
        <div class="legend-anchor-grid" role="group" aria-label="Legend screen anchor">
          <button type="button" data-legend-anchor="top-left">Top Left</button>
          <button type="button" data-legend-anchor="top-center">Top</button>
          <button type="button" data-legend-anchor="top-right">Top Right</button>
          <button type="button" data-legend-anchor="bottom-left">Bottom Left</button>
          <button type="button" data-legend-anchor="bottom-center">Bottom</button>
          <button type="button" data-legend-anchor="bottom-right">Bottom Right</button>
        </div>
        <label>Width <input type="range" min="260" max="700" step="1" data-legend-path="layout.width"></label>
        <label>Card Height <input type="range" min="56" max="520" step="1" data-legend-path="layout.minHeight"></label>
        <label>Scale <input type="range" min="0.65" max="1.8" step="0.01" data-legend-path="layout.scale"></label>
        <label>Offset X <input type="range" min="0" max="400" step="1" data-legend-path="layout.offsetX"></label>
        <label>Offset Y <input type="range" min="0" max="260" step="1" data-legend-path="layout.offsetY"></label>
        <label>Padding X <input type="range" min="4" max="40" step="1" data-legend-path="layout.paddingX"></label>
        <label>Padding Y <input type="range" min="4" max="30" step="1" data-legend-path="layout.paddingY"></label>
        <label>Gap <input type="range" min="2" max="24" step="1" data-legend-path="layout.itemGap"></label>
        <label>Gradient Height <input type="range" min="8" max="40" step="1" data-legend-path="gradient.height"></label>
        <label><input type="checkbox" data-legend-path="visibility.gradient"> Gradient visible</label>
        <label><input type="checkbox" data-legend-path="visibility.gradientLabels"> Legend labels visible</label>
        <p class="legend-editor__hint">Turn on drag-to-edit in Branding to freely position every layer on the legend card — logo, title, gradient, badges, and more are all independent.</p>
        <div class="legend-editor__subgroup" data-element-inspector>
          <p>Selected layer: <strong data-editor-target-label>header-container</strong></p>
          <label>Offset X <input type="number" data-editor-target-x step="1"></label>
          <label>Offset Y <input type="number" data-editor-target-y step="1"></label>
          <label>Scale <input type="range" data-editor-target-scale min="0.5" max="2" step="0.01"></label>
        </div>
        <button type="button" data-legend-action="reset-layout">Reset Layout</button>
      </section>
    </div>
  `;
  document.body.appendChild(panel);

  panel.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    const tabButton = target.closest("[data-legend-tab]");
    if (tabButton) {
      const tab = tabButton.getAttribute("data-legend-tab") || "layout";
      updateConfig((draft) => {
        draft.editor.activeTab = tab;
      }, { sync: true });
      return;
    }
    const themeButton = target.closest("[data-legend-theme]");
    if (themeButton) {
      const theme = themeButton.getAttribute("data-legend-theme");
      if (!theme) return;
      applyTheme(theme);
      refreshPreview({ rebuild: true });
      return;
    }
    const anchorButton = target.closest("[data-legend-anchor]");
    if (anchorButton) {
      const anchor = anchorButton.getAttribute("data-legend-anchor") || "top-center";
      updateConfig((draft) => {
        draft.layout.anchor = anchor;
      });
      return;
    }
    if (target.closest("[data-gradient-stop-remove]")) {
      const row = target.closest("[data-gradient-stop-index]");
      const index = Number(row?.getAttribute("data-gradient-stop-index"));
      updateConfig((draft) => {
        draft.header.background.stops.splice(index, 1);
      }, { rebuild: true });
      return;
    }
    const actionButton = target.closest("[data-legend-action]");
    if (!actionButton) return;
    const action = actionButton.getAttribute("data-legend-action");
    const presetSelect = panel.querySelector("[data-legend-preset-select]");
    const presetNameInput = panel.querySelector("[data-legend-preset-name]");
    if (action === "close") {
      panel.classList.add("is-hidden");
      document.getElementById("legendEditorToggle")?.classList.remove("active");
      return;
    }
    if (action === "clear-header-image") {
      clearLegendHeaderImage();
      return;
    }
    if (
      action === "toggle-edit" ||
      action === "toggle-header" ||
      action === "swap-logo" ||
      action === "reset-layout"
    ) {
      handleLegendStudioQuickAction(action);
      return;
    }
    if (action === "add-gradient-stop") {
      updateConfig((draft) => {
        draft.header.background.stops.push({ color: "#63d3ff", stop: 100 });
        draft.header.background.enabled = true;
      }, { rebuild: true });
      return;
    }
    if (action === "save-preset") {
      const customName = String(presetNameInput?.value || "").trim();
      if (!customName) return;
      savePreset(customName);
      refreshPresetOptions();
      if (presetSelect) presetSelect.value = customName;
      return;
    }
    if (action === "load-preset") {
      const selected = String(presetSelect?.value || "").trim();
      if (!selected) return;
      loadPreset(selected);
      refreshPreview({ rebuild: true });
      return;
    }
    if (action === "delete-preset") {
      const selected = String(presetSelect?.value || "").trim();
      deletePreset(selected);
      refreshPresetOptions();
    }
  });

  panel.addEventListener("keydown", (event) => {
    const tabButton = event.target instanceof HTMLElement ? event.target.closest("[data-legend-tab]") : null;
    if (!tabButton) {
      if (event.key === "Escape") {
        panel.classList.add("is-hidden");
        document.getElementById("legendEditorToggle")?.classList.remove("active");
        document.getElementById("legendEditorToggle")?.focus();
      }
      return;
    }
    const tabButtons = Array.from(panel.querySelectorAll("[data-legend-tab]"));
    const currentIndex = tabButtons.indexOf(tabButton);
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      focusTab(panel, currentIndex + 1);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      focusTab(panel, currentIndex - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusTab(panel, 0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusTab(panel, tabButtons.length - 1);
    }
  });

  panel.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement || target instanceof HTMLSelectElement)) return;
    if (target.hasAttribute("data-editor-target-x")) {
      const selectedTarget = getConfigValue("editor.selectedTarget");
      const targetMeta = LEGEND_EDITOR_TARGET_MAP[selectedTarget];
      if (!targetMeta) return;
      setConfigValue(targetMeta.xPath, Number.parseFloat(target.value) || 0);
      applyConfigToDom();
      return;
    }
    if (target.hasAttribute("data-editor-target-y")) {
      const selectedTarget = getConfigValue("editor.selectedTarget");
      const targetMeta = LEGEND_EDITOR_TARGET_MAP[selectedTarget];
      if (!targetMeta) return;
      setConfigValue(targetMeta.yPath, Number.parseFloat(target.value) || 0);
      applyConfigToDom();
      return;
    }
    if (target.hasAttribute("data-editor-target-scale")) {
      const selectedTarget = getConfigValue("editor.selectedTarget");
      const targetMeta = LEGEND_EDITOR_TARGET_MAP[selectedTarget];
      if (!targetMeta) return;
      setConfigValue(targetMeta.scalePath, Number.parseFloat(target.value) || 1);
      applyConfigToDom();
      return;
    }
    if (target.hasAttribute("data-gradient-stop-color") || target.hasAttribute("data-gradient-stop-position")) {
      const row = target.closest("[data-gradient-stop-index]");
      const index = Number(row?.getAttribute("data-gradient-stop-index"));
      const isColor = target.hasAttribute("data-gradient-stop-color");
      updateConfig((draft) => {
        const stop = draft.header.background.stops[index];
        if (!stop) return;
        if (isColor) stop.color = target.value;
        else stop.stop = Number.parseFloat(target.value) || 0;
      });
      return;
    }
    const path = target.getAttribute("data-legend-path");
    if (!path) return;
    const nextValue =
      target instanceof HTMLInputElement && target.type === "checkbox" ? target.checked : target.value;
    applyStudioPanelValue(path, nextValue, target.type);
  });

  panel.addEventListener("change", (event) => {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.hasAttribute("data-legend-header-image-upload")) {
      readLegendHeaderImageFile(target.files?.[0]);
      target.value = "";
      return;
    }
    if (target instanceof HTMLInputElement && target.hasAttribute("data-legend-logo-upload")) {
      readLegendLogoFile(target.files?.[0]);
      target.value = "";
    }
  });

  refreshPresetOptions();
  syncPanel();
}

export function syncPanel() {
  const panel = document.getElementById("legendEditorPanel");
  if (!panel) return;
  const config = getConfig();
  const activeTab = config.editor.activeTab || "style";
  panel.querySelectorAll("[data-legend-tab]").forEach((button) => {
    const isActive = button.getAttribute("data-legend-tab") === activeTab;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
    button.tabIndex = isActive ? 0 : -1;
  });
  panel.querySelectorAll("[data-legend-section]").forEach((section) => {
    section.classList.toggle("is-hidden", section.getAttribute("data-legend-section") !== activeTab);
  });
  panel.querySelectorAll("[data-legend-path]").forEach((input) => {
    const path = input.getAttribute("data-legend-path");
    const value = getConfigValue(path);
    if (input instanceof HTMLInputElement && input.type === "checkbox") {
      input.checked = Boolean(value);
      return;
    }
    if (input instanceof HTMLInputElement && input.type === "color") {
      const fallback =
        path === "palette.accentColor" ? "#63d3ff" : path === "headerImage.overlayColor" ? "#000000" : "#ffffff";
      input.value = typeof value === "string" && /^#/.test(value) ? value : fallback;
      return;
    }
    input.value = value ?? "";
  });
  panel.querySelectorAll("[data-legend-theme]").forEach((button) => {
    const isActive = button.getAttribute("data-legend-theme") === config.theme;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  });
  panel.querySelectorAll("[data-legend-anchor]").forEach((button) => {
    button.classList.toggle("active", button.getAttribute("data-legend-anchor") === config.layout.anchor);
  });
  syncGradientEditor(panel);
  syncLegendContextToolbar(document.getElementById("radarLegend"));
  updateTargetInspectorControls();
}

/** Creates (or returns) the bottom-tray button that opens the Legend Studio panel. */
export function createLegendEditorToolButton() {
  let button = document.getElementById("legendEditorToggle");
  if (!button) {
    const toolGrid = document.querySelector(".bottom-center .tool-grid");
    if (!toolGrid) return null;
    button = document.createElement("button");
    button.id = "legendEditorToggle";
    button.className = "inspector-toggle btn-icon";
    button.type = "button";
    button.title = "Legend Studio";
    button.setAttribute("aria-haspopup", "dialog");
    button.setAttribute("aria-expanded", "false");
    button.innerHTML =
      '<span class="inspector-toggle-icon" aria-hidden="true"><i data-lucide="panel-top"></i></span>';
    toolGrid.appendChild(button);
    if (typeof window.rebalanceSystemTrayRows === "function") {
      window.rebalanceSystemTrayRows();
    }
    if (window.lucide && typeof window.lucide.createIcons === "function") {
      window.lucide.createIcons();
    }
  }

  if (!button.dataset.legendEditorBound) {
    button.dataset.legendEditorBound = "true";
    button.addEventListener("click", (event) => {
      event.preventDefault();
      const panel = document.getElementById("legendEditorPanel");
      if (!panel) return;
      const nextVisible = panel.classList.contains("is-hidden");
      panel.classList.toggle("is-hidden", !nextVisible);
      button.classList.toggle("active", nextVisible);
      button.setAttribute("aria-expanded", nextVisible ? "true" : "false");
      if (nextVisible) {
        syncPanel();
        refreshPreview({ rebuild: true });
        panel.querySelector("[data-legend-tab].active")?.focus();
      }
    });
  }
  return button;
}
