/**
 * @file On-canvas toolbar for the Radar Legend: quick-toggle buttons, resize
 * handles (width/height/scale, per-layer), and inline title/subtitle editing.
 * Every mutation goes through the store (`updateConfig`/`setConfigValue`) —
 * this module never mutates config directly.
 */

import {
  LEGEND_EDITOR_TARGET_MAP,
  LEGEND_TARGET_VISIBILITY_PATH,
  DEFAULT_LEGEND_EDITOR_CONFIG,
  cloneLegendEditorConfig,
} from "./schema.js";
import {
  getConfig,
  getConfigValue,
  setConfigValue,
  updateConfig,
  getDragState,
  setDragState,
  endDragSession,
} from "./store.js";
// Circular ES module imports are safe here: both sides only invoke the
// imported bindings from within event-handler closures at runtime, never
// during each other's top-level module evaluation.
import { applyConfigToDom } from "./renderer.js";
import { syncPanel, updateTargetInspectorControls } from "./configPanel.js";

function clampNumber(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function isLegendHeaderImageMode(header) {
  if (!header) return false;
  if (header.useBackgroundImage === false) return false;
  const data = String(header.backgroundImageData || "").trim();
  const url = String(header.backgroundImageUrl || "").trim();
  return Boolean(data || url);
}

/** @param {import('./types.js').ToolbarActionId} action */
export function handleLegendStudioQuickAction(action) {
  if (!action) return;
  if (action === "toggle-header") {
    updateConfig((draft) => {
      draft.visibility.header = !draft.visibility.header;
    }, { rebuild: true });
    return;
  }
  if (action === "swap-logo") {
    updateConfig((draft) => {
      draft.header.logoPlacement = draft.header.logoPlacement === "right" ? "left" : "right";
    });
    return;
  }
  if (action === "toggle-readout") {
    updateConfig((draft) => {
      draft.visibility.hoverReadout = !draft.visibility.hoverReadout;
    });
    return;
  }
  if (action === "toggle-edit") {
    updateConfig((draft) => {
      draft.editor.headerEditMode = !draft.editor.headerEditMode;
    });
    return;
  }
  if (action === "toggle-logo") {
    updateConfig((draft) => {
      draft.visibility.logo = !draft.visibility.logo;
    }, { rebuild: true });
    return;
  }
  if (action === "toggle-subtitle") {
    updateConfig((draft) => {
      draft.visibility.subtitle = !draft.visibility.subtitle;
    });
    return;
  }
  if (action === "toggle-gradient") {
    updateConfig((draft) => {
      draft.visibility.gradient = !draft.visibility.gradient;
    });
    return;
  }
  if (action === "toggle-gradient-labels") {
    updateConfig((draft) => {
      draft.visibility.gradientLabels = !draft.visibility.gradientLabels;
    });
    return;
  }
  if (action === "toggle-badges") {
    updateConfig((draft) => {
      draft.visibility.badges = !draft.visibility.badges;
    });
    return;
  }
  if (action === "toggle-footnote") {
    updateConfig((draft) => {
      draft.visibility.footnote = !draft.visibility.footnote;
    });
    return;
  }
  if (action === "toggle-selected") {
    const selectedTarget = getConfigValue("editor.selectedTarget");
    const visibilityPath = LEGEND_TARGET_VISIBILITY_PATH[selectedTarget];
    if (!visibilityPath) return;
    updateConfig(
      (draft) => {
        const segments = visibilityPath.split(".");
        let ref = draft;
        for (let i = 0; i < segments.length - 1; i += 1) {
          ref = ref[segments[i]];
        }
        const key = segments[segments.length - 1];
        ref[key] = !ref[key];
      },
      { rebuild: visibilityPath === "visibility.header" || visibilityPath === "visibility.logo" },
    );
    return;
  }
  if (action === "reset-layout") {
    updateConfig((draft) => {
      draft.layout = {
        ...draft.layout,
        ...cloneLegendEditorConfig(DEFAULT_LEGEND_EDITOR_CONFIG.layout),
      };
      draft.layout.freeform = false;
      draft.header.containerOffsetX = 0;
      draft.header.containerOffsetY = 0;
      draft.header.containerScale = 1;
      draft.header.textOffsetX = 0;
      draft.header.textOffsetY = 0;
      draft.header.textScale = 1;
      draft.header.logoOffsetX = 0;
      draft.header.logoOffsetY = 0;
      draft.header.logoScale = 1;
      draft.header.titleOffsetX = 0;
      draft.header.titleOffsetY = 0;
      draft.header.titleScale = 1;
      draft.header.subtitleOffsetX = 0;
      draft.header.subtitleOffsetY = 0;
      draft.header.subtitleScale = 1;
      draft.header.width = 0;
      draft.header.height = DEFAULT_LEGEND_EDITOR_CONFIG.header.height;
      draft.header.canvasHeight = DEFAULT_LEGEND_EDITOR_CONFIG.header.canvasHeight;
      draft.gradient.offsetX = 0;
      draft.gradient.offsetY = 0;
      draft.gradient.scale = 1;
      draft.gradient.labelsOffsetX = 0;
      draft.gradient.labelsOffsetY = 0;
      draft.gradient.labelsScale = 1;
      draft.badges.offsetX = 0;
      draft.badges.offsetY = 0;
      draft.badges.scale = 1;
      draft.footnote.offsetX = 0;
      draft.footnote.offsetY = 0;
      draft.footnote.scale = 1;
    });
  }
}

export function commitEditableText() {
  updateConfig((draft) => {
    const legendRoot = document.getElementById("radarLegend");
    if (!legendRoot) return;
    const titleEl = legendRoot.querySelector(".legend-strip__title");
    const subtitleEl = legendRoot.querySelector(".legend-strip__subtitle");
    if (titleEl) draft.header.customTitle = titleEl.textContent?.trim() || "";
    if (subtitleEl) draft.header.customSubtitle = subtitleEl.textContent?.trim() || "";
  });
}

function createLegendTargetResizeHandles(target, handleTypes) {
  const wrap = document.createElement("div");
  wrap.className = "legend-target-edit-handles";
  wrap.setAttribute("data-legend-target-handles", target);
  const handleSpecs = {
    e: { mode: "header-width", className: "legend-edit-handle--e", label: "Resize header width" },
    s: { mode: "header-height", className: "legend-edit-handle--s", label: "Resize header height" },
    se: { mode: "logo-size", className: "legend-edit-handle--se", label: "Resize logo" },
  };
  handleTypes.forEach((type) => {
    const spec = handleSpecs[type];
    if (!spec) return;
    const button = document.createElement("button");
    button.type = "button";
    button.className = `legend-edit-handle ${spec.className}`;
    button.setAttribute("data-legend-resize-mode", spec.mode);
    button.setAttribute("aria-label", spec.label);
    wrap.appendChild(button);
  });
  return wrap;
}

export function updateLegendStudioResizeChrome(legendRoot) {
  if (!legendRoot) return;
  const config = getConfig();
  const editMode = !!config?.editor?.headerEditMode;
  const freeform = config?.layout?.freeform === true;
  legendRoot.classList.toggle("legend-studio-edit-active", editMode);
  legendRoot.classList.toggle("legend-freeform-active", freeform);
  legendRoot.querySelectorAll(".legend-target-edit-handles").forEach((element) => {
    element.remove();
  });
  if (!editMode) return;

  const headerEl = legendRoot.querySelector('[data-legend-target="header-container"]');
  if (headerEl && config.visibility?.header !== false) {
    headerEl.appendChild(createLegendTargetResizeHandles("header-container", ["e", "s"]));
  }
  const logoEl = legendRoot.querySelector('[data-legend-target="logo"]');
  if (logoEl && config.visibility?.logo !== false) {
    logoEl.appendChild(createLegendTargetResizeHandles("logo", ["se"]));
  }
}

export function beginLegendResizeDrag(mode, event) {
  const config = getConfig();
  const imageMode = isLegendHeaderImageMode(config.header);
  const legendRoot = document.getElementById("radarLegend");
  const dragState = { mode, startX: event.clientX, startY: event.clientY };

  if (mode === "legend-scale") {
    dragState.originScale = Number(getConfigValue("layout.scale")) || 1;
  } else if (mode === "legend-width") {
    dragState.originWidth = Number(getConfigValue("layout.width")) || 360;
  } else if (mode === "legend-height") {
    dragState.originHeight = Number(getConfigValue("layout.minHeight")) || 88;
  } else if (mode === "header-width") {
    const headerEl = legendRoot?.querySelector('[data-legend-target="header-container"]');
    const configuredWidth = Number(getConfigValue("header.width")) || 0;
    dragState.originWidth = configuredWidth > 0 ? configuredWidth : headerEl?.offsetWidth || 320;
  } else if (mode === "header-height") {
    dragState.imageMode = imageMode;
    dragState.originHeight = imageMode
      ? Number(getConfigValue("header.canvasHeight")) || 104
      : Number(getConfigValue("header.height")) || 44;
  } else if (mode === "logo-size") {
    dragState.originSize = Number(getConfigValue("header.logoSize")) || 28;
  } else {
    return;
  }

  setDragState(dragState);
}

export function onLegendEditorPointerMove(event) {
  const dragging = getDragState();
  if (!dragging) return;
  if (dragging.mode === "legend-scale") {
    const dx = event.clientX - dragging.startX;
    const dy = event.clientY - dragging.startY;
    const delta = (dx + dy) / 420;
    const scale = clampNumber(dragging.originScale + delta, 0.65, 1.8);
    setConfigValue("layout.scale", Number(scale.toFixed(2)));
    applyConfigToDom();
    return;
  }
  if (dragging.mode === "legend-width") {
    const dx = event.clientX - dragging.startX;
    const width = clampNumber(dragging.originWidth + dx, 260, 700);
    setConfigValue("layout.width", Math.round(width));
    applyConfigToDom();
    return;
  }
  if (dragging.mode === "legend-height") {
    const dy = event.clientY - dragging.startY;
    const minHeight = clampNumber(dragging.originHeight + dy, 56, 520);
    setConfigValue("layout.minHeight", Math.round(minHeight));
    applyConfigToDom();
    return;
  }
  if (dragging.mode === "header-width") {
    const dx = event.clientX - dragging.startX;
    const width = clampNumber(dragging.originWidth + dx, 120, 680);
    setConfigValue("header.width", Math.round(width));
    applyConfigToDom();
    return;
  }
  if (dragging.mode === "header-height") {
    const dy = event.clientY - dragging.startY;
    if (dragging.imageMode) {
      const canvasHeight = clampNumber(dragging.originHeight + dy, 48, 220);
      setConfigValue("header.canvasHeight", Math.round(canvasHeight));
    } else {
      const height = clampNumber(dragging.originHeight + dy, 28, 160);
      setConfigValue("header.height", Math.round(height));
    }
    applyConfigToDom();
    return;
  }
  if (dragging.mode === "logo-size") {
    const dx = event.clientX - dragging.startX;
    const dy = event.clientY - dragging.startY;
    const size = clampNumber(dragging.originSize + (dx + dy) / 2, 16, 96);
    setConfigValue("header.logoSize", Math.round(size));
    applyConfigToDom();
    return;
  }
  if (!dragging.targetMeta) return;
  const snap = Math.max(1, Number(getConfigValue("editor.snap")) || 1);
  const dx = event.clientX - dragging.startX;
  const dy = event.clientY - dragging.startY;
  const snappedX = Math.round((dragging.originX + dx) / snap) * snap;
  const snappedY = Math.round((dragging.originY + dy) / snap) * snap;
  setConfigValue(dragging.targetMeta.xPath, snappedX);
  setConfigValue(dragging.targetMeta.yPath, snappedY);
  applyConfigToDom();
}

export function onLegendEditorPointerUp() {
  if (!getDragState()) return;
  endDragSession();
}

export function bindLegendContextToolbarInteractions() {
  const legendRoot = document.getElementById("radarLegend");
  if (!legendRoot || legendRoot.dataset.legendContextBound === "true") return;
  legendRoot.dataset.legendContextBound = "true";

  legendRoot.addEventListener("pointerdown", (event) => {
    const actionButton =
      event.target instanceof HTMLElement ? event.target.closest("[data-legend-context-action]") : null;
    if (actionButton) {
      const action = actionButton.getAttribute("data-legend-context-action");
      if (action && action !== "scale") {
        event.preventDefault();
        event.stopPropagation();
        handleLegendStudioQuickAction(action);
        return;
      }
    }

    const resizeHandle =
      event.target instanceof HTMLElement ? event.target.closest("[data-legend-resize-mode]") : null;
    if (resizeHandle) {
      event.preventDefault();
      event.stopPropagation();
      const mode = resizeHandle.getAttribute("data-legend-resize-mode");
      if (mode) beginLegendResizeDrag(mode, event);
      return;
    }
    const scaleHandle =
      event.target instanceof HTMLElement
        ? event.target.closest("[data-legend-context-action='scale']")
        : null;
    if (!scaleHandle) return;
    event.preventDefault();
    event.stopPropagation();
    beginLegendResizeDrag("legend-scale", event);
  });

  // Keyboard support: Enter/Space activates focused toolbar buttons (native
  // <button> already does this, but resize handles rely on pointer drag only
  // — expose an arrow-key nudge for keyboard users).
  legendRoot.addEventListener("keydown", (event) => {
    const handle =
      event.target instanceof HTMLElement ? event.target.closest("[data-legend-resize-mode]") : null;
    if (!handle) return;
    const step = event.shiftKey ? 10 : 2;
    const deltas = {
      ArrowLeft: [-step, 0],
      ArrowRight: [step, 0],
      ArrowUp: [0, -step],
      ArrowDown: [0, step],
    };
    const delta = deltas[event.key];
    if (!delta) return;
    event.preventDefault();
    const mode = handle.getAttribute("data-legend-resize-mode");
    const fakeEvent = { clientX: delta[0], clientY: delta[1] };
    beginLegendResizeDrag(mode, { clientX: 0, clientY: 0 });
    onLegendEditorPointerMove(fakeEvent);
    onLegendEditorPointerUp();
  });
}

export function bindLegendHeaderEditorInteractions() {
  const legendDiv = document.getElementById("legendScale");
  if (!legendDiv || legendDiv.dataset.legendEditorBound === "true") return;
  legendDiv.dataset.legendEditorBound = "true";

  legendDiv.addEventListener("pointerdown", (event) => {
    if (
      event.target instanceof HTMLElement &&
      event.target.closest("[data-legend-resize-mode], .legend-context-toolbar")
    ) {
      return;
    }
    const editMode = !!getConfigValue("editor.headerEditMode");
    if (!editMode) return;
    const targetEl =
      event.target instanceof HTMLElement ? event.target.closest("[data-legend-target]") : null;
    if (!targetEl) return;
    if (event.target instanceof HTMLElement && event.target.closest(".legend-edit-handle")) {
      return;
    }
    event.preventDefault();
    const target = targetEl.getAttribute("data-legend-target") || "header-container";
    const targetMeta = LEGEND_EDITOR_TARGET_MAP[target];
    if (!targetMeta) return;
    setConfigValue("editor.selectedTarget", target);
    if (target === "logo") {
      setConfigValue("editor.activeTab", "branding");
    } else if (["gradient", "gradient-labels", "badges", "footnote"].includes(target)) {
      setConfigValue("editor.activeTab", "layout");
    } else {
      setConfigValue("editor.activeTab", "branding");
    }
    syncPanel();
    updateTargetInspectorControls();
    applyConfigToDom();
    setDragState({
      targetMeta,
      startX: event.clientX,
      startY: event.clientY,
      originX: Number(getConfigValue(targetMeta.xPath)) || 0,
      originY: Number(getConfigValue(targetMeta.yPath)) || 0,
    });
  });

  legendDiv.addEventListener("dblclick", (event) => {
    const target =
      event.target instanceof HTMLElement
        ? event.target.closest(".legend-strip__title, .legend-strip__subtitle")
        : null;
    if (!(target instanceof HTMLElement)) return;
    event.preventDefault();
    target.setAttribute("contenteditable", "true");
    target.focus();
    document.getSelection()?.selectAllChildren(target);
  });

  legendDiv.addEventListener("focusout", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (
      target.matches(".legend-strip__title[contenteditable='true']") ||
      target.matches(".legend-strip__subtitle[contenteditable='true']")
    ) {
      target.setAttribute("contenteditable", "false");
      commitEditableText();
      syncPanel();
    }
  });

  legendDiv.addEventListener("input", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (
      target.matches(".legend-strip__title[contenteditable='true']") ||
      target.matches(".legend-strip__subtitle[contenteditable='true']")
    ) {
      commitEditableText();
    }
  });
}

export function syncLegendContextToolbar(legendRoot = document.getElementById("radarLegend")) {
  if (!legendRoot) return;
  const config = getConfig();
  const visibility = config.visibility || {};
  const editMode = !!config.editor?.headerEditMode;
  const selectedTarget = config.editor?.selectedTarget || "header-container";
  const canToggleSelected = Boolean(LEGEND_TARGET_VISIBILITY_PATH[selectedTarget]);

  const setActive = (selector, active) => {
    const el = legendRoot.querySelector(selector);
    el?.classList.toggle("is-active", active);
    if (el) el.setAttribute("aria-pressed", active ? "true" : "false");
  };

  setActive('[data-legend-context-action="toggle-edit"]', editMode);
  setActive('[data-legend-context-action="toggle-readout"]', visibility.hoverReadout !== false);
  setActive('[data-legend-context-action="toggle-header"]', visibility.header !== false);
  setActive('[data-legend-context-action="toggle-logo"]', visibility.logo !== false);
  setActive('[data-legend-context-action="toggle-subtitle"]', visibility.subtitle !== false);
  setActive('[data-legend-context-action="toggle-gradient"]', visibility.gradient !== false);
  setActive('[data-legend-context-action="toggle-gradient-labels"]', visibility.gradientLabels !== false);
  setActive('[data-legend-context-action="toggle-badges"]', visibility.badges !== false);
  setActive('[data-legend-context-action="toggle-footnote"]', visibility.footnote !== false);

  const editRow = legendRoot.querySelector(".legend-context-toolbar__edit-row");
  if (editRow) {
    editRow.classList.toggle("is-hidden", !editMode);
  }
  const hideSelectedBtn = legendRoot.querySelector('[data-legend-context-action="toggle-selected"]');
  if (hideSelectedBtn) {
    hideSelectedBtn.classList.toggle("is-hidden", !editMode || !canToggleSelected);
    hideSelectedBtn.textContent = `Hide ${selectedTarget}`;
  }
}

/** Builds/refreshes the on-canvas toolbar + resize handles on `#radarLegend`. */
export function ensureLegendStudioChrome(legendRoot) {
  if (!legendRoot) return;
  const config = getConfig();
  const visibility = config.visibility || {};
  const editMode = !!config.editor?.headerEditMode;
  const activeClass = (enabled) => (enabled !== false ? "is-active" : "");
  const pressed = (enabled) => (enabled !== false ? "true" : "false");

  let toolbar = legendRoot.querySelector(".legend-context-toolbar");
  if (!toolbar) {
    toolbar = document.createElement("div");
    toolbar.className = "legend-context-toolbar";
    toolbar.setAttribute("role", "toolbar");
    toolbar.setAttribute("aria-label", "Legend quick actions");
    legendRoot.appendChild(toolbar);
  }
  toolbar.innerHTML = `
    <div class="legend-context-toolbar__main-row">
      <button type="button" data-legend-context-action="toggle-edit" class="${activeClass(editMode)}" aria-pressed="${pressed(editMode)}">Edit</button>
      <button type="button" data-legend-context-action="toggle-header" class="${activeClass(visibility.header)}" aria-pressed="${pressed(visibility.header)}">Header</button>
      <button type="button" data-legend-context-action="swap-logo">Swap Logo</button>
      <button type="button" data-legend-context-action="toggle-readout" class="${activeClass(visibility.hoverReadout)}" aria-pressed="${pressed(visibility.hoverReadout)}">Readout</button>
      <button type="button" data-legend-context-action="reset-layout">Reset</button>
    </div>
    <div class="legend-context-toolbar__edit-row${editMode ? "" : " is-hidden"}">
      <button type="button" data-legend-context-action="toggle-logo" class="${activeClass(visibility.logo)}" aria-pressed="${pressed(visibility.logo)}">Logo</button>
      <button type="button" data-legend-context-action="toggle-subtitle" class="${activeClass(visibility.subtitle)}" aria-pressed="${pressed(visibility.subtitle)}">Subtitle</button>
      <button type="button" data-legend-context-action="toggle-gradient" class="${activeClass(visibility.gradient)}" aria-pressed="${pressed(visibility.gradient)}">Gradient</button>
      <button type="button" data-legend-context-action="toggle-gradient-labels" class="${activeClass(visibility.gradientLabels)}" aria-pressed="${pressed(visibility.gradientLabels)}">Labels</button>
      <button type="button" data-legend-context-action="toggle-badges" class="${activeClass(visibility.badges)}" aria-pressed="${pressed(visibility.badges)}">Badges</button>
      <button type="button" data-legend-context-action="toggle-footnote" class="${activeClass(visibility.footnote)}" aria-pressed="${pressed(visibility.footnote)}">Note</button>
      <button type="button" data-legend-context-action="toggle-selected">Hide layer</button>
    </div>
  `;
  syncLegendContextToolbar(legendRoot);

  const handleSpecs = [
    { className: "legend-resize-handle--width", mode: "legend-width", label: "Resize legend width" },
    { className: "legend-resize-handle--height", mode: "legend-height", label: "Resize legend height" },
    { className: "legend-resize-handle--scale", action: "scale", label: "Scale legend" },
  ];
  legendRoot.querySelectorAll(".legend-resize-handle").forEach((handle) => handle.remove());
  handleSpecs.forEach((spec) => {
    const resizeHandle = document.createElement("button");
    resizeHandle.type = "button";
    resizeHandle.className = `legend-resize-handle ${spec.className}`;
    resizeHandle.tabIndex = 0;
    if (spec.action) resizeHandle.setAttribute("data-legend-context-action", spec.action);
    if (spec.mode) resizeHandle.setAttribute("data-legend-resize-mode", spec.mode);
    resizeHandle.setAttribute("aria-label", spec.label);
    legendRoot.appendChild(resizeHandle);
  });
}

let pointerListenersBound = false;
export function bindGlobalPointerListeners() {
  if (pointerListenersBound) return;
  window.addEventListener("pointermove", onLegendEditorPointerMove);
  window.addEventListener("pointerup", onLegendEditorPointerUp);
  pointerListenersBound = true;
}
