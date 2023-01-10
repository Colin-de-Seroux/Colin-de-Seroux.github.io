window.addEventListener("load", function () {
  getPosition();
});

function success(pos) {
  const crd = pos.coords;

  let map = L.map("map").setView([crd.latitude, crd.longitude], 19);

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

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      "&copy; 2023 Copyright : Colin de Seroux, LP DAM, phenix333.dev@gmail.com",
  }).addTo(map);

  L.marker([crd.latitude, crd.longitude])
    .addTo(map)
    .bindPopup("Je suis ici")
    .openPopup();

  L.marker([43.701711, 7.268157], { icon: greenIcon })
    .addTo(map)
    .bindPopup("Nice")
    .openPopup();
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
