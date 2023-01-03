window.addEventListener("load", function () {
  getOrientation();
});

function processO(event) {
  document.getElementById("alpha").innerHTML = event.alpha;
  document.getElementById("beta").innerHTML = event.beta;
  document.getElementById("gamma").innerHTML = event.gamma;
  console.log(event.alpha);
  console.log(event.beta);
  console.log(event.gamma);
}

function processM(event) {
  document.getElementById("acceleration").innerHTML =
    event.accelerationIncludingGravity;
  document.getElementById("rotation").innerHTML = event.rotationRate;
}

function getOrientation() {
  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (event) => {
      document.getElementById("alpha").innerHTML = event.alpha;
      document.getElementById("beta").innerHTML = event.beta;
      document.getElementById("gamma").innerHTML = event.gamma;
    });
  }

  if (window.DeviceMotionEvent) {
    window.addEventListener("devicemotion", processM, false);
  }
}
