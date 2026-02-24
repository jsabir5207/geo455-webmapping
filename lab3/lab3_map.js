const map = L.map("map").setView([43.8171364, -91.2139081], 10);

L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  maxZoom: 17,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
               '<a href="https://opentopomap.org">OpenTopoMap</a>'
}).addTo(map);

var myIcon1 = L.icon({
    iconUrl: 'images/icon_1.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon2 = L.icon({
    iconUrl: 'images/icon_2.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon3 = L.icon({
    iconUrl: 'images/icon_3.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon2 = L.icon({
    iconUrl: 'images/icon_2.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon3 = L.icon({
    iconUrl: 'images/icon_3.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon4 = L.icon({
    iconUrl: 'images/icon_4.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon5 = L.icon({
    iconUrl: 'images/icon_5.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon6 = L.icon({
    iconUrl: 'images/icon_6.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon7 = L.icon({
    iconUrl: 'images/icon_7.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon8 = L.icon({
    iconUrl: 'images/icon_8.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon9 = L.icon({
    iconUrl: 'images/icon_9.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon10 = L.icon({
    iconUrl: 'images/icon_10.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon11 = L.icon({
    iconUrl: 'images/icon_11.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});
var myIcon12 = L.icon({
    iconUrl: 'images/icon_12.png',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -28],
});


var Miller_Bluff = L.marker([43.8273,-91.2114], {icon: myIcon1})
  .addTo(map)
  .bindPopup("<b>This is Miller Bluff, a classic hiking spot with a great view of La Crosse and the surrounding area</b>");
var Kings_Chair = L.marker([43.798,-91.2041], {icon: myIcon2})
  .addTo(map)
  .bindPopup("<b>This is Kings Chair, a lightly lesser known hiking spot</b>");
var Goose_Island = L.marker([43.715,-91.2313], {icon: myIcon3})
  .addTo(map)
  .bindPopup("<b>This is Goose Island Campground. I love canoeing here with my friends in the warmer months</b>")
  .openPopup();
var Quarry= L.marker([43.6178,-91.2743], {icon: myIcon4})
  .addTo(map)
  .bindPopup("<b>This is the Quarry. It is a sharp cliff face with incredible views of the south minnesota bluffs</b>")
  .openPopup();
var Grb = L.marker([43.9393,-91.4092], {icon: myIcon5})
  .addTo(map)
  .bindPopup("<b>This is Great River Bluffs State Park. Another great hiking spot</b>")
  .openPopup();
var Perot = L.marker([44.016,-91.4753], {icon: myIcon6})
  .addTo(map)
  .bindPopup("<b>This is Perot State Park, yet again another great place to spend time outdoors</b>")
  .openPopup();
var Kickapoo = L.marker([43.5959,-90.6264], {icon: myIcon7})
  .addTo(map)
  .bindPopup("<b>This is Kickapoo River Wildlife Reserve. Another place I have enjoyed camping and canoeing</b>")
  .openPopup();
var Bridge = L.marker([43.83475,-91.27617], {icon: myIcon8})
  .addTo(map)
  .bindPopup("<b>This is the location of a bridge that me and my friends like to jump off of into the river on warm days</b>")
  .openPopup();
var Mt_LaCrosse = L.marker([43.7426,-91.1823], {icon: myIcon9})
  .addTo(map)
  .bindPopup("<b>This is Mt. La Crosse, the local Ski and Snowboarding area.</b>")
  .openPopup();
