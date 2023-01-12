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
scale = 10
gForce = 0.5 / scale
gridScale = 5*scale

grid = undefined
gridX = undefined
gridY = undefined

screenX = Math.floor((window.innerWidth-20) / gridScale) * gridScale
screenY = Math.floor((window.innerHeight-20) / gridScale) * gridScale

function redoGrid(particles) {
  if(!(grid === undefined)) {
    // gather all particles
    for(let i in grid) {
      for(let j in grid[i]) {
        for(let k in grid[i][j]) {particles.push(grid[i][j][k])}
      }
    }
  }
  // build new grid
  gridX = Math.ceil(screenX / gridScale)
  gridY = Math.ceil(screenY / gridScale)
  grid = new Array(gridX)
  for(let i = 0; i < gridX; i++) {
    grid[i] = new Array(gridY)
    for(let j = 0; j < gridY; j++) {
      grid[i][j] = []
    }
  }
  // scatter particles
  for(let i in particles) {
    gridPush(particles[i])
  }
}

function gridPush(p) {
  let x = Math.floor(p.x / gridScale)
  let y = Math.floor(p.y / gridScale)
  grid[x][y].push(p)
}

function createParticles() {
  let particles = []
  for(let i = 0; i < 5000; i++) {
    particles.push({x:Math.random()*screenX, y:Math.random()*screenY, t:Math.floor(Math.random() * numTypes)});
  }
  redoGrid(particles)
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
  for(let i = 0; i < gridX; i++) {
    for(let j = 0; j < gridY; j++) {
      for(let k in grid[i][j]) {
        let p1 = grid[i][j][k]
        p1.dx = Math.random()*0.01-0.005
        p1.dy = Math.random()*0.01-0.005
        for(let i2 = -1; i2 <= 1; i2++) {
          for(let j2 = -1; j2 <= 1; j2++) {
            let ii2 = myMod(i+i2, gridX)
            let jj2 = myMod(j+j2, gridY)
            let g2 = grid[ii2][jj2]
            for(let k2 in g2) {
              let p2 = g2[k2]
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
      }
    }
  }
}

function computePosition() {
  for(let i = 0; i < gridX; i++) {
    for(let j = 0; j < gridY; j++) {
      for(let k in grid[i][j]) {
        let p = grid[i][j][k]
        p.x = myMod(p.x + p.dx, screenX)
        p.y = myMod(p.y + p.dy, screenY)
        let x = Math.floor(p.x / gridScale)
        let y = Math.floor(p.y / gridScale)
        if (i != x || j != y) {
          grid[i][j].splice(k,1)
          grid[x][y].push(p)
        }
      }
    }
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

  for(let i = 0; i < gridX; i++) {
    for(let j = 0; j < gridY; j++) {
      for(let k in grid[i][j]) {
        let p = grid[i][j][k]
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = colors[p.t];
        ctx.fill();
      }
    }
  }
}

window.addEventListener('resize', () => {
  screenX = Math.floor((window.innerWidth-20) / gridScale) * gridScale
  screenY = Math.floor((window.innerHeight-20) / gridScale) * gridScale
  redoGrid([])
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
