const map = L.map("map").setView([32.45983672149128, -86.47462982585812], 13);

L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png", {
  maxZoom: 17,
  attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
               '<a href="https://opentopomap.org">OpenTopoMap</a>'
}).addTo(map);

L.marker([32.45622010239132, -86.46859026364585])
  .addTo(map)
  .bindPopup("<b>Hello!</b><br>This is the public pool I worked at as a lifeguard in high school.")
  .openPopup();