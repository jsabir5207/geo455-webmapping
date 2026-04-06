var streets = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

var mymap = L.map("map", {
  center: [28.972443641658437, 84.59443216376953],
  zoom: 8,
  layers:streets
          });
//minimap//
var miniLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    minZoom: 0,
    maxZoom: 19
});


//Mountain Peaks//
var myIcon = L.icon({
    iconUrl: 'images/peaks.png',
    iconSize: [20, 20],
    iconAnchor: [10, 15],
    popupAnchor: [1, -24],
});
var peaks = new L.geoJson(mtn_peaks, {
    onEachFeature: function (feature, featureLayer) {
        featureLayer.bindPopup(
            "<p>Peak Name: <b>" +
                feature.properties.TITLE +
                "</b></br>" +
                "Peak Height: " +
                feature.properties.Peak_Heigh +
                " m</br>" +
                "Number of Deaths: " +
                feature.properties.number_of_ +
                "</br>" +
                "Number of Expeditions: " +
                feature.properties.number_of1 +
                "</p>"
        );
    },
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, { icon: myIcon });
    }
}).addTo(mymap);

//Proportional Circles//
function getRadius(area) {
    var radius = Math.sqrt(area / Math.PI);
    return radius * 2;
}

var propcircles = new L.geoJson(mtn_peaks, {
    onEachFeature: function (feature, featureLayer) {
        featureLayer.bindPopup(
            "<p>Peak Name: <b>" +
                feature.properties.TITLE +
                "</b></br>" +
                "Number of Expeditions: " +
                feature.properties.number_of1 +
                "</p>"
        );
    },
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
            fillColor: "#920101",
            color: "#920101",
            weight: 2,
            radius: getRadius(feature.properties.number_of1),
            fillOpacity: 0.35
        }).on({
            mouseover: function (e) {
                this.openPopup();
                this.setStyle({ fillOpacity: 0.8, fillColor: "#2D8F4E" });
            },
            mouseout: function (e) {
                this.closePopup();
                this.setStyle({ fillOpacity: 0.35, fillColor: "#920101" });
            }
        });
    }
});

//Heatmap//
var min = 0;
var max = 0;
var heatMapPoints = [];

mtn_peaks.features.forEach(function(feature) {
    heatMapPoints.push([
        feature.geometry.coordinates[1],
        feature.geometry.coordinates[0],
        feature.properties.number_of_
    ]);
    
    if (feature.properties.number_of_ < min || min ===0) {
        min = feature.properties.number_of_;
    }
    
    if (feature.properties.number_of_ > max || max === 0) {
        max = feature.properties.number_of_;
    }
});

var heat = L.heatLayer(heatMapPoints, {
    radius: 25,
    minOpacity: 0.5,
    gradient:{0.5: 'blue', 0.75: 'lime', 1: 'red'},
});

//Cluster Markers//
var clustermarkers = L.markerClusterGroup();
mtn_peaks.features.forEach(function(feature) {
    clustermarkers.addLayer(L.marker([feature.geometry.coordinates[1], feature.geometry.coordinates[0]]));
});


//Search Box// 
var searchControl = new L.Control.Search({
    position:'topright',
    layer: peaks,
    propertyName: 'TITLE',
    marker: false,
    markeranimate: true,
    delayType: 50,
    collapsed: false,
    textPlaceholder: 'Search by Peak Name: e.g. Everest, Lhotse',   
    moveToLocation: function(latlng, title, map) {
        mymap.setView(latlng, 15);}
});
mymap.addControl(searchControl);

var overlayMaps = {
    "Himalayan Peaks": peaks,
    "Proportional Circles": propcircles,
    "Death Density": heat,
    "Clustered Peaks": clustermarkers
};

L.control.layers(null, overlayMaps).addTo(mymap);

var miniMap = new L.Control.MiniMap(miniLayer, {
    toggleDisplay: true,  // button to hide/show minimap
    minimized: false,     // start visible
    position: "bottomleft"
}).addTo(mymap);










