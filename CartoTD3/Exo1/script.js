window.addEventListener("load", function () {
  setImageCanvas();
});

const setImageCanvas = () => {
  let canvas = document.getElementById("canvas");
  let ctx = canvas.getContext("2d");
  let img = new Image();

  img.src = "../assets/prairie.jpg";

  img.onload = () => {
    canvas.height = img.height;
    canvas.width = img.width;

    ctx.drawImage(img, 0, 0);

    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.arc(75, 75, 50, 0, Math.PI * 2, true); // Cercle extérieur
    ctx.moveTo(110, 75);
    ctx.fill();

    ctx.fillStyle = "orange";
    ctx.fillRect(100, canvas.height - 210, 230, 200);
    ctx.strokeRect(100, canvas.height - 210, 230, 200);

    ctx.fillStyle = "brown";
    ctx.fillRect(130, canvas.height - 190, 100, 180);
    ctx.strokeRect(130, canvas.height - 190, 100, 180);

    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.moveTo(100, canvas.height - 210);
    ctx.lineTo(215, canvas.height - 310);
    ctx.lineTo(330, canvas.height - 210);
    ctx.fill();
    ctx.stroke();
  };
};

const soleilClicked = () => {
  let soleil = document.getElementById("soleil");
  let ciel = document.getElementById("ciel");

  soleil.style.fill = soleil.style.fill === "yellow" ? "orange" : "yellow";
  ciel.style.fill = soleil.style.fill === "yellow" ? "blue" : "grey";
}