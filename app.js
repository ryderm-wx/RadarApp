// --- Constants (Defined once, used globally) ---
const MAPTILER_API_KEY = "SskdAs3Zk3tm9lBUtRKN"; // Replace with your MapTiler API key
const NEXRAD_BUCKET_URL = "https://unidata-nexrad-level3.s3.amazonaws.com";
const RADAR_SITES_URL =
  "https://www.ncei.noaa.gov/access/homr/file/nexrad-stations.csv"; // Example source

// Define icons for different event codes
const icons = {
  "TO.W": "🌪️", // Tornado Warning
  "SV.W": "⛈️", // Severe Thunderstorm Warning
  "FF.W": "🌊", // Flash Flood Warning
  "FL.W": "💧", // Flood Warning
  "HU.W": "🌀", // Hurricane Warning
  "WS.W": "❄️", // Winter Storm Warning
  "BZ.W": "❄️", // Blizzard Warning
  "IS.W": "🧊", // Ice Storm Warning
  "HS.W": "🌨️", // Heavy Snow Warning
  "FW.W": "🔥", // Fire Weather Warning
  "HW.W": "💨", // High Wind Warning
  "EH.W": "🌡️", // Excessive Heat Warning
  "EC.W": "🥶", // Extreme Cold Warning
  // Add more event codes and icons as needed
};

// Define the color expression once globally, as it's static
const DBZ_COLOR_EXPRESSION = [
  "interpolate",
  ["linear"],
  ["get", "dbz"],
  0,
  "rgba(1,243,247,0.8)",
  0.5,
  "rgba(3,231,239,0.8)",
  1.0,
  "rgba(5,219,231,0.8)",
  1.5,
  "rgba(7,207,223,0.8)",
  2.0,
  "rgba(9,195,215,0.8)",
  2.5,
  "rgba(11,183,207,0.8)",
  3.0,
  "rgba(13,171,199,0.8)",
  3.5,
  "rgba(15,195,191,0.8)",
  4.0,
  "rgba(17,147,183,0.8)",
  4.5,
  "rgba(19,135,175,0.8)",
  5.0,
  "rgba(21,123,167,0.8)",
  5.5,
  "rgba(23,112,159,0.8)",
  6.0,
  "rgba(21,114,163,0.8)",
  6.5,
  "rgba(20,117,168,0.8)",
  7.0,
  "rgba(19,120,173,0.8)",
  7.5,
  "rgba(18,123,178,0.8)",
  8.0,
  "rgba(17,126,182,0.8)",
  8.5,
  "rgba(16,129,187,0.8)",
  9.0,
  "rgba(15,132,192,0.8)",
  9.5,
  "rgba(14,135,197,0.8)",
  10.0,
  "rgba(12,137,201,0.8)",
  10.5,
  "rgba(11,140,206,0.8)",
  11.0,
  "rgba(10,143,211,0.8)",
  11.5,
  "rgba(9,146,216,0.8)",
  12.0,
  "rgba(8,149,220,0.8)",
  12.5,
  "rgba(7,152,255,0.8)",
  13.0,
  "rgba(6,155,230,0.8)",
  13.5,
  "rgba(5,158,235,0.8)",
  14.0,
  "rgba(21,191,180,0.8)",
  14.5,
  "rgba(37,225,125,0.8)",
  15.0,
  "rgba(36,221,121,0.8)",
  15.5,
  "rgba(35,218,118,0.8)",
  16.0,
  "rgba(34,214,115,0.8)",
  16.5,
  "rgba(33,211,112,0.8)",
  17.0,
  "rgba(32,207,108,0.8)",
  17.5,
  "rgba(31,204,105,0.8)",
  18.0,
  "rgba(30,200,102,0.8)",
  18.5,
  "rgba(29,197,99,0.8)",
  19.0,
  "rgba(28,194,96,0.8)",
  19.5,
  "rgba(27,190,93,0.8)",
  20.0,
  "rgba(26,187,90,0.8)",
  20.5,
  "rgba(28,184,87,0.8)",
  21.0,
  "rgba(24,180,84,0.8)",
  21.5,
  "rgba(24,177,81,0.8)",
  22.0,
  "rgba(23,174,77,0.8)",
  22.5,
  "rgba(22,170,74,0.8)",
  23.0,
  "rgba(21,167,71,0.8)",
  23.5,
  "rgba(20,164,68,0.8)",
  24.0,
  "rgba(19,160,65,0.8)",
  24.5,
  "rgba(18,157,62,0.8)",
  25.0,
  "rgba(17,154,59,0.8)",
  25.5,
  "rgba(16,150,56,0.8)",
  26.0,
  "rgba(15,147,53,0.8)",
  26.5,
  "rgba(15,144,50,0.8)",
  27.0,
  "rgba(14,140,46,0.8)",
  27.5,
  "rgba(13,137,43,0.8)",
  28.0,
  "rgba(12,133,40,0.8)",
  28.5,
  "rgba(11,130,37,0.8)",
  29.0,
  "rgba(10,127,34,0.8)",
  29.5,
  "rgba(9,123,31,0.8)",
  30.0,
  "rgba(8,120,27,0.8)",
  30.5,
  "rgba(7,117,24,0.8)",
  31.0,
  "rgba(6,113,21,0.8)",
  31.5,
  "rgba(5,110,18,0.8)",
  32.0,
  "rgba(4,107,15,0.8)",
  32.5,
  "rgba(3,103,12,0.8)",
  33.0,
  "rgba(2,100,9,0.8)",
  33.5,
  "rgba(1,96,5,0.8)",
  34.0,
  "rgba(128,175,19,0.8)",
  34.5,
  "rgba(255,255,33,0.8)",
  35.0,
  "rgba(255,247,28,0.8)",
  35.5,
  "rgba(255,239,23,0.8)",
  36.0,
  "rgba(255,231,18,0.8)",
  36.5,
  "rgba(255,223,14,0.8)",
  37.0,
  "rgba(255,215,9,0.8)",
  37.5,
  "rgba(255,207,4,0.8)",
  38.0,
  "rgba(255,199,0,0.8)",
  38.5,
  "rgba(255,191,0,0.8)",
  39.0,
  "rgba(255,183,0,0.8)",
  39.5,
  "rgba(255,175,0,0.8)",
  40.0,
  "rgba(255,157,0,0.8)",
  40.5,
  "rgba(255,140,0,0.8)",
  41.0,
  "rgba(255,122,0,0.8)",
  41.5,
  "rgba(255,105,0,0.8)",
  42.0,
  "rgba(255,87,0,0.8)",
  42.5,
  "rgba(255,70,0,0.8)",
  43.0,
  "rgba(255,52,0,0.8)",
  43.5,
  "rgba(255,35,0,0.8)",
  44.0,
  "rgba(255,17,0,0.8)",
  44.5,
  "rgba(255,0,0,0.8)",
  45.0,
  "rgba(249,0,0,0.8)",
  45.5,
  "rgba(244,0,0,0.8)",
  46.0,
  "rgba(239,0,0,0.8)",
  46.5,
  "rgba(233,0,0,0.8)",
  47.0,
  "rgba(228,0,0,0.8)",
  47.5,
  "rgba(223,0,0,0.8)",
  48.0,
  "rgba(217,0,0,0.8)",
  48.5,
  "rgba(212,0,0,0.8)",
  49.0,
  "rgba(207,0,0,0.8)",
  49.5,
  "rgba(201,0,0,0.8)",
  50.0,
  "rgba(195,0,0,0.8)",
  50.5,
  "rgba(190,0,0,0.8)",
  51.0,
  "rgba(185,0,0,0.8)",
  51.5,
  "rgba(180,0,0,0.8)",
  52.0,
  "rgba(175,0,0,0.8)",
  52.5,
  "rgba(170,0,0,0.8)",
  53.0,
  "rgba(165,0,0,0.8)",
  53.5,
  "rgba(160,0,0,0.8)",
  54.0,
  "rgba(154,0,0,0.8)",
  54.5,
  "rgba(180,0,180,0.8)",
  55.0,
  "rgba(186,9,185,0.8)",
  55.5,
  "rgba(192,19,190,0.8)",
  56.0,
  "rgba(198,29,195,0.8)",
  56.5,
  "rgba(204,39,201,0.8)",
  57.0,
  "rgba(210,49,206,0.8)",
  57.5,
  "rgba(216,59,211,0.8)",
  58.0,
  "rgba(223,68,216,0.8)",
  58.5,
  "rgba(229,78,222,0.8)",
  59.0,
  "rgba(235,88,227,0.8)",
  59.5,
  "rgba(241,98,232,0.8)",
  60.0,
  "rgba(247,108,237,0.8)",
  60.5,
  "rgba(253,117,243,0.8)",
  61.0,
  "rgba(232,109,232,0.8)",
  61.5,
  "rgba(212,104,204,0.8)",
  62.0,
  "rgba(192,93,184,0.8)",
  62.5,
  "rgba(171,85,165,0.8)",
  63.0,
  "rgba(151,77,146,0.8)",
  63.5,
  "rgba(131,69,126,0.8)",
  64.0,
  "rgba(111,61,107,0.8)",
  64.5,
  "rgba(90,53,88,0.8)",
  65.0,
  "rgba(70,45,68,0.8)",
  65.5,
  "rgba(50,37,49,0.8)",
  66.0,
  "rgba(29,30,29,0.8)",
  66.5,
  "rgba(33,34,33,0.8)",
  67.0,
  "rgba(37,38,37,0.8)",
  67.5,
  "rgba(41,42,41,0.8)",
  68.0,
  "rgba(45,46,45,0.8)",
  68.5,
  "rgba(49,50,49,0.8)",
  69.0,
  "rgba(53,54,53,0.8)",
  69.5,
  "rgba(57,58,57,0.8)",
  70.0,
  "rgba(61,62,61,0.8)",
  70.5,
  "rgba(65,66,65,0.8)",
  71.0,
  "rgba(69,70,69,0.8)",
  71.5,
  "rgba(73,74,73,0.8)",
  72.0,
  "rgba(77,78,77,0.8)",
  72.5,
  "rgba(81,82,81,0.8)",
  73.0,
  "rgba(85,86,85,0.8)",
  73.5,
  "rgba(89,90,89,0.8)",
  74.0,
  "rgba(93,94,93,0.8)",
  74.5,
  "rgba(97,98,97,0.8)",
  75.0,
  "rgba(101,102,101,0.8)",
  75.5,
  "rgba(105,106,105,0.8)",
  76.0,
  "rgba(109,110,109,0.8)",
  76.5,
  "rgba(113,114,113,0.8)",
  77.0,
  "rgba(117,118,117,0.8)",
  77.5,
  "rgba(121,122,121,0.8)",
  78.0,
  "rgba(125,126,125,0.8)",
  78.5,
  "rgba(129,130,129,0.8)",
  79.0,
  "rgba(133,134,133,0.8)",
  79.5,
  "rgba(137,138,137,0.8)",
  80.0,
  "rgba(142,142,142,0.8)",
  80.5,
  "rgba(146,146,146,0.8)",
  81.0,
  "rgba(150,150,150,0.8)",
  81.5,
  "rgba(154,154,154,0.8)",
  82.0,
  "rgba(158,158,158,0.8)",
  82.5,
  "rgba(162,162,162,0.8)",
  83.0,
  "rgba(166,166,166,0.8)",
  83.5,
  "rgba(170,170,170,0.8)",
  84.0,
  "rgba(174,174,174,0.8)",
  84.5,
  "rgba(178,178,178,0.8)",
  85.0,
  "rgba(182,182,182,0.8)",
  85.5,
  "rgba(186,186,186,0.8)",
  86.0,
  "rgba(190,190,190,0.8)",
  86.5,
  "rgba(194,194,194,0.8)",
  87.0,
  "rgba(198,198,198,0.8)",
  87.5,
  "rgba(202,202,202,0.8)",
  88.0,
  "rgba(206,206,206,0.8)",
  88.5,
  "rgba(210,210,210,0.8)",
  89.0,
  "rgba(214,214,214,0.8)",
  89.5,
  "rgba(218,218,218,0.8)",
  90.0,
  "rgba(222,222,222,0.8)",
  90.5,
  "rgba(226,226,226,0.8)",
  91.0,
  "rgba(230,230,230,0.8)",
  91.5,
  "rgba(234,234,234,0.8)",
  92.0,
  "rgba(238,238,238,0.8)",
  92.5,
  "rgba(242,242,242,0.8)",
  93.0,
  "rgba(246,246,246,0.8)",
  93.5,
  "rgba(250,250,250,0.8)",
  94.0,
  "rgba(254,254,254,0.8)",
  94.5,
  "rgba(258,258,258,0.8)",
  95.0,
  "rgba(262,262,262,0.8)",
  100.0,
  "rgba(262,262,262,0.8)",
];

const VELOCITY_COLOR_EXPRESSION = [
  "interpolate",
  ["linear"],
  ["get", "dbz"], // The attribute name is still 'dbz' in the shader, but it holds velocity
  -200,
  "rgba(255, 220, 220, 0.8)",
  -140,
  "rgba(255, 20, 180, 0.8)",
  -120,
  "rgba(114, 3, 141, 0.8)",
  -100,
  "rgba(32, 1, 141, 0.8)",
  -90,
  "rgba(47, 215, 225, 0.8)",
  -70,
  "rgba(172, 239, 242, 0.8)",
  -50,
  "rgba(33, 253, 50, 0.8)",
  -40,
  "rgba(15, 99, 20, 0.8)",
  -10,
  "rgba(106, 125, 105, 0.8)",
  0,
  "rgba(122, 48, 57, 0.8)", // Center of the scale
  10,
  "rgba(242, 1, 6, 0.8)",
  40,
  "rgba(255, 142, 212, 0.8)",
  55,
  "rgba(255, 221, 176, 0.8)",
  60,
  "rgba(255, 151, 86, 0.8)",
  80,
  "rgba(254, 137, 80, 0.8)",
  120,
  "rgba(97, 6, 2, 0.8)",
  140,
  "rgba(60, 0, 0, 0.8)",
  200,
  "rgba(45, 0, 0, 0.8)",
  999,
  "rgba(123, 0, 200, 0.8)", // RF (Range Folded) color
];

// --- Global variables for map state (managed carefully) ---
const radarLayerId = "radar-webgl-layer"; // NEW: ID for the custom WebGL layer
const sweepSourceId = "radar-sweep"; // New ID for the sweep source
const sweepLayerId = "radar-sweep-layer"; // New ID for the sweep layer
let selectedRadarSite = null;
let mapInstance = null;
// NEW: Global variable to hold the actual custom layer instance
let customRadarLayerInstance = null;

// --- Sweep Animation Variables ---
// Current sweep animation variables
// Enhanced sweep animation variables
let currentSweepAngle = 0;
let animationFrameId = null;
const SWEEP_SPEED_DPS = 0.2;
const SWEEP_WIDTH = 10; // Slightly wider for better visibility
const SWEEP_RADIUS_KM = 500;
const SWEEP_ARC_STEPS = 500; // More steps for smoother arc
const SWEEP_OPACITY = 0.9; // Control overall opacity
const SWEEP_FADE_TAIL = true; // Enable fading tail effect
const SWEEP_TAIL_LENGTH = 60; // Length of the fading tail in degrees
const SWEEP_COLOR = "rgba(255, 255, 255, 0.9)"; // Main color
const SWEEP_GLOW_COLOR = "rgba(120, 200, 255, 0.6)"; // Subtle blue glow

// Add these global variables to track alerts
let activeAlerts = new Map();
let selectedAlert = null;
let alertDetailsElement = null;

// Initialize the SSE connection to receive live alerts
function initAlertFeed() {
  const eventSource = new EventSource(
    "https://xmpp-api-production.up.railway.app/live-alerts"
  );

  eventSource.addEventListener("INIT", (event) => {
    const alert = JSON.parse(event.data);
    addAlertToMap(alert);
  });

  eventSource.addEventListener("NEW", (event) => {
    const alert = JSON.parse(event.data).feature;
    addAlertToMap(alert);
  });

  eventSource.addEventListener("UPDATE", (event) => {
    const alert = JSON.parse(event.data).feature;
    updateAlertOnMap(alert);
  });

  eventSource.addEventListener("ALERT_CANCELED", (event) => {
    const { id } = JSON.parse(event.data);
    removeAlertFromMap(id);
  });

  eventSource.addEventListener("SPECIAL_WEATHER_STATEMENT", (event) => {
    const alert = JSON.parse(event.data).feature;
    addAlertToMap(alert);
  });

  eventSource.onerror = (error) => {
    console.error("SSE connection error:", error);
    // Try to reconnect after a delay
    setTimeout(() => {
      eventSource.close();
      initAlertFeed();
    }, 5000);
  };
}

// Function to create and show alerts dropdown
function showAlertsDropdown(position) {
  // Remove any existing dropdown
  const existingDropdown = document.getElementById("alerts-dropdown");
  if (existingDropdown) {
    existingDropdown.remove();
  }

  // Get all alerts in the current view
  const alertsInView = Array.from(activeAlerts.values());

  if (alertsInView.length === 0) return;

  // Create dropdown element
  const dropdown = document.createElement("div");
  dropdown.id = "alerts-dropdown";
  dropdown.style.position = "absolute";
  dropdown.style.top = `${position ? position.y : 60}px`;
  dropdown.style.right = "10px";
  dropdown.style.backgroundColor = "white";
  dropdown.style.borderRadius = "8px";
  dropdown.style.boxShadow = "0 3px 10px rgba(0,0,0,0.3)";
  dropdown.style.zIndex = "1001";
  dropdown.style.width = "300px";
  dropdown.style.maxHeight = "400px";
  dropdown.style.overflow = "auto";
  dropdown.style.padding = "10px";

  // Add header
  const header = document.createElement("div");
  header.style.borderBottom = "1px solid #eee";
  header.style.paddingBottom = "10px";
  header.style.marginBottom = "10px";
  header.style.fontWeight = "bold";
  header.innerHTML = `<span>Active Alerts (${alertsInView.length})</span>
                      <span class="close-dropdown" style="float:right; cursor:pointer;">×</span>`;
  dropdown.appendChild(header);

  // Add alerts
  alertsInView.forEach((alert) => {
    const alertItem = document.createElement("div");
    alertItem.className = "dropdown-alert-item";
    alertItem.style.padding = "8px";
    alertItem.style.margin = "5px 0";
    alertItem.style.borderRadius = "5px";
    alertItem.style.cursor = "pointer";
    alertItem.style.borderLeft = `4px solid ${getAlertColor(alert.eventCode)}`;
    alertItem.style.backgroundColor = "#f8f8f8";
    alertItem.style.transition = "background-color 0.2s";

    // Get icon for the alert
    const icon = getAlertIcon(alert.eventCode);

    alertItem.innerHTML = `
      <div style="display:flex; align-items:center;">
        <div style="margin-right:10px;">${icon}</div>
        <div>
          <div style="font-weight:bold;">${alert.eventName}</div>
          <div style="font-size:0.8em; color:#666;">
            ${alert.counties ? alert.counties.join(", ") : "Unknown location"}
          </div>
        </div>
      </div>
    `;

    // Hover effect
    alertItem.addEventListener("mouseover", () => {
      alertItem.style.backgroundColor = "#f0f0f0";
    });
    alertItem.addEventListener("mouseout", () => {
      alertItem.style.backgroundColor = "#f8f8f8";
    });

    // Click to open full alert
    alertItem.addEventListener("click", () => {
      dropdown.remove();
      showAlertDetails(alert);
    });

    dropdown.appendChild(alertItem);
  });

  // Add close functionality
  dropdown.querySelector(".close-dropdown").addEventListener("click", () => {
    dropdown.remove();
  });

  // Close when clicking outside
  document.addEventListener(
    "click",
    (e) => {
      if (
        dropdown &&
        !dropdown.contains(e.target) &&
        !e.target.closest(".alerts-toggle-btn")
      ) {
        dropdown.remove();
      }
    },
    { once: true }
  );

  document.body.appendChild(dropdown);
  return dropdown;
}

// Create a button to toggle the alerts dropdown
function createAlertsToggleButton() {
  // Remove existing button if present
  const existing = document.querySelector(".alerts-toggle-btn");
  if (existing) existing.remove();

  const button = document.createElement("div");
  button.className = "alerts-toggle-btn";
  button.innerHTML = `<div style="display:flex; align-items:center;">
                        <span style="margin-right:5px;">⚠️</span>
                        <span>Alerts</span>
                        <span class="alert-count" style="margin-left:5px; background-color:red; color:white; border-radius:50%; width:20px; height:20px; display:flex; justify-content:center; align-items:center; font-size:0.8em;">
                          ${activeAlerts.size}
                        </span>
                      </div>`;

  Object.assign(button.style, {
    position: "absolute",
    top: "10px",
    right: "10px",
    backgroundColor: "#333",
    color: "white",
    padding: "8px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    zIndex: "1000",
    boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
    transition: "all 0.3s ease",
  });

  button.addEventListener("mouseover", () => {
    button.style.backgroundColor = "#555";
  });

  button.addEventListener("mouseout", () => {
    button.style.backgroundColor = "#333";
  });

  button.addEventListener("click", (e) => {
    e.stopPropagation();
    showAlertsDropdown({ x: e.clientX, y: e.clientY + 30 });
  });

  document.body.appendChild(button);
  return button;
}

// Update the toggle button when alerts change
function updateAlertsButton() {
  const button = document.querySelector(".alerts-toggle-btn");
  if (!button) {
    createAlertsToggleButton();
    return;
  }

  const countElement = button.querySelector(".alert-count");
  if (countElement) {
    countElement.textContent = activeAlerts.size;

    // Make the button pulse when there are alerts
    if (activeAlerts.size > 0) {
      button.style.animation = "pulse 2s infinite";
    } else {
      button.style.animation = "none";
    }
  }
}

// Add this to your CSS
const style = document.createElement("style");
style.textContent = `
  @keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
  
  .dropdown-alert-item:hover {
    background-color: #f0f0f0 !important;
  }
`;
document.head.appendChild(style);

// Modify your alert handling functions to update the button
function addAlertToMap(alert) {
  if (activeAlerts.has(alert.id)) {
    updateAlertOnMap(alert);
    return;
  }

  // Store the alert in our collection
  activeAlerts.set(alert.id, alert);

  // Add the polygon visualization if geometry exists
  if (alert.polygon) {
    addAlertPolygon(mapInstance, alert);
  } else if (alert.counties && alert.counties.length > 0) {
    // Add county-based visualization if no polygon
    addAlertCounties(alert);
  }

  // Update the alerts button
  updateAlertsButton();
}

function removeAlertFromMap(alertId) {
  const alert = activeAlerts.get(alertId);
  if (!alert) return;

  // Remove from our collection
  activeAlerts.delete(alertId);

  // If this was the selected alert, remove the details panel
  if (selectedAlert && selectedAlert.id === alertId && alertDetailsElement) {
    alertDetailsElement.remove();
    alertDetailsElement = null;
    selectedAlert = null;
  }

  // Remove the marker if it exists
  if (alert.marker) {
    alert.marker.remove();
  }

  // Remove the polygon layers if they exist
  if (mapInstance.getLayer(`alert-fill-${alertId}`)) {
    mapInstance.removeLayer(`alert-fill-${alertId}`);
  }

  if (mapInstance.getLayer(`alert-line-${alertId}`)) {
    mapInstance.removeLayer(`alert-line-${alertId}`);
  }

  // Remove the source if it exists
  if (mapInstance.getSource(`alert-${alertId}`)) {
    mapInstance.removeSource(`alert-${alertId}`);
  }

  // Update the alerts button
  updateAlertsButton();
}

// Initialize the alerts button when the map is ready
function initializeWeatherAlerts() {
  // Add CSS for alert markers
  const style = document.createElement("style");
  style.textContent = `
    .alert-marker {
      transition: transform 0.2s ease;
    }
    .alert-marker:hover {
      transform: scale(1.2);
    }
  `;
  document.head.appendChild(style);

  // Create the alerts button
  createAlertsToggleButton();
}

const enhancedStyles = `
  :root {
    --glass-bg: rgba(15, 23, 42, 0.85);
    --glass-border: rgba(255, 255, 255, 0.1);
    --glass-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    --accent-glow: rgba(56, 189, 248, 0.3);
    --text-primary: rgba(255, 255, 255, 0.95);
    --text-secondary: rgba(255, 255, 255, 0.7);
  }

  .glass-morphism {
    background: var(--glass-bg);
    backdrop-filter: blur(12px) saturate(180%);
    border: 1px solid var(--glass-border);
    box-shadow: var(--glass-shadow);
    border-radius: 16px;
  }

  .alert-dropdown {
    position: fixed; /* Changed to fixed for better positioning */
    min-width: 320px;
    max-width: 400px;
    padding: 16px;
    color: var(--text-primary);
    animation: fadeIn 0.2s ease-out;
    z-index: 1000;
  }

  .alert-item {
    padding: 12px;
    margin: 4px 0;
    border-radius: 8px;
    transition: all 0.2s ease;
    border: 1px solid transparent;
  }

  .alert-item:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: var(--glass-border);
    transform: translateY(-1px);
  }

  .alert-detail {
    position: fixed;
    bottom: 32px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 800px;
    padding: 24px;
    color: var(--text-primary);
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .alert-header {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 20px;
    padding-bottom: 16px;
    border-bottom: 1px solid var(--glass-border);
  }

  .alert-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }

  .alert-section {
    background: rgba(255, 255, 255, 0.05);
    padding: 16px;
    border-radius: 12px;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  @keyframes slideUp {
    from { transform: translate(-50%, 100%); opacity: 0; }
    to { transform: translate(-50%, 0); opacity: 1; }
  }
`;

//ALERT POLYGON GENERATION AND HANDLING
// Validate coords: lon between -180 and 180, lat between -90 and 90
function isValidCoordinate(coord) {
  const [lon, lat] = coord;
  return (
    typeof lon === "number" &&
    typeof lat === "number" &&
    lon >= -180 &&
    lon <= 180 &&
    lat >= -90 &&
    lat <= 90
  );
}

function addAlertPolygon(map, alert) {
  if (!map || !alert.polygon) return;

  const id = `alert-${alert.id}`;
  const color = getAlertColor(alert.eventCode);

  // Fix coordinate order and validate
  const fixedPolygon = {
    type: "Polygon",
    coordinates: alert.polygon.coordinates.map((ring) =>
      ring
        .map((coord) => {
          // Swap lat/lon => lon/lat, assuming alert.polygon is [lat, lon]
          const fixed = [coord[1], coord[0]];
          if (!isValidCoordinate(fixed)) {
            console.warn(`Invalid coordinate in alert ${alert.id}:`, coord);
            return null;
          }
          return fixed;
        })
        .filter((coord) => coord !== null)
    ),
  };

  // Make sure polygon ring has at least 3 valid points
  if (
    fixedPolygon.coordinates.length === 0 ||
    fixedPolygon.coordinates[0].length < 3
  ) {
    console.warn(
      `Invalid polygon for alert ${alert.id}: insufficient valid coordinates`
    );
    return;
  }

  // Remove existing source and layers to prevent duplicates
  if (map.getLayer(`${id}-glow`)) map.removeLayer(`${id}-glow`);
  if (map.getLayer(id)) map.removeLayer(id);
  if (map.getSource(id)) map.removeSource(id);

  map.addSource(id, {
    type: "geojson",
    data: {
      type: "Feature",
      geometry: fixedPolygon,
      properties: { id: id },
    },
  });

  // Glow layer
  map.addLayer({
    id: `${id}-glow`,
    type: "line",
    source: id,
    paint: {
      "line-color": color,
      "line-width": 12,
      "line-blur": 8,
      "line-opacity": 0.4,
    },
  });

  // Main polygon outline layer
  map.addLayer({
    id: id,
    type: "line",
    source: id,
    paint: {
      "line-color": color,
      "line-width": 3,
      "line-opacity": 0.8,
    },
  });

  // Click handler for the polygon
  map.on("click", id, (e) => handleAlertClick(e, alert));
}

// Handle clicks on the map to show alerts in the area
function handleMapClick(e) {
  const point = [e.lngLat.lng, e.lngLat.lat];
  const alertsInArea = [];

  activeAlerts.forEach((alert) => {
    if (!alert.polygon) return;

    // Create a fixed polygon with correct coordinate order
    const fixedPolygon = {
      type: "Polygon",
      coordinates: alert.polygon.coordinates.map(
        (ring) => ring.map((coord) => [coord[1], coord[0]]) // Swap lat/lon to lon/lat
      ),
    };

    try {
      if (turf.booleanPointInPolygon(point, fixedPolygon)) {
        alertsInArea.push(alert);
      }
    } catch (error) {
      console.error("Error checking point in polygon:", error);
    }
  });

  if (alertsInArea.length > 0) {
    showAlertDropdown(e.point, alertsInArea);
  }
}

// Create and show the alert dropdown menu
function showAlertDropdown(point, alerts) {
  const existing = document.getElementById("alert-dropdown");
  if (existing) existing.remove();

  const dropdown = document.createElement("div");
  dropdown.id = "alert-dropdown";
  dropdown.className = "alert-dropdown";

  // Add base styles
  Object.assign(dropdown.style, {
    position: "absolute",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
    width: "300px",
    maxHeight: "400px",
    overflowY: "auto",
    zIndex: "1000",
    padding: "12px",
    border: "1px solid rgba(0,0,0,0.1)",
  });

  // Calculate position
  const padding = 20;
  const dropdownWidth = 300;
  const dropdownHeight = Math.min(400, window.innerHeight - 40);

  // Ensure dropdown stays within viewport
  let left = Math.min(point.x, window.innerWidth - dropdownWidth - padding);
  left = Math.max(padding, left);

  let top = point.y + window.scrollY;
  if (top + dropdownHeight > window.innerHeight) {
    top = window.innerHeight - dropdownHeight - padding;
  }

  dropdown.style.left = `${left}px`;
  dropdown.style.top = `${top}px`;

  // Add header
  const header = document.createElement("div");
  Object.assign(header.style, {
    borderBottom: "1px solid #eee",
    paddingBottom: "10px",
    marginBottom: "10px",
  });

  header.innerHTML = `
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <h3 style="margin: 0; font-size: 16px;">Weather Alerts</h3>
      <div style="font-size: 0.9rem; color: #666;">
        ${alerts.length} active alert${alerts.length > 1 ? "s" : ""}
      </div>
    </div>
  `;
  dropdown.appendChild(header);

  // Add alerts list
  const alertsList = document.createElement("div");
  alertsList.style.marginTop = "8px";

  alerts.forEach((alert) => {
    const item = document.createElement("div");
    item.className = "alert-item";
    Object.assign(item.style, {
      padding: "10px",
      borderRadius: "6px",
      cursor: "pointer",
      marginBottom: "8px",
      transition: "background-color 0.2s",
      backgroundColor: "#f8f8f8",
    });

    item.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px;">
        <div style="width: 8px; height: 8px; border-radius: 50%; 
             background: ${getAlertColor(alert.eventCode)}; 
             box-shadow: 0 0 10px ${getAlertColor(alert.eventCode)}"></div>
        <div>
          <div style="font-weight: 500;">${alert.eventName}</div>
          <div style="font-size: 0.85rem; color: #666;">
            ${alert.counties[0]}${
      alert.counties.length > 1 ? ` +${alert.counties.length - 1} more` : ""
    }
          </div>
        </div>
      </div>
    `;

    // Add hover effect
    item.addEventListener("mouseover", () => {
      item.style.backgroundColor = "#f0f0f0";
    });
    item.addEventListener("mouseout", () => {
      item.style.backgroundColor = "#f8f8f8";
    });

    item.onclick = () => {
      showDetailedAlert(alert);
      dropdown.remove();
    };
    alertsList.appendChild(item);
  });

  dropdown.appendChild(alertsList);
  document.body.appendChild(dropdown);

  // Add close button
  const closeButton = document.createElement("button");
  Object.assign(closeButton.style, {
    position: "absolute",
    top: "8px",
    right: "8px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "18px",
    color: "#666",
  });
  closeButton.innerHTML = "×";
  closeButton.onclick = () => dropdown.remove();
  dropdown.appendChild(closeButton);

  // Close dropdown when clicking outside
  setTimeout(() => {
    document.addEventListener(
      "click",
      (e) => {
        if (!dropdown.contains(e.target)) dropdown.remove();
      },
      { once: true }
    );
  }, 0);

  // Add some basic CSS if not already present
  if (!document.getElementById("alert-dropdown-styles")) {
    const style = document.createElement("style");
    style.id = "alert-dropdown-styles";
    style.textContent = `
      .alert-dropdown {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      }
      .alert-item:last-child {
        margin-bottom: 0;
      }
    `;
    document.head.appendChild(style);
  }
}

// Show detailed alert information
function showDetailedAlert(alert) {
  try {
    const bbox = turf.bbox(alert.polygon);
    const bounds = [
      [Math.min(bbox[0], bbox[2]), Math.min(bbox[1], bbox[3])].map((coord) =>
        parseFloat(coord)
      ),
      [Math.max(bbox[0], bbox[2]), Math.max(bbox[1], bbox[3])].map((coord) =>
        parseFloat(coord)
      ),
    ];

    // Swap coordinates if they're in wrong order (lat, lng instead of lng, lat)
    if (Math.abs(bounds[0][0]) < 90 && Math.abs(bounds[0][1]) > 90) {
      bounds.forEach((pair) => {
        [pair[0], pair[1]] = [pair[1], pair[0]];
      });
    }

    // Final validation
    if (
      bounds[0][0] >= -180 &&
      bounds[0][0] <= 180 && // west
      bounds[1][0] >= -180 &&
      bounds[1][0] <= 180 && // east
      bounds[0][1] >= -90 &&
      bounds[0][1] <= 90 && // south
      bounds[1][1] >= -90 &&
      bounds[1][1] <= 90 // north
    ) {
      mapInstance.fitBounds(bounds, {
        padding: 50,
        duration: 1000,
        maxZoom: 10,
      });
    } else {
      console.error("Invalid bounds:", bounds);
      // Fallback to first coordinate of polygon
      const firstCoord = alert.polygon.coordinates[0][0];
      mapInstance.setCenter([firstCoord[0], firstCoord[1]]);
      mapInstance.setZoom(8);
    }

    // Get color based on alert type
    const color = getAlertColor(alert.eventCode);
    const icon = getAlertIcon(alert.eventCode);

    // Format dates
    const issuedFormatted = alert.effective
      ? formatDate(alert.effective)
      : "N/A";
    const expiresFormatted = alert.expires ? formatDate(alert.expires) : "N/A";

    // Build threats section
    let threatsList = buildThreatsList(alert);

    // Create detailed alert view with enhanced styling
    const detailView = document.createElement("div");
    detailView.id = "alert-detail";
    detailView.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(20, 20, 28, 0.7);
      border-radius: 18px;
      padding: 0;
      color: white;
      z-index: 1000;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      max-width: 600px;
      width: 90%;
      overflow: hidden;
      animation: fadeIn 0.4s ease-out, floatUp 0.5s ease-out;
      background-image: 
        linear-gradient(125deg, rgba(${color.replace(/[^\d,]/g, "")}, 0.08) 0%, 
        rgba(40, 40, 55, 0.3) 50%, 
        rgba(20, 20, 28, 0.5) 100%);
    `;

    // Add keyframe animations to head
    const style = document.createElement("style");
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes floatUp {
        from { transform: translateX(-50%) translateY(20px); }
        to { transform: translateX(-50%) translateY(0); }
      }
      @keyframes pulse {
        0% { box-shadow: 0 0 0 0 rgba(${color.replace(/[^\d,]/g, "")}, 0.7); }
        70% { box-shadow: 0 0 0 10px rgba(${color.replace(/[^\d,]/g, "")}, 0); }
        100% { box-shadow: 0 0 0 0 rgba(${color.replace(/[^\d,]/g, "")}, 0); }
      }
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `;
    document.head.appendChild(style);

    detailView.innerHTML = `
      <div class="alert-header" style="
        background: linear-gradient(135deg, ${color} 0%, rgba(${color.replace(
      /[^\d,]/g,
      ""
    )}, 0.7) 100%);
        background-size: 200% 200%;
        animation: gradientShift 5s ease infinite;
        color: white;
        padding: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      ">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 20px;
            animation: pulse 2s infinite;
          ">${icon}</div>
          <h2 style="margin: 0; font-size: 1.5rem; text-shadow: 0 2px 4px rgba(0,0,0,0.3);">${
            alert.eventName
          }</h2>
        </div>
        <button onclick="this.parentElement.parentElement.remove()" style="
          background: rgba(255, 255, 255, 0.15);
          border: none;
          color: white;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 16px;
          transition: all 0.2s ease;
          backdrop-filter: blur(5px);
        ">×</button>
      </div>
      
      <div class="alert-body" style="padding: 25px;">
        <div style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        ">
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            width: 48%;
          ">
            <span style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.6);">ISSUED</span>
            <span style="font-weight: 600; margin-top: 5px;">${issuedFormatted}</span>
          </div>
          <div style="
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 10px;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 12px;
            width: 48%;
            ${
              alert.expires && isExpiringSoon(alert.expires)
                ? "border: 1px solid rgba(255, 87, 87, 0.5);"
                : ""
            }
          ">
            <span style="font-size: 0.8rem; color: rgba(255, 255, 255, 0.6);">EXPIRES</span>
            <span style="font-weight: 600; margin-top: 5px; ${
              alert.expires && isExpiringSoon(alert.expires)
                ? "color: #ff5757;"
                : ""
            }">${expiresFormatted}</span>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div style="
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            padding: 15px;
            border: 1px solid rgba(255, 255, 255, 0.05);
          ">
            <h4 style="
              margin: 0 0 10px 0;
              color: ${color};
              font-size: 1rem;
              display: flex;
              align-items: center;
              gap: 8px;
            ">
              <span style="
                width: 8px;
                height: 8px;
                background: ${color};
                border-radius: 50%;
                display: inline-block;
              "></span>
              Alert Information
            </h4>
            <div style="color: rgba(255, 255, 255, 0.8); font-size: 0.9rem;">
              <p style="margin: 5px 0;">
                <span style="color: rgba(255, 255, 255, 0.5);">Source:</span> 
                ${alert.office || "National Weather Service"}
              </p>
              <p style="margin: 5px 0;">
                <span style="color: rgba(255, 255, 255, 0.5);">Event Code:</span> 
                ${alert.eventCode || "N/A"}
              </p>
            </div>
          </div>
          
          <div style="
            background: rgba(255, 255, 255, 0.03);
            border-radius: 12px;
            padding: 15px;
            border: 1px solid rgba(255, 255, 255, 0.05);
          ">
            <h4 style="
              margin: 0 0 10px 0;
              color: ${color};
              font-size: 1rem;
              display: flex;
              align-items: center;
              gap: 8px;
            ">
              <span style="
                width: 8px;
                height: 8px;
                background: ${color};
                border-radius: 50%;
                display: inline-block;
              "></span>
              Affected Areas
            </h4>
            <div style="
              color: rgba(255, 255, 255, 0.8);
              font-size: 0.9rem;
              max-height: 80px;
              overflow-y: auto;
              scrollbar-width: thin;
              scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
            ">
              <p style="margin: 5px 0;">${
                alert.counties ? alert.counties.join(", ") : "Not specified"
              }</p>
            </div>
          </div>
        </div>
        
        <div style="
          background: rgba(${color.replace(/[^\d,]/g, "")}, 0.05);
          border-radius: 12px;
          padding: 15px;
          border: 1px solid rgba(${color.replace(/[^\d,]/g, "")}, 0.1);
          margin-bottom: 20px;
        ">
          <h4 style="
            margin: 0 0 10px 0;
            color: ${color};
            font-size: 1rem;
            display: flex;
            align-items: center;
            gap: 8px;
          ">
            <span style="
              width: 8px;
              height: 8px;
              background: ${color};
              border-radius: 50%;
              display: inline-block;
            "></span>
            Threats & Impacts
          </h4>
          <div style="color: rgba(255, 255, 255, 0.8); font-size: 0.9rem;">
            ${threatsList}
          </div>
        </div>
        
        <div class="alert-actions" style="
          display: flex;
          justify-content: flex-end;
          margin-top: 15px;
        ">
          <button class="view-full-alert" style="
            background: ${color};
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 15px rgba(${color.replace(/[^\d,]/g, "")}, 0.3);
            transition: all 0.2s ease;
          ">
            <span>View Full Alert</span>
            <span>→</span>
          </button>
        </div>
      </div>
    `;

    // Remove existing alert detail if present
    const existingDetail = document.getElementById("alert-detail");
    if (existingDetail) {
      existingDetail.remove();
    }

    document.body.appendChild(detailView);
  } catch (error) {
    console.error("Error in showDetailedAlert:", error);
    const errorView = document.createElement("div");
    errorView.style.cssText = `
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(220, 38, 38, 0.9);
      color: white;
      padding: 15px 30px;
      border-radius: 12px;
      backdrop-filter: blur(10px);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      animation: slideUp 0.3s ease;
    `;
    errorView.textContent =
      "Unable to display alert details. Please try again.";
    document.body.appendChild(errorView);
    setTimeout(() => errorView.remove(), 3000);
  }
}

// Helper function to convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(
        result[3],
        16
      )}`
    : "255, 255, 255";
}

// Add necessary CSS to your stylesheet dynamically
const styles = `
  @keyframes slideUp {
    from { transform: translateX(-50%) translateY(100%); }
    to { transform: translateX(-50%) translateY(0); }
  }

  #alert-dropdown {
    animation: fadeIn 0.2s ease-out;
  }

  #alert-detail {
    animation: slideUp 0.3s ease-out;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);

// Initialize the click handler on map load

function getAlertColor(eventCodeOrName) {
  if (!eventCodeOrName) return "#CCCCCC";

  // First check if it's a two-letter event code
  if (eventCodeOrName.length === 2) {
    const codeColors = {
      TO: "#FF0000", // Tornado
      SV: "#FFA500", // Severe Thunderstorm
      FF: "#00FF00", // Flash Flood
      FL: "#00FFFF", // Flood
      WS: "#0000FF", // Winter Storm
      WW: "#800080", // Winter Weather
      HU: "#FFC0CB", // Hurricane
      TY: "#FFC0CB", // Typhoon
      TR: "#FFC0CB", // Tropical Storm
      BZ: "#FFFFFF", // Blizzard
      HS: "#FFD700", // Heat
      EH: "#FFD700", // Excessive Heat
      HW: "#FFD700", // High Wind
      FW: "#FF4500", // Fire Weather
      RH: "#DDA0DD", // Radiological Hazard
      EC: "#FFD700", // Evacuation
      EVI: "#FFD700", // Evacuation Immediate
      HMW: "#DDA0DD", // Hazardous Materials Warning
      NUW: "#DDA0DD", // Nuclear Power Plant Warning
      SPW: "#DDA0DD", // Shelter in Place Warning
      VOW: "#DDA0DD", // Volcano Warning
      AF: "#FF7F50", // Ashfall
      AVW: "#C0C0C0", // Avalanche Warning
      CAE: "#800000", // Child Abduction Emergency
      CDW: "#008080", // Civil Danger Warning
      CEM: "#008080", // Civil Emergency Message
      CF: "#DAA520", // Coastal Flood
      CFW: "#DAA520", // Coastal Flood Warning
      DSW: "#8B4513", // Dust Storm Warning
      EQW: "#800000", // Earthquake Warning
      FRW: "#FF00FF", // Fire Warning
      HLS: "#000000", // Hurricane Local Statement
      LEW: "#800000", // Law Enforcement Warning
      LAE: "#800000", // Local Area Emergency
      TS: "#808000", // Tsunami
      TSW: "#808000", // Tsunami Warning
      SSW: "#FFD700", // Storm Surge Warning
      TOW: "#FF0000", // Tornado Warning
      TRW: "#FFC0CB", // Tropical Storm Warning
      WIW: "#0000FF", // Wind
      SPS: "#FFD700", // Special Weather Statement
    };

    if (codeColors[eventCodeOrName]) {
      return codeColors[eventCodeOrName];
    }

    // Handle codes like "TO.W" by checking the first two characters
    if (eventCodeOrName.includes(".")) {
      const mainCode = eventCodeOrName.substring(0, 2);
      if (codeColors[mainCode]) {
        return codeColors[mainCode];
      }
    }
  }

  // If not a code or code not found, try matching the event name
  const nameColors = {
    // --- Tornado Related ---
    "Tornado Warning": "#FF0000", // Bright Red - Standard Tornado Warning
    "Observed Tornado Warning": "#FF00FF", // Magenta
    "Radar Confirmed Tornado Warning": "#FF00FF", // Magenta
    "Spotter Confirmed Tornado Warning": "#FF00FF", // Magenta
    "Public Confirmed Tornado Warning": "#FF00FF", // Magenta
    "PDS Tornado Warning": "#FF00FF", // Magenta - Particularly Dangerous Situation Tornado Warning
    "Tornado Emergency": "#850085", // Dark Purple - Gravest Tornado Threat
    "Tornado Watch": "#8B0000", // Dark Red - Tornado Watch

    // --- Severe Thunderstorm Related ---
    "Severe Thunderstorm Warning": "#FF8000", // Orange
    "Considerable Severe Thunderstorm Warning": "#FF6347", // Tomato
    "Destructive Severe Thunderstorm Warning": "#FF4500", // OrangeRed
    "Severe Thunderstorm Watch": "#DB7093", // Pale Violet Red

    // --- Flood Related ---
    "Flash Flood Warning": "#228B22", // Forest Green
    "Flash Flood Emergency": "#8B0000", // Dark Red
    "Flood Warning": "#3CB371", // Medium Sea Green
    "Flood Watch": "#66CDAA", // Medium Aquamarine
    "Flood Advisory": "#9ACD32", // Yellow Green
    "Coastal Flood Warning": "#4682B4", // Steel Blue
    "Coastal Flood Watch": "#87CEEB", // Sky Blue
    "Coastal Flood Advisory": "#ADD8E6", // Light Blue

    // --- Winter Weather Related ---
    "Winter Weather Advisory": "#7B68EE", // Medium Slate Blue
    "Winter Storm Warning": "#FF69B4", // Hot Pink
    "Winter Storm Watch": "#6699CC", // Light Steel Blue
    "Ice Storm Warning": "#8B008B", // Dark Magenta
    "Blizzard Warning": "#FF4500", // OrangeRed
    "Snow Squall Warning": "#64B5F6", // Light Blue
    "Freezing Rain Advisory": "#008080", // Teal
    "Freezing Fog Advisory": "#008080", // Teal
    "Sleet Advisory": "#B0E0E6", // Powder Blue
    "Lake Effect Snow Warning": "#4169E1", // Royal Blue
    "Lake Effect Snow Advisory": "#87CEFA", // Light Sky Blue

    // --- Wind Related ---
    "High Wind Warning": "#DAA520", // Goldenrod
    "High Wind Watch": "#B8860B", // Dark Goldenrod
    "Wind Advisory": "#D2B48C", // Tan
    "Gale Warning": "#008B8B", // Dark Cyan
    "Storm Warning": "#483D8B", // Dark Slate Blue
    "Hurricane Force Wind Warning": "#8B0000", // Dark Red

    // --- Extreme Temperature Related ---
    "Excessive Heat Warning": "#FFD700", // Gold
    "Heat Advisory": "#F0E68C", // Khaki
    "Excessive Wind Chill Warning": "#ADD8E6", // Light Blue
    "Wind Chill Advisory": "#B0C4DE", // Light Steel Blue
    "Freeze Warning": "#6A5ACD", // Slate Blue
    "Hard Freeze Warning": "#483D8B", // Dark Slate Blue

    // --- Fire Weather Related ---
    "Red Flag Warning": "#B22222", // FireBrick
    "Fire Weather Watch": "#CD5C5C", // IndianRed

    // --- Coastal & Marine (non-wind/non-flood) ---
    "High Surf Advisory": "#4682B4", // Steel Blue
    "Rip Current Statement": "#1E90FF", // DodgerBlue
    "Small Craft Advisory": "#5F9EA0", // CadetBlue

    // --- Air Quality / Dust / Smoke ---
    "Dense Fog Advisory": "#708090", // Slate Gray
    "Dust Advisory": "#BDB76B", // Dark Khaki
    "Dust Storm Warning": "#8B4513", // Saddle Brown
    "Air Quality Alert": "#A9A9A9", // Dark Gray
    "Dense Smoke Advisory": "#696969", // Dim Gray

    // --- Tropical Cyclones ---
    "Hurricane Warning": "#8B0000", // Dark Red
    "Hurricane Watch": "#DC143C", // Crimson
    "Tropical Storm Warning": "#FF4500", // OrangeRed
    "Tropical Storm Watch": "#FFA07A", // LightSalmon
    "Tropical Depression": "#FFB6C1", // LightPink
    "Storm Surge Warning": "#800000", // Maroon
    "Storm Surge Watch": "#A52A2A", // Brown

    // --- Geological / Rare Events ---
    "Tsunami Warning": "#8B0000", // Dark Red
    "Tsunami Watch": "#DC143C", // Crimson
    "Tsunami Advisory": "#FF4500", // OrangeRed
    "Volcanic Ash Advisory": "#8B4513", // SaddleBrown

    // --- General / Information ---
    "Special Weather Statement": "#FFE4B5", // Moccasin
    "Mesoscale Discussion": "#0066ff", // Blue
    "Hazardous Weather Outlook": "#808080", // Gray
    "Hydrologic Outlook": "#B0C4DE", // Light Steel Blue
    "Beach Hazards Statement": "#F4A460", // SandyBrown
  };

  return nameColors[eventCodeOrName] || "rgba(255, 255, 255, 0.9)"; // Default for unknown alerts
}

function getAlertColor(eventCodeOrName) {
  if (!eventCodeOrName) return "#CCCCCC";

  // First check if it's a two-letter event code
  if (eventCodeOrName.length === 2) {
    const codeColors = {
      TO: "#FF0000", // Tornado
      SV: "#FFA500", // Severe Thunderstorm
      FF: "#00FF00", // Flash Flood
      FL: "#00FFFF", // Flood
      WS: "#0000FF", // Winter Storm
      WW: "#800080", // Winter Weather
      HU: "#FFC0CB", // Hurricane
      TY: "#FFC0CB", // Typhoon
      TR: "#FFC0CB", // Tropical Storm
      BZ: "#FFFFFF", // Blizzard
      HS: "#FFD700", // Heat
      EH: "#FFD700", // Excessive Heat
      HW: "#FFD700", // High Wind
      FW: "#FF4500", // Fire Weather
      RH: "#DDA0DD", // Radiological Hazard
      EC: "#FFD700", // Evacuation
      EVI: "#FFD700", // Evacuation Immediate
      HMW: "#DDA0DD", // Hazardous Materials Warning
      NUW: "#DDA0DD", // Nuclear Power Plant Warning
      SPW: "#DDA0DD", // Shelter in Place Warning
      VOW: "#DDA0DD", // Volcano Warning
      AF: "#FF7F50", // Ashfall
      AVW: "#C0C0C0", // Avalanche Warning
      CAE: "#800000", // Child Abduction Emergency
      CDW: "#008080", // Civil Danger Warning
      CEM: "#008080", // Civil Emergency Message
      CF: "#DAA520", // Coastal Flood
      CFW: "#DAA520", // Coastal Flood Warning
      DSW: "#8B4513", // Dust Storm Warning
      EQW: "#800000", // Earthquake Warning
      FRW: "#FF00FF", // Fire Warning
      HLS: "#000000", // Hurricane Local Statement
      LEW: "#800000", // Law Enforcement Warning
      LAE: "#800000", // Local Area Emergency
      TS: "#808000", // Tsunami
      TSW: "#808000", // Tsunami Warning
      SSW: "#FFD700", // Storm Surge Warning
      TOW: "#FF0000", // Tornado Warning
      TRW: "#FFC0CB", // Tropical Storm Warning
      WIW: "#0000FF", // Wind
      SPS: "#FFD700", // Special Weather Statement
    };

    if (codeColors[eventCodeOrName]) {
      return codeColors[eventCodeOrName];
    }

    // Handle codes like "TO.W" by checking the first two characters
    if (eventCodeOrName.includes(".")) {
      const mainCode = eventCodeOrName.substring(0, 2);
      if (codeColors[mainCode]) {
        return codeColors[mainCode];
      }
    }
  }

  // If not a code or code not found, try matching the event name
  const nameColors = {
    // --- Tornado Related ---
    "Tornado Warning": "#FF0000", // Bright Red - Standard Tornado Warning
    "Observed Tornado Warning": "#FF00FF", // Magenta
    "Radar Confirmed Tornado Warning": "#FF00FF", // Magenta
    "Spotter Confirmed Tornado Warning": "#FF00FF", // Magenta
    "Public Confirmed Tornado Warning": "#FF00FF", // Magenta
    "PDS Tornado Warning": "#FF00FF", // Magenta - Particularly Dangerous Situation Tornado Warning
    "Tornado Emergency": "#850085", // Dark Purple - Gravest Tornado Threat
    "Tornado Watch": "#8B0000", // Dark Red - Tornado Watch

    // --- Severe Thunderstorm Related ---
    "Severe Thunderstorm Warning": "#FF8000", // Orange
    "Considerable Severe Thunderstorm Warning": "#FF6347", // Tomato
    "Destructive Severe Thunderstorm Warning": "#FF4500", // OrangeRed
    "Severe Thunderstorm Watch": "#DB7093", // Pale Violet Red

    // --- Flood Related ---
    "Flash Flood Warning": "#228B22", // Forest Green
    "Flash Flood Emergency": "#8B0000", // Dark Red
    "Flood Warning": "#3CB371", // Medium Sea Green
    "Flood Watch": "#66CDAA", // Medium Aquamarine
    "Flood Advisory": "#9ACD32", // Yellow Green
    "Coastal Flood Warning": "#4682B4", // Steel Blue
    "Coastal Flood Watch": "#87CEEB", // Sky Blue
    "Coastal Flood Advisory": "#ADD8E6", // Light Blue

    // --- Winter Weather Related ---
    "Winter Weather Advisory": "#7B68EE", // Medium Slate Blue
    "Winter Storm Warning": "#FF69B4", // Hot Pink
    "Winter Storm Watch": "#6699CC", // Light Steel Blue
    "Ice Storm Warning": "#8B008B", // Dark Magenta
    "Blizzard Warning": "#FF4500", // OrangeRed
    "Snow Squall Warning": "#64B5F6", // Light Blue
    "Freezing Rain Advisory": "#008080", // Teal
    "Freezing Fog Advisory": "#008080", // Teal
    "Sleet Advisory": "#B0E0E6", // Powder Blue
    "Lake Effect Snow Warning": "#4169E1", // Royal Blue
    "Lake Effect Snow Advisory": "#87CEFA", // Light Sky Blue

    // --- Wind Related ---
    "High Wind Warning": "#DAA520", // Goldenrod
    "High Wind Watch": "#B8860B", // Dark Goldenrod
    "Wind Advisory": "#D2B48C", // Tan
    "Gale Warning": "#008B8B", // Dark Cyan
    "Storm Warning": "#483D8B", // Dark Slate Blue
    "Hurricane Force Wind Warning": "#8B0000", // Dark Red

    // --- Extreme Temperature Related ---
    "Excessive Heat Warning": "#FFD700", // Gold
    "Heat Advisory": "#F0E68C", // Khaki
    "Excessive Wind Chill Warning": "#ADD8E6", // Light Blue
    "Wind Chill Advisory": "#B0C4DE", // Light Steel Blue
    "Freeze Warning": "#6A5ACD", // Slate Blue
    "Hard Freeze Warning": "#483D8B", // Dark Slate Blue

    // --- Fire Weather Related ---
    "Red Flag Warning": "#B22222", // FireBrick
    "Fire Weather Watch": "#CD5C5C", // IndianRed

    // --- Coastal & Marine (non-wind/non-flood) ---
    "High Surf Advisory": "#4682B4", // Steel Blue
    "Rip Current Statement": "#1E90FF", // DodgerBlue
    "Small Craft Advisory": "#5F9EA0", // CadetBlue

    // --- Air Quality / Dust / Smoke ---
    "Dense Fog Advisory": "#708090", // Slate Gray
    "Dust Advisory": "#BDB76B", // Dark Khaki
    "Dust Storm Warning": "#8B4513", // Saddle Brown
    "Air Quality Alert": "#A9A9A9", // Dark Gray
    "Dense Smoke Advisory": "#696969", // Dim Gray

    // --- Tropical Cyclones ---
    "Hurricane Warning": "#8B0000", // Dark Red
    "Hurricane Watch": "#DC143C", // Crimson
    "Tropical Storm Warning": "#FF4500", // OrangeRed
    "Tropical Storm Watch": "#FFA07A", // LightSalmon
    "Tropical Depression": "#FFB6C1", // LightPink
    "Storm Surge Warning": "#800000", // Maroon
    "Storm Surge Watch": "#A52A2A", // Brown

    // --- Geological / Rare Events ---
    "Tsunami Warning": "#8B0000", // Dark Red
    "Tsunami Watch": "#DC143C", // Crimson
    "Tsunami Advisory": "#FF4500", // OrangeRed
    "Volcanic Ash Advisory": "#8B4513", // SaddleBrown

    // --- General / Information ---
    "Special Weather Statement": "#FFE4B5", // Moccasin
    "Mesoscale Discussion": "#0066ff", // Blue
    "Hazardous Weather Outlook": "#808080", // Gray
    "Hydrologic Outlook": "#B0C4DE", // Light Steel Blue
    "Beach Hazards Statement": "#F4A460", // SandyBrown
  };

  return nameColors[eventCodeOrName] || "rgba(255, 255, 255, 0.9)"; // Default for unknown alerts
}

// Helper function to create custom marker
function createAlertMarker(title, icon, color) {
  const el = document.createElement("div");
  el.className = "alert-marker";
  el.style.backgroundColor = color;
  el.style.color = "#fff";
  el.style.borderRadius = "50%";
  el.style.width = "30px";
  el.style.height = "30px";
  el.style.display = "flex";
  el.style.alignItems = "center";
  el.style.justifyContent = "center";
  el.style.fontSize = "18px";
  el.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
  el.innerHTML = icon;
  el.title = title;
  return el;
}

// Function to get bounds from a polygon
function getBoundsFromPolygon(polygon) {
  let minLat = 90,
    maxLat = -90,
    minLng = 180,
    maxLng = -180;

  if (
    polygon.type === "Polygon" &&
    polygon.coordinates &&
    polygon.coordinates.length > 0
  ) {
    const coords = polygon.coordinates[0]; // Outer ring

    for (const coord of coords) {
      const lng = coord[0];
      const lat = coord[1];

      minLat = Math.min(minLat, lat);
      maxLat = Math.max(maxLat, lat);
      minLng = Math.min(minLng, lng);
      maxLng = Math.max(maxLng, lng);
    }
  }

  return { minLat, maxLat, minLng, maxLng };
}

// Function to add county-based alert
function addAlertCounties(alert) {
  // For county-based alerts, we'll add a marker at an approximate center
  // In a real app, you'd geocode the counties to get precise locations

  // Here's a simple approximation - using the first county as the marker location
  // In a production app, you'd want to use a geocoding service to get proper coordinates

  const firstCounty = alert.counties[0];
  // For demo purposes, we're placing it at a fixed location
  // You should replace this with actual geocoding in production
  const center = [-95 + Math.random() * 30, 35 + Math.random() * 10]; // Random position in the US

  addAlertMarker(alert, center);
}

// Function to add an alert marker
function addAlertMarker(alert, position) {
  return;
}

// Function to show alert details dropdown
// Improved alert panel when clicked
function showAlertDetails(alert) {
  // Get icon and color based on event code
  const icon = icons[alert.eventCode] || "⚠️";
  const color = getAlertColor(alert.eventCode);

  // Format expiration date
  const expiresFormatted = alert.expires ? formatDate(alert.expires) : "N/A";

  // Format issued date
  const issuedFormatted = alert.effective ? formatDate(alert.effective) : "N/A";

  // Build threats section
  let threatsList = buildThreatsList(alert);

  // Create alert details HTML
  const alertHTML = `
    <div class="alert-details" style="border-left: 5px solid ${color}; box-shadow: 0 3px 10px rgba(0,0,0,0.2); border-radius: 8px; overflow: hidden;">
      <div class="alert-header" style="background: ${color}; color: white; padding: 15px; display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0; font-size: 1.4rem;">${icon} ${
    alert.eventName
  }</h3>
        <span class="alert-close" style="cursor: pointer; font-size: 20px;">×</span>
      </div>
      
      <div class="alert-body" style="padding: 15px; background: #fff;">
        <div class="alert-time-info" style="display: flex; justify-content: space-between; margin-bottom: 15px; color: #555; font-size: 0.9rem;">
          <div>Issued: <span style="font-weight: bold;">${issuedFormatted}</span></div>
          <div>Expires: <span style="font-weight: bold; ${
            isExpiringSoon(alert.expires) ? "color: #f44336;" : ""
          }">${expiresFormatted}</span></div>
        </div>
        
        <div class="alert-locations" style="margin-bottom: 15px;">
          <h4 style="margin: 0 0 8px 0; color: #333; border-bottom: 1px solid #eee; padding-bottom: 5px;">Affected Areas</h4>
          <p style="margin: 0;">${alert.counties.join(", ")}</p>
        </div>
        
        ${threatsList}
        
        <div class="alert-actions" style="margin-top: 15px; display: flex; justify-content: flex-end;">
          <button class="view-full-alert" style="background: ${color}; color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer;">View Full Alert</button>
        </div>
      </div>
    </div>
  `;

  // Create or update alert panel
  const alertPanel =
    document.getElementById("alert-panel") || createAlertPanel();
  alertPanel.innerHTML = alertHTML;

  // Add event listeners
  alertPanel.querySelector(".alert-close").addEventListener("click", () => {
    alertPanel.style.display = "none";
  });

  alertPanel.querySelector(".view-full-alert").addEventListener("click", () => {
    showFullAlertText(alert.rawText);
  });
}

// Helper function to check if alert is expiring soon (within 30 minutes)
function isExpiringSoon(expiresDate) {
  if (!expiresDate) return false;
  const expires = new Date(expiresDate);
  const now = new Date();
  return expires - now < 30 * 60 * 1000; // 30 minutes in milliseconds
}

// Helper function to create alert panel container
function createAlertPanel() {
  const panel = document.createElement("div");
  panel.id = "alert-panel";
  panel.style.position = "absolute";
  panel.style.top = "50px";
  panel.style.right = "10px";
  panel.style.width = "350px";
  panel.style.zIndex = "1000";
  panel.style.transition = "all 0.3s ease-in-out";
  document.body.appendChild(panel);
  return panel;
}

// Build enhanced threats list
function buildThreatsList(alert) {
  if (!alert.threats) return "";

  const threats = [];
  const threatIcons = {
    tornado: "🌪️",
    damage: "💥",
    wind: "💨",
    hail: "🧊",
    flood: "🌊",
  };

  if (alert.threats.tornadoDetection) {
    threats.push(`
      <div class="threat-item" style="display: flex; align-items: center; margin-bottom: 8px;">
        <div style="margin-right: 10px; font-size: 1.2rem;">${threatIcons.tornado}</div>
        <div>
          <div style="font-weight: bold;">Tornado</div>
          <div>${alert.threats.tornadoDetection}</div>
        </div>
      </div>
    `);
  }

  if (alert.threats.tornadoDamageThreat) {
    threats.push(`
      <div class="threat-item" style="display: flex; align-items: center; margin-bottom: 8px;">
        <div style="margin-right: 10px; font-size: 1.2rem;">${threatIcons.damage}</div>
        <div>
          <div style="font-weight: bold;">Tornado Damage Threat</div>
          <div>${alert.threats.tornadoDamageThreat}</div>
        </div>
      </div>
    `);
  }

  if (alert.threats.thunderstormDamageThreat) {
    threats.push(`
      <div class="threat-item" style="display: flex; align-items: center; margin-bottom: 8px;">
        <div style="margin-right: 10px; font-size: 1.2rem;">${threatIcons.damage}</div>
        <div>
          <div style="font-weight: bold;">Thunderstorm Damage Threat</div>
          <div>${alert.threats.thunderstormDamageThreat}</div>
        </div>
      </div>
    `);
  }

  if (alert.threats.flashFloodDamageThreat) {
    threats.push(`
      <div class="threat-item" style="display: flex; align-items: center; margin-bottom: 8px;">
        <div style="margin-right: 10px; font-size: 1.2rem;">${threatIcons.flood}</div>
        <div>
          <div style="font-weight: bold;">Flash Flood Damage Threat</div>
          <div>${alert.threats.flashFloodDamageThreat}</div>
        </div>
      </div>
    `);
  }

  if (alert.threats.hailThreat) {
    threats.push(`
      <div class="threat-item" style="display: flex; align-items: center; margin-bottom: 8px;">
        <div style="margin-right: 10px; font-size: 1.2rem;">${
          threatIcons.hail
        }</div>
        <div>
          <div style="font-weight: bold;">Hail Threat</div>
          <div>${alert.threats.hailThreat}${
      alert.threats.maxHailSize
        ? ` - Max Size: ${alert.threats.maxHailSize}`
        : ""
    }</div>
        </div>
      </div>
    `);
  }

  if (alert.threats.windThreat) {
    threats.push(`
      <div class="threat-item" style="display: flex; align-items: center; margin-bottom: 8px;">
        <div style="margin-right: 10px; font-size: 1.2rem;">${
          threatIcons.wind
        }</div>
        <div>
          <div style="font-weight: bold;">Wind Threat</div>
          <div>${alert.threats.windThreat}${
      alert.threats.maxWindGust
        ? ` - Max Gust: ${alert.threats.maxWindGust}`
        : ""
    }</div>
        </div>
      </div>
    `);
  }

  if (threats.length > 0) {
    return `
      <div class="threat-section" style="margin-bottom: 15px;">
        <h4 style="margin: 0 0 10px 0; color: #333; border-bottom: 1px solid #eee; padding-bottom: 5px;">Threat Information</h4>
        <div>${threats.join("")}</div>
      </div>
    `;
  }

  return "";
}

// Show full alert text in a modal
function showFullAlertText(rawText) {
  // Create modal backdrop
  const backdrop = document.createElement("div");
  backdrop.style.position = "fixed";
  backdrop.style.top = "0";
  backdrop.style.left = "0";
  backdrop.style.right = "0";
  backdrop.style.bottom = "0";
  backdrop.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
  backdrop.style.zIndex = "2000";
  backdrop.style.display = "flex";
  backdrop.style.justifyContent = "center";
  backdrop.style.alignItems = "center";

  // Create modal content
  const modal = document.createElement("div");
  modal.style.backgroundColor = "white";
  modal.style.borderRadius = "8px";
  modal.style.maxWidth = "600px";
  modal.style.width = "90%";
  modal.style.maxHeight = "80vh";
  modal.style.overflowY = "auto";
  modal.style.position = "relative";

  // Create close button
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "×";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "10px";
  closeBtn.style.right = "10px";
  closeBtn.style.background = "none";
  closeBtn.style.border = "none";
  closeBtn.style.fontSize = "24px";
  closeBtn.style.cursor = "pointer";

  // Create content
  const content = document.createElement("div");
  content.style.padding = "20px";
  content.innerHTML = `<pre style="white-space: pre-wrap; font-family: monospace;">${rawText}</pre>`;

  // Assemble modal
  modal.appendChild(closeBtn);
  modal.appendChild(content);
  backdrop.appendChild(modal);

  // Add to document
  document.body.appendChild(backdrop);

  // Add event listeners
  closeBtn.addEventListener("click", () => {
    document.body.removeChild(backdrop);
  });

  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      document.body.removeChild(backdrop);
    }
  });
}

// Function to close alert details when clicking outside
function closeAlertDetailsOutside(event) {
  if (
    alertDetailsElement &&
    !alertDetailsElement.contains(event.target) &&
    !event.target.closest(".alert-marker")
  ) {
    alertDetailsElement.remove();
    alertDetailsElement = null;
    document.removeEventListener("click", closeAlertDetailsOutside);
  }
}

// Function to show the full alert details modal
function showFullAlertDetails(alert) {
  // Remove the dropdown
  if (alertDetailsElement) {
    alertDetailsElement.remove();
    alertDetailsElement = null;
  }

  // Create the modal
  const modal = document.createElement("div");
  modal.className = "alert-modal";
  modal.id = "alert-modal";

  // Style the modal
  Object.assign(modal.style, {
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  });

  const alertColor = getAlertColor(alert.eventCode);

  // Build the modal content
  const modalContent = document.createElement("div");
  Object.assign(modalContent.style, {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    maxWidth: "700px",
    width: "80%",
    maxHeight: "80vh",
    overflowY: "auto",
    position: "relative",
  });

  // Add a close button
  const closeButton = document.createElement("button");
  closeButton.textContent = "×";
  Object.assign(closeButton.style, {
    position: "absolute",
    top: "10px",
    right: "15px",
    background: "none",
    border: "none",
    fontSize: "24px",
    cursor: "pointer",
    color: "#333",
  });
  closeButton.addEventListener("click", () => modal.remove());

  // Format expiration date if available
  const expiresFormatted = alert.expires ? formatDate(alert.expires) : "N/A";

  // Create alert threat list
  let threatsList = "";
  if (alert.threats) {
    const threats = [];
    if (alert.threats.tornadoDetection)
      threats.push(`<li>Tornado: ${alert.threats.tornadoDetection}</li>`);
    if (alert.threats.tornadoDamageThreat)
      threats.push(
        `<li>Tornado Damage Threat: ${alert.threats.tornadoDamageThreat}</li>`
      );
    if (alert.threats.thunderstormDamageThreat)
      threats.push(
        `<li>Thunderstorm Damage Threat: ${alert.threats.thunderstormDamageThreat}</li>`
      );
    if (alert.threats.flashFloodDamageThreat)
      threats.push(
        `<li>Flash Flood Damage Threat: ${alert.threats.flashFloodDamageThreat}</li>`
      );
    if (alert.threats.hailThreat)
      threats.push(`<li>Hail Threat: ${alert.threats.hailThreat}</li>`);
    if (alert.threats.maxHailSize)
      threats.push(`<li>Max Hail Size: ${alert.threats.maxHailSize}</li>`);
    if (alert.threats.windThreat)
      threats.push(`<li>Wind Threat: ${alert.threats.windThreat}</li>`);
    if (alert.threats.maxWindGust)
      threats.push(`<li>Max Wind Gust: ${alert.threats.maxWindGust}</li>`);

    if (threats.length > 0) {
      threatsList = `
        <div class="threat-section">
          <h4>Threat Information</h4>
          <ul>${threats.join("")}</ul>
        </div>
      `;
    }
  }

  // Build modal HTML
  modalContent.innerHTML = `
    <header style="border-bottom: 3px solid ${alertColor}; padding-bottom: 10px; margin-bottom: 15px;">
      <div style="display: flex; align-items: center;">
        <div style="background-color: ${alertColor}; width: 40px; height: 40px; border-radius: 50%; margin-right: 15px; display: flex; justify-content: center; align-items: center; color: white; font-size: 20px;">
          ${getAlertIcon(alert.eventCode)}
        </div>
        <h2 style="margin: 0; color: ${alertColor};">${alert.eventName}</h2>
      </div>
    </header>
    
    <div class="alert-content" style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
      <div class="alert-meta">
        <div class="alert-section">
          <h4>Alert Information</h4>
          <p><strong>Event Code:</strong> ${alert.eventCode || "N/A"}</p>
          <p><strong>Issued By:</strong> ${
            alert.office || "National Weather Service"
          }</p>
          <p><strong>Expires:</strong> ${expiresFormatted}</p>
        </div>
        
        <div class="alert-section">
          <h4>Affected Areas</h4>
          <p>${alert.counties.join(", ")}</p>
        </div>
        
        ${threatsList}
      </div>
      
      <div class="alert-raw-text" style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; font-family: monospace; font-size: 12px; white-space: pre-wrap; overflow-x: auto;">
        ${alert.rawText || "No additional details available."}
      </div>
    </div>
  `;

  modalContent.appendChild(closeButton);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);

  // Close modal when clicking outside
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });
}

// Function to update an existing alert on the map
function updateAlertOnMap(alert) {
  // Remove the old alert first
  removeAlertFromMap(alert.id);
  // Then add the updated alert
  addAlertToMap(alert);
}

// Function to remove an alert from the map
function removeAlertFromMap(alertId) {
  const alert = activeAlerts.get(alertId);
  if (!alert) return;

  // Remove the marker if it exists
  if (alert.marker) {
    alert.marker.remove();
  }

  // Remove the polygon layers if they exist
  if (mapInstance.getLayer(`alert-fill-${alertId}`)) {
    mapInstance.removeLayer(`alert-fill-${alertId}`);
  }

  if (mapInstance.getLayer(`alert-line-${alertId}`)) {
    mapInstance.removeLayer(`alert-line-${alertId}`);
  }

  // Remove the source if it exists
  if (mapInstance.getSource(`alert-${alertId}`)) {
    mapInstance.removeSource(`alert-${alertId}`);
  }

  // Remove from our collection
  activeAlerts.delete(alertId);

  // If this was the selected alert, remove the details panel
  if (selectedAlert && selectedAlert.id === alertId && alertDetailsElement) {
    alertDetailsElement.remove();
    alertDetailsElement = null;
    selectedAlert = null;
  }
}

// Helper function to get alert color based on event code
function getAlertColor(eventCode) {
  if (!eventCode) return "#CCCCCC";

  const colors = {
    TO: "#FF0000", // Tornado
    SV: "#FFA500", // Severe Thunderstorm
    FF: "#00FF00", // Flash Flood
    FL: "#00FFFF", // Flood
    WS: "#0000FF", // Winter Storm
    WW: "#800080", // Winter Weather
    HU: "#FFC0CB", // Hurricane
    TY: "#FFC0CB", // Typhoon
    TR: "#FFC0CB", // Tropical Storm
    BZ: "#FFFFFF", // Blizzard
    HS: "#FFD700", // Heat
    EH: "#FFD700", // Excessive Heat
    HW: "#FFD700", // High Wind
    FW: "#FF4500", // Fire Weather
    RH: "#DDA0DD", // Radiological Hazard
    EC: "#FFD700", // Evacuation
    EVI: "#FFD700", // Evacuation Immediate
    HMW: "#DDA0DD", // Hazardous Materials Warning
    NUW: "#DDA0DD", // Nuclear Power Plant Warning
    SPW: "#DDA0DD", // Shelter in Place Warning
    VOW: "#DDA0DD", // Volcano Warning
    AF: "#FF7F50", // Ashfall
    AVW: "#C0C0C0", // Avalanche Warning
    CAE: "#800000", // Child Abduction Emergency
    CDW: "#008080", // Civil Danger Warning
    CEM: "#008080", // Civil Emergency Message
    CF: "#DAA520", // Coastal Flood
    CFW: "#DAA520", // Coastal Flood Warning
    DSW: "#8B4513", // Dust Storm Warning
    EQW: "#800000", // Earthquake Warning
    FRW: "#FF00FF", // Fire Warning
    HLS: "#000000", // Hurricane Local Statement
    LEW: "#800000", // Law Enforcement Warning
    LAE: "#800000", // Local Area Emergency
    TS: "#808000", // Tsunami
    TSW: "#808000", // Tsunami Warning
    SSW: "#FFD700", // Storm Surge Warning
    TOW: "#FF0000", // Tornado Warning
    TRW: "#FFC0CB", // Tropical Storm Warning
    WIW: "#0000FF", // Wind
    SPS: "#FFD700", // Special Weather Statement
  };

  // Handle event codes like "TO.W" by checking the first two characters
  const mainCode = eventCode.substring(0, 2);
  return colors[mainCode] || colors[eventCode] || "#CCCCCC";
}

// Helper function to get alert icon based on event code
function getAlertIcon(eventCode) {
  if (!eventCode) return "⚠️";

  const icons = {
    TO: "🌪️", // Tornado
    SV: "⛈️", // Severe Thunderstorm
    FF: "🌊", // Flash Flood
    FL: "💧", // Flood
    WS: "❄️", // Winter Storm
    WW: "🌨️", // Winter Weather
    HU: "🌀", // Hurricane
    TY: "🌀", // Typhoon
    TR: "🌀", // Tropical Storm
    BZ: "❄️", // Blizzard
    HS: "🔥", // Heat
    EH: "🔥", // Excessive Heat
    HW: "💨", // High Wind
    FW: "🔥", // Fire Weather
    RH: "☢️", // Radiological Hazard
    EC: "🚗", // Evacuation
    EVI: "🏃", // Evacuation Immediate
    HMW: "☣️", // Hazardous Materials Warning
    NUW: "☢️", // Nuclear Power Plant Warning
    SPW: "🏠", // Shelter in Place Warning
    VOW: "🌋", // Volcano Warning
    AF: "🌋", // Ashfall
    AVW: "⛰️", // Avalanche Warning
    CAE: "👶", // Child Abduction Emergency
    CDW: "⚠️", // Civil Danger Warning
    CEM: "⚠️", // Civil Emergency Message
    CF: "🌊", // Coastal Flood
    CFW: "🌊", // Coastal Flood Warning
    DSW: "💨", // Dust Storm Warning
    EQW: "🏚️", // Earthquake Warning
    FRW: "🔥", // Fire Warning
    HLS: "🌀", // Hurricane Local Statement
    LEW: "👮", // Law Enforcement Warning
    LAE: "⚠️", // Local Area Emergency
    TS: "🌊", // Tsunami
    TSW: "🌊", // Tsunami Warning
    SSW: "🌊", // Storm Surge Warning
    TOW: "🌪️", // Tornado Warning
    TRW: "🌀", // Tropical Storm Warning
    WIW: "💨", // Wind
    SPS: "⚠️", // Special Weather Statement
  };

  // Handle event codes like "TO.W" by checking the first two characters
  const mainCode = eventCode.substring(0, 2);
  return icons[mainCode] || icons[eventCode] || "⚠️";
}

// Helper function to format dates
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// Call this function after the map is initialized
function initializeWeatherAlerts() {
  // Add a CSS class for alert markers
  const style = document.createElement("style");
  style.textContent = `
    .alert-marker {
      transition: transform 0.2s ease;
    }
    .alert-marker:hover {
      transform: scale(1.2);
    }
  `;
  document.head.appendChild(style);

  // Initialize the SSE connection
  initAlertFeed();
}

// Initialize the app when the window loads
window.onload = async () => {
  // Initialize the map
  mapInstance = new maplibregl.Map({
    container: "map",
    style: `https://api.maptiler.com/maps/01977107-2c8b-7b89-873e-7e5019dbb13c/style.json?key=${MAPTILER_API_KEY}`,
    center: [-98.585522, 39.8333333], // Center of the US
    zoom: 4,
  });
  // Ensure weather alerts initialization happens after the map instance is ready
  mapInstance.on("load", initializeWeatherAlerts);
  mapInstance.on("click", handleMapClick);

  // Initialize the radar sites data
  const radarSites = await fetchRadarSites();
  populateRadarSitesDropdown(radarSites);

  // Add radar sites to the map (this also depends on map load for source/layer)
  addRadarSitesToMap(mapInstance, radarSites);

  // Create and display the color scale legend ONCE
  createColorScaleLegend();

  // --- Event listeners ---
  document
    .getElementById("radarSiteSelect")
    .addEventListener("change", async (e) => {
      const siteId = e.target.value;
      if (siteId) {
        selectedRadarSite = radarSites.find((site) => site.id === siteId);

        // Fly to the selected radar site
        mapInstance.flyTo({
          center: [selectedRadarSite.longitude, selectedRadarSite.latitude],
          zoom: 7,
          duration: 1500,
        });

        // Show radar controls
        document.querySelector(".radar-controls").style.display = "block";

        // Fetch and display radar data
        startRadarPolling(mapInstance, selectedRadarSite);
      } else {
        // Hide radar controls
        document.querySelector(".radar-controls").style.display = "none";

        // Remove radar layer and sweep effect
        removeRadarLayer(mapInstance);
        stopSweepAnimation(mapInstance);
      }
    });

  document
    .getElementById("refreshRadar")
    .addEventListener("click", async () => {
      if (selectedRadarSite) {
        return;
      }
    });

  document.getElementById("toggleRadar").addEventListener("click", () => {
    // Toggle the WebGL radar data layer visibility
    if (mapInstance.getLayer(radarLayerId)) {
      const visibility = mapInstance.getLayoutProperty(
        radarLayerId,
        "visibility"
      );
      if (visibility === "visible" || visibility === undefined) {
        mapInstance.setLayoutProperty(radarLayerId, "visibility", "none");
        document.getElementById("toggleRadar").textContent = "Show Radar";
        document.getElementById("radarLegend").style.display = "none";
      } else {
        mapInstance.setLayoutProperty(radarLayerId, "visibility", "visible");
        document.getElementById("toggleRadar").textContent = "Hide Radar";
        document.getElementById("radarLegend").style.display = "block";
      }
    }
  });
};

// --- Helper functions ---

async function fetchRadarSites() {
  try {
    // Complete list of all NEXRAD radar sites in the United States without the leading "K"
    return [
      {
        id: "ABR",
        name: "Aberdeen, SD",
        latitude: 45.4558,
        longitude: -98.4131,
      },
      {
        id: "ENX",
        name: "Albany, NY",
        latitude: 42.5864,
        longitude: -74.0639,
      },
      {
        id: "ABX",
        name: "Albuquerque, NM",
        latitude: 35.1497,
        longitude: -106.8239,
      },
      {
        id: "FDR",
        name: "Altus AFB, OK",
        latitude: 34.3622,
        longitude: -98.9764,
      },
      {
        id: "AMA",
        name: "Amarillo, TX",
        latitude: 35.2333,
        longitude: -101.7092,
      },
      {
        id: "AHG",
        name: "Anchorage, AK",
        latitude: 60.7258,
        longitude: -151.3514,
      },
      {
        id: "GUA",
        name: "Anderson AFB, GU",
        latitude: 13.4525,
        longitude: 144.8058,
      },
      {
        id: "FFC",
        name: "Atlanta, GA",
        latitude: 33.3636,
        longitude: -84.5658,
      },
      {
        id: "EWX",
        name: "Austin/San Antonio, TX",
        latitude: 29.7039,
        longitude: -98.0283,
      },
      {
        id: "BBX",
        name: "Beale AFB, CA",
        latitude: 39.4961,
        longitude: -121.6317,
      },
      {
        id: "ABC",
        name: "Bethel, AK",
        latitude: 60.7919,
        longitude: -161.8764,
      },
      {
        id: "BLX",
        name: "Billings, MT",
        latitude: 45.8539,
        longitude: -108.6067,
      },
      {
        id: "BGM",
        name: "Binghamton, NY",
        latitude: 42.1997,
        longitude: -75.9847,
      },
      {
        id: "BMX",
        name: "Birmingham, AL",
        latitude: 33.1722,
        longitude: -86.7697,
      },
      {
        id: "BIS",
        name: "Bismarck, ND",
        latitude: 46.7708,
        longitude: -100.7603,
      },
      {
        id: "CBX",
        name: "Boise, ID",
        latitude: 43.4906,
        longitude: -116.2361,
      },
      {
        id: "BOX",
        name: "Boston, MA",
        latitude: 41.9558,
        longitude: -71.1369,
      },
      {
        id: "BRO",
        name: "Brownsville, TX",
        latitude: 25.9161,
        longitude: -97.4189,
      },
      {
        id: "BUF",
        name: "Buffalo, NY",
        latitude: 42.9489,
        longitude: -78.7369,
      },
      {
        id: "CXX",
        name: "Burlington, VT",
        latitude: 44.5111,
        longitude: -73.1669,
      },
      {
        id: "RSG",
        name: "Camp Humphreys, Korea",
        latitude: 36.9558,
        longitude: 127.0211,
      },
      {
        id: "FDX",
        name: "Cannon AFB, NM",
        latitude: 34.6353,
        longitude: -103.6297,
      },
      {
        id: "ICX",
        name: "Cedar City, UT",
        latitude: 37.5908,
        longitude: -112.8622,
      },
      {
        id: "CLX",
        name: "Charleston, SC",
        latitude: 32.6556,
        longitude: -81.0422,
      },
      {
        id: "RLX",
        name: "Charleston, WV",
        latitude: 38.3111,
        longitude: -81.7231,
      },
      {
        id: "CYS",
        name: "Cheyenne, WY",
        latitude: 41.1519,
        longitude: -104.8061,
      },
      {
        id: "LOT",
        name: "Chicago, IL",
        latitude: 41.6047,
        longitude: -88.0847,
      },
      {
        id: "ILN",
        name: "Cincinnati, OH",
        latitude: 39.4203,
        longitude: -83.8217,
      },
      {
        id: "CLE",
        name: "Cleveland, OH",
        latitude: 41.4131,
        longitude: -81.8597,
      },
      {
        id: "CAE",
        name: "Columbia, SC",
        latitude: 33.9486,
        longitude: -81.1183,
      },
      {
        id: "GWX",
        name: "Columbus AFB, MS",
        latitude: 33.8969,
        longitude: -88.3289,
      },
      {
        id: "CRP",
        name: "Corpus Christi, TX",
        latitude: 27.7842,
        longitude: -97.5111,
      },
      {
        id: "FWS",
        name: "Dallas/Ft. Worth, TX",
        latitude: 32.5731,
        longitude: -97.3031,
      },
      {
        id: "DVN",
        name: "Davenport, IA",
        latitude: 41.6117,
        longitude: -90.5808,
      },
      {
        id: "FTG",
        name: "Denver, CO",
        latitude: 39.7867,
        longitude: -104.5458,
      },
      {
        id: "DMX",
        name: "Des Moines, IA",
        latitude: 41.7311,
        longitude: -93.7228,
      },
      {
        id: "DTX",
        name: "Detroit, MI",
        latitude: 42.6997,
        longitude: -83.4717,
      },
      {
        id: "DDC",
        name: "Dodge City, KS",
        latitude: 37.7608,
        longitude: -99.9689,
      },
      {
        id: "DOX",
        name: "Dover AFB, DE",
        latitude: 38.8256,
        longitude: -75.44,
      },
      {
        id: "DLH",
        name: "Duluth, MN",
        latitude: 46.8369,
        longitude: -92.2097,
      },
      {
        id: "DYX",
        name: "Dyess AFB, TX",
        latitude: 32.5383,
        longitude: -99.2544,
      },
      {
        id: "EYX",
        name: "Edwards AFB, CA",
        latitude: 35.0978,
        longitude: -117.5608,
      },
      {
        id: "EVX",
        name: "Eglin AFB, FL",
        latitude: 30.5644,
        longitude: -85.9214,
      },
      {
        id: "EPZ",
        name: "El Paso, TX",
        latitude: 31.8731,
        longitude: -106.6981,
      },
      {
        id: "LRX",
        name: "Elko, NV",
        latitude: 40.7397,
        longitude: -116.8028,
      },
      {
        id: "BHX",
        name: "Eureka, CA",
        latitude: 40.4983,
        longitude: -124.2922,
      },
      {
        id: "APD",
        name: "Fairbanks, AK",
        latitude: 65.035,
        longitude: -147.5017,
      },
      {
        id: "FSX",
        name: "Flagstaff, AZ",
        latitude: 34.5744,
        longitude: -111.1978,
      },
      {
        id: "HPX",
        name: "Fort Campbell, KY",
        latitude: 36.7367,
        longitude: -87.2853,
      },
      {
        id: "GRK",
        name: "Fort Hood, TX",
        latitude: 30.7219,
        longitude: -97.3828,
      },
      {
        id: "POE",
        name: "Fort Polk, LA",
        latitude: 31.1556,
        longitude: -92.9758,
      },
      {
        id: "EOX",
        name: "Fort Rucker, AL",
        latitude: 31.4606,
        longitude: -85.4594,
      },
      {
        id: "SRX",
        name: "Fort Smith, AR",
        latitude: 35.2906,
        longitude: -94.3617,
      },
      {
        id: "IWX",
        name: "Fort Wayne, IN",
        latitude: 41.3589,
        longitude: -85.7,
      },
      {
        id: "APX",
        name: "Gaylord, MI",
        latitude: 44.9072,
        longitude: -84.7197,
      },
      {
        id: "GGW",
        name: "Glasgow, MT",
        latitude: 48.2064,
        longitude: -106.625,
      },
      {
        id: "GLD",
        name: "Goodland, KS",
        latitude: 39.3669,
        longitude: -101.7003,
      },
      {
        id: "MVX",
        name: "Grand Forks, ND",
        latitude: 47.5278,
        longitude: -97.3256,
      },
      {
        id: "GJX",
        name: "Grand Junction, CO",
        latitude: 39.0622,
        longitude: -108.2139,
      },
      {
        id: "GRR",
        name: "Grand Rapids, MI",
        latitude: 42.8939,
        longitude: -85.5447,
      },
      {
        id: "TFX",
        name: "Great Falls, MT",
        latitude: 47.4597,
        longitude: -111.3853,
      },
      {
        id: "GRB",
        name: "Green Bay, WI",
        latitude: 44.4983,
        longitude: -88.1114,
      },
      {
        id: "GSP",
        name: "Greer, SC",
        latitude: 34.8833,
        longitude: -82.22,
      },
      {
        id: "RMX",
        name: "Griffiss AFB, NY",
        latitude: 43.4678,
        longitude: -75.4578,
      },
      {
        id: "UEX",
        name: "Hastings, NE",
        latitude: 40.3208,
        longitude: -98.4419,
      },
      {
        id: "HDX",
        name: "Holloman AFB, NM",
        latitude: 33.0764,
        longitude: -106.1228,
      },
      {
        id: "CBW",
        name: "Houlton, ME",
        latitude: 46.0392,
        longitude: -67.8064,
      },
      {
        id: "HGX",
        name: "Houston/Galveston, TX",
        latitude: 29.4719,
        longitude: -95.0792,
      },
      {
        id: "HTX",
        name: "Huntsville, AL",
        latitude: 34.9306,
        longitude: -86.0833,
      },
      {
        id: "IND",
        name: "Indianapolis, IN",
        latitude: 39.7075,
        longitude: -86.2803,
      },
      {
        id: "JKL",
        name: "Jackson, KY",
        latitude: 37.5908,
        longitude: -83.3131,
      },
      {
        id: "JAN",
        name: "Jackson, MS",
        latitude: 32.3178,
        longitude: -90.08,
      },
      {
        id: "JAX",
        name: "Jacksonville, FL",
        latitude: 30.4847,
        longitude: -81.7019,
      },
      {
        id: "ODN",
        name: "Kadena, Okinawa",
        latitude: 26.3019,
        longitude: 127.9097,
      },
      {
        id: "HKN",
        name: "Kamuela, HI",
        latitude: 20.1256,
        longitude: -155.7778,
      },
      {
        id: "EAX",
        name: "Kansas City, MO",
        latitude: 38.8103,
        longitude: -94.2644,
      },
      {
        id: "BYX",
        name: "Key West, FL",
        latitude: 24.5975,
        longitude: -81.7031,
      },
      {
        id: "AKC",
        name: "King Salmon, AK",
        latitude: 58.6794,
        longitude: -156.6294,
      },
      {
        id: "MRX",
        name: "Knoxville/Tri-Cities, TN",
        latitude: 36.1686,
        longitude: -83.4017,
      },
      {
        id: "KJK",
        name: "Kunsan AB, Korea",
        latitude: 35.9242,
        longitude: 126.6222,
      },
      {
        id: "ARX",
        name: "La Crosse, WI",
        latitude: 43.8228,
        longitude: -91.1911,
      },
      {
        id: "PLA",
        name: "Lajes AB, Azores",
        latitude: 38.7303,
        longitude: -27.3217,
      },
      {
        id: "LCH",
        name: "Lake Charles, LA",
        latitude: 30.1253,
        longitude: -93.2158,
      },
      {
        id: "ESX",
        name: "Las Vegas, NV",
        latitude: 35.7011,
        longitude: -114.8914,
      },
      {
        id: "DFX",
        name: "Laughlin AFB, TX",
        latitude: 29.2728,
        longitude: -100.2806,
      },
      {
        id: "ILX",
        name: "Lincoln, IL",
        latitude: 40.1506,
        longitude: -89.3367,
      },
      {
        id: "LZK",
        name: "Little Rock, AR",
        latitude: 34.8364,
        longitude: -92.2622,
      },
      {
        id: "VTX",
        name: "Los Angeles, CA",
        latitude: 34.4117,
        longitude: -119.1794,
      },
      {
        id: "LVX",
        name: "Louisville, KY",
        latitude: 37.9753,
        longitude: -85.9439,
      },
      {
        id: "LBB",
        name: "Lubbock, TX",
        latitude: 33.6542,
        longitude: -101.8142,
      },
      {
        id: "MQT",
        name: "Marquette, MI",
        latitude: 46.5311,
        longitude: -87.5483,
      },
      {
        id: "MXX",
        name: "Maxwell AFB, AL",
        latitude: 32.5367,
        longitude: -85.7897,
      },
      {
        id: "MAX",
        name: "Medford, OR",
        latitude: 42.0811,
        longitude: -122.7172,
      },
      {
        id: "MLB",
        name: "Melbourne, FL",
        latitude: 28.1133,
        longitude: -80.6542,
      },
      {
        id: "NQA",
        name: "Memphis, TN",
        latitude: 35.3447,
        longitude: -89.8733,
      },
      {
        id: "AMX",
        name: "Miami, FL",
        latitude: 25.6111,
        longitude: -80.4128,
      },
      {
        id: "AIH",
        name: "Middleton Island, AK",
        latitude: 59.4614,
        longitude: -146.3031,
      },
      {
        id: "MAF",
        name: "Midland/Odessa, TX",
        latitude: 31.9433,
        longitude: -102.1894,
      },
      {
        id: "MKX",
        name: "Milwaukee, WI",
        latitude: 42.9678,
        longitude: -88.5506,
      },
      {
        id: "MPX",
        name: "Minneapolis/St. Paul, MN",
        latitude: 44.8489,
        longitude: -93.5656,
      },
      {
        id: "MBX",
        name: "Minot AFB, ND",
        latitude: 48.3925,
        longitude: -100.8644,
      },
      {
        id: "MSX",
        name: "Missoula, MT",
        latitude: 47.0411,
        longitude: -113.9864,
      },
      {
        id: "MOB",
        name: "Mobile, AL",
        latitude: 30.6794,
        longitude: -88.2397,
      },
      {
        id: "HMO",
        name: "Molokai, HI",
        latitude: 21.1328,
        longitude: -157.18,
      },
      {
        id: "VAX",
        name: "Moody AFB, GA",
        latitude: 30.3903,
        longitude: -83.0017,
      },
      {
        id: "MHX",
        name: "Morehead City, NC",
        latitude: 34.7761,
        longitude: -76.8761,
      },
      {
        id: "OHX",
        name: "Nashville, TN",
        latitude: 36.2472,
        longitude: -86.5625,
      },
      {
        id: "LIX",
        name: "New Orleans, LA",
        latitude: 30.3367,
        longitude: -89.8256,
      },
      {
        id: "OKX",
        name: "New York City, NY",
        latitude: 40.8656,
        longitude: -72.8639,
      },
      {
        id: "AEC",
        name: "Nome, AK",
        latitude: 64.5114,
        longitude: -165.295,
      },
      {
        id: "AKQ",
        name: "Norfolk/Richmond, VA",
        latitude: 36.9839,
        longitude: -77.0072,
      },
      {
        id: "LNX",
        name: "North Platte, NE",
        latitude: 41.9578,
        longitude: -100.5764,
      },
      {
        id: "TLX",
        name: "Oklahoma City, OK",
        latitude: 35.3331,
        longitude: -97.2775,
      },
      {
        id: "OAX",
        name: "Omaha, NE",
        latitude: 41.3203,
        longitude: -96.3667,
      },
      {
        id: "PAH",
        name: "Paducah, KY",
        latitude: 37.0683,
        longitude: -88.7719,
      },
      {
        id: "PDT",
        name: "Pendleton, OR",
        latitude: 45.6906,
        longitude: -118.8528,
      },
      {
        id: "DIX",
        name: "Philadelphia, PA",
        latitude: 39.9469,
        longitude: -74.4108,
      },
      {
        id: "IWA",
        name: "Phoenix, AZ",
        latitude: 33.2892,
        longitude: -111.67,
      },
      {
        id: "PBZ",
        name: "Pittsburgh, PA",
        latitude: 40.5317,
        longitude: -80.2181,
      },
      {
        id: "SFX",
        name: "Pocatello/Idaho Falls, ID",
        latitude: 43.1056,
        longitude: -112.6861,
      },
      {
        id: "GYX",
        name: "Portland, ME",
        latitude: 43.8914,
        longitude: -70.2564,
      },
      {
        id: "RTX",
        name: "Portland, OR",
        latitude: 45.7147,
        longitude: -122.9658,
      },
      {
        id: "PUX",
        name: "Pueblo, CO",
        latitude: 38.4594,
        longitude: -104.1814,
      },
      {
        id: "RAX",
        name: "Raleigh/Durham, NC",
        latitude: 35.6656,
        longitude: -78.4897,
      },
      {
        id: "UDX",
        name: "Rapid City, SD",
        latitude: 44.1247,
        longitude: -102.8297,
      },
      {
        id: "RGX",
        name: "Reno, NV",
        latitude: 39.7544,
        longitude: -119.4622,
      },
      {
        id: "RIW",
        name: "Riverton, WY",
        latitude: 43.0661,
        longitude: -108.4772,
      },
      {
        id: "FCX",
        name: "Roanoke, VA",
        latitude: 37.0244,
        longitude: -80.2739,
      },
      {
        id: "JGX",
        name: "Robins AFB, GA",
        latitude: 32.6753,
        longitude: -83.3511,
      },
      {
        id: "DAX",
        name: "Sacramento, CA",
        latitude: 38.5011,
        longitude: -121.6778,
      },
      {
        id: "LSX",
        name: "Saint Louis, MO",
        latitude: 38.6989,
        longitude: -90.6828,
      },
      {
        id: "MTX",
        name: "Salt Lake City, UT",
        latitude: 41.2628,
        longitude: -112.4481,
      },
      {
        id: "SJT",
        name: "San Angelo, TX",
        latitude: 31.3714,
        longitude: -100.4925,
      },
      {
        id: "NKX",
        name: "San Diego, CA",
        latitude: 32.9189,
        longitude: -117.0419,
      },
      {
        id: "MUX",
        name: "San Francisco, CA",
        latitude: 37.1553,
        longitude: -121.8983,
      },
      {
        id: "HNX",
        name: "San Joaquin Valley, CA",
        latitude: 36.3142,
        longitude: -119.6319,
      },
      {
        id: "JUA",
        name: "San Juan, PR",
        latitude: 18.1156,
        longitude: -66.0778,
      },
      {
        id: "SOX",
        name: "Santa Ana Mountains, CA",
        latitude: 33.8178,
        longitude: -117.6358,
      },
      {
        id: "ATX",
        name: "Seattle/Tacoma, WA",
        latitude: 48.1944,
        longitude: -122.4958,
      },
      {
        id: "SHV",
        name: "Shreveport, LA",
        latitude: 32.4508,
        longitude: -93.8414,
      },
      {
        id: "FSD",
        name: "Sioux Falls, SD",
        latitude: 43.5878,
        longitude: -96.7294,
      },
      {
        id: "ACG",
        name: "Sitka, AK",
        latitude: 56.8528,
        longitude: -135.5292,
      },
      {
        id: "HKI",
        name: "South Kauai, HI",
        latitude: 21.8942,
        longitude: -159.5522,
      },
      {
        id: "HWA",
        name: "South Shore, HI",
        latitude: 19.095,
        longitude: -155.5689,
      },
      {
        id: "OTX",
        name: "Spokane, WA",
        latitude: 47.6803,
        longitude: -117.6267,
      },
      {
        id: "SGF",
        name: "Springfield, MO",
        latitude: 37.2353,
        longitude: -93.4006,
      },
      {
        id: "CCX",
        name: "State College, PA",
        latitude: 40.9231,
        longitude: -78.0036,
      },
      {
        id: "LWX",
        name: "Sterling, VA",
        latitude: 38.9753,
        longitude: -77.4778,
      },
      {
        id: "TLH",
        name: "Tallahassee, FL",
        latitude: 30.3975,
        longitude: -84.3289,
      },
      {
        id: "TBW",
        name: "Tampa, FL",
        latitude: 27.7056,
        longitude: -82.4017,
      },
      {
        id: "TWX",
        name: "Topeka, KS",
        latitude: 38.9969,
        longitude: -96.2325,
      },
      {
        id: "EMX",
        name: "Tucson, AZ",
        latitude: 31.8936,
        longitude: -110.6303,
      },
      {
        id: "INX",
        name: "Tulsa, OK",
        latitude: 36.175,
        longitude: -95.5647,
      },
      {
        id: "VNX",
        name: "Vance AFB, OK",
        latitude: 36.7408,
        longitude: -98.1278,
      },
      {
        id: "VBX",
        name: "Vandenberg AFB, CA",
        latitude: 34.8381,
        longitude: -120.3975,
      },
      {
        id: "ICT",
        name: "Wichita, KS",
        latitude: 37.6547,
        longitude: -97.4428,
      },
      {
        id: "LTX",
        name: "Wilmington, NC",
        latitude: 33.9894,
        longitude: -78.4289,
      },
      {
        id: "YUX",
        name: "Yuma, AZ",
        latitude: 32.4953,
        longitude: -114.6567,
      },
    ];
  } catch (error) {
    console.error("Error fetching radar sites:", error);
    return [];
  }
}

function populateRadarSitesDropdown(sites) {
  const select = document.getElementById("radarSiteSelect");
  select.innerHTML = '<option value="">Select a radar site</option>';

  let optionsHtml = sites
    .map(
      (site) => `<option value="${site.id}">${site.id} - ${site.name}</option>`
    )
    .join("");
  select.insertAdjacentHTML("beforeend", optionsHtml);
}

function addRadarSitesToMap(map, sites) {
  const features = sites.map((site) => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [site.longitude, site.latitude],
    },
    properties: {
      id: site.id,
      name: site.name,
    },
  }));

  map.on("load", () => {
    map.addSource("radar-sites", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: features,
      },
    });
    map.addLayer({
      id: "radar-sites-layer",
      type: "circle",
      source: "radar-sites",
      paint: {
        "circle-radius": 6,
        "circle-color": "#B42222",
        "circle-stroke-width": 2,
        "circle-stroke-color": "#FFFFFF",
      },
    });

    map.on("click", "radar-sites-layer", (e) => {
      const siteId = e.features[0].properties.id;
      const siteName = e.features[0].properties.name;

      document.getElementById("radarSiteSelect").value = siteId;

      const event = new Event("change");
      document.getElementById("radarSiteSelect").dispatchEvent(event);
    });

    map.on("mouseenter", "radar-sites-layer", () => {
      map.getCanvas().style.cursor = "pointer";
    });

    map.on("mouseleave", "radar-sites-layer", () => {
      map.getCanvas().style.cursor = "";
    });
  });
}

/**
 * Generates a Uint8Array for a 1D texture to be used as a color ramp in WebGL.
 * @param {Array} colorExpression The MapLibre color expression array.
 * @param {number} textureSize The width of the texture (e.g., 256).
 * @returns {Uint8Array} The raw pixel data for the texture.
 */
function generateColorRampArray(colorExpression, textureSize = 256) {
  const stops = [];
  for (let i = 3; i < colorExpression.length; i += 2) {
    const value = colorExpression[i];
    const colorStr = colorExpression[i + 1];
    const color = colorStr.match(/(\d+(\.\d+)?)/g).map(Number);
    color[3] = Math.round((color[3] !== undefined ? color[3] : 1.0) * 255);
    stops.push({ value, color });
  }
  if (stops.length === 0) return new Uint8Array(textureSize * 4);
  const minDbz = 0.0;
  const maxDbz = 95.0;
  const data = new Uint8Array(textureSize * 4);
  for (let i = 0; i < textureSize; i++) {
    const dbz = minDbz + (i / (textureSize - 1)) * (maxDbz - minDbz);
    let stop1 = stops[0],
      stop2 = stops[stops.length - 1];
    for (let j = 0; j < stops.length - 1; j++) {
      if (dbz >= stops[j].value && dbz <= stops[j + 1].value) {
        stop1 = stops[j];
        stop2 = stops[j + 1];
        break;
      }
    }
    if (dbz > stop2.value) stop1 = stop2;
    const t =
      stop2.value - stop1.value === 0
        ? 0
        : (dbz - stop1.value) / (stop2.value - stop1.value);
    const r = stop1.color[0] + t * (stop2.color[0] - stop1.color[0]);
    const g = stop1.color[1] + t * (stop2.color[1] - stop1.color[1]);
    const b = stop1.color[2] + t * (stop2.color[2] - stop1.color[2]);
    const a = stop1.color[3] + t * (stop2.color[3] - stop1.color[3]);
    const offset = i * 4;
    data[offset] = Math.round(r);
    data[offset + 1] = Math.round(g);
    data[offset + 2] = Math.round(b);
    data[offset + 3] = Math.round(a);
  }
  return data;
}

const RadarWebGLLayer = {
  id: radarLayerId,
  type: "custom",
  renderingMode: "2d",

  onAdd: function (map, gl) {
    this.map = map;
    this.gl = gl;

    // IMPORTANT: Capture this instance so we can call its methods later
    customRadarLayerInstance = this;

    const vertexSource = `
          uniform mat4 u_matrix;
          attribute vec2 a_position;
          attribute float a_dbz;
          varying float v_dbz;

          void main() {
              gl_Position = u_matrix * vec4(a_position, 0.0, 1.0);
              v_dbz = a_dbz;
          }`;

    const fragmentSource = `
          precision mediump float;
          varying float v_dbz;
          uniform sampler2D u_color_ramp;
          uniform vec2 u_dbz_range;

          void main() {
              float normalized_dbz = (v_dbz - u_dbz_range[0]) / (u_dbz_range[1] - u_dbz_range[0]);
              normalized_dbz = clamp(normalized_dbz, 0.0, 1.0);

              gl_FragColor = texture2D(u_color_ramp, vec2(normalized_dbz, 0.5));
          }`;

    // --- Shader compilation with error checking ---
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.error(
        "Vertex shader compile error:",
        gl.getShaderInfoLog(vertexShader)
      );
    }

    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fragmentSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.error(
        "Fragment shader compile error:",
        gl.getShaderInfoLog(fragmentShader)
      );
    }

    this.program = gl.createProgram();
    gl.attachShader(this.program, vertexShader);
    gl.attachShader(this.program, fragmentShader);
    gl.linkProgram(this.program);
    if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(this.program));
    }

    // Get the locations of our attributes and uniforms
    this.a_pos_loc = gl.getAttribLocation(this.program, "a_position");
    this.a_dbz_loc = gl.getAttribLocation(this.program, "a_dbz");
    this.u_matrix_loc = gl.getUniformLocation(this.program, "u_matrix");
    this.u_color_ramp_loc = gl.getUniformLocation(this.program, "u_color_ramp");
    this.u_dbz_range_loc = gl.getUniformLocation(this.program, "u_dbz_range");

    // Create the buffers for our data
    this.positionBuffer = gl.createBuffer();
    this.dbzBuffer = gl.createBuffer();
    this.vertexCount = 0;
    this.rawData = null; // Store the raw lon/lat + dbz
    this.mercatorPositions = null; // Store pre-computed Mercator positions
    this.needsMercatorUpdate = true; // Flag to trigger initial Mercator calculation

    // Create and load the color ramp texture
    const colorRampData = generateColorRampArray(DBZ_COLOR_EXPRESSION, 256);
    this.colorRampTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.colorRampTexture);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      256,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      colorRampData
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    // Add event listener for map camera changes AFTER the layer is added
    // This ensures we only re-calculate Mercator positions when necessary
    // 'render' event is a good choice as it fires just before MapLibre draws the frame.
    this.map.on("render", this.onMapRendered.bind(this));
  },

  // NEW METHOD: Called by map 'render' event to update Mercator positions
  onMapRendered: function () {
    // Only recompute and re-upload Mercator positions if flagged
    if (this.needsMercatorUpdate && this.rawData && this.gl) {
      console.log(
        "Recomputing Mercator coordinates and re-uploading position buffer."
      );
      const gl = this.gl;
      const vertices = this.rawData.vertices; // Raw lon/lat vertices

      const mercatorCoords = new Float32Array(vertices.length);
      for (let i = 0; i < vertices.length; i += 2) {
        const merc = maplibregl.MercatorCoordinate.fromLngLat({
          lng: vertices[i],
          lat: vertices[i + 1],
        });
        mercatorCoords[i] = merc.x;
        mercatorCoords[i + 1] = merc.y;
      }
      this.mercatorPositions = mercatorCoords;

      gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
      // Use STATIC_DRAW because these positions only change when new radar data arrives
      // or if the underlying projection logic somehow changes, not every frame during pan/zoom.
      gl.bufferData(gl.ARRAY_BUFFER, this.mercatorPositions, gl.STATIC_DRAW);
      this.needsMercatorUpdate = false; // Reset flag
    }
  },

  // Define updateData as a direct method of the blueprint object
  // This is called when new data comes from the server.
  updateData: function (data) {
    this.rawData = data; // Store the raw data
    this.vertexCount = data ? data.vertices.length / 2 : 0;

    // Update only the dBZ buffer here, as Mercator positions will be handled by onMapRendered
    if (this.gl && data) {
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.dbzBuffer);
      this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array(this.rawData.values),
        this.gl.STATIC_DRAW
      );
    }
    this.needsMercatorUpdate = true; // Signal that Mercator positions need to be recalculated
    if (this.map) {
      this.map.triggerRepaint();
    } else {
      console.warn(
        "Map instance not available in custom layer's updateData. Cannot trigger repaint."
      );
    }
  },

  // Define removeData as a direct method of the blueprint object
  // Called when we want to clear the radar display without removing the layer.
  removeData: function () {
    this.rawData = null;
    this.mercatorPositions = null;
    this.vertexCount = 0;
    this.needsMercatorUpdate = true; // Reset flag for next data load
    if (this.map) {
      this.map.triggerRepaint();
    }
  },

  // The render method remains the same, but now uses pre-calculated positions
  render: function (gl, matrix) {
    if (!this.mercatorPositions || this.vertexCount === 0) return;

    gl.useProgram(this.program);

    // Set GL state for transparency
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.disable(gl.DEPTH_TEST);

    // Pass the map's projection matrix to the vertex shader
    gl.uniformMatrix4fv(this.u_matrix_loc, false, matrix);

    // Bind the *pre-computed* Mercator coordinate data (no new bufferData call here!)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.enableVertexAttribArray(this.a_pos_loc);
    gl.vertexAttribPointer(this.a_pos_loc, 2, gl.FLOAT, false, 0, 0);

    // Bind the dBZ value data (this doesn't change per frame)
    gl.bindBuffer(gl.ARRAY_BUFFER, this.dbzBuffer);
    gl.enableVertexAttribArray(this.a_dbz_loc);
    gl.vertexAttribPointer(this.a_dbz_loc, 1, gl.FLOAT, false, 0, 0);

    // Bind the color ramp texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.colorRampTexture);
    gl.uniform1i(this.u_color_ramp_loc, 0);
    gl.uniform2f(this.u_dbz_range_loc, 0.0, 95.0);

    // Draw the triangles
    gl.drawArrays(gl.TRIANGLES, 0, this.vertexCount);

    // Good practice to reset GL state
    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
  },

  // Add an onRemove method for cleanup
  onRemove: function (gl) {
    // Remove the map 'render' event listener
    if (this.map && this.onMapRendered) {
      this.map.off("render", this.onMapRendered);
    }

    if (this.program) gl.deleteProgram(this.program);
    if (this.positionBuffer) gl.deleteBuffer(this.positionBuffer);
    if (this.dbzBuffer) gl.deleteBuffer(this.dbzBuffer);
    if (this.colorRampTexture) gl.deleteTexture(this.colorRampTexture);
    this.rawData = null;
    this.mercatorPositions = null;
    this.vertexCount = 0;
    customRadarLayerInstance = null; // Clear the global reference
    console.log(
      "Custom layer instance's onRemove called. WebGL resources cleaned up."
    );
  },
};

let lastRadarKey = null;
let radarPollingTimer = null;
const POLLING_INTERVAL = 15000; // 60 seconds

async function pollForNewRadarData(map, site, product = "N0B") {
  console.log("Polling for new radar data...");
  try {
    // Get the latest radar file key from the backend
    const keyResp = await fetch(
      `http://127.0.0.1:5100/api/radar-latest-key/${site.id}?product=${product}`
    );
    if (!keyResp.ok) throw new Error("Failed to check latest radar key");
    const { key } = await keyResp.json();

    // If the key has changed, fetch and display new radar data
    if (key && key !== lastRadarKey) {
      lastRadarKey = key;
      await fetchAndDisplayRadarData(map, site, product);
      startSweepAnimation(mapInstance, selectedRadarSite);
    }
    // else: do nothing, data is unchanged
  } catch (err) {
    console.error("Radar polling error:", err);
  }
}

// Start polling for a given site
function startRadarPolling(map, site, product = "N0B") {
  // Clear any previous polling
  if (radarPollingTimer) clearInterval(radarPollingTimer);

  // Poll immediately, then set interval
  pollForNewRadarData(map, site, product);
  radarPollingTimer = setInterval(() => {
    pollForNewRadarData(map, site, product);
  }, POLLING_INTERVAL);
}

async function fetchAndDisplayRadarData(map, site) {
  try {
    document.getElementById("loadingIndicator").style.display = "block";
    const response = await fetch(
      `http://127.0.0.1:5100/api/radar-webgl/${site.id}?product=N0B`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch radar data: ${response.statusText}`);
    }
    const radarData = await response.json();
    console.log(
      `Received ${radarData.vertices.length / 2} vertices for WebGL rendering.`
    );
    updateRadarLayer(map, radarData);
    updateRadarInfo(site);
    document.getElementById("radarLegend").style.display = "block";
  } catch (error) {
    console.error("Error fetching or rendering WebGL radar data:", error);
    alert(`Error loading radar data: ${error.message}`);
  } finally {
    document.getElementById("loadingIndicator").style.display = "none";
  }
}

// THIS IS THE NEW updateRadarLayer function
function updateRadarLayer(map, data) {
  // If the custom layer instance hasn't been added yet, add it
  if (!customRadarLayerInstance) {
    const firstSymbolId = map
      .getStyle()
      .layers.find((l) => l.type === "symbol")?.id;
    map.addLayer(RadarWebGLLayer, firstSymbolId);
    // After `map.addLayer`, `RadarWebGLLayer.onAdd` will be called,
    // which then sets `customRadarLayerInstance = this;`
  }

  // Now, call updateData on the globally stored instance
  if (
    customRadarLayerInstance &&
    typeof customRadarLayerInstance.updateData === "function"
  ) {
    customRadarLayerInstance.updateData(data);
  } else {
    // This case should ideally not happen if onAdd successfully sets customRadarLayerInstance
    console.error(
      "Custom radar layer instance or its updateData method not available. This indicates an issue during layer initialization."
    );
  }
}

function removeRadarLayer(map) {
  // If we have a reference to the instance, call its removeData method for cleanup
  if (
    customRadarLayerInstance &&
    typeof customRadarLayerInstance.removeData === "function"
  ) {
    customRadarLayerInstance.removeData(); // Clear data immediately
  }

  // Then remove the layer itself from the map, which will trigger onRemove
  if (map.getLayer(radarLayerId)) {
    map.removeLayer(radarLayerId);
  }
  document.getElementById("radarLegend").style.display = "none";
  document.getElementById("toggleRadar").textContent = "Show Radar"; // Correct text after hiding
}

function updateRadarInfo(site) {
  try {
    const infoDiv = document.querySelector(".radar-info");
    const now = new Date();
    const dateOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedDate = now.toLocaleDateString("en-US", dateOptions);
    let html = `
            <strong>Radar Site:</strong> ${site.id} - ${site.name}<br>
            <strong>Rendered with:</strong> WebGL Custom Layer<br>
            <strong>Approx. Time:</strong> ${formattedDate}<br>
            <strong>Product:</strong> N0B (Base Reflectivity)<br>
        `;
    infoDiv.innerHTML = html;
  } catch (error) {
    console.error("Error updating radar info:", error);
  }
}

function createColorScaleLegend() {
  const legendDiv = document.getElementById("legendScale");

  // Use the existing color expression data
  const dbzColorExpression = DBZ_COLOR_EXPRESSION.slice(3); // Skip the "interpolate", "linear", ["get", "dbz"] parts

  // Extract all values and colors for gradient stops
  const gradientStops = [];
  const labeledValues = [];

  // Use a smaller step to get enough values for a detailed legend
  for (let i = 0; i < dbzColorExpression.length; i += 2) {
    const value = dbzColorExpression[i];
    const color = dbzColorExpression[i + 1];

    // Calculate percentage for gradient stop
    const percentage = (value / 95) * 100;
    gradientStops.push(`${color} ${percentage.toFixed(1)}%`);

    // Add labels at regular intervals
    if (value % 20 === 0 || value === 0) {
      labeledValues.push({ value, percentage });
    }
  }

  // Create a gradient string
  const gradientString = gradientStops.join(", ");

  // Create HTML for the legend
  let html = `
    <div style="
      padding: 12px;
      border-radius: 10px;
      background: var(--glass-bg);
      box-shadow: var(--glass-shadow);
      border: 1px solid var(--glass-border);
      backdrop-filter: blur(8px);
      width: 280px;
    ">
      <div style="
        font-size: 14px;
        color: var(--text-primary);
        margin-bottom: 8px;
        font-weight: 500;
        text-align: center;
      ">Radar Reflectivity (dBZ)</div>
      
      <!-- Gradient bar -->
      <div style="
        height: 24px;
        width: 100%;
        background: linear-gradient(to right, ${gradientString});
        border-radius: 4px;
        position: relative;
        margin-bottom: 16px;
      "></div>
      
      <!-- Value markers -->
      <div style="
        position: relative;
        height: 20px;
        width: 100%;
        display: flex;
        justify-content: space-between;
      ">`;

  // Add tick marks and labels
  labeledValues.forEach(({ value, percentage }) => {
    html += `
      <div style="
        position: absolute;
        left: ${percentage}%;
        transform: translateX(-50%);
        text-align: center;
        color: var(--text-secondary);
        font-size: 12px;
      ">
        <div style="
          height: 6px;
          width: 1px;
          background-color: rgba(255,255,255,0.5);
          margin: 0 auto 4px;
        "></div>
        ${value}
      </div>`;
  });

  html += `</div>
    </div>`;

  legendDiv.innerHTML = html;
}

// --- NEW SWEEP ANIMATION FUNCTIONS ---

function startSweepAnimation(map, site) {
  stopSweepAnimation(map); // Ensure any previous animation is stopped
  const center = [site.longitude, site.latitude];
  if (!map.getSource(sweepSourceId)) {
    map.addSource(sweepSourceId, {
      type: "geojson",
      data: { type: "FeatureCollection", features: [] },
    });
  }
  if (!map.getLayer(sweepLayerId)) {
    map.addLayer(
      {
        id: sweepLayerId,
        type: "fill",
        source: sweepSourceId,
        paint: {
          // Use a gradient color for the fill
          "fill-color": [
            "interpolate",
            ["linear"],
            ["zoom"],
            4,
            "rgba(255, 255, 255, 0.2)",
            8,
            "rgba(120, 200, 255, 0.4)",
            12,
            "rgba(0, 150, 255, 0.6)",
          ],
          "fill-outline-color": "rgba(255, 255, 255, 0.3)",
          "fill-opacity": 0.5,
        },
      },
      radarLayerId // Place it below the actual radar data
    );
  }

  const animateSweep = () => {
    currentSweepAngle = (currentSweepAngle + SWEEP_SPEED_DPS) % 360;
    let startAngle = currentSweepAngle - SWEEP_WIDTH / 2;
    let endAngle = currentSweepAngle + SWEEP_WIDTH / 2;
    if (startAngle < 0) startAngle += 360;
    if (endAngle > 360) endAngle -= 360;
    const arc = turf.lineArc(
      turf.point(center),
      SWEEP_RADIUS_KM,
      startAngle,
      endAngle,
      { steps: SWEEP_ARC_STEPS * 2, units: "kilometers" } // Increase steps for smoother arc
    );
    const sweepPolygon = turf.polygon([
      [center, ...arc.geometry.coordinates, center],
    ]);
    map.getSource(sweepSourceId).setData(sweepPolygon);
    animationFrameId = requestAnimationFrame(animateSweep);
  };
  animationFrameId = requestAnimationFrame(animateSweep);
}

function stopSweepAnimation(map) {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }
  if (map.getLayer(sweepLayerId)) {
    map.removeLayer(sweepLayerId);
  }
  if (map.getSource(sweepSourceId)) {
    map.removeSource(sweepSourceId);
  }
}
