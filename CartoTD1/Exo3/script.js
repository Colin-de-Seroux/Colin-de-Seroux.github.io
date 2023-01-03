window.addEventListener("load", function () {
  getOrientation();
});

function process(event) {
  document.getElementById("alpha").innerHTML = event.accelerationIncludingGravity.x;
  document.getElementById("beta").innerHTML = event.accelerationIncludingGravity.y;
  document.getElementById("gamma").innerHTML = event.accelerationIncludingGravity.z;
}

function getOrientation() {
  window.addEventListener("devicemotion", process, true);
}
