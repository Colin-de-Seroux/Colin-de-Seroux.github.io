const info = document.getElementById("info");
const button = document.getElementById("button");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
let clicked = false;
let color = "#000000";

canvas.addEventListener("mousedown", clickStart);
canvas.addEventListener("touchstart", clickStart);
canvas.addEventListener("mousemove", move);
canvas.addEventListener("touchmove", move);
canvas.addEventListener("mouseup", clickEnd);
canvas.addEventListener("touchend", clickEnd);
button.addEventListener("click", clear);

document.getElementById("blue").addEventListener("click", () => {
  color = "#0000FF";
});
document.getElementById("grey").addEventListener("click", () => {
  color = "#808080";
});
document.getElementById("green").addEventListener("click", () => {
  color = "#008000";
});
document.getElementById("red").addEventListener("click", () => {
  color = "#FF0000";
});
document.getElementById("yellow").addEventListener("click", () => {
  color = "#FFFF00";
});
document.getElementById("white").addEventListener("click", () => {
  color = "#FFFFFF";
});
document.getElementById("black").addEventListener("click", () => {
  color = "#000000";
});

function changeColor(color) {
  this.color = color;
}

function clickStart(event) {
  event.preventDefault();

  info.innerHTML = event.type;

  context.beginPath();

  const pos = getMousePos(event);

  context.moveTo(pos.x, pos.y);
  context.lineWidth = 3;
  context.strokeStyle = color;
  context.fill();

  clicked = true;
}

function move(event) {
  event.preventDefault();

  info.innerHTML = event.type;

  if (clicked) {
    const pos = getMousePos(event);

    context.lineTo(pos.x, pos.y);
    context.stroke();
  }
}

function clickEnd(event) {
  event.preventDefault();

  info.innerHTML = event.type;

  if (clicked) {
    context.stroke();
  }

  clicked = false;
}

function clear(event) {
  event.preventDefault();

  context.clearRect(0, 0, canvas.width, canvas.height);
}

function getMousePos(event) {
  const clientX = event.clientX || event.touches[0].clientX;
  const clientY = event.clientY || event.touches[0].clientY;
  const { offsetLeft, offsetTop } = event.target;

  return { x: clientX - offsetLeft, y: clientY - offsetTop };
}
