/**
 * @file Legend/header config schema: storage keys, defaults, theme presets,
 * and pure (no-DOM) helpers for cloning/merging/normalizing/migrating config.
 *
 * This is the single source of truth for the shape of a {@link LegendConfig}.
 * @typedef {import('./types.js').LegendConfig} LegendConfig
 * @typedef {import('./types.js').ThemePreset} ThemePreset
 */

export const LEGEND_EDITOR_CONFIG_STORAGE_KEY = "radar-legend-editor-config-v1";
export const LEGEND_EDITOR_PRESETS_STORAGE_KEY = "radar-legend-editor-presets-v1";
export const LEGEND_EDITOR_DEFAULT_PRESET_NAME = "__default_broadcast";

export const LEGEND_EDITOR_TARGET_MAP = {
  "header-container": {
    xPath: "header.containerOffsetX",
    yPath: "header.containerOffsetY",
    scalePath: "header.containerScale",
    widthPath: "header.width",
    heightPath: "header.height",
    imageHeightPath: "header.canvasHeight",
  },
  "text-container": {
    xPath: "header.textOffsetX",
    yPath: "header.textOffsetY",
    scalePath: "header.textScale",
  },
  title: {
    xPath: "header.titleOffsetX",
    yPath: "header.titleOffsetY",
    scalePath: "header.titleScale",
  },
  subtitle: {
    xPath: "header.subtitleOffsetX",
    yPath: "header.subtitleOffsetY",
    scalePath: "header.subtitleScale",
  },
  logo: {
    xPath: "header.logoOffsetX",
    yPath: "header.logoOffsetY",
    scalePath: "header.logoScale",
    sizePath: "header.logoSize",
  },
  gradient: {
    xPath: "gradient.offsetX",
    yPath: "gradient.offsetY",
    scalePath: "gradient.scale",
  },
  "gradient-labels": {
    xPath: "gradient.labelsOffsetX",
    yPath: "gradient.labelsOffsetY",
    scalePath: "gradient.labelsScale",
  },
  badges: {
    xPath: "badges.offsetX",
    yPath: "badges.offsetY",
    scalePath: "badges.scale",
  },
  footnote: {
    xPath: "footnote.offsetX",
    yPath: "footnote.offsetY",
    scalePath: "footnote.scale",
  },
};

export const LEGEND_TARGET_VISIBILITY_PATH = {
  "header-container": "visibility.header",
  logo: "visibility.logo",
  subtitle: "visibility.subtitle",
  gradient: "visibility.gradient",
  "gradient-labels": "visibility.gradientLabels",
  title: null,
  "text-container": null,
  badges: "visibility.badges",
  footnote: "visibility.footnote",
};

export const DEFAULT_LEGEND_ELEMENT_STYLES = {
  title: {
    fontFamily: "",
    fontSize: 0,
    fontWeight: 0,
    fontStyle: "normal",
    letterSpacing: 0,
    color: "",
    opacity: 1,
    textAlign: "",
    textShadowX: 0,
    textShadowY: 0,
    textShadowBlur: 0,
    textShadowColor: "rgba(0,0,0,0.55)",
  },
  subtitle: {
    fontFamily: "",
    fontSize: 0,
    fontWeight: 0,
    fontStyle: "normal",
    letterSpacing: 0,
    color: "",
    opacity: 1,
    textAlign: "",
    textShadowX: 0,
    textShadowY: 0,
    textShadowBlur: 0,
    textShadowColor: "rgba(0,0,0,0.55)",
  },
  logo: {
    opacity: 1,
    filterBrightness: 1,
    filterContrast: 1,
  },
  "text-container": {
    opacity: 1,
  },
  "header-container": {
    opacity: 1,
  },
  gradient: {
    opacity: 1,
  },
  "gradient-labels": {
    fontFamily: "",
    fontSize: 0,
    fontWeight: 0,
    fontStyle: "normal",
    letterSpacing: 0,
    color: "",
    opacity: 1,
    textAlign: "",
    textShadowX: 0,
    textShadowY: 0,
    textShadowBlur: 0,
    textShadowColor: "rgba(0,0,0,0.55)",
  },
};

export const LEGEND_HEADER_IMAGE_LAYOUT = {
  logo: { baseX: 10, baseY: 10 },
  "text-container": { baseX: 54, baseY: 12 },
  title: { baseX: 0, baseY: 0 },
  subtitle: { baseX: 0, baseY: 0 },
};

/** @type {LegendConfig} */
export const DEFAULT_LEGEND_EDITOR_CONFIG = {
  schemaVersion: 2,
  theme: "broadcast",
  layout: {
    anchor: "top-center",
    offsetX: 0,
    offsetY: 4,
    width: 360,
    minHeight: 88,
    freeform: false,
    scale: 1,
    paddingX: 14,
    paddingY: 10,
    borderRadius: 14,
    itemGap: 10,
  },
  header: {
    enabled: true,
    align: "left",
    justify: "space-between",
    height: 44,
    width: 0,
    gap: 10,
    logoUrl: "",
    logoPlacement: "left",
    logoSize: 28,
    logoRadius: 8,
    logoOffsetX: 0,
    logoOffsetY: 0,
    logoScale: 1,
    containerOffsetX: 0,
    containerOffsetY: 0,
    containerScale: 1,
    textOffsetX: 0,
    textOffsetY: 0,
    textScale: 1,
    titleOffsetX: 0,
    titleOffsetY: 0,
    titleScale: 1,
    subtitleOffsetX: 0,
    subtitleOffsetY: 0,
    subtitleScale: 1,
    customTitle: "",
    customSubtitle: "",
    useBackgroundImage: false,
    backgroundImageUrl: "",
    backgroundImageData: "",
    canvasHeight: 104,
    backgroundFit: "cover",
    backgroundPositionX: 50,
    backgroundPositionY: 50,
    // New: optional multi-stop gradient background for the header canvas,
    // layered underneath any background image/overlay.
    background: {
      enabled: false,
      type: "linear",
      angle: 90,
      stops: [
        { color: "#1d4ed8", stop: 0 },
        { color: "#0ea5e9", stop: 100 },
      ],
    },
  },
  headerImage: {
    imageOpacity: 1,
    overlayColor: "#000000",
    overlayOpacity: 0,
  },
  palette: {
    accentColor: "#63d3ff",
    titleColor: "",
    subtitleColor: "",
    labelColor: "",
  },
  elementStyles: {},
  typography: {
    titleSize: 14,
    subtitleSize: 11,
    titleWeight: 700,
    subtitleWeight: 500,
    itemLabelSize: 11,
  },
  gradient: {
    height: 16,
    radius: 999,
    offsetX: 0,
    offsetY: 0,
    scale: 1,
    labelsOffsetX: 0,
    labelsOffsetY: 0,
    labelsScale: 1,
  },
  badges: {
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  },
  footnote: {
    offsetX: 0,
    offsetY: 0,
    scale: 1,
  },
  visuals: {
    backgroundOpacity: 0.88,
    borderOpacity: 0.16,
    borderWidth: 1,
    blur: 14,
    shadowStrength: 0.4,
    glowStrength: 0.18,
  },
  visibility: {
    header: true,
    subtitle: true,
    logo: true,
    gradient: true,
    gradientLabels: true,
    hoverReadout: true,
    badges: true,
    footnote: true,
  },
  editor: {
    activeTab: "style",
    headerEditMode: false,
    selectedTarget: "header-container",
    snap: 2,
    showGuides: true,
  },
};

export const LEGEND_STUDIO_TAB_MIGRATION = {
  layout: "layout",
  header: "branding",
  logos: "branding",
  typography: "style",
  colors: "style",
  advanced: "layout",
  presets: "style",
};

/** @type {Object<string, ThemePreset>} */
export const LEGEND_STUDIO_THEME_PRESETS = {
  broadcast: {
    label: "Broadcast",
    description: "Glass card, strong header, metadata badges",
    accent: "#63d3ff",
    config: {
      theme: "broadcast",
      layout: {
        width: 380,
        minHeight: 92,
        paddingX: 14,
        paddingY: 10,
        borderRadius: 14,
        itemGap: 10,
      },
      typography: {
        titleSize: 14,
        subtitleSize: 11,
        titleWeight: 700,
        subtitleWeight: 500,
        itemLabelSize: 11,
      },
      gradient: { height: 16, radius: 999 },
      visuals: {
        backgroundOpacity: 0.88,
        borderOpacity: 0.16,
        borderWidth: 1,
        blur: 14,
        shadowStrength: 0.4,
        glowStrength: 0.18,
      },
      palette: { accentColor: "#63d3ff" },
      visibility: { header: true, subtitle: true, logo: true, badges: true, footnote: true },
    },
  },
  minimal: {
    label: "Minimal",
    description: "Low-noise professional overlay",
    accent: "#94a3b8",
    config: {
      theme: "minimal",
      layout: {
        width: 340,
        minHeight: 72,
        paddingX: 12,
        paddingY: 9,
        borderRadius: 10,
        itemGap: 8,
      },
      typography: {
        titleSize: 13,
        subtitleSize: 10,
        titleWeight: 650,
        subtitleWeight: 450,
        itemLabelSize: 10,
      },
      gradient: { height: 12, radius: 8 },
      visuals: {
        backgroundOpacity: 0.78,
        borderOpacity: 0.12,
        borderWidth: 1,
        blur: 8,
        shadowStrength: 0.22,
        glowStrength: 0,
      },
      palette: { accentColor: "#94a3b8" },
      visibility: { header: true, subtitle: false, logo: false, badges: false, footnote: false },
    },
  },
  compact: {
    label: "Compact",
    description: "Small footprint for dense radar views",
    accent: "#38bdf8",
    config: {
      theme: "compact",
      layout: {
        width: 300,
        minHeight: 64,
        paddingX: 10,
        paddingY: 8,
        borderRadius: 11,
        itemGap: 7,
      },
      typography: {
        titleSize: 12,
        subtitleSize: 9,
        titleWeight: 700,
        subtitleWeight: 500,
        itemLabelSize: 9,
      },
      gradient: { height: 10, radius: 999 },
      visuals: {
        backgroundOpacity: 0.84,
        borderOpacity: 0.14,
        borderWidth: 1,
        blur: 10,
        shadowStrength: 0.28,
        glowStrength: 0.08,
      },
      palette: { accentColor: "#38bdf8" },
      visibility: { header: true, subtitle: false, logo: true, badges: false, footnote: false },
    },
  },
  lowerThird: {
    label: "TV Lower-Third",
    description: "Wide production-style header strip",
    accent: "#f59e0b",
    config: {
      theme: "lowerThird",
      layout: {
        anchor: "bottom-center",
        offsetY: 30,
        width: 520,
        minHeight: 104,
        paddingX: 16,
        paddingY: 12,
        borderRadius: 16,
        itemGap: 12,
      },
      typography: {
        titleSize: 16,
        subtitleSize: 12,
        titleWeight: 800,
        subtitleWeight: 550,
        itemLabelSize: 11,
      },
      gradient: { height: 18, radius: 999 },
      visuals: {
        backgroundOpacity: 0.9,
        borderOpacity: 0.22,
        borderWidth: 1,
        blur: 16,
        shadowStrength: 0.5,
        glowStrength: 0.16,
      },
      palette: { accentColor: "#f59e0b" },
      visibility: { header: true, subtitle: true, logo: true, badges: true, footnote: true },
    },
  },
  darkGlass: {
    label: "Dark Glass",
    description: "High contrast dark glass with glow",
    accent: "#a78bfa",
    config: {
      theme: "darkGlass",
      layout: {
        width: 400,
        minHeight: 96,
        paddingX: 15,
        paddingY: 11,
        borderRadius: 18,
        itemGap: 10,
      },
      typography: {
        titleSize: 14,
        subtitleSize: 11,
        titleWeight: 750,
        subtitleWeight: 500,
        itemLabelSize: 11,
      },
      gradient: { height: 16, radius: 999 },
      visuals: {
        backgroundOpacity: 0.92,
        borderOpacity: 0.24,
        borderWidth: 1,
        blur: 20,
        shadowStrength: 0.58,
        glowStrength: 0.24,
      },
      palette: { accentColor: "#a78bfa" },
      visibility: { header: true, subtitle: true, logo: true, badges: true, footnote: true },
    },
  },
};

export function cloneLegendEditorConfig(value) {
  return JSON.parse(JSON.stringify(value));
}

export function mergeLegendEditorConfig(base, incoming) {
  if (!incoming || typeof incoming !== "object") return base;
  Object.keys(incoming).forEach((key) => {
    const nextValue = incoming[key];
    if (Array.isArray(nextValue)) {
      base[key] = nextValue.slice();
      return;
    }
    if (nextValue && typeof nextValue === "object") {
      const seeded =
        base[key] && typeof base[key] === "object" && !Array.isArray(base[key])
          ? base[key]
          : {};
      base[key] = mergeLegendEditorConfig(seeded, nextValue);
      return;
    }
    base[key] = nextValue;
  });
  return base;
}

/**
 * @param {Partial<LegendConfig>} config
 * @returns {LegendConfig}
 */
export function normalizeLegendEditorConfig(config) {
  const next = mergeLegendEditorConfig(
    cloneLegendEditorConfig(DEFAULT_LEGEND_EDITOR_CONFIG),
    config,
  );
  next.schemaVersion = 2;
  next.theme = LEGEND_STUDIO_THEME_PRESETS[next.theme] ? next.theme : "broadcast";
  next.editor.activeTab =
    LEGEND_STUDIO_TAB_MIGRATION[next.editor.activeTab] ||
    next.editor.activeTab ||
    "style";
  if (!["style", "branding", "layout"].includes(next.editor.activeTab)) {
    next.editor.activeTab = "style";
  }
  next.visibility.badges = next.visibility.badges !== false;
  next.visibility.footnote = next.visibility.footnote !== false;
  next.visibility.gradientLabels = next.visibility.gradientLabels !== false;
  next.layout.freeform = next.layout?.freeform === true;
  if (!next.badges || typeof next.badges !== "object") {
    next.badges = { ...DEFAULT_LEGEND_EDITOR_CONFIG.badges };
  }
  if (!next.footnote || typeof next.footnote !== "object") {
    next.footnote = { ...DEFAULT_LEGEND_EDITOR_CONFIG.footnote };
  }
  if (!next.header.background || typeof next.header.background !== "object") {
    next.header.background = cloneLegendEditorConfig(
      DEFAULT_LEGEND_EDITOR_CONFIG.header.background,
    );
  }
  if (!Array.isArray(next.header.background.stops) || !next.header.background.stops.length) {
    next.header.background.stops = cloneLegendEditorConfig(
      DEFAULT_LEGEND_EDITOR_CONFIG.header.background.stops,
    );
  }
  return next;
}

export function setLegendConfigAtPath(target, path, value) {
  const segments = String(path || "")
    .split(".")
    .filter(Boolean);
  if (!segments.length || !target || typeof target !== "object") return;
  let ref = target;
  for (let i = 0; i < segments.length - 1; i += 1) {
    const key = segments[i];
    if (!ref[key] || typeof ref[key] !== "object") ref[key] = {};
    ref = ref[key];
  }
  ref[segments[segments.length - 1]] = value;
}

export function getLegendConfigAtPath(target, path) {
  return String(path || "")
    .split(".")
    .reduce(
      (current, segment) =>
        current && typeof current === "object" ? current[segment] : undefined,
      target,
    );
}

export function legendStudioPathNeedsRebuild(path) {
  return (
    path === "header.customTitle" ||
    path === "header.customSubtitle" ||
    path === "header.logoUrl" ||
    path.startsWith("header.background") ||
    path.startsWith("header.useBackground") ||
    path.startsWith("header.canvas") ||
    path.startsWith("headerImage.") ||
    path === "visibility.header" ||
    path === "visibility.logo" ||
    path === "visibility.subtitle"
  );
}

export function escapeLegendHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

/**
 * Builds a CSS `background-image` gradient string from a header gradient
 * config, or an empty string if the gradient is disabled/empty.
 * @param {import('./types.js').LegendGradientBackgroundConfig} [gradientConfig]
 */
export function buildLegendHeaderGradientCss(gradientConfig) {
  if (!gradientConfig || !gradientConfig.enabled) return "";
  const stops = Array.isArray(gradientConfig.stops) ? gradientConfig.stops : [];
  if (!stops.length) return "";
  const stopsCss = stops
    .slice()
    .sort((a, b) => Number(a.stop) - Number(b.stop))
    .map((stop) => `${stop.color} ${Number(stop.stop) || 0}%`)
    .join(", ");
  if (gradientConfig.type === "radial") {
    return `radial-gradient(circle, ${stopsCss})`;
  }
  const angle = Number(gradientConfig.angle) || 0;
  return `linear-gradient(${angle}deg, ${stopsCss})`;
}
