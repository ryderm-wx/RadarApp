# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
from pathlib import Path
import requests
from datetime import datetime, timezone
import xml.etree.ElementTree as ET
import traceback
import numpy as np

app = Flask(__name__)
CORS(app)

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import nexrad  # your existing radar parser

def get_latest_radar_key(site_id, product, date=None):
    if date is None:
        date = datetime.now(timezone.utc).strftime("%Y_%m_%d")
    prefix = f"{site_id}_{product}_{date}"
    url = f"https://unidata-nexrad-level3.s3.amazonaws.com/?prefix={prefix}"

    resp = requests.get(url)
    resp.raise_for_status()
    root = ET.fromstring(resp.content)
    ns = {'s3': 'http://s3.amazonaws.com/doc/2006-03-01/'}
    keys = [elem.text for elem in root.findall('s3:Contents/s3:Key', ns)]
    if not keys:
        raise FileNotFoundError(f"No radar files found for prefix {prefix}")
    keys.sort()
    return keys[-1]

def download_radar_file(site_id, product):
    base_url = "https://unidata-nexrad-level3.s3.amazonaws.com"
    key = get_latest_radar_key(site_id, product)
    file_url = f"{base_url}/{key}"
    print(f"✅ Fetching radar file: {file_url}")

    temp_dir = Path("./temp")
    temp_dir.mkdir(exist_ok=True)
    temp_path = temp_dir / key
    
    content = requests.get(file_url).content
    with open(temp_path, 'wb') as f:
        f.write(content)
    return str(temp_path)

def extract_radar_data(radar_data):
    azimuths = None
    ranges = None
    radar_values = None

    if hasattr(radar_data, 'sym_block') and radar_data.sym_block:
        for layer in radar_data.sym_block:
            if not isinstance(layer, (list, tuple)):
                continue
            for packet in layer:
                if isinstance(packet, dict) and 'start_az' in packet and 'data' in packet:
                    azimuths = packet['start_az']

                    if hasattr(radar_data, 'ij_to_km'):
                        gate_km = radar_data.ij_to_km
                    else:
                        gate_km = packet.get('gate_scale', 1000) / 1000.0

                    first_bin = packet.get('first', 0)
                    first_km = first_bin * gate_km

                    num_bins = len(packet['data'][0]) if packet['data'] else 0
                    ranges = np.linspace(first_km, first_km + (num_bins - 1) * gate_km, num_bins).tolist()

                    try:
                        radar_values = [
                            radar_data.map_data(np.frombuffer(radial_bytes, dtype=np.uint8))
                            for radial_bytes in packet['data']
                        ]
                        break
                    except Exception as e:
                        print(f"❌ Error mapping radar values: {e}")
                        continue
            if azimuths is not None:
                break
    return azimuths, ranges, radar_values

def get_site_coordinates(site_id):
    # Remove leading K if present
    if site_id.startswith('K') and len(site_id) > 1:
        site_id = site_id[1:]
    
    sites = {
        "ABR": {"lat": 45.45583, "lon": -98.41306},
        "ENX": {"lat": 42.58639, "lon": -74.06389},
        "ABX": {"lat": 35.14972, "lon": -106.82389},
        "FDR": {"lat": 34.36222, "lon": -98.97639},
        "AMA": {"lat": 35.23333, "lon": -101.70917},
        "AHG": {"lat": 60.72583, "lon": -151.35139},
        "GUA": {"lat": 13.45250, "lon": 144.80583},
        "FFC": {"lat": 33.36361, "lon": -84.56583},
        "EWX": {"lat": 29.70389, "lon": -98.02833},
        "BBX": {"lat": 39.49611, "lon": -121.63167},
        "ABC": {"lat": 60.79194, "lon": -161.87639},
        "BLX": {"lat": 45.85389, "lon": -108.60611},
        "BGM": {"lat": 42.19972, "lon": -75.98472},
        "BMX": {"lat": 33.17222, "lon": -86.76972},
        "BIS": {"lat": 46.77083, "lon": -100.76056},
        "CBX": {"lat": 43.49056, "lon": -116.23556},
        "BOX": {"lat": 41.95583, "lon": -71.13694},
        "BRO": {"lat": 25.91611, "lon": -97.41889},
        "BUF": {"lat": 42.94889, "lon": -78.73667},
        "CXX": {"lat": 44.51111, "lon": -73.16694},
        "RSG": {"lat": 36.95583, "lon": 127.02111},
        "FDX": {"lat": 34.63528, "lon": -103.62972},
        "ICX": {"lat": 37.59083, "lon": -112.86222},
        "CLX": {"lat": 32.65556, "lon": -81.04222},
        "RLX": {"lat": 38.31111, "lon": -81.72306},
        "CYS": {"lat": 41.15194, "lon": -104.80611},
        "LOT": {"lat": 41.60472, "lon": -88.08472},
        "ILN": {"lat": 39.42028, "lon": -83.82167},
        "CLE": {"lat": 41.41306, "lon": -81.85972},
        "CAE": {"lat": 33.94861, "lon": -81.11833},
        "GWX": {"lat": 33.89667, "lon": -88.32889},
        "CRP": {"lat": 27.78417, "lon": -97.51111},
        "FWS": {"lat": 32.57306, "lon": -97.30306},
        "DVN": {"lat": 41.61167, "lon": -90.58083},
        "FTG": {"lat": 39.78667, "lon": -104.54583},
        "DMX": {"lat": 41.73111, "lon": -93.72278},
        "DTX": {"lat": 42.69972, "lon": -83.47167},
        "DDC": {"lat": 37.76083, "lon": -99.96889},
        "DOX": {"lat": 38.82556, "lon": -75.44000},
        "DLH": {"lat": 46.83694, "lon": -92.20972},
        "DYX": {"lat": 32.53833, "lon": -99.25444},
        "EYX": {"lat": 35.09778, "lon": -117.56083},
        "EVX": {"lat": 30.56444, "lon": -85.92139},
        "EPZ": {"lat": 31.87306, "lon": -106.69806},
        "LRX": {"lat": 40.73972, "lon": -116.80278},
        "BHX": {"lat": 40.49833, "lon": -124.29194},
        "APD": {"lat": 65.03500, "lon": -147.50167},
        "FSX": {"lat": 34.57444, "lon": -111.19778},
        "HPX": {"lat": 36.73667, "lon": -87.28500},
        "GRK": {"lat": 30.72194, "lon": -97.38306},
        "POE": {"lat": 31.15556, "lon": -92.97583},
        "EOX": {"lat": 31.46056, "lon": -85.45944},
        "SRX": {"lat": 35.29056, "lon": -94.36167},
        "IWX": {"lat": 41.35889, "lon": -85.70000},
        "APX": {"lat": 44.90722, "lon": -84.71972},
        "GGW": {"lat": 48.20639, "lon": -106.62500},
        "GLD": {"lat": 39.36694, "lon": -101.70028},
        "MVX": {"lat": 47.52778, "lon": -97.32556},
        "GJX": {"lat": 39.06222, "lon": -108.21389},
        "GRR": {"lat": 42.89389, "lon": -85.54472},
        "TFX": {"lat": 47.45972, "lon": -111.38528},
        "GRB": {"lat": 44.49833, "lon": -88.11139},
        "GSP": {"lat": 34.88333, "lon": -82.22000},
        "RMX": {"lat": 43.46778, "lon": -75.45778},
        "UEX": {"lat": 40.32083, "lon": -98.44194},
        "HDX": {"lat": 33.07639, "lon": -106.12278},
        "CBW": {"lat": 46.03917, "lon": -67.80639},
        "HGX": {"lat": 29.47194, "lon": -95.07917},
        "HTX": {"lat": 34.93056, "lon": -86.08333},
        "IND": {"lat": 39.70750, "lon": -86.28028},
        "JKL": {"lat": 37.59083, "lon": -83.31306},
        "JAN": {"lat": 32.31778, "lon": -90.08000},
        "JAX": {"lat": 30.48472, "lon": -81.70194},
        "ODN": {"lat": 26.30194, "lon": 127.90972},
        "HKN": {"lat": 20.12556, "lon": -155.77778},
        "EAX": {"lat": 38.81028, "lon": -94.26444},
        "BYX": {"lat": 24.59750, "lon": -81.70306},
        "AKC": {"lat": 58.67944, "lon": -156.62944},
        "MRX": {"lat": 36.16861, "lon": -83.40167},
        "KJK": {"lat": 35.92417, "lon": 126.62222},
        "ARX": {"lat": 43.82278, "lon": -91.19111},
        "PLA": {"lat": 38.73028, "lon": -27.32167},
        "LCH": {"lat": 30.12528, "lon": -93.21583},
        "ESX": {"lat": 35.70111, "lon": -114.89139},
        "DFX": {"lat": 29.27278, "lon": -100.28056},
        "ILX": {"lat": 40.15056, "lon": -89.33722},
        "LZK": {"lat": 34.83639, "lon": -92.26222},
        "VTX": {"lat": 34.41167, "lon": -119.17944},
        "LVX": {"lat": 37.97528, "lon": -85.94389},
        "LBB": {"lat": 33.65417, "lon": -101.81417},
        "MQT": {"lat": 46.53111, "lon": -87.54833},
        "MXX": {"lat": 32.53667, "lon": -85.78972},
        "MAX": {"lat": 42.08111, "lon": -122.71722},
        "MLB": {"lat": 28.11333, "lon": -80.65417},
        "NQA": {"lat": 35.34472, "lon": -89.87333},
        "AMX": {"lat": 25.61111, "lon": -80.41278},
        "AIH": {"lat": 59.46139, "lon": -146.30306},
        "MAF": {"lat": 31.94333, "lon": -102.18917},
        "MKX": {"lat": 42.96778, "lon": -88.55056},
        "MPX": {"lat": 44.84889, "lon": -93.56556},
        "MBX": {"lat": 48.39250, "lon": -100.86500},
        "MSX": {"lat": 47.04111, "lon": -113.98611},
        "MOB": {"lat": 30.67944, "lon": -88.23972},
        "HMO": {"lat": 21.13278, "lon": -157.18000},
        "VAX": {"lat": 30.39028, "lon": -83.00167},
        "MHX": {"lat": 34.77611, "lon": -76.87611},
        "OHX": {"lat": 36.24722, "lon": -86.56250},
        "LIX": {"lat": 30.33667, "lon": -89.82556},
        "OKX": {"lat": 40.86556, "lon": -72.86389},
        "AEC": {"lat": 64.51139, "lon": -165.29500},
        "AKQ": {"lat": 36.98389, "lon": -77.00722},
        "LNX": {"lat": 41.95778, "lon": -100.57639},
        "TLX": {"lat": 35.33306, "lon": -97.27750},
        "OAX": {"lat": 41.32028, "lon": -96.36667},
        "PAH": {"lat": 37.06833, "lon": -88.77194},
        "PDT": {"lat": 45.69056, "lon": -118.85278},
        "DIX": {"lat": 39.94694, "lon": -74.41083},
        "IWA": {"lat": 33.28917, "lon": -111.66972},
        "PBZ": {"lat": 40.53167, "lon": -80.21806},
        "SFX": {"lat": 43.10583, "lon": -112.68611},
        "GYX": {"lat": 43.89139, "lon": -70.25639},
        "RTX": {"lat": 45.71472, "lon": -122.96528},
        "PUX": {"lat": 38.45944, "lon": -104.18139},
        "RAX": {"lat": 35.66556, "lon": -78.49000},
        "UDX": {"lat": 44.12500, "lon": -102.82972},
        "RGX": {"lat": 39.75417, "lon": -119.46167},
        "RIW": {"lat": 43.06611, "lon": -108.47722},
        "FCX": {"lat": 37.02444, "lon": -80.27389},
        "JGX": {"lat": 32.67528, "lon": -83.35111},
        "DAX": {"lat": 38.50111, "lon": -121.67750},
        "LSX": {"lat": 38.69889, "lon": -90.68278},
        "MTX": {"lat": 41.26278, "lon": -112.44750},
        "SJT": {"lat": 31.37139, "lon": -100.49250},
        "NKX": {"lat": 32.91889, "lon": -117.04194},
        "MUX": {"lat": 37.15528, "lon": -121.89833},
        "HNX": {"lat": 36.31417, "lon": -119.63194},
        "JUA": {"lat": 18.11556, "lon": -66.07806},
        "SOX": {"lat": 33.81778, "lon": -117.63583},
        "ATX": {"lat": 48.19444, "lon": -122.49583},
        "SHV": {"lat": 32.45083, "lon": -93.84139},
        "FSD": {"lat": 43.58778, "lon": -96.72944},
        "ACG": {"lat": 56.85278, "lon": -135.52917},
        "HKI": {"lat": 21.89417, "lon": -159.55222},
        "HWA": {"lat": 19.09500, "lon": -155.56889},
        "OTX": {"lat": 47.68028, "lon": -117.62667},
        "SGF": {"lat": 37.23528, "lon": -93.40056},
        "CCX": {"lat": 40.92306, "lon": -78.00361},
        "LWX": {"lat": 38.97528, "lon": -77.47778},
        "TLH": {"lat": 30.39750, "lon": -84.32889},
        "TBW": {"lat": 27.70556, "lon": -82.40167},
        "TWX": {"lat": 38.99694, "lon": -96.22583},
        "EMX": {"lat": 31.89361, "lon": -110.63028},
        "INX": {"lat": 36.17500, "lon": -95.56472},
        "VNX": {"lat": 36.74083, "lon": -98.12778},
        "VBX": {"lat": 34.83806, "lon": -120.39750},
        "ICT": {"lat": 37.65472, "lon": -97.44278},
        "LTX": {"lat": 33.98944, "lon": -78.42889},
        "YUX": {"lat": 32.49528, "lon": -114.65667}
    }
    
    return sites.get(site_id, {"lat": 39.8333333, "lon": -98.585522})

def fast_polar_to_latlon_vec(azimuths, ranges, origin):
    """
    Fast vectorized polar to lat/lon approx using flat earth math.
    Inputs are 1D numpy arrays.
    Returns Nx2 array of [lon, lat].
    """
    lat0, lon0 = origin['lat'], origin['lon']

    az_rad = np.radians(azimuths)
    x = ranges * np.sin(az_rad)    # km east
    y = ranges * np.cos(az_rad)    # km north

    # Degree per km approx at ~40°N latitude
    lat = lat0 + y * 0.008983
    lon = lon0 + x * 0.011427

    return np.vstack([lon, lat]).T

def calculate_vertices_batch(az_start_arr, az_end_arr, r1_arr, r2_arr, origin):
    """
    Vectorized polygon vertices calc with flat-earth approx for speed.

    Returns array shape (N, 4, 2) of lon/lat corners.
    """
    N = len(az_start_arr)
    
    # Four corners per polygon:
    # corner1: (az_start, r1)
    # corner2: (az_start, r2)
    # corner3: (az_end, r2)
    # corner4: (az_end, r1)

    az_corners = np.vstack([
        az_start_arr,
        az_start_arr,
        az_end_arr,
        az_end_arr,
    ])

    r_corners = np.vstack([
        r1_arr,
        r2_arr,
        r2_arr,
        r1_arr,
    ])

    az_flat = az_corners.flatten()
    r_flat = r_corners.flatten()

    coords_flat = fast_polar_to_latlon_vec(az_flat, r_flat, origin)

    coords = coords_flat.reshape(4, N, 2).transpose(1, 0, 2)

    return coords

@app.route('/api/radar/<site_id>', methods=['GET'])
def get_radar_data(site_id):
    product = request.args.get('product', 'N0B')
    try:
        radar_file_path = download_radar_file(site_id, product)
        if product.startswith('N0'):
            radar_data = nexrad.Level3File(radar_file_path)
        else:
            radar_data = nexrad.Level2File(radar_file_path)

        geojson = convert_radar_to_geojson(radar_data, site_id)
        return jsonify(geojson)
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

def convert_radar_to_geojson(radar_data, site_id):
    site_coords = get_site_coordinates(site_id)
    azimuths, ranges, radar_values = extract_radar_data(radar_data)
    if azimuths is None or ranges is None or radar_values is None:
        return {"type": "FeatureCollection", "features": []}

    azimuths = np.array(azimuths)
    ranges = np.array(ranges)
    radar_values = np.array(radar_values)

    # Wrap azimuths for polygon edges
    az_start = azimuths
    az_end = np.roll(azimuths, -1)
    az_diff = (az_end - az_start) % 360
    valid_az = az_diff < 10
    if not np.any(valid_az):
        return {"type": "FeatureCollection", "features": []}

    r1 = ranges[:-1]
    r2 = ranges[1:]
    valid_az_indices = np.where(valid_az)[0]

    features = []
    dbz_threshold = 0 # increase threshold to skip weak/noise signals

    for idx in valid_az_indices:
        az_s = az_start[idx]
        az_e = az_end[idx]
        vals = radar_values[idx, :-1]

        # Filter vals above threshold, drop tiny/noise pixels — huge perf gain
        valid_mask = (vals > dbz_threshold) & ~np.isnan(vals)
        if not np.any(valid_mask):
            continue

        valid_rng_indices = np.where(valid_mask)[0]

        az_start_arr = np.full(len(valid_rng_indices), az_s)
        az_end_arr = np.full(len(valid_rng_indices), az_e)
        r1_arr = r1[valid_rng_indices]
        r2_arr = r2[valid_rng_indices]

        verts = calculate_vertices_batch(az_start_arr, az_end_arr, r1_arr, r2_arr, site_coords)

        for i, rng_idx in enumerate(valid_rng_indices):
            poly_coords = verts[i].tolist()
            poly_coords.append(poly_coords[0])  # close polygon

            features.append({
                "type": "Feature",
                "geometry": {"type": "Polygon", "coordinates": [poly_coords]},
                "properties": {"dbz": float(vals[rng_idx])}
            })

    print(f"⚡ Built {len(features)} polygons after filtering weak signals")
    return {"type": "FeatureCollection", "features": features}


# --- NEW: Function to process data for WebGL ---
def convert_radar_to_webgl_data(radar_data, site_id):
    """
    Processes radar data into flat arrays of vertices and dBZ values
    for efficient WebGL rendering.
    """
    site_coords = get_site_coordinates(site_id)
    azimuths, ranges, radar_values = extract_radar_data(radar_data)
    if azimuths is None or ranges is None or radar_values is None:
        return [], []

    azimuths = np.array(azimuths)
    ranges = np.array(ranges)
    radar_values = np.array(radar_values)

    az_start = azimuths
    az_end = np.roll(azimuths, -1)
    az_diff = (az_end - az_start) % 360
    valid_az = az_diff < 10
    if not np.any(valid_az):
        return [], []

    r1 = ranges[:-1]
    r2 = ranges[1:]
    valid_az_indices = np.where(valid_az)[0]

    all_vertices_flat = []
    all_values_flat = []
    
    dbz_threshold = 0

    for idx in valid_az_indices:
        az_s = az_start[idx]
        az_e = az_end[idx]
        vals = radar_values[idx, :-1]

        valid_mask = (vals > dbz_threshold) & ~np.isnan(vals)
        if not np.any(valid_mask):
            continue

        valid_rng_indices = np.where(valid_mask)[0]
        
        az_start_arr = np.full(len(valid_rng_indices), az_s)
        az_end_arr = np.full(len(valid_rng_indices), az_e)
        r1_arr = r1[valid_rng_indices]
        r2_arr = r2[valid_rng_indices]
        
        verts_batch = calculate_vertices_batch(az_start_arr, az_end_arr, r1_arr, r2_arr, site_coords)
        
        valid_vals = vals[valid_rng_indices]

        for i in range(len(valid_rng_indices)):
            v = verts_batch[i] 
            dbz = float(valid_vals[i])

            # Deconstruct the quad into two triangles (v0,v1,v2 and v0,v2,v3)
            all_vertices_flat.extend(v[0])
            all_vertices_flat.extend(v[1])
            all_vertices_flat.extend(v[2])
            all_vertices_flat.extend(v[0])
            all_vertices_flat.extend(v[2])
            all_vertices_flat.extend(v[3])
            
            # Add the dBZ value for each of the 6 vertices
            all_values_flat.extend([dbz] * 6)

    print(f"⚡ Built {len(all_vertices_flat) // 6} triangles for WebGL")
    return all_vertices_flat, all_values_flat

@app.route('/api/radar-latest-key/<site_id>', methods=['GET'])
def get_latest_radar_key_api(site_id):
    product = request.args.get('product', 'N0B')
    try:
        key = get_latest_radar_key(site_id, product)
        return jsonify({"key": key})
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500

# --- NEW: API Endpoint for WebGL data ---
@app.route('/api/radar-webgl/<site_id>', methods=['GET'])
def get_radar_data_webgl(site_id):
    product = request.args.get('product', 'N0B')
    try:
        radar_file_path = download_radar_file(site_id, product)
        if product.startswith('N0'):
            radar_data = nexrad.Level3File(radar_file_path)
        else:
            radar_data = nexrad.Level2File(radar_file_path)

        vertices, values = convert_radar_to_webgl_data(radar_data, site_id)
        
        return jsonify({
            "vertices": vertices,
            "values": values
        })
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5100)