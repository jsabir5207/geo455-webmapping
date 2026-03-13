var streets = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

/*Three Different map layers*/

var imagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});


/*Setting the view*/

var map = L.map("map", {
  center: [6.794952075439587, 20.91148703911037],
  zoom: 2,
  layers: [streets, imagery,]
});

/*Creating home button*/

var homeCenter = map.getCenter();
var homeZoom = map.getZoom();
L.easyButton(
  '<img src="images/globe_icon.png" height="60%"/>',
  function (){
    map.setView(homeCenter, homeZoom);
  },
  "Home"
).addTo(map);

/*Create custom popups with images*/
var greatwallPopup = "Great Wall of China<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/20090529_Great_Wall_8185.jpg/256px-20090529_Great_Wall_8185.jpg' alt='great wall wiki' width='150px'/>";
var chichenPopup = "Chichen Itza<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/4/43/003_El_Castillo_o_templo_de_Kukulkan._Chich%C3%A9n_Itz%C3%A1%2C_M%C3%A9xico._MPLC.jpg/256px-003_El_Castillo_o_templo_de_Kukulkan._Chich%C3%A9n_Itz%C3%A1%2C_M%C3%A9xico._MPLC.jpg' alt='Chichen Itza' width='150px'/>";
var petraPopup = "Petra<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/The_Monastery%2C_Petra%2C_Jordan8.jpg/256px-The_Monastery%2C_Petra%2C_Jordan8.jpg' alt='Petra wiki' width='150px'/>";
var machupichuPopup = "Machu Pichu<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Machu_Picchu%2C_Peru.jpg/256px-Machu_Picchu%2C_Peru.jpg' alt='Machu Pichu' width='150px'/>";
var christPopup = "Christ the Redeemer<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Aerial_view_of_the_Statue_of_Christ_the_Redeemer.jpg/256px-Aerial_view_of_the_Statue_of_Christ_the_Redeemer.jpg' alt='Christ the Redeemer wiki' width='150px'/>";
var coloPopup = "The Collosseum<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Colosseum_in_Rome-April_2007-1-_copie_2B.jpg/256px-Colosseum_in_Rome-April_2007-1-_copie_2B.jpg' alt='colosseum' width='150px'/>";
var tajPopup = "Taj Mahal<br/><img src='https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Taj-Mahal.jpg/256px-Taj-Mahal.jpg' alt='Taj Mahal' width='150px'/>";

var customOptions ={'maxWidth': '150','className' : 'custom'};

/*Layergroup and data array*/
var landmarks = L.layerGroup(); //
landmarks.addTo(map);
var wonders = [
  { name: "Great Wall of China", coords: [40.4505, 116.5490], popupHtml: greatwallPopup },
  { name: "Chichen Itza", coords: [20.6793, -88.5682], popupHtml: chichenPopup },
  { name: "Petra", coords: [30.3285, 35.4444], popupHtml: petraPopup },
  { name: "Machu Pichu", coords: [-13.1629, -72.5450], popupHtml: machupichuPopup },
  { name: "Christ the Redeemer", coords: [-22.9517, -43.2104], popupHtml: christPopup },
  { name: "Colosseum", coords: [41.8902, 12.4922], popupHtml: coloPopup },
  { name: "Taj Mahal", coords: [27.1753, 78.0421], popupHtml: tajPopup },
];

var iconFiles = [
  "images/icon_1.png",
  "images/icon_2.png",
  "images/icon_3.png",
  "images/icon_4.png",
  "images/icon_5.png",
  "images/icon_6.png",
  "images/icon_7.png",
];

var wonderIcons = [];
for (var i = 0; i < iconFiles.length; i++) {
  wonderIcons.push(
    L.icon({
      iconUrl: iconFiles[i],
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -28],
    })
  );
}

function addWondersToLayer(dataArray, layerGroup, iconsArray) {
  var markers= [];
  
  for (var i = 0; i < dataArray.length; i++) {
    var feature = dataArray[i];
    
    var marker = L.marker(feature.coords, { icon: iconsArray[i] });
  marker.bindPopup(feature.popupHtml, customOptions);
  marker.bindTooltip(feature.name, {
      direction: "top",
      sticky: true,
      opacity: 0.9});
  marker.addTo(layerGroup);
  markers.push(marker);
  }
  
  return markers;
}
var wonderMarkers = addWondersToLayer(wonders, landmarks, wonderIcons);

/*Sidebar Buttons*/
var buttonsDiv = document.getElementById("wonder-buttons");
var wonderZoom = 6; // pick a zoom level you like

for (var i = 0; i < wonders.length; i++) {
  (function(index) {
    // Create a <button>
    var btn = document.createElement("button");
    btn.type = "button";

    // If using Bootstrap, use btn classes. If not, you can use your own CSS.
    btn.className = "btn btn-outline-secondary btn-sm text-start";

    // Use the SAME icon as the marker + show name
    btn.innerHTML =
      '<img src="' + iconFiles[index] + '" style="width:18px;height:18px;margin-right:8px;">' +
      wonders[index].name;

    // When clicked: zoom to the location + open popup
    btn.addEventListener("click", function() {
      map.setView(wonders[index].coords, wonderZoom);
      wonderMarkers[index].openPopup();
    });

    buttonsDiv.appendChild(btn);
  })(i);
}
/*Layer Control & Menu Items*/
var baseLayers = {
    'Satellite Imagery': imagery,
    'Streetmap': streets,
    };

var overlays = {
  "Seven Wonders": landmarks,
};
var layerControl = L.control.layers(baseLayers, overlays, {collapsed: false}).addTo(map);
var miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 0,
  maxZoom: 13,
  attribution: '&copy; OpenStreetMap'
});

var issIcon = L.icon({
    iconUrl: "images/iss200.png",
    iconSize: [80, 52],
    iconAnchor: [25, 16],
});

var issMarker = L.marker([0, 0], { icon: issIcon}).addTo(map);

var api_url = "https://api.wheretheiss.at/v1/satellites/25544";

function formatTime(d) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit"});
}

async function getISS() {
  try {
    var response = await fetch(api_url);
    if (!response.ok) throw new Error("ISS API error");
    var data = await response.json();
    var latitude = data.latitude;
    var longitude = data.longitude;
    
    issMarker.setLatLng([latitude, longitude]);
    
    document.getElementById("lat").text.Content = latitude.toFixed(3);
    document.getElementById("lon").text.Content = longitude.toFixed(3);
    document.getElementById("iss-time").textContent = formatTime(new Date());
  } catch (err) {
    document.getElementById("iss-time").textContent = "ISS unavailable";
  }
}
getISS();
setInterval(getISS, 1000);

document.getElementById("btn-iss").addEventListener("click", function () {
  var ll = issMarker.getLatLng();
  map.setView([ll.lat, ll.lng], 4);
});
// Add minimap control
var miniMap = new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true,
  minimized: false,
  position: "bottomleft"
}).addTo(map);

/*Resume on Part 2 Step 11: LatLong Popup*/
var clickPopup = L.popup();

function onMapClick(e) {
  var lat = e.latlng.lat;
  var lon = e.latlng.lng;
  
  clickPopup
    .setLatLng(e.latlng)
    .setContent(
      "You clicked the map at: <br>" +
        "<b>Lat:</b> " + lat.toFixed(5) + "<br>" +
        "<b>Lon:</b> " + lon.toFixed(5)
  )
  .openOn(map);
  
  document.getElementById("click-lat").textContent = lat.toFixed(5);
  document.getElementById("click-lon").textContent = lon.toFixed(5);
}

map.on("click", onMapClick);

