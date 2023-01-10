window.addEventListener("load", function () {
  getPosition();
});

function success(pos) {
  const crd = pos.coords;

  const greenIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const redIcon = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  let map = L.map("map").setView([crd.latitude, crd.longitude], 19);

  L.tileLayer("https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png", {
    attribution:
      "&copy; 2023 Copyright : Colin de Seroux, LP DAM, phenix333.dev@gmail.com",
  }).addTo(map);

  L.marker(
    [crd.latitude, crd.longitude],
    { icon: redIcon },
    { color: "yellow" }
  )
    .addTo(map)
    .bindPopup("Je suis ici");

  const nice = [43.701711, 7.268157];
  const marseille = [43.3, 5.4];

  L.marker(nice, { icon: greenIcon }).addTo(map).bindPopup("Nice");

  L.marker(marseille).addTo(map).bindPopup("Marseille");

  L.polyline([nice, marseille], { color: "black" })
    .addTo(map)
    .bindPopup(
      "Distance : " +
        distance(nice[0], nice[1], marseille[0], marseille[1]) +
        "m"
    );

  L.polygon(
    [
      [25.774, -80.19],
      [18.466, -66.118],
      [32.321, -64.757],
    ],
    { color: "red" }
  )
    .addTo(map)
    .bindPopup("Triangle des bermudes");

  L.circle([crd.latitude, crd.longitude], {
    color: "orange",
    radius: crd.accuracy,
  }).addTo(map);
}

function error(err) {
  console.warn(`ERREUR (${err.code}): ${err.message}`);
}

function getPosition() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  navigator.geolocation.getCurrentPosition(success, error, options);
}

function convertRad(input) {
  return (Math.PI * input) / 180;
}

function distance(x1, y1, x2, y2) {
  const R = 6378137;

  let lat_a = convertRad(x1);
  let lon_a = convertRad(y1);
  let lat_b = convertRad(x2);
  let lon_b = convertRad(y2);
  let lat_d = (lat_b - lat_a) / 2;
  let lon_d = (lon_b - lon_a) / 2;

  let d =
    Math.sin(lat_d) * Math.sin(lat_d) +
    Math.cos(lat_a) * Math.cos(lat_b) * Math.sin(lon_d) * Math.sin(lon_d);

  return R * 2 * Math.atan2(Math.sqrt(d), Math.sqrt(1 - d));
}
