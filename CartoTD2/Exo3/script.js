window.addEventListener("load", function () {
  getPosition();
});

async function success(pos) {
  const crd = pos.coords;

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

  L.marker([crd.latitude, crd.longitude], { icon: redIcon })
    .addTo(map)
    .bindPopup("Je suis ici");

  L.circle([crd.latitude, crd.longitude], {
    color: "orange",
    radius: crd.accuracy,
  }).addTo(map);

  await fetch(
    `https://geo.api.gouv.fr/departements/06/communes?fields=nom,code,codesPostaux,codeDepartement,codeRegion,population&format=geojson&geometry=centre`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      L.geoJSON(data).addTo(map);
    })
    .catch((error) => {
      console.log(error);
    });
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
