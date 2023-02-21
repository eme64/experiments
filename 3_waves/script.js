//colors = new Array(numTypes)
//for(var i = 0; i < numTypes; i++) {
//  poles[i] = new Array(numTypes)
//  colors[i] = "hsl(" + (360.0 * i / numTypes) + ",100%,50%)"
//  for(var j = 0; j < numTypes; j++){
//    poles[i][j] = (i == j) ? -1 : Math.random() - 0.5
//  }
//}

screenX = window.innerWidth-20
screenY = window.innerHeight-20

resolution = 40

tick = 0

function myMod(x, m) {
  let y = x % m
  return (y < 0) ? y + m : y
}

function prng(x) {
  var a = x * 15485863;
  return (a*a*a % 2038074743) / 2038074743;
}

function prng_3d(x, y, z) {
  return prng((x * 1001 + y) * 11 + z);
}

function perlin_0(x, y, z) {
  var x0 = Math.floor(x);
  var y0 = Math.floor(y);
  var z0 = Math.floor(z);
  var x1 = x0 + 1;
  var y1 = y0 + 1;
  var z1 = z0 + 1;
  var dx = x - x0;
  var dy = y - y0;
  var dz = z - z0;
  var t00 = (1-dx) * prng_3d(x0, y0, z0) + dx * prng_3d(x1, y0, z0);
  var t01 = (1-dx) * prng_3d(x0, y0, z1) + dx * prng_3d(x1, y0, z1);
  var t10 = (1-dx) * prng_3d(x0, y1, z0) + dx * prng_3d(x1, y1, z0);
  var t11 = (1-dx) * prng_3d(x0, y1, z1) + dx * prng_3d(x1, y1, z1);
  var t0 = (1-dy) * t00 +  dy * t10;
  var t1 = (1-dy) * t01 +  dy * t11;
  return (1-dz) * t0 + dz * t1;
}

function perlin_N(x, y, z, N) {
  var sum = 0;
  var fac = 1.0;
  var fac_sum = 0;
  for(let n = 0; n < N; n++) {
    sum += fac * perlin_0(x, y, z);
    fac_sum += fac;
    fac *= 1.5;
    x *= 0.5;
    y *= 0.5;
    z *= 0.5;
  }
  return sum / fac_sum;
}

function rgb(r, g, b) {
  r = Math.floor(r * 256)
  g = Math.floor(g * 256)
  b = Math.floor(b * 256)
  return "rgb(" + r + "," + g + "," + b + ")";
}

function hsl(h) {
  h = h * 360
  return "hsl(" + h + ",100%,50%)";
}

function updateCanvas() {
  var universe = document.getElementById("universe")
  var canv = document.getElementById("mainCanvas")
  canv.width = screenX;
  canv.height = screenY;

  tick++;

  var ctx = canv.getContext("2d");
  ctx.fillStyle = "#000000";
  ctx.clearRect(0, 0, canv.width, canv.height);

  ctx.rect(0, 0, screenX, screenY);
  ctx.fillStyle = "#111122";
  ctx.fill();

  var xx = screenX / resolution + 1;
  var yy = screenY / resolution + 1;

  for(let i = 0; i < xx; i++) {
    for(let j = 0; j < yy; j++) {
      var x = i*resolution;
      var y = j*resolution;
      ctx.beginPath();
      ctx.moveTo(x, y);
      var rdx = (perlin_N(i, j, 0.3*tick + 1000, 7) * 2.0 - 1) * 10 * resolution;
      var rdy = (perlin_N(i, j, 0.3*tick + 2000, 7) * 2.0 - 1) * 10 * resolution;
      ctx.lineTo(x + rdx, y + rdy);
      ctx.lineWidth = resolution * 0.1;
      //ctx.strokeStyle = rgb(
      //  perlin_N(i, j, 0.1 * tick + 3000, 5),
      //  perlin_N(i, j, 0.1 * tick + 4000, 5),
      //  perlin_N(i, j, 0.1 * tick + 5000, 5),
      //);
      ctx.strokeStyle = hsl(
        perlin_N(i, j, 0.3 * tick, 7) * 4,
      );
      ctx.stroke();
      //ctx.beginPath();
      //ctx.rect(x, y, resolution, resolution);
      //ctx.fillStyle = hsl(
      //  perlin_N(i, j, tick, 7) * 2,
      //);
      //ctx.fillStyle = rgb(
      //  perlin_N(i, j, 0.3 * tick + 1000, 6),
      //  perlin_N(i, j, 0.3 * tick + 2000, 6),
      //  perlin_N(i, j, 0.3 * tick + 3000, 6),
      //);
      //ctx.fill();
    }
  }
}

window.addEventListener('resize', () => {
  screenX = window.innerWidth-20
  screenY = window.innerHeight-20
})

function init() {
  var universe =  document.createElement('universe');
  universe.id = "universe"
  document.body.appendChild(universe);

  var canv = document.createElement('canvas');
  canv.id = 'mainCanvas';
  universe.appendChild(canv);

  setInterval(updateCanvas, 1)
}

init()
