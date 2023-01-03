window.addEventListener("load", function () {
  getPosition();
});

function successGCP(pos) {
  let crd = pos.coords;

  document.getElementById(
    "longitudeGCP"
  ).innerHTML = `Longitude : ${crd.longitude}`;
  document.getElementById(
    "latitudeGCP"
  ).innerHTML = `Latitude : ${crd.latitude}`;
  document.getElementById(
    "altitudeGCP"
  ).innerHTML = `Altitude : ${crd.altitude}`;
  document.getElementById(
    "precisionGCP"
  ).innerHTML = `Précision : ${crd.accuracy}`;
  document.getElementById("vitesseGCP").innerHTML = `Vitesse : ${crd.speed}`;
  document.getElementById("dateGCP").innerHTML = new Date();
}

function errorGCP(err) {
  console.warn(`ERREUR (${err.code}): ${err.message}`);
}

function successWP(pos) {
  let crd = pos.coords;

  document.getElementById(
    "longitudeWP"
  ).innerHTML = `Longitude : ${crd.longitude}`;
  document.getElementById(
    "latitudeWP"
  ).innerHTML = `Latitude : ${crd.latitude}`;
  document.getElementById(
    "altitudeWP"
  ).innerHTML = `Altitude : ${crd.altitude}`;
  document.getElementById(
    "precisionWP"
  ).innerHTML = `Précision : ${crd.accuracy}`;
  document.getElementById("vitesseWP").innerHTML = `Vitesse : ${crd.speed}`;
  document.getElementById("dateWP").innerHTML = new Date();
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

  navigator.geolocation.getCurrentPosition(successGCP, errorGCP, options);
  navigator.geolocation.watchPosition(successWP, errorWP, options);
}
