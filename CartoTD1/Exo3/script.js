window.addEventListener("load", function () {
  getOrientation();
});

function processO(event) {
  document.getElementById("alpha").innerHTML = event.alpha;
  document.getElementById("beta").innerHTML = event.beta;
  document.getElementById("gamma").innerHTML = event.gamma;
}

function processM(event) {
  document.getElementById("ax").innerHTML = `Accélération en x : ${event.accelerationIncludingGravity.x}`;
  document.getElementById("ay").innerHTML = `Accélération en y : ${event.accelerationIncludingGravity.y}`;
  document.getElementById("az").innerHTML = `Accélération en z : ${event.accelerationIncludingGravity.z}`;

  document.getElementById("ax").innerHTML = `Rotation en x : ${event.rotationRate.alpha}`;
  document.getElementById("ay").innerHTML = `Rotation en y : ${event.rotationRate.beta}`;
  document.getElementById("az").innerHTML = `Rotation en z : ${event.rotationRate.gamma}`;
}

function getOrientation() {
  if(window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", processO);
  }

  if (window.DeviceMotionEvent) {
    window.addEventListener("devicemotion", processM, false);
  }
}
