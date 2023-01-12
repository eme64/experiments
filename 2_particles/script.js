screenX = window.innerWidth-20
screenY = window.innerHeight-20

particles = [];

function createParticles() {
  for(let i = 0; i < 1000; i++) {
    particles.push({x:Math.random()*screenX, y:Math.random()*screenY});
  }
}

function myMod(x, m) {
  let y = x % m
  return (y < 0) ? y + m : y
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
      if(d > 0 && d < 200) {
        p1.dx += dx / d * (200-d) * 0.01
        p1.dy += dy / d * (200-d) * 0.01
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
    ctx.fillStyle = "#00ff00";
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
