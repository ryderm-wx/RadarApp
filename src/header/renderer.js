/**
 * @file Rendering layer for the Radar Legend "header". Builds the legend's
 * inner HTML from a product + config, and applies config (CSS vars, layout,
 * visual styles) to the live DOM. Subscribes to the store and only performs
 * a full rebuild when the store signals `meta.rebuild`; everything else is
 * patched in place via `applyConfigToDom` for smooth, allocation-free updates.
 *
 * @typedef {import('./types.js').LegendConfig} LegendConfig
 * @typedef {import('./types.js').LegendMeta} LegendMeta
 */

import {
  DEFAULT_LEGEND_EDITOR_CONFIG,
  DEFAULT_LEGEND_ELEMENT_STYLES,
  LEGEND_HEADER_IMAGE_LAYOUT,
  escapeLegendHtml,
  buildLegendHeaderGradientCss,
} from "./schema.js";
import { getConfig, subscribe, isLegendFreeformLayoutActive } from "./store.js";
import {
  ensureLegendStudioChrome,
  updateLegendStudioResizeChrome,
  syncLegendContextToolbar,
  bindLegendHeaderEditorInteractions,
} from "./toolbar.js";

const MS_TO_MPH = 2.23694;

let currentProductCode = null;
let currentProductInfo = null;
/** @type {{isReflectivity?: boolean, precipTypeModeEnabled?: boolean}} */
let currentRenderMeta = {};

/**
 * @param {string} productCode
 * @param {Object} productInfo - Radar product descriptor (unit, isVelocity, colorExpression, name).
 * @param {{isReflectivity?: boolean, precipTypeModeEnabled?: boolean}} [meta]
 * @returns {LegendMeta}
 */
export function buildLegendMeta(productCode, productInfo, meta = {}) {
  const unitLabel = productInfo.unit || "";
  const precipTypeMode = Boolean(meta.precipTypeModeEnabled);
  const isReflectivity = Boolean(meta.isReflectivity);

  if (precipTypeMode && isReflectivity) {
    return {
      subtitle:
        "Reflectivity recolored by precip type using HRRR CRAIN/CFRZR/CICEP/CSNOW classification",
      leftLabel: "Lower intensity",
      rightLabel: "Higher intensity",
      footnote:
        "Green/teal = rain, pink = freezing rain, orange = sleet, blue = snow.",
      badges: [
        {
          label: "Rain",
          range: unitLabel ? `0-95 ${unitLabel}` : "0-95 dBZ",
          description: "Liquid precipitation",
          color: "rgba(90, 220, 170, 0.65)",
        },
        {
          label: "Freezing rain",
          range: unitLabel ? `100-195 ${unitLabel}` : "100-195 encoded",
          description: "Supercooled rain",
          color: "rgba(240, 145, 210, 0.68)",
        },
        {
          label: "Sleet",
          range: unitLabel ? `200-295 ${unitLabel}` : "200-295 encoded",
          description: "Ice pellets",
          color: "rgba(250, 175, 110, 0.68)",
        },
        {
          label: "Snow",
          range: unitLabel ? `300-395 ${unitLabel}` : "300-395 encoded",
          description: "Frozen precipitation",
          color: "rgba(70,146,240,0.72)",
        },
      ],
    };
  }

  if (productInfo.isVelocity) {
    const strongThreshold = Math.round(20 * MS_TO_MPH);
    const calmThreshold = Math.round(10 * MS_TO_MPH);
    return {
      subtitle: "Radial wind speed relative to the radar beam",
      leftLabel: "Inbound - greens",
      rightLabel: "Outbound - reds",
      footnote:
        "Pair inbound/outbound couplets to spot rotation. Purple indicates range folding.",
      badges: [
        {
          label: "Inbound",
          range: unitLabel ? `<= -${strongThreshold} ${unitLabel}` : "Toward radar",
          description: "Air moving toward the radar (teals/greens)",
          color: "rgba(90, 220, 170, 0.6)",
        },
        {
          label: "Calm / shear",
          range: unitLabel
            ? `-${calmThreshold} to +${calmThreshold} ${unitLabel}`
            : "Near zero",
          description: "Weak winds or shear zone (grays)",
          color: "rgba(205, 210, 222, 0.65)",
        },
        {
          label: "Outbound",
          range: unitLabel ? `>= +${strongThreshold} ${unitLabel}` : "Away from radar",
          description: "Air moving away from the radar (reds/pinks)",
          color: "rgba(255, 140, 140, 0.65)",
        },
        {
          label: "Range fold",
          range: "RF flagged",
          description: "Purple = ambiguous velocity data",
          color: "rgba(185, 132, 255, 0.65)",
        },
      ],
    };
  }

  return {
    subtitle: "Intensity of precipitation cores and debris",
    leftLabel: "Light rain / snow",
    rightLabel: "Extreme hail / debris",
    footnote: "Reflectivity above 55 dBZ often signals severe hail or debris.",
    badges: [
      {
        label: "Light",
        range: unitLabel ? `< 25 ${unitLabel}` : "Light",
        description: "Sprinkles, flurries, virga",
        color: "rgba(99, 211, 255, 0.55)",
      },
      {
        label: "Moderate",
        range: unitLabel ? `25-40 ${unitLabel}` : "Moderate",
        description: "Steady rain or melting snow",
        color: "rgba(120, 214, 190, 0.6)",
      },
      {
        label: "Heavy",
        range: unitLabel ? `40-55 ${unitLabel}` : "Heavy",
        description: "Torrential rain, small hail",
        color: "rgba(255, 190, 120, 0.65)",
      },
      {
        label: "Extreme",
        range: unitLabel ? `> 55 ${unitLabel}` : "Extreme",
        description: "Giant hail, debris signatures",
        color: "rgba(255, 120, 120, 0.7)",
      },
    ],
  };
}

export function ensureLegendVisible() {
  const legendRoot = document.getElementById("radarLegend");
  if (!legendRoot) return;
  if (legendRoot.style.display === "none") {
    legendRoot.style.display = "block";
  }
}

function getLegendHeaderImageSource(header) {
  const data = String(header?.backgroundImageData || "").trim();
  if (data) return data;
  const url = String(header?.backgroundImageUrl || "").trim();
  return url || "";
}

function isLegendHeaderImageMode(header) {
  if (!header) return false;
  if (header.useBackgroundImage === false) return false;
  return Boolean(getLegendHeaderImageSource(header));
}

function ensureLegendElementStyles(config, target) {
  if (!config.elementStyles) config.elementStyles = {};
  if (!config.elementStyles[target]) {
    config.elementStyles[target] = { ...(DEFAULT_LEGEND_ELEMENT_STYLES[target] || {}) };
  }
  return config.elementStyles[target];
}

function getLegendElementStyle(config, target) {
  const defaults = DEFAULT_LEGEND_ELEMENT_STYLES[target] || {};
  const stored = ensureLegendElementStyles(config, target);
  return { ...defaults, ...stored };
}

function buildLegendTextShadow(style) {
  const blur = Number(style.textShadowBlur) || 0;
  const x = Number(style.textShadowX) || 0;
  const y = Number(style.textShadowY) || 0;
  if (!blur && !x && !y) return "";
  const color = style.textShadowColor || "rgba(0,0,0,0.55)";
  return `${x}px ${y}px ${blur}px ${color}`;
}

function applyLegendElementVisualStyle(config, element, target, typographyFallback = null) {
  if (!element) return;
  const style = getLegendElementStyle(config, target);
  const palette = config?.palette || DEFAULT_LEGEND_EDITOR_CONFIG.palette;

  element.style.opacity = String(
    Number.isFinite(Number(style.opacity)) ? Number(style.opacity) : 1,
  );

  if (target === "logo") {
    const brightness = Number(style.filterBrightness) || 1;
    const contrast = Number(style.filterContrast) || 1;
    element.style.filter = `brightness(${brightness}) contrast(${contrast})`;
    return;
  }

  if (typographyFallback) {
    const fontSize =
      Number(style.fontSize) > 0 ? Number(style.fontSize) : typographyFallback.size;
    const fontWeight =
      Number(style.fontWeight) > 0 ? Number(style.fontWeight) : typographyFallback.weight;
    element.style.fontSize = `${fontSize}px`;
    element.style.fontWeight = String(fontWeight);
    element.style.fontStyle = style.fontStyle || "normal";
    element.style.fontFamily = style.fontFamily || typographyFallback.family || "";
    element.style.letterSpacing = `${Number(style.letterSpacing) || 0}px`;
    if (style.textAlign) element.style.textAlign = style.textAlign;

    let color = style.color || "";
    if (!color && target === "title" && palette.titleColor) color = palette.titleColor;
    if (!color && target === "subtitle" && palette.subtitleColor) {
      color = palette.subtitleColor;
    }
    if (!color && target === "gradient-labels" && palette.labelColor) {
      color = palette.labelColor;
    }
    if (color) element.style.color = color;

    const shadow = buildLegendTextShadow(style);
    element.style.textShadow = shadow || "";
  }
}

function getLegendStripInnerWidth(layout) {
  return Math.max(120, Number(layout?.width || 360) - Number(layout?.paddingX || 14) * 2);
}

/** Width shared by header, gradient bar, and labels — matches header card when set. */
function getLegendContentWidth(header, layout) {
  const stripW = getLegendStripInnerWidth(layout);
  const headerW = Number(header?.width) || 0;
  return headerW > 0 ? Math.min(headerW, stripW) : stripW;
}

function hasLegendLogoImage(header) {
  return Boolean(String(header?.logoUrl || "").trim());
}

function shouldShowGradientLabels(visibility) {
  return visibility.gradient !== false && visibility.gradientLabels !== false;
}

function applyLegendGradientLayerSizing(gradientWrap, gradientBar, gradientLabels, header, layout) {
  const contentW = getLegendContentWidth(header, layout);
  if (gradientWrap) {
    gradientWrap.style.width = `${contentW}px`;
    gradientWrap.style.maxWidth = "100%";
    gradientWrap.style.minWidth = "0";
    gradientWrap.style.boxSizing = "border-box";
  }
  if (gradientBar) {
    gradientBar.style.width = "100%";
    gradientBar.style.maxWidth = "100%";
    gradientBar.style.minWidth = "0";
    gradientBar.style.boxSizing = "border-box";
  }
  if (gradientLabels) {
    gradientLabels.style.width = "100%";
    gradientLabels.style.maxWidth = "100%";
    gradientLabels.style.minWidth = "0";
    gradientLabels.style.boxSizing = "border-box";
  }
}

function getLegendEditBaselines({ header, layout, gradient, imageMode }) {
  const contentW = getLegendContentWidth(header, layout);
  const headerH = imageMode ? Number(header.canvasHeight) || 104 : Number(header.height) || 44;
  const gap = Number(layout.itemGap) || 10;
  const logoSize = hasLegendLogoImage(header) ? Number(header.logoSize) || 28 : 0;
  const headerGap = Number(header.gap) || 10;
  const textX = logoSize > 0 ? logoSize + headerGap : 0;
  const logoX =
    header.logoPlacement === "right" ? Math.max(0, contentW - logoSize) : 0;
  const gradientY = headerH + gap;
  const labelsY = gradientY + Number(gradient.height) + 6;
  const badgesY = labelsY + 18;
  const footnoteY = badgesY + 28;
  return {
    "header-container": { x: 0, y: 0 },
    logo: { x: logoX, y: 4 },
    "text-container": { x: textX, y: 0 },
    title: { x: textX, y: 0 },
    subtitle: { x: textX, y: 18 },
    gradient: { x: 0, y: gradientY },
    "gradient-labels": { x: 0, y: labelsY },
    badges: { x: 0, y: badgesY },
    footnote: { x: 0, y: footnoteY },
  };
}

function clearLegendFreeLayerStyles(element) {
  if (!element) return;
  element.style.position = "";
  element.style.left = "";
  element.style.top = "";
  element.style.right = "";
  element.style.bottom = "";
  element.style.zIndex = "";
  element.style.width = "";
  element.style.height = "";
  element.style.margin = "";
  element.style.order = "";
  element.style.transform = "";
  element.style.transformOrigin = "";
}

function applyLegendFreeLayerPosition(element, offsetX, offsetY, scale, baseline, options = {}) {
  if (!element) return;
  const base = baseline || { x: 0, y: 0 };
  element.style.position = "absolute";
  element.style.left = `${base.x + (Number(offsetX) || 0)}px`;
  element.style.top = `${base.y + (Number(offsetY) || 0)}px`;
  element.style.right = "auto";
  element.style.bottom = "auto";
  element.style.transform = `scale(${Number(scale) || 1})`;
  element.style.transformOrigin = "top left";
  element.style.margin = "0";
  if (options.width != null) element.style.width = options.width;
  if (options.maxWidth != null) element.style.maxWidth = options.maxWidth;
  if (options.height != null) element.style.height = options.height;
  if (options.zIndex != null) element.style.zIndex = String(options.zIndex);
}

function applyLegendHeaderLayerPosition(
  element,
  target,
  offsetX,
  offsetY,
  scale,
  imageMode,
  headerContext = {},
) {
  if (!element) return;
  const useImageBase =
    imageMode &&
    LEGEND_HEADER_IMAGE_LAYOUT[target] &&
    (target === "logo" || target === "text-container");
  if (useImageBase) {
    const base = LEGEND_HEADER_IMAGE_LAYOUT[target];
    element.style.position = "absolute";
    element.style.top = `${base.baseY}px`;
    if (target === "logo" && headerContext.logoPlacement === "right") {
      element.style.left = "auto";
      element.style.right = `${base.baseX}px`;
    } else {
      element.style.left = `${base.baseX}px`;
      element.style.right = "auto";
    }
    element.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    element.style.transformOrigin = "top left";
    return;
  }
  if (imageMode && (target === "logo" || target === "text-container")) {
    element.style.position = "absolute";
  } else if (imageMode) {
    element.style.position = "";
    element.style.left = "";
    element.style.top = "";
    element.style.right = "";
  } else {
    element.style.position = "";
    element.style.left = "";
    element.style.top = "";
    element.style.right = "";
  }
  element.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
  element.style.transformOrigin = imageMode ? "top left" : "";
}

function applyLegendFlowLayoutToDom({
  strip,
  headerLayer,
  headerCanvas,
  textWrap,
  titleEl,
  subtitleEl,
  logoWrap,
  gradientWrap,
  gradientBar,
  gradientLabels,
  badgesWrap,
  footnoteEl,
  header,
  layout,
  typography,
  gradient,
  visibility,
  editor,
  imageMode,
  config,
}) {
  if (strip) {
    clearLegendFreeLayerStyles(strip);
    strip.style.display = "";
    strip.style.position = "";
    strip.style.minHeight = "";
    strip.style.height = "";
  }
  if (headerLayer) {
    headerLayer.style.display = "";
    clearLegendFreeLayerStyles(headerLayer);
    headerLayer.classList.toggle("legend-strip__header-layer--overlay", imageMode);
  }
  if (textWrap) {
    textWrap.style.display = "";
    clearLegendFreeLayerStyles(textWrap);
    textWrap.style.width = "";
    textWrap.style.boxSizing = "";
    textWrap.style.paddingLeft = "";
    textWrap.style.paddingRight = "";
    textWrap.style.maxWidth = "";
    applyLegendHeaderLayerPosition(
      textWrap,
      "text-container",
      header.textOffsetX,
      header.textOffsetY,
      header.textScale,
      imageMode,
      header,
    );
    applyLegendElementVisualStyle(config, textWrap, "text-container");
  }
  if (titleEl) {
    clearLegendFreeLayerStyles(titleEl);
    applyLegendHeaderLayerPosition(
      titleEl,
      "title",
      header.titleOffsetX,
      header.titleOffsetY,
      header.titleScale,
      imageMode,
      header,
    );
    applyLegendElementVisualStyle(config, titleEl, "title", {
      size: typography.titleSize,
      weight: typography.titleWeight,
      family: typography.titleFamily || "",
    });
    titleEl.setAttribute("contenteditable", editor.headerEditMode ? "true" : "false");
  }
  if (subtitleEl) {
    subtitleEl.style.display = visibility.subtitle ? "block" : "none";
    clearLegendFreeLayerStyles(subtitleEl);
    applyLegendHeaderLayerPosition(
      subtitleEl,
      "subtitle",
      header.subtitleOffsetX,
      header.subtitleOffsetY,
      header.subtitleScale,
      imageMode,
      header,
    );
    applyLegendElementVisualStyle(config, subtitleEl, "subtitle", {
      size: typography.subtitleSize,
      weight: typography.subtitleWeight,
      family: typography.subtitleFamily || "",
    });
    subtitleEl.setAttribute("contenteditable", editor.headerEditMode ? "true" : "false");
  }
  if (logoWrap) {
    const hasLogo = hasLegendLogoImage(header);
    logoWrap.style.display = hasLogo && visibility.logo ? "flex" : "none";
    logoWrap.style.width = `${header.logoSize}px`;
    logoWrap.style.height = `${header.logoSize}px`;
    logoWrap.style.borderRadius = `${header.logoRadius}px`;
    clearLegendFreeLayerStyles(logoWrap);
    logoWrap.style.order = imageMode ? "0" : header.logoPlacement === "right" ? "2" : "0";
    applyLegendHeaderLayerPosition(
      logoWrap,
      "logo",
      header.logoOffsetX,
      header.logoOffsetY,
      header.logoScale,
      imageMode,
      header,
    );
    applyLegendElementVisualStyle(config, logoWrap, "logo");
  }
  if (gradientWrap) {
    gradientWrap.style.display = visibility.gradient ? "block" : "none";
    clearLegendFreeLayerStyles(gradientWrap);
    gradientWrap.style.transform = `translate(${gradient.offsetX}px, ${gradient.offsetY}px) scale(${gradient.scale})`;
    applyLegendElementVisualStyle(config, gradientWrap, "gradient");
    applyLegendGradientLayerSizing(gradientWrap, gradientBar, gradientLabels, header, layout);
  }
  if (gradientBar) {
    clearLegendFreeLayerStyles(gradientBar);
    gradientBar.style.display = visibility.gradient ? "block" : "none";
  }
  if (gradientLabels) {
    clearLegendFreeLayerStyles(gradientLabels);
    gradientLabels.style.display = shouldShowGradientLabels(visibility) ? "flex" : "none";
    gradientLabels.style.transform = `translate(${gradient.labelsOffsetX}px, ${gradient.labelsOffsetY}px) scale(${gradient.labelsScale})`;
    gradientLabels.style.fontSize = `${typography.itemLabelSize}px`;
    applyLegendElementVisualStyle(config, gradientLabels, "gradient-labels", {
      size: typography.itemLabelSize,
      weight: 500,
      family: "",
    });
  }
  if (badgesWrap) {
    badgesWrap.style.display = visibility.badges ? "flex" : "none";
    clearLegendFreeLayerStyles(badgesWrap);
    badgesWrap.style.transform = "";
  }
  if (footnoteEl) {
    footnoteEl.style.display = visibility.footnote ? "block" : "none";
    clearLegendFreeLayerStyles(footnoteEl);
    footnoteEl.style.transform = "";
  }
  if (headerCanvas) {
    clearLegendFreeLayerStyles(headerCanvas);
  }
}

function applyLegendFreeEditLayoutToDom({
  strip,
  headerEl,
  headerCanvas,
  textWrap,
  titleEl,
  subtitleEl,
  logoWrap,
  gradientWrap,
  gradientBar,
  gradientLabels,
  badgesWrap,
  footnoteEl,
  header,
  layout,
  typography,
  gradient,
  badges,
  footnote,
  visibility,
  editor,
  imageMode,
  config,
}) {
  const baselines = getLegendEditBaselines({ header, layout, gradient, imageMode });
  const contentW = getLegendContentWidth(header, layout);
  const headerH = imageMode ? Number(header.canvasHeight) || 104 : Number(header.height) || 44;
  const headerW = Number(header.width) > 0 ? Number(header.width) : contentW;

  if (strip) {
    const canvasHeight = Math.max(56, Number(layout.minHeight) || 88);
    strip.style.display = "block";
    strip.style.position = "relative";
    strip.style.minHeight = `${canvasHeight}px`;
    strip.style.height = `${canvasHeight}px`;
    strip.style.overflow = editor.headerEditMode ? "visible" : "hidden";
  }
  if (textWrap) {
    textWrap.style.display = "contents";
    clearLegendFreeLayerStyles(textWrap);
  }
  if (gradientWrap) {
    gradientWrap.style.display = "contents";
    clearLegendFreeLayerStyles(gradientWrap);
  }
  if (headerEl) {
    headerEl.style.display = visibility.header ? "block" : "none";
    headerEl.style.overflow = "visible";
    applyLegendFreeLayerPosition(
      headerEl,
      header.containerOffsetX,
      header.containerOffsetY,
      header.containerScale,
      baselines["header-container"],
      { width: `${headerW}px`, height: `${headerH}px`, zIndex: 1 },
    );
    applyLegendElementVisualStyle(config, headerEl, "header-container");
  }
  if (headerCanvas) {
    headerCanvas.style.position = "absolute";
    headerCanvas.style.inset = "0";
    headerCanvas.style.zIndex = "0";
  }
  if (logoWrap) {
    const hasLogo = hasLegendLogoImage(header);
    logoWrap.style.display = hasLogo && visibility.logo ? "flex" : "none";
    logoWrap.style.width = `${header.logoSize}px`;
    logoWrap.style.height = `${header.logoSize}px`;
    logoWrap.style.borderRadius = `${header.logoRadius}px`;
    applyLegendFreeLayerPosition(
      logoWrap,
      header.logoOffsetX,
      header.logoOffsetY,
      header.logoScale,
      baselines.logo,
      { zIndex: 4 },
    );
    applyLegendElementVisualStyle(config, logoWrap, "logo");
  }
  if (titleEl) {
    applyLegendFreeLayerPosition(
      titleEl,
      header.titleOffsetX,
      header.titleOffsetY,
      header.titleScale,
      baselines.title,
      { zIndex: 4 },
    );
    applyLegendElementVisualStyle(config, titleEl, "title", {
      size: typography.titleSize,
      weight: typography.titleWeight,
      family: typography.titleFamily || "",
    });
    titleEl.setAttribute("contenteditable", "true");
  }
  if (subtitleEl) {
    subtitleEl.style.display = visibility.subtitle ? "block" : "none";
    applyLegendFreeLayerPosition(
      subtitleEl,
      header.subtitleOffsetX,
      header.subtitleOffsetY,
      header.subtitleScale,
      baselines.subtitle,
      { zIndex: 4 },
    );
    applyLegendElementVisualStyle(config, subtitleEl, "subtitle", {
      size: typography.subtitleSize,
      weight: typography.subtitleWeight,
      family: typography.subtitleFamily || "",
    });
    subtitleEl.setAttribute("contenteditable", "true");
  }
  if (gradientBar) {
    gradientBar.style.display = visibility.gradient ? "block" : "none";
    gradientBar.style.height = `${gradient.height}px`;
    gradientBar.style.borderRadius = `${gradient.radius}px`;
    applyLegendFreeLayerPosition(
      gradientBar,
      gradient.offsetX,
      gradient.offsetY,
      gradient.scale,
      baselines.gradient,
      { width: `${contentW}px`, maxWidth: "100%", zIndex: 3 },
    );
    gradientBar.style.boxSizing = "border-box";
    gradientBar.style.minWidth = "0";
  }
  if (gradientLabels) {
    gradientLabels.style.display = shouldShowGradientLabels(visibility) ? "flex" : "none";
    gradientLabels.style.fontSize = `${typography.itemLabelSize}px`;
    applyLegendFreeLayerPosition(
      gradientLabels,
      gradient.labelsOffsetX,
      gradient.labelsOffsetY,
      gradient.labelsScale,
      baselines["gradient-labels"],
      { width: `${contentW}px`, maxWidth: "100%", zIndex: 3 },
    );
    gradientLabels.style.boxSizing = "border-box";
    gradientLabels.style.minWidth = "0";
    applyLegendElementVisualStyle(config, gradientLabels, "gradient-labels", {
      size: typography.itemLabelSize,
      weight: 500,
      family: "",
    });
  }
  if (badgesWrap) {
    badgesWrap.style.display = visibility.badges ? "flex" : "none";
    applyLegendFreeLayerPosition(
      badgesWrap,
      badges.offsetX,
      badges.offsetY,
      badges.scale,
      baselines.badges,
      { width: `${contentW}px`, maxWidth: "100%", zIndex: 3 },
    );
  }
  if (footnoteEl) {
    footnoteEl.style.display = visibility.footnote ? "block" : "none";
    applyLegendFreeLayerPosition(
      footnoteEl,
      footnote.offsetX,
      footnote.offsetY,
      footnote.scale,
      baselines.footnote,
      { width: `${contentW}px`, maxWidth: "100%", zIndex: 3 },
    );
  }
}

function applyLegendEditorAnchor(legendRoot, layout) {
  const anchor = layout.anchor || "top-center";
  legendRoot.style.top = "auto";
  legendRoot.style.left = "auto";
  legendRoot.style.right = "auto";
  legendRoot.style.bottom = "auto";
  switch (anchor) {
    case "top-left":
      legendRoot.style.top = `${layout.offsetY}px`;
      legendRoot.style.left = `${layout.offsetX}px`;
      legendRoot.style.transform = `scale(${layout.scale})`;
      break;
    case "top-right":
      legendRoot.style.top = `${layout.offsetY}px`;
      legendRoot.style.right = `${layout.offsetX}px`;
      legendRoot.style.transform = `scale(${layout.scale})`;
      break;
    case "bottom-left":
      legendRoot.style.bottom = `${layout.offsetY}px`;
      legendRoot.style.left = `${layout.offsetX}px`;
      legendRoot.style.transform = `scale(${layout.scale})`;
      break;
    case "bottom-right":
      legendRoot.style.bottom = `${layout.offsetY}px`;
      legendRoot.style.right = `${layout.offsetX}px`;
      legendRoot.style.transform = `scale(${layout.scale})`;
      break;
    case "bottom-center":
      legendRoot.style.bottom = `${layout.offsetY}px`;
      legendRoot.style.left = "50%";
      legendRoot.style.transform = `translateX(-50%) scale(${layout.scale})`;
      break;
    default:
      legendRoot.style.top = `${layout.offsetY}px`;
      legendRoot.style.left = "50%";
      legendRoot.style.transform = `translateX(-50%) scale(${layout.scale})`;
      break;
  }
}

/** Patches the live DOM to reflect the current config, without rebuilding markup. */
export function applyConfigToDom() {
  const config = getConfig();
  const legendRoot = document.getElementById("radarLegend");
  if (!legendRoot) return;
  const { layout, typography, visuals, header, headerImage, palette, visibility, gradient, editor } =
    config;
  const imageMode = isLegendHeaderImageMode(header);
  const headerImageSource = getLegendHeaderImageSource(header);
  const useFreeLayout = isLegendFreeformLayoutActive();
  const canvasHeight = Math.max(56, Number(layout.minHeight) || 88);

  legendRoot.dataset.legendTheme = config.theme || "broadcast";
  legendRoot.style.setProperty("--legend-width", `${layout.width}px`);
  legendRoot.style.setProperty("--legend-min-height", `${canvasHeight}px`);
  legendRoot.style.setProperty("--legend-padding-x", `${layout.paddingX}px`);
  legendRoot.style.setProperty("--legend-padding-y", `${layout.paddingY}px`);
  legendRoot.style.setProperty("--legend-radius", `${layout.borderRadius}px`);
  legendRoot.style.setProperty("--legend-gap", `${layout.itemGap}px`);
  legendRoot.style.setProperty("--legend-scale", String(layout.scale));
  legendRoot.style.setProperty("--legend-accent", palette?.accentColor || "#63d3ff");
  legendRoot.style.setProperty("--legend-title-color", palette?.titleColor || "#f8fafc");
  legendRoot.style.setProperty(
    "--legend-subtitle-color",
    palette?.subtitleColor || "rgba(226, 232, 240, 0.72)",
  );
  legendRoot.style.setProperty(
    "--legend-label-color",
    palette?.labelColor || "rgba(226, 232, 240, 0.84)",
  );
  legendRoot.style.setProperty(
    "--legend-bg-opacity",
    String(imageMode ? Math.min(visuals.backgroundOpacity, 0.35) : visuals.backgroundOpacity),
  );
  legendRoot.style.setProperty("--legend-border-opacity", String(visuals.borderOpacity));
  legendRoot.style.setProperty("--legend-border-width", `${visuals.borderWidth}px`);
  legendRoot.style.setProperty("--legend-blur", `${imageMode ? 0 : visuals.blur}px`);
  legendRoot.style.setProperty("--legend-shadow-strength", String(visuals.shadowStrength));
  legendRoot.style.setProperty("--legend-glow-strength", String(visuals.glowStrength));
  legendRoot.style.setProperty("--legend-gradient-height", `${gradient.height}px`);
  legendRoot.style.setProperty("--legend-gradient-radius", `${gradient.radius}px`);
  legendRoot.style.setProperty("--legend-title-size", `${typography.titleSize}px`);
  legendRoot.style.setProperty("--legend-subtitle-size", `${typography.subtitleSize}px`);
  legendRoot.style.setProperty("--legend-title-weight", String(typography.titleWeight));
  legendRoot.style.setProperty("--legend-subtitle-weight", String(typography.subtitleWeight));
  legendRoot.style.setProperty("--legend-label-size", `${typography.itemLabelSize}px`);

  legendRoot.style.width = `${layout.width}px`;
  legendRoot.style.minHeight = `${canvasHeight}px`;
  legendRoot.style.height = useFreeLayout ? `${canvasHeight}px` : "";
  legendRoot.style.padding = `${layout.paddingY}px ${layout.paddingX}px`;
  legendRoot.style.borderRadius = `${layout.borderRadius}px`;
  const headerGradientCss = buildLegendHeaderGradientCss(header.background);
  const baseBg = imageMode
    ? `rgba(5, 8, 18, ${Math.min(visuals.backgroundOpacity, 0.35)})`
    : `rgba(5, 8, 18, ${visuals.backgroundOpacity})`;
  legendRoot.style.background = headerGradientCss ? `${headerGradientCss}, ${baseBg}` : baseBg;
  legendRoot.style.border = `${visuals.borderWidth}px solid rgba(255, 255, 255, ${visuals.borderOpacity})`;
  legendRoot.style.backdropFilter = imageMode ? "none" : `blur(${visuals.blur}px)`;
  legendRoot.style.boxShadow = `0 10px 24px rgba(0,0,0,${visuals.shadowStrength}), 0 0 20px rgba(99,211,255,${visuals.glowStrength})`;
  legendRoot.style.transformOrigin = "top center";
  applyLegendEditorAnchor(legendRoot, layout);
  legendRoot.classList.toggle("legend-header-edit-mode", !!editor.headerEditMode);
  legendRoot.classList.toggle("legend-show-guides", !!editor.showGuides);
  legendRoot.classList.toggle("legend-header-image-mode", imageMode);
  legendRoot.classList.toggle("legend-free-edit-mode", useFreeLayout);
  legendRoot.classList.toggle("legend-freeform-layout", useFreeLayout);

  const strip = legendRoot.querySelector(".legend-strip");
  const headerEl = legendRoot.querySelector(".legend-strip__header");
  const headerCanvas = legendRoot.querySelector(".legend-strip__header-canvas");
  const headerBg = legendRoot.querySelector(".legend-strip__header-bg");
  const headerOverlay = legendRoot.querySelector(".legend-strip__header-overlay");
  const headerLayer = legendRoot.querySelector(".legend-strip__header-layer");
  const textWrap = legendRoot.querySelector(".legend-strip__text");
  const titleEl = legendRoot.querySelector(".legend-strip__title");
  const subtitleEl = legendRoot.querySelector(".legend-strip__subtitle");
  const logoWrap = legendRoot.querySelector(".legend-strip__logo-wrap");
  const gradientWrap = legendRoot.querySelector(".legend-strip__gradient");
  const gradientBar = legendRoot.querySelector(".legend-gradient__bar");
  const gradientLabels = legendRoot.querySelector(".legend-strip__labels");
  const badgesWrap = legendRoot.querySelector(".legend-strip__badges");
  const footnoteEl = legendRoot.querySelector(".legend-strip__footnote");
  const readoutEl = legendRoot.querySelector(".legend-gradient__hover-value");
  if (strip) strip.style.gap = `${layout.itemGap}px`;

  if (headerCanvas) {
    headerCanvas.style.display = imageMode ? "block" : "none";
  }
  if (headerBg) {
    if (imageMode && headerImageSource) {
      headerBg.src = headerImageSource;
      headerBg.style.display = "block";
      headerBg.style.objectFit = header.backgroundFit || "cover";
      headerBg.style.objectPosition = `${header.backgroundPositionX ?? 50}% ${header.backgroundPositionY ?? 50}%`;
      headerBg.style.opacity = String(headerImage?.imageOpacity ?? 1);
    } else {
      headerBg.removeAttribute("src");
      headerBg.style.display = "none";
    }
  }
  if (headerOverlay) {
    const overlayOpacity = Number(headerImage?.overlayOpacity) || 0;
    headerOverlay.style.display = imageMode && overlayOpacity > 0 ? "block" : "none";
    headerOverlay.style.background = headerImage?.overlayColor || "#000000";
    headerOverlay.style.opacity = String(overlayOpacity);
  }

  if (headerEl) {
    if (!useFreeLayout) {
      headerEl.style.display = visibility.header ? (imageMode ? "block" : "flex") : "none";
      headerEl.style.height = imageMode ? `${header.canvasHeight}px` : `${header.height}px`;
      if (Number(header.width) > 0) {
        headerEl.style.width = `${header.width}px`;
        headerEl.style.maxWidth = "100%";
      } else {
        headerEl.style.width = "";
        headerEl.style.maxWidth = "";
      }
      headerEl.style.gap = imageMode ? "0" : `${header.gap}px`;
      headerEl.style.justifyContent = imageMode ? "flex-start" : header.justify;
      headerEl.style.textAlign = header.align;
      headerEl.style.transform = `translate(${header.containerOffsetX}px, ${header.containerOffsetY}px) scale(${header.containerScale})`;
      headerEl.style.overflow = "";
      applyLegendElementVisualStyle(config, headerEl, "header-container");
    } else {
      clearLegendFreeLayerStyles(headerEl);
    }
  }

  const layoutContext = {
    legendRoot,
    strip,
    headerEl,
    headerLayer,
    headerCanvas,
    textWrap,
    titleEl,
    subtitleEl,
    logoWrap,
    gradientWrap,
    gradientBar,
    gradientLabels,
    badgesWrap,
    footnoteEl,
    header,
    layout,
    typography,
    gradient,
    badges: config.badges || DEFAULT_LEGEND_EDITOR_CONFIG.badges,
    footnote: config.footnote || DEFAULT_LEGEND_EDITOR_CONFIG.footnote,
    visibility,
    editor,
    imageMode,
    config,
  };

  if (useFreeLayout) {
    applyLegendFreeEditLayoutToDom(layoutContext);
  } else {
    applyLegendFlowLayoutToDom(layoutContext);
  }

  if (gradientBar) {
    gradientBar.style.height = `${gradient.height}px`;
    gradientBar.style.borderRadius = `${gradient.radius}px`;
    if (palette?.accentColor) {
      gradientBar.style.boxShadow = `inset 0 0 0 1px rgba(255, 255, 255, 0.14), 0 0 12px ${palette.accentColor}33`;
    }
  }
  if (readoutEl) {
    readoutEl.style.display = visibility.hoverReadout ? "" : "none";
  }
  legendRoot.querySelectorAll("[data-legend-target]").forEach((element) => {
    element.classList.toggle(
      "legend-selected-target",
      element.getAttribute("data-legend-target") === editor.selectedTarget && editor.headerEditMode,
    );
  });
  updateLegendStudioResizeChrome(legendRoot);
  syncLegendContextToolbar(legendRoot);
}

/** Fully rebuilds the legend's inner markup for the given product, then applies config. */
function rebuild() {
  if (!currentProductInfo) return;
  const config = getConfig();
  const legendDiv = document.getElementById("legendScale");
  if (!legendDiv) return;

  const productInfo = currentProductInfo;
  const productCode = currentProductCode;
  const expressionStops = productInfo.colorExpression.slice(3);
  const gradientStops = [];
  const values = [];

  const isValidLegendValue = (value) => {
    if (typeof value !== "number" || !isFinite(value)) return false;
    if (Math.abs(value) === 9999 || Math.abs(value) === 999) return false;
    if (Math.abs(value) === 32768 || Math.abs(value) === 65535) return false;
    if (value > 200) return false;
    return true;
  };

  for (let i = 0; i < expressionStops.length; i += 2) {
    const value = expressionStops[i];
    const color = expressionStops[i + 1];
    if (!isValidLegendValue(value)) continue;
    gradientStops.push({ value, color });
    values.push(value);
  }

  let gradientCSS = "linear-gradient(90deg, #0f172a, #020617)";
  if (gradientStops.length) {
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue === 0 ? 1 : maxValue - minValue;
    gradientCSS = `linear-gradient(90deg, ${gradientStops
      .map(({ value, color }) => {
        const pct = ((value - minValue) / range) * 100;
        return `${color} ${Math.max(0, Math.min(100, pct)).toFixed(2)}%`;
      })
      .join(", ")})`;
  }

  const legendMeta = buildLegendMeta(productCode, productInfo, currentRenderMeta);
  const title = config.header.customTitle?.trim() || `${productCode} · ${productInfo.name}`;
  const subtitle = config.header.customSubtitle?.trim() || legendMeta.subtitle || "";
  const hasLogo = hasLegendLogoImage(config.header);
  const logoBlock = hasLogo
    ? `<div class="legend-strip__logo-wrap" data-legend-target="logo"><img src="${escapeLegendHtml(config.header.logoUrl)}" alt="Legend logo"></div>`
    : "";
  const badgeHTML = (legendMeta.badges || [])
    .map(
      (badge) => `
        <div class="legend-strip__badge" style="--badge-color:${escapeLegendHtml(badge.color || config.palette.accentColor || "#63d3ff")}">
          <span class="legend-strip__badge-dot" aria-hidden="true"></span>
          <strong>${escapeLegendHtml(badge.label || "")}</strong>
          <span>${escapeLegendHtml(badge.range || badge.description || "")}</span>
        </div>
      `,
    )
    .join("");

  legendDiv.innerHTML = `
    <div class="legend-strip">
      <div class="legend-strip__header" data-legend-target="header-container">
        <div class="legend-strip__header-canvas" aria-hidden="true">
          <img class="legend-strip__header-bg" alt="">
          <div class="legend-strip__header-overlay"></div>
        </div>
        <div class="legend-strip__header-layer">
          ${logoBlock}
          <div class="legend-strip__text" data-legend-target="text-container">
            <h4 class="legend-strip__title" data-legend-target="title">${escapeLegendHtml(title)}</h4>
            <p class="legend-strip__subtitle" data-legend-target="subtitle">${escapeLegendHtml(subtitle)}</p>
          </div>
        </div>
      </div>
      <div class="legend-strip__gradient">
        <div class="legend-gradient__bar legend-strip__bar" data-legend-target="gradient" style="background:${gradientCSS}; cursor:crosshair;" data-min-value="${gradientStops.length ? Math.min(...values) : 0}" data-max-value="${gradientStops.length ? Math.max(...values) : 1}"></div>
        <div class="legend-gradient__hover-value" style="display:none; position:absolute; background:rgba(0,0,0,0.8); color:white; padding:4px 8px; border-radius:4px; font-size:12px; white-space:nowrap; pointer-events:none; z-index:1000;"></div>
        <div class="legend-strip__labels" data-legend-target="gradient-labels">
          <span>${escapeLegendHtml(legendMeta.leftLabel || "Low")}</span>
          <span>${escapeLegendHtml(legendMeta.rightLabel || "High")}</span>
        </div>
      </div>
      <div class="legend-strip__badges" data-legend-target="badges" aria-label="Radar legend metadata">${badgeHTML}</div>
      <p class="legend-strip__footnote" data-legend-target="footnote">${escapeLegendHtml(legendMeta.footnote || productInfo.unit || "")}</p>
    </div>
  `;

  const legendRoot = document.getElementById("radarLegend");
  ensureLegendStudioChrome(legendRoot);
  bindLegendHeaderEditorInteractions();
  applyConfigToDom();

  const gradientBar = legendDiv.querySelector(".legend-gradient__bar");
  const hoverValue = legendDiv.querySelector(".legend-gradient__hover-value");
  if (gradientBar && hoverValue && gradientStops.length > 0) {
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    const range = maxValue - minValue === 0 ? 1 : maxValue - minValue;
    const unit = productInfo.unit || "";
    gradientBar.addEventListener("mousemove", (e) => {
      if (!getConfig().visibility.hoverReadout) return;
      const rect = gradientBar.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, x / rect.width));
      const value = minValue + pct * range;
      hoverValue.textContent = `${value.toFixed(1)} ${unit}`;
      hoverValue.style.display = "block";
      hoverValue.style.left = `${x}px`;
      hoverValue.style.top = "-28px";
    });
    gradientBar.addEventListener("mouseleave", () => {
      hoverValue.style.display = "none";
    });
  }
}

/**
 * Public entry point: render (or patch) the legend for a given radar product.
 * @param {string} productCode
 * @param {Object} productInfo
 * @param {{isReflectivity?: boolean, precipTypeModeEnabled?: boolean}} [meta]
 */
export function renderForProduct(productCode, productInfo, meta = {}) {
  currentProductCode = productCode;
  currentProductInfo = productInfo;
  currentRenderMeta = meta;
  ensureLegendVisible();
  rebuild();
}

/** Re-render using the last product passed to `renderForProduct`. */
export function refreshPreview(options = {}) {
  ensureLegendVisible();
  if (options.rebuild || !currentProductInfo) {
    rebuild();
  } else {
    applyConfigToDom();
  }
}

subscribe((_config, meta) => {
  if (!currentProductInfo && !document.getElementById("legendScale")?.innerHTML) return;
  if (meta.rebuild) {
    rebuild();
  } else {
    applyConfigToDom();
  }
});
