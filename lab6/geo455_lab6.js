//basemap//

var mymap = L.map('map').setView([51.48882027639122, -0.1028811094342392], 11);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(mymap);

//minimap//
var miniLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  minZoom: 0,
  maxZoom: 13,
  attribution: '&copy; OpenStreetMap'
});
var miniMap = new L.Control.MiniMap(miniLayer, {
  toggleDisplay: true,
  minimized: false,
  position: "bottomleft"
}).addTo(mymap);

function getColorDensity(value) {
    return value > 139 ? '#54278f':
           value > 87  ? '#756bb1':
           value > 53  ? '#9e9ac8':
           value > 32  ? '#cbc9e2':
                         '#f2f0f7';
}
function getColorLanguage (value) {
    return value > 47 ? '#006d2c':
           value > 31  ? '#31a354':
           value > 26  ? '#74c476':
           value > 15  ? '#a1d99b':
           value > 13  ? '#c7e9c0':
                         '#edf8e9';
}
function styleDensity(feature){
    return {
        fillColor: getColorDensity(feature.properties.pop_den),   
        weight: 2,
        opacity: 1,
        color: 'gray',
        fillOpacity: 0.9
    };
} 
function styleLanguage(feature){
    return {
        fillColor: getColorLanguage(feature.properties.Eng_Dens),   
        weight: 2,
        opacity: 1,
        color: 'gray',
        fillOpacity: 0.9
    };
} 
//Highlight Function//
function highlightFeature(e) {
  var layer = e.target;
  
  layer.setStyle({
  weight: 5,
  color: '#666',
  fillOpacity: 0.7
  });
  
  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
  }
}
//Reset Functions
function resetDensityHighlight(e) {
    densitylayer.resetStyle(e.target);
    e.target.closePopup();
}
function resetLanguageHighlight(e) {
    Languagelayer.resetStyle(e.target);
    e.target.closePopup();
}
//Interaction Functions
function onEachDensityFeature(feature, layer) {
  layer.bindPopup(
    '<strong>' + feature.properties.NAME + '</strong><br>' +
    '<span style="color:purple">' + feature.properties.pop_den + ' people/hectare</span>'
  );
  
  layer.on({
    mouseover: function (e) {
        highlightFeature(e);
        e.target.openPopup();
    },
    mouseout: resetDensityHighlight
  });
}
function onEachLanguageFeature(feature, layer) {
  layer.bindPopup(
      '<strong>' + feature.properties.NAME + '</strong><br>' +
        '<span style="color:green">' + feature.properties.Eng_Dens + ' people/hectare</span>'
    );
  layer.on({
        mouseover: function (e) {
            highlightFeature(e);
            e.target.openPopup();
        },
        mouseout: resetLanguageHighlight 
    });
}

var densitylayer = L.geoJSON(data, {
    style: styleDensity,
    onEachFeature: onEachDensityFeature
}).addTo(mymap);

var Languagelayer = L.geoJSON(data, {  
    style: styleLanguage,
    onEachFeature: onEachLanguageFeature
});

//Legends In The Side Pannel
function buildLegendHTML(title, grades, colorFunction) {
    var html = '<div class="legend-title">' + title + '</div>';
    
    for (var i = 0; i < grades.length; i++) {
      var from = grades[i];
      var to = grades [i + 1];
      
      html +=
          '<div class="legend-box">' +
            '<span class="legend-color" style="background:' + colorFunction(from + 1) + '"></span>' +
            '<span>' + from + (to ? '&ndash;' + to : '+') + '</span>' +
          '</div>';
    }
  
    return html;
}

//Insert density legend into side panel step 12 pat 2//
var densityLegendDiv = document.getElementById('density-legend');
if (densityLegendDiv) {
    densityLegendDiv.innerHTML = buildLegendHTML(
        'Population Density',
        [0, 32, 53, 87, 139],
        getColorDensity
    );
}
var LanguageLegendDiv = document.getElementById('Language-legend');
if (LanguageLegendDiv) {
    LanguageLegendDiv.innerHTML = buildLegendHTML(
        'Density of English Speaking Households',
        [0, 13, 15, 26, 31, 47],
        getColorLanguage
    );
}

var baseLayers = {
    "Population Density": densitylayer,
    "English Speaking Households": Languagelayer
};

L.control.layers(baseLayers, null, {
  collapsed: false,
  position: 'topright'
}).addTo(mymap);

