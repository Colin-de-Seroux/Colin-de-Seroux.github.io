window.addEventListener("load", function () {
  getOrientation();
});

function processO(event) {
  document.getElementById("alpha").innerHTML = event.alpha;
  document.getElementById("beta").innerHTML = event.beta;
  document.getElementById("gamma").innerHTML = event.gamma;
}

function processM(event) {
  document.getElementById("acceleration").innerHTML = event.accelerationIncludingGravity;
  document.getElementById("rotation").innerHTML = event.rotationRate;
}

function getOrientation() {
  if(window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", processO, true);
  }

  if (window.DeviceMotionEvent) {
    window.addEventListener("devicemotion", processM, true);
  }
}
