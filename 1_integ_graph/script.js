maxX = 100;
maxY = 100;

changes = {}
branches = {}

function updateMax(x,y) {
  maxX = Math.max(maxX,x);
  maxY = Math.max(maxY,y);
}

function myFunction() {
 document.getElementById("demo").innerHTML = "Paragraph changed.";
}

function updateCanvas(overFocusId) {
  var universe = document.getElementById("universe")
  var canv = document.getElementById("mainCanvas")
  canv.width = maxX+100;
  canv.height = maxY+100;

  var ctx = canv.getContext("2d");
  ctx.clearRect(0, 0, canv.width, canv.height);

  for (const [key, value] of Object.entries(changes)) {
    var n = changes[key].node;
    var lastNode = changes[key].lastNode;
    if (lastNode) {
      ctx.beginPath();
      ctx.moveTo(n.offsetLeft, n.offsetTop+0.5*n.offsetHeight);
      ctx.lineTo(lastNode.offsetLeft+lastNode.offsetWidth, lastNode.offsetTop+0.5*lastNode.offsetHeight);
      ctx.strokeStyle = "#666666";
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    if (overFocusId==key) {
      n.style.border = "solid #000000";
    } else {
      n.style.border = "";
    }

    var action = changes[key].action;
    if (action && changes[action]) {
      var aN = changes[action].node;
      if (aN) {
        var p = branches[changes[key].branch].parent;
        if (p && p==changes[action].branch) {
          n.style.background = "#88aaff";
          col = "#0000aa";
        } else {
          p2 = branches[changes[action].branch].parent;
          if (p2 && p2==changes[key].branch) {
            n.style.background = "#aaff88";
            col = "#338800";
          } else {
            n.style.background = "#cccc00";
            col = "#aaaa00";
          }
        }

        ctx.beginPath();
        ctx.moveTo(n.offsetLeft, n.offsetTop+0.5*n.offsetHeight);
        ctx.lineTo(aN.offsetLeft+aN.offsetWidth, aN.offsetTop+0.5*aN.offsetHeight);
        ctx.strokeStyle = col;
        ctx.lineWidth = 3;
        if (overFocusId==key) {
          aN.style.border = "solid "+col;
          ctx.lineWidth = 5;
        }
        ctx.stroke();


      }
    }
  }
}

function addNode(x,y,id) {
  var universe = document.getElementById("universe")
  var div = document.createElement("myelement");
  div.style.background = "#aaaaaa";
  div.style.color = "black";
  div.innerHTML = id;

  div.style.left = x+"px";
  div.style.top = y+"px";
  updateMax(x,y);

  div.id = "node"+id;
  universe.appendChild(div);

  div.onmouseover = function() {mouseOverNode(id);}

  return div;
}

function mouseOverNode(id) {
  updateCanvas(id);
}

function init() {
  var universe =  document.createElement('universe');
  universe.id = "universe"
  document.body.appendChild(universe);

  var canv = document.createElement('canvas');
  canv.id = 'mainCanvas';
  universe.appendChild(canv);

  branches = {};
  changes = {};
  var c = 0;
  var b = 0;
  var stack = {};
  var stackptr = 0;

  b++;
  branches[b] = {y:10+30*b,x:10,parent:undefined};
  stackptr++;
  stack[stackptr] = b;

  c++;
  changes[c] = {change:c,branch:b,action:undefined};
  branches[b].last = c;

  while (stackptr>0 && c < 30) {
    b++;
    branches[b] = {y:10+30*b,x:10,parent:stack[stackptr]};

    c++;
    changes[c] = {change:c,branch:b,action:branches[stack[stackptr]].last};
    branches[b].last = c;

    if (Math.random() > 0.5) {
      stackptr++;
      stack[stackptr] = b;
    } else if (Math.random() > 0.5) {
      stackptr--;
    }
  }

  for (var i = 0; i < 200; i++) {
    var bb = Math.ceil(Math.random()*b);
    var action = undefined;
    if (Math.random() > 0.8) {
      var p = branches[bb].parent;
      if (p) {
        action = branches[p].last
      }
    } else if (Math.random() > 0.95) {
      var bbb = Math.ceil(Math.random()*b);
      action = branches[bbb].last
    }
    c++;
    changes[c] = {change:c,branch:bb,action:action};
    branches[bb].last = c;
  }

  for (const [key, change] of Object.entries(changes)) {
    var xpos = branches[change.branch].x;
    var action = change.action;
    if (action && changes[action]) {
      var aN = changes[action].node;
      xpos = Math.max(xpos,aN.offsetLeft+aN.offsetWidth+10);
      var bb = changes[action].branch;
      branches[bb].x = Math.max(branches[bb].x,xpos+40);
    }

    var n = addNode(xpos,branches[change.branch].y,key);
    changes[key].node = n;
    changes[key].lastNode = branches[change.branch].lastNode;
    branches[change.branch].lastNode = n;
    branches[change.branch].x = xpos+40;
  }

  updateCanvas()
}

init()
