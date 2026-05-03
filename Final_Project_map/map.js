// ── 1. Initialize map ──────────────────────────────────────────────────
const map = L.map('map').setView([43.8014, -91.2396], 10);

// ── 2. Base tile layer ─────────────────────────────────────────────────
const cartoDB = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/">CARTO</a>',
  maxZoom: 19
});

const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: '© <a href="https://www.esri.com/">Esri</a>',
  maxZoom: 19
});

// Add CartoDB as the default
cartoDB.addTo(map);

// ── Basemap switcher ───────────────────────────────────────────────────
const baseMaps = {
  "Street": cartoDB,
  "Satellite": satellite
};

L.control.layers(baseMaps, null, { position: 'topleft' }).addTo(map);

// ── 3. Proportional circle legend ───────────────────────────────────────
function getCircleRadius(score) {
  const radii = {
    5: 20,
    4: 16,
    3: 12,
    2: 8,
    1: 5
  };
  return radii[score] || 5;
}

// ── 4. State park polygon layer ────────────────────────────────────────

let parkLayer = L.geoJSON(null, {
  style: {
    color: '#c8d4a0',
    weight: 1.5,
    fillOpacity: 0,
    interactive: false
  }
}).addTo(map);

fetch('parks.geojson')
  .then(response => response.json())
  .then(data => parkLayer .addData(data));

//Park Centroids - Proportional circle for amenity score
let parkCentroidLayer = L.geoJSON(null, {
  pointToLayer: (feature, latlng) =>
    L.circleMarker(latlng, {
      radius: getCircleRadius(feature.properties.AMENITY),
      fillColor: '#8aab5a',
      color: '#c8d4a0',
      weight: 1.5,
      fillOpacity: 0.8
    }),
  onEachFeature: (feature, layer) => {
    const p = feature.properties;
    layer.bindPopup(`
      <div class="popup-name">${p.NAME}</div>
      <div class="popup-detail">Amenity score: ${p.AMENITY} / 5</div>
    `);
  }
}).addTo(map);

fetch('centroids.geojson')
  .then(response => response.json())
  .then(data => {
    parkCentroidLayer.addData(data);
    parkCentroidLayer.bringToFront();
  });


// ── Trail difficulty color function ───────────────────────────────────
function getDifficultyColor(difficulty) {
  const colors = {
    'easy': '#1ed0e2',
    'intermediate': '#e5f648',
    'hard': '#d01c8b'
  };
  return colors[difficulty.toLowerCase()] || '#d01c8b';
}

// ── Trail line layer ──────────────────────────────────────────────────
let trailLayer = L.geoJSON(null, {
  style: feature => ({
    color: getDifficultyColor(feature.properties.Difficulty),
    weight: 3,
    opacity: 0.8
  }),
  onEachFeature: (feature, layer) => {
    const p = feature.properties;
  // Highlight on hover
  layer.on('mouseover', function () {
    layer.setStyle({
      color: '#ffffff',
      weight: 5,
      opacity: 1
    });
  });
  layer.on('mouseout', function () {
    trailLayer.resetStyle(layer);
  });
    layer.bindPopup(`
      <div class="popup-name">${p.Name}</div>
      <div class="popup-detail">Difficulty: ${p.Difficulty}</div>
      <div class="popup-detail">Length: ${parseFloat(p.Length).toFixed(1)} miles</div>
      <div class="popup-detail">Hiking: ${p.HIKING}</div>
      <div class="popup-detail">Biking: ${p.Biking}</div>
    `);
  }
}).addTo(map);

fetch('trails2.geojson')
  .then(response => response.json())
  .then(data => {
    trailLayer.addData(data);
    trailLayer.bringToFront();
  });
//Amenity point layer
function getAmenityIcon(type) {
  const icons = {
    'restroom': 'toilet.png',
    'parking': 'parking.png'
  };
  return L.icon({
    iconUrl: icons[type.toLowerCase()] || 'default.png',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
}

let amenityLayer = L.geoJSON(null, {
  pointToLayer: (feature, latlng) =>
    L.marker(latlng, {
      icon: getAmenityIcon(feature.properties.Type)
    }),

}).addTo(map);

fetch('points2.geojson')
  .then(response => response.json())
  .then(data => amenityLayer.addData(data));



// ── 6. Layer toggle controls ───────────────────────────────────────────
document.getElementById('toggle-parks').addEventListener('change', e => {
  e.target.checked ? map.addLayer(parkLayer) : map.removeLayer(parkLayer);
});

document.getElementById('toggle-trails').addEventListener('change', e => {
  e.target.checked ? map.addLayer(trailLayer) : map.removeLayer(trailLayer);
});
document.getElementById('toggle-centroids').addEventListener('change', e => {
  e.target.checked ? map.addLayer(parkCentroidLayer) : map.removeLayer(parkCentroidLayer);
});
document.getElementById('toggle-amenities').addEventListener('change', e => {
  e.target.checked ? map.addLayer(amenityLayer) : map.removeLayer(amenityLayer);
});
// separate toggle label for choropleth

//County Boundaries
let countyLayer = L.geoJSON(null, {
  style: {
    color: '#c8d4a0',
    weight: 1.5,
    fillOpacity: 0,
  }
}).addTo(map);

fetch('counties.geojson')
  .then(response => response.json())
  .then(data => countyLayer.addData(data));

// ── 7. Home button ─────────────────────────────────────────────────────
const homeCoords = [43.8014, -91.2396];
const homeZoom = 9;

const homeBtn = L.control({ position: 'topleft' });

homeBtn.onAdd = function () {
  const btn = L.DomUtil.create('button', 'leaflet-bar leaflet-control');
  btn.innerHTML = '⌂';
  btn.title = 'Return to initial extent';
  btn.style.cssText = 'font-size:18px; width:34px; height:34px; cursor:pointer; background:white; border:none;';
  L.DomEvent.on(btn, 'click', function () {
    map.setView(homeCoords, homeZoom);
  });
  return btn;
};

homeBtn.addTo(map);

// ── Legend collapse ────────────────────────────────────────────────────
function toggleLegend(bodyId) {
  const body = document.getElementById(bodyId);
  const btn = body.previousElementSibling.querySelector('.legend-toggle');
  if (body.style.display === 'none') {
    body.style.display = 'block';
    btn.textContent = '−';
  } else {
    body.style.display = 'none';
    btn.textContent = '+';
  }
}