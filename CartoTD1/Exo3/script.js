window.addEventListener("load", function () {
  getOrientation();
});

function process(event) {
  document.getElementById("alpha").innerHTML = event.alpha;
  document.getElementById("beta").innerHTML = event.beta;
  document.getElementById("gamma").innerHTML = event.gamma;
}

function getOrientation() {
  window.addEventListener("devicemotion", process, true);
}
