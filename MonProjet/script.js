let init = true;
let map;

window.addEventListener("load", async function () {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiY3YwNiIsImEiOiJjajg2MmpzYjcwbWdnMzNsc2NzM2l4eW0yIn0.TfDJipR5II7orUZaC848YA";

  getPosition();
});

function login() {
  // ok
}

function getListClimbing() {
  return [
    {
      name: "Les Gorges du Blavet",
      parking: { lat: 43.4329, lon: 6.7352 },
      site: { lat: 43.5174132, lon: 6.6552713 },
      image: "./assets/les-gorges-du-blavet.jpg",
    },
    {
      name: "Cap Dramont",
      parking: { lat: 43.4147, lon: 6.84837 },
      site: { lat: 43.413777, lon: 6.852078 },
      image: "./assets/cap-dramont.jpg",
    },
    {
      name: "Rocher de Théole",
      parking: { lat: 43.448785, lon: 6.881681 },
      site: { lat: 43.44968, lon: 6.882336 },
      image: "./assets/cap-dramont.jpg",
    },
  ];
}

async function success(pos) {
  const crd = pos.coords;

  if (init) {
    init = false;

    map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [crd.longitude, crd.latitude],
      zoom: 13,
    });

    const popupIci = new mapboxgl.Popup({ offset: 25 }).setText("Je suis ici");

    let myMarker = new mapboxgl.Marker({ color: "#00ff00" })
      .setLngLat([crd.longitude, crd.latitude])
      .addTo(map)
      .setPopup(popupIci);

    myMarker.getElement().addEventListener("mouseenter", function () {
      myMarker.togglePopup();
    });

    myMarker.getElement().addEventListener("mouseleave", function () {
      myMarker.togglePopup();
    });

    getListClimbing().forEach((site) => {
      let popupSite = new mapboxgl.Popup({ offset: 25 }).setText(site.name);
      let markerSite = new mapboxgl.Marker({ color: "#0000ff" })
        .setLngLat([site.site.lon, site.site.lat])
        .addTo(map)
        .setPopup(popupSite);

      markerSite.getElement().addEventListener("mouseenter", function () {
        markerSite.togglePopup();
      });

      markerSite.getElement().addEventListener("mouseleave", function () {
        markerSite.togglePopup();
      });

      markerSite.getElement().addEventListener("click", function () {
        getRoute([crd.longitude, crd.latitude], [site.parking.lon, site.parking.lat]);
      });
    });
  }
}

async function getRoute(start, end) {
  map.on("load", () => {
    map.addLayer({
      id: "point",
      type: "circle",
      source: {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Point",
                coordinates: start,
              },
            },
          ],
        },
      },
      paint: {
        "circle-radius": 10,
        "circle-color": "#3887be",
      },
    });
  });

  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=pk.eyJ1IjoiY3YwNiIsImEiOiJjajg2MmpzYjcwbWdnMzNsc2NzM2l4eW0yIn0.TfDJipR5II7orUZaC848YA`,
    { method: "GET" }
  );
  const json = await query.json();
  const data = json.routes[0];
  const route = data.geometry.coordinates;
  const geojson = {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: route,
    },
  };

  if (map.getSource("route")) {
    map.getSource("route").setData(geojson);
  } else {
    map.addLayer({
      id: "route",
      type: "line",
      source: {
        type: "geojson",
        data: geojson,
      },
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#3887be",
        "line-width": 5,
        "line-opacity": 0.75,
      },
    });
  }
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
