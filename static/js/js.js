var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
window.addEventListener("resize", function () {
  "use strict";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
var matrix = "123456780ABCDEFGHIJKLMNOPQRTabcdefghijklmnopqrstuvwxyz";
matrix = matrix.split("");
var font_size = 16;
var columns = canvas.width / font_size; 
var drops = [];
for (var x = 0; x < columns; x++) drops[x] = 1;
function draw() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#0F0";
  ctx.font = font_size + "px matrix";
  //looping over drops
  for (var i = 0; i < drops.length; i++) {
    var text = matrix[Math.floor(Math.random() * matrix.length)];
    ctx.fillText(text, i * font_size, drops[i] * font_size);
    if (drops[i] * font_size > canvas.height && Math.random() > 0.975)
      drops[i] = 0;
    drops[i]++;
  }
}
setInterval(draw, 33);
function toggleMenu() {
  var sidebar = document.getElementById("sidebar");
  var logo = document.getElementById("logo");
  sidebar.classList.toggle("active");
  logo.classList.toggle("hidden");
}
