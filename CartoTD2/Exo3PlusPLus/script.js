window.addEventListener("load", function () {
  getPosition();
});

async function success(pos) {
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

  // L.tileLayer("https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.png", {
  //   attribution:
  //     "&copy; 2023 Copyright : Colin de Seroux, LP DAM, phenix333.dev@gmail.com",
  // }).addTo(map);

  // L.marker([crd.latitude, crd.longitude], { icon: redIcon })
  //   .addTo(map)
  //   .bindPopup("Je suis ici");

  // L.circle([crd.latitude, crd.longitude], {
  //   color: "orange",
  //   radius: crd.accuracy,
  // }).addTo(map);

  // const nice = [43.701711, 7.268157];

  // L.marker(nice, { icon: greenIcon }).addTo(map).bindPopup("Nice");

  L.mapquest.key = "tR2C6osuQcc3RoWnxDMXF6FACtNAzMl8";

  // 'map' refers to a <div> element with the ID map
  let map = L.mapquest.map("map", {
    center: [crd.latitude, crd.longitude],
    layers: L.mapquest.tileLayer("map"),
    zoom: 12,
  });

  L.marker([crd.latitude, crd.longitude]).addTo(map);
  L.marker([43.701711, 7.268157]).addTo(map);

  map.addLayer(map.Routing.RouteLayer.extend({
    createStartMarker: () => {
      return L.marker([crd.latitude, crd.longitude]).addTo(map);
    },
    createEndMarker: () => {
      return L.marker([43.701711, 7.268157]).addTo(map);
    },
  }));
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
