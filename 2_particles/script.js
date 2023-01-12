screenX = window.innerWidth-20
screenY = window.innerHeight-20

particles = [];
numTypes = 10;
poles = new Array(numTypes)
colors = new Array(numTypes)
for(var i = 0; i < numTypes; i++) {
  poles[i] = new Array(numTypes)
  colors[i] = "hsl(" + (360.0 * i / numTypes) + ",100%,50%)"
  for(var j = 0; j < numTypes; j++){
    poles[i][j] = (i == j) ? -1 : Math.random() - 0.5
  }
}
scale = 50
gForce = 0.01

function createParticles() {
  for(let i = 0; i < 1000; i++) {
    particles.push({x:Math.random()*screenX, y:Math.random()*screenY, t:Math.floor(Math.random() * numTypes)});
  }
}

function myMod(x, m) {
  let y = x % m
  return (y < 0) ? y + m : y
}

function force(d, pole) {
  if(d > 0) {
    if(d < scale) {
      return gForce * (scale - d)
    } else if(d < 3*scale) {
      return gForce * (d - scale) * 0.5 * pole
    } else if(d < 5*scale) {
      return gForce * (5*scale - d) * 0.5* pole
    }
  }
  return 0
}

function computeForce() {
  for(let i in particles) {
    let p1 = particles[i]
    p1.dx = Math.random()*0.01-0.005
    p1.dy = Math.random()*0.01-0.005
    for(let j in particles) {
      let p2 = particles[j]
      let dx = myMod(p1.x - p2.x, screenX)
      let dy = myMod(p1.y - p2.y, screenY)
      if (dx > 0.5 * screenX) { dx -= screenX }
      if (dy > 0.5 * screenY) { dy -= screenY }
      const d = Math.sqrt(dx*dx + dy*dy)
      if(d > 0 && d < 300) {
        let f = force(d, poles[p1.t][p2.t]) / d
        p1.dx += dx * f
        p1.dy += dy * f
      }
    }
  }
}

function computePosition() {
  for(let i in particles) {
    let p1 = particles[i]
    p1.x = myMod(p1.x + p1.dx, screenX)
    p1.y = myMod(p1.y + p1.dy, screenY)
  }
}

function updateCanvas() {
  var universe = document.getElementById("universe")
  var canv = document.getElementById("mainCanvas")
  canv.width = screenX;
  canv.height = screenY;

  const time = new Date();

  var ctx = canv.getContext("2d");
  ctx.fillStyle = "#000000";
  ctx.clearRect(0, 0, canv.width, canv.height);

  ctx.rect(0, 0, screenX, screenY);
  ctx.fillStyle = "#111122";
  ctx.fill();

  computeForce();
  computePosition();

  for(let i in particles) {
    let p = particles[i]
    ctx.beginPath();
    ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = colors[p.t];
    ctx.fill();
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


  createParticles();

  setInterval(updateCanvas, 1)
}

init()
