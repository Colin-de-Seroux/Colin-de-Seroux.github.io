let state = "init";
let map;
let listSite = [];
let goTo;
let myPos;
let modelTransform;
let car;
let compass;
let deviceControls;
let crd;

window.addEventListener("load", async function () {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiY3YwNiIsImEiOiJjajg2MmpzYjcwbWdnMzNsc2NzM2l4eW0yIn0.TfDJipR5II7orUZaC848YA";

  getPosition();
  init();
  render();
});

const yellow = "rgb(255, 240, 188)";
const grey = "rgb(192, 192, 192)";

let scene;
let camera;
let renderer;
let light;
let countryList = [];
let t = 0;

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(grey);

  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.x = 1.5;
  camera.position.y = 1.5;
  camera.lookAt(scene.position);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(80, 80);

  document.getElementById("container").appendChild(renderer.domElement);

  createCompass();
}

function createCompass() {
  var loader = new THREE.STLLoader();
  loader.load("./assets/nsew.stl", function (geometry) {
    var material = new THREE.MeshBasicMaterial({ color: 0x0114cd });
    var mesh = new THREE.Mesh(geometry, material);

    mesh.scale.set(0.06, 0.06, 0.05);
    mesh.position.set(0, 0, 0);

    compass = new THREE.Object3D();
    compass.rotation.y = 1.6;
    compass.add(mesh);

    scene.add(compass);
  });
}

function render() {
  requestAnimationFrame(render);

  renderer.render(scene, camera);
}

function login() {
  // ok
}

function getListClimbing() {
  return [
    {
      name: "Les Gorges du Blavet",
      parking: { lat: 43.516497, lon: 6.652439 },
      site: { lat: 43.5174132, lon: 6.6525 },
      image: [
        "./assets/les-gorges-du-blavet.jpg",
        "./assets/les-gorges-du-blavet2.jpg",
        "./assets/les-gorges-du-blavet3.jpg",
      ],
    },
    {
      name: "Cap Dramont",
      parking: { lat: 43.4147, lon: 6.84837 },
      site: { lat: 43.413777, lon: 6.852078 },
      image: [
        "./assets/cap-dramont.jpg",
        "./assets/cap-dramont2.jpg",
        "./assets/cap-dramont3.jpg",
      ],
    },
    {
      name: "Rocher de Théole",
      parking: { lat: 43.448785, lon: 6.881681 },
      site: { lat: 43.44968, lon: 6.882336 },
      image: [
        "./assets/rocher-de-theole.jpg",
        "./assets/rocher-de-theole2.jpg",
        "./assets/rocher-de-theole3.jpg",
      ],
    },
  ];
}

function createWheels() {
  const geometry = new THREE.BoxBufferGeometry(8.25, 3, 3);
  const material = new THREE.MeshLambertMaterial({ color: 0x333333 });
  const wheel = new THREE.Mesh(geometry, material);
  wheel.position.y = 1.5;
  return wheel;
}

function createCar() {
  car = new THREE.Group();

  const backWheel = createWheels();
  backWheel.position.z = 4.5;
  car.add(backWheel);

  const frontWheel = createWheels();
  frontWheel.position.z = -4.5;
  car.add(frontWheel);

  const main = new THREE.Mesh(
    new THREE.BoxBufferGeometry(6.25, 3.25, 15),
    new THREE.MeshLambertMaterial({ color: 0x78b14b })
  );
  main.position.y = 3;
  car.add(main);

  const cabin = new THREE.Mesh(
    new THREE.BoxBufferGeometry(6, 3, 8.25),
    new THREE.MeshLambertMaterial({ color: 0xffffff })
  );
  cabin.position.z = 1.5;
  cabin.position.y = 6;

  car.add(cabin);

  return car;
}

function success(pos) {
  crd = pos.coords;

  if (state === "init") {
    state = "";

    map = new mapboxgl.Map({
      container: "map",
      style: "mapbox://styles/mapbox/streets-v12",
      center: [crd.longitude, crd.latitude],
      zoom: 13,
    });

    myPos = new mapboxgl.Marker({ color: "#00ff00" })
      .setLngLat([crd.longitude, crd.latitude])
      .addTo(map)
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setText("Je suis ici"));

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
        getRoute(
          [crd.longitude, crd.latitude],
          [site.parking.lon, site.parking.lat],
          "driving"
        );
        goTo = site;
        document.getElementById("route").style.display = "block";
        info();
      });

      listSite.push(markerSite);
    });

    const modelOrigin = [crd.longitude, crd.latitude];
    const modelAltitude = 0;
    const modelRotate = [Math.PI / 2, 0, 0];

    const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
      modelOrigin,
      modelAltitude
    );

    modelTransform = {
      translateX: modelAsMercatorCoordinate.x,
      translateY: modelAsMercatorCoordinate.y,
      translateZ: modelAsMercatorCoordinate.z,
      rotateX: modelRotate[0],
      rotateY: modelRotate[1],
      rotateZ: modelRotate[2],
      scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits(),
    };

    const THREE = window.THREE;

    const customLayer = {
      id: "3d-model",
      type: "custom",
      renderingMode: "3d",
      onAdd: function (map, gl) {
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();

        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0, -70, 100).normalize();
        this.scene.add(directionalLight);

        const directionalLight2 = new THREE.DirectionalLight(0xffffff);
        directionalLight2.position.set(0, 70, 100).normalize();
        this.scene.add(directionalLight2);

        const car = createCar();
        this.scene.add(car);

        this.map = map;

        this.renderer = new THREE.WebGLRenderer({
          canvas: map.getCanvas(),
          context: gl,
          antialias: true,
        });

        this.renderer.autoClear = false;
      },
      render: function (gl, matrix) {
        const rotationX = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(1, 0, 0),
          modelTransform.rotateX
        );
        const rotationY = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(0, 1, 0),
          modelTransform.rotateY
        );
        const rotationZ = new THREE.Matrix4().makeRotationAxis(
          new THREE.Vector3(0, 0, 1),
          modelTransform.rotateZ
        );

        const m = new THREE.Matrix4().fromArray(matrix);
        const l = new THREE.Matrix4()
          .makeTranslation(
            modelTransform.translateX,
            modelTransform.translateY,
            modelTransform.translateZ
          )
          .scale(
            new THREE.Vector3(
              modelTransform.scale,
              -modelTransform.scale,
              modelTransform.scale
            )
          )
          .multiply(rotationX)
          .multiply(rotationY)
          .multiply(rotationZ);

        this.camera.projectionMatrix = m.multiply(l);
        this.renderer.resetState();
        this.renderer.render(this.scene, this.camera);
        this.map.triggerRepaint();
      },
    };

    map.on("style.load", () => {
      const layers = map.getStyle().layers;
      const labelLayerId = layers.find(
        (layer) => layer.type === "symbol" && layer.layout["text-field"]
      ).id;

      map.addLayer(
        {
          id: "add-3d-buildings",
          source: "composite",
          "source-layer": "building",
          filter: ["==", "extrude", "true"],
          type: "fill-extrusion",
          minzoom: 15,
          paint: {
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-height": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "height"],
            ],
            "fill-extrusion-base": [
              "interpolate",
              ["linear"],
              ["zoom"],
              15,
              0,
              15.05,
              ["get", "min_height"],
            ],
            "fill-extrusion-opacity": 0.6,
          },
        },
        labelLayerId
      );

      map.addLayer(customLayer, "waterway-label");
    });

    window.addEventListener("deviceorientation", function (event) {
      car.rotation.y = ((event.alpha % 180) * Math.PI) / 180;
      map.triggerRepaint();
    });
  }
}

async function getRoute(start, end, methode) {
  const query = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/${methode}/${start[0]},${start[1]};${end[0]},${end[1]}?alternatives=true&geometries=geojson&language=en&overview=full&steps=true&access_token=pk.eyJ1IjoiY3YwNiIsImEiOiJjajg2MmpzYjcwbWdnMzNsc2NzM2l4eW0yIn0.TfDJipR5II7orUZaC848YA`,
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

function successWP(pos) {
  crd = pos.coords;

  myPos.setLngLat([crd.longitude, crd.latitude]);

  const position = new mapboxgl.MercatorCoordinate(crd.longitude, crd.latitude);

  modelTransform.x = position.x;
  modelTransform.y = position.y;

  map.triggerRepaint();

  document.getElementById("speed").innerHTML = `Vitesse : ${
    crd.speed === null ? 0 : crd.speed.toFixed(2)
  } km/h`;
}

function errorWP(err) {
  console.warn(`ERREUR (${err.code}): ${err.message}`);
}

function getPosition() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  navigator.geolocation.getCurrentPosition(success, error, options);
  navigator.geolocation.watchPosition(successWP, errorWP, options);
}

function routeOk() {
  listSite.forEach((site) => {
    if (
      site._lngLat.lng !== goTo.site.lon &&
      site._lngLat.lat !== goTo.site.lat
    ) {
      site.remove();
    }
  });

  document.getElementById("route").style.display = "none";
  document.getElementById("parking").style.display = "block";
}

function parkingOk() {
  getRoute(
    [crd.longitude, crd.latitude],
    [goTo.site.lon, goTo.site.lat],
    "walking"
  );

  document.getElementById("parking").style.display = "none";
  document.getElementById("info").style.display = "block";
  document.getElementById("walk").style.display = "block";
}

function walkOk() {
  document.getElementById("walk").style.display = "none";

  listSite.forEach((site) => {
    site.remove();
  });

  map.removeLayer("route");
}

function info() {
  document.getElementById("firstImage").src = goTo.image[0];
  document.getElementById("secondImage").src = goTo.image[1];
  document.getElementById("firdImage").src = goTo.image[2];
  document.getElementById("title").innerHTML = goTo.name;
  document.getElementById("popup").style.display = "block";
}

function closePopup() {
  document.getElementById("popup").style.display = "none";
}
