/**
 * @file Responsive overflow behavior for the Radar Legend: below a width
 * breakpoint, the full legend strip collapses into a small icon button that
 * expands the legend in-place on demand (tap/click or Enter/Space).
 */

const COLLAPSE_BREAKPOINT_PX = 300;

let collapsed = false;
let expandedOverride = false;
let resizeObserver = null;

function ensureCollapseButton(legendRoot) {
  let button = legendRoot.querySelector(".legend-collapse-toggle");
  if (!button) {
    button = document.createElement("button");
    button.type = "button";
    button.className = "legend-collapse-toggle";
    button.setAttribute("aria-label", "Show radar legend");
    button.setAttribute("aria-expanded", "false");
    button.textContent = "☰";
    button.addEventListener("click", () => {
      expandedOverride = !expandedOverride;
      applyCollapseState(legendRoot);
    });
    legendRoot.appendChild(button);
  }
  return button;
}

function applyCollapseState(legendRoot) {
  const shouldCollapse = collapsed && !expandedOverride;
  legendRoot.classList.toggle("legend-collapsed", shouldCollapse);
  const button = legendRoot.querySelector(".legend-collapse-toggle");
  if (button) {
    button.setAttribute("aria-expanded", shouldCollapse ? "false" : "true");
    button.style.display = collapsed ? "flex" : "none";
  }
}

/**
 * Observes the legend's available width (via its offset parent, since the
 * legend itself is absolutely positioned) and toggles a compact mode when
 * the viewport is too narrow to comfortably show the full strip.
 */
export function initResponsiveCollapse(legendRoot = document.getElementById("radarLegend")) {
  if (!legendRoot || resizeObserver) return;
  ensureCollapseButton(legendRoot);

  const evaluate = () => {
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const nextCollapsed = viewportWidth <= COLLAPSE_BREAKPOINT_PX + 40;
    if (nextCollapsed !== collapsed) {
      collapsed = nextCollapsed;
      if (!collapsed) expandedOverride = false;
      applyCollapseState(legendRoot);
    }
  };

  resizeObserver =
    typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(evaluate)
      : { observe: () => window.addEventListener("resize", evaluate), disconnect: () => {} };
  resizeObserver.observe(document.documentElement);
  window.addEventListener("resize", evaluate);
  evaluate();
}
