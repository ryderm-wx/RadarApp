/**
 * @file Type definitions for the Radar Legend "header" system.
 *
 * The app has no build step, so these are JSDoc typedefs instead of
 * TypeScript interfaces. They are picked up by editors/TS servers via
 * `jsconfig.json` (`checkJs: true`) for inline type checking with zero
 * runtime compilation cost.
 */

/**
 * @typedef {Object} LegendLayoutConfig
 * @property {"top-left"|"top-center"|"top-right"|"bottom-left"|"bottom-center"|"bottom-right"} anchor
 * @property {number} offsetX
 * @property {number} offsetY
 * @property {number} width
 * @property {number} minHeight
 * @property {boolean} freeform
 * @property {number} scale
 * @property {number} paddingX
 * @property {number} paddingY
 * @property {number} borderRadius
 * @property {number} itemGap
 */

/**
 * @typedef {Object} LegendHeaderConfig
 * @property {boolean} enabled
 * @property {"left"|"center"|"right"} align
 * @property {string} justify
 * @property {number} height
 * @property {number} width
 * @property {number} gap
 * @property {string} logoUrl
 * @property {"left"|"right"} logoPlacement
 * @property {number} logoSize
 * @property {number} logoRadius
 * @property {number} logoOffsetX
 * @property {number} logoOffsetY
 * @property {number} logoScale
 * @property {number} containerOffsetX
 * @property {number} containerOffsetY
 * @property {number} containerScale
 * @property {number} textOffsetX
 * @property {number} textOffsetY
 * @property {number} textScale
 * @property {number} titleOffsetX
 * @property {number} titleOffsetY
 * @property {number} titleScale
 * @property {number} subtitleOffsetX
 * @property {number} subtitleOffsetY
 * @property {number} subtitleScale
 * @property {string} customTitle
 * @property {string} customSubtitle
 * @property {boolean} useBackgroundImage
 * @property {string} backgroundImageUrl
 * @property {string} backgroundImageData
 * @property {number} canvasHeight
 * @property {"cover"|"contain"|"fill"} backgroundFit
 * @property {number} backgroundPositionX
 * @property {number} backgroundPositionY
 * @property {LegendGradientBackgroundConfig} [background]
 */

/**
 * @typedef {Object} LegendGradientStop
 * @property {string} color - CSS color for this stop.
 * @property {number} stop - Position 0-100 (percent).
 */

/**
 * @typedef {Object} LegendGradientBackgroundConfig
 * @property {boolean} enabled
 * @property {"linear"|"radial"} type
 * @property {number} angle - Degrees, used when type is "linear".
 * @property {LegendGradientStop[]} stops
 */

/**
 * @typedef {Object} LegendPaletteConfig
 * @property {string} accentColor
 * @property {string} titleColor
 * @property {string} subtitleColor
 * @property {string} labelColor
 */

/**
 * @typedef {Object} LegendTypographyConfig
 * @property {number} titleSize
 * @property {number} subtitleSize
 * @property {number} titleWeight
 * @property {number} subtitleWeight
 * @property {number} itemLabelSize
 */

/**
 * @typedef {Object} LegendGradientConfig
 * @property {number} height
 * @property {number} radius
 * @property {number} offsetX
 * @property {number} offsetY
 * @property {number} scale
 * @property {number} labelsOffsetX
 * @property {number} labelsOffsetY
 * @property {number} labelsScale
 */

/**
 * @typedef {Object} LegendOffsetScaleConfig
 * @property {number} offsetX
 * @property {number} offsetY
 * @property {number} scale
 */

/**
 * @typedef {Object} LegendVisualsConfig
 * @property {number} backgroundOpacity
 * @property {number} borderOpacity
 * @property {number} borderWidth
 * @property {number} blur
 * @property {number} shadowStrength
 * @property {number} glowStrength
 */

/**
 * @typedef {Object} LegendVisibilityConfig
 * @property {boolean} header
 * @property {boolean} subtitle
 * @property {boolean} logo
 * @property {boolean} gradient
 * @property {boolean} gradientLabels
 * @property {boolean} hoverReadout
 * @property {boolean} badges
 * @property {boolean} footnote
 */

/**
 * @typedef {Object} LegendEditorUiConfig
 * @property {"style"|"branding"|"layout"} activeTab
 * @property {boolean} headerEditMode
 * @property {string} selectedTarget
 * @property {number} snap
 * @property {boolean} showGuides
 */

/**
 * @typedef {Object} LegendConfig
 * @property {number} schemaVersion
 * @property {string} theme
 * @property {LegendLayoutConfig} layout
 * @property {LegendHeaderConfig} header
 * @property {{imageOpacity:number, overlayColor:string, overlayOpacity:number}} headerImage
 * @property {LegendPaletteConfig} palette
 * @property {Object<string, Object>} elementStyles
 * @property {LegendTypographyConfig} typography
 * @property {LegendGradientConfig} gradient
 * @property {LegendOffsetScaleConfig} badges
 * @property {LegendOffsetScaleConfig} footnote
 * @property {LegendVisualsConfig} visuals
 * @property {LegendVisibilityConfig} visibility
 * @property {LegendEditorUiConfig} editor
 */

/**
 * @typedef {Object} ThemePreset
 * @property {string} label
 * @property {string} description
 * @property {string} accent
 * @property {Partial<LegendConfig>} config
 */

/**
 * @typedef {Object} LegendBadge
 * @property {string} label
 * @property {string} range
 * @property {string} description
 * @property {string} color
 */

/**
 * @typedef {Object} LegendMeta
 * @property {string} subtitle
 * @property {string} leftLabel
 * @property {string} rightLabel
 * @property {string} footnote
 * @property {LegendBadge[]} badges
 */

/**
 * @typedef {"toggle-header"|"swap-logo"|"toggle-readout"|"toggle-edit"|"toggle-logo"|"toggle-subtitle"|"toggle-gradient"|"toggle-gradient-labels"|"toggle-badges"|"toggle-footnote"|"toggle-selected"|"reset-layout"} ToolbarActionId
 */

export {};
