var canvas = document.getElementById('meow');
var ctx = canvas.getContext('2d');
canvas.style.background = 'lightblue';

var totalBoxes = 100,
    averageSize = 10,
    leaveAfter = 50,
    speedFunction = function speed(i) {
      return 0;
    };

var Box = function(args) {
  this.x = args.x;
  this.y = args.y;
  this.mass = Math.sqrt((args.width || 1) * (args.height || 1));
  this.vx = 0;
  this.vy = 0;
  this.ax = 0;
  this.ay = 0;

  this.width = args.width;
  this.height = args.height;
  this.id = args.id;
  this.speed = args.speed;
  this.collided = false;
}

Box.prototype.render = function(ctx) {
  ctx.fillStyle = this.collided ? "red" : "lightblue";
  ctx.fillStyle = "orange";
  ctx.fillRect(this.x, this.y, this.width, this.height);
  ctx.fillStyle = "black";
  ctx.strokeRect(this.x-1, this.y-1, this.width+1, this.height+1);
  ctx.font = "16px sans-serif";
  ctx.fillStyle = "black";
  //ctx.fillText(this.id, this.x+this.width/2, this.y+this.height/2);
}

function render(ctx, objects) {
  ctx.clearRect(0, 0, 500, 500);
  ctx.fillStyle = "black";
  ctx.strokeRect(1, 1, 498, 498);
  for (var i in objects) {
    objects[i].render(ctx);
  }
}

function reapCandidates(map) {
  var stack = [],
      candidates = [];
  for (var i in map) {
    for (var id in map[i]) {
      //console.log(i, xMap[i][id]);
      var thisId = map[i][id];
      var endedThisId = false;
      for (var si in stack) {
        si = parseInt(si);
        if (stack[si] === thisId) {
          delete stack[si];
          endedThisId = true;
        } else {
          if (candidates[thisId]) {
            if (candidates[thisId].indexOf(stack[si]) === -1) {
              candidates[thisId].push(stack[si]);
            }
          } else {
            candidates[thisId] = [stack[si]];
          }
        }
      }
      if (!endedThisId) {
        stack.push(thisId);
      }
    }
  }
  return candidates;
}

function crossCandidates(xcand, ycand) {
  var collided = [];
  for (var x in xcand) {
    for (var yind in xcand[x]) {
      var y = xcand[x][yind];
      if (ycand[y] && ycand[y].indexOf(parseInt(x)) !== -1) {
        if (!(collided[y] && collided[y].indexOf(parseInt(x)) !== -1)) {
          //console.log('new colizion!', x, y);
          if (collided[x]) {
            collided[x].push(y);
          } else {
            collided[x] = [y];
          }
        }
      }
    }
  }
  return collided;
}

function populateMap(map, coord, id) {
  coord = Math.round(coord);
  if (map[coord]) {
    map[coord].push(id);
  } else {
    map[coord] = [id];
  }
}

function detectCollisions(objects) {
  // populate maps
  var xMap = [],
      yMap = [];
  for (var i in objects) {
    var obj = objects[i];
    if (obj.vy === 0 && obj.vx === 0)
      continue;
    populateMap(xMap, obj.x, obj.id);
    populateMap(xMap, obj.x + obj.width, obj.id);
    populateMap(yMap, obj.y, obj.id);
    populateMap(yMap, obj.y + obj.height, obj.id);
  }

  // reap x/y candidates
  var xCandidates = reapCandidates(xMap);
  var yCandidates = reapCandidates(yMap);

  return crossCandidates(xCandidates, yCandidates);
}

function handleCollisions(collisions, objects) {
  for (var i in collisions) {
    var obj1 = objects[i];
    obj1.collided = true;
    for (var j in collisions[i]) {
      var obj2 = objects[collisions[i][j]];
      obj2.collided = true;

      var top, bottom;
      if (obj1.y + obj1.height / 2 < obj2.y + obj2.height / 2)
        top = obj1, bottom = obj2;
      else
        top = obj2, bottom = obj1;

      top.y = bottom.y - top.height;

      if (top.vy > 15)
        top.vy *= -0.2;
      else
        top.vy = 0;
    }
  }
}

function update(objects, dt) {
  var dt1000 = dt/1000;

  var gravity = dt1000 * 9.8;
  for (var i in objects) {
    var obj = objects[i];
    obj.collided = false;
    obj.y += obj.vy * dt1000;
    obj.vy += obj.mass * gravity;

    if (obj.y > 498 - obj.height) {
      obj.y = 498 - obj.height;
      obj.vx = obj.vy = obj.ax = obj.ay = 0;
      //obj.x = Math.random() * 480;
    }
  }
}

var lastTime = Date.now();
var pass = leave = 0;
function main(ctx, objects) {
  var now = Date.now();
  var dt = now - lastTime;
  lastTime = now;

  update(objects, dt);
  handleCollisions(detectCollisions(objects), objects);
  render(ctx, objects);

  pass++;
  if (pass % 10 === 0) {
    console.log(Math.round(100000/dt)/100 + " fps");
    pass = 0;
    leave++;
  }
  if (leave > leaveAfter) {
    console.log('leaving so I dont break your computer');
    return;
  }

  requestAnimationFrame(function() {main(ctx, objects);});
}

// then make the data and start the loop
var boxes;
function createBoxes(n, s, speedFn) {
  boxes = [];
  for (var i = 0; i < n; i++) {
    boxes.push(new Box({
      x: Math.round(Math.random() * 480),
      y: Math.round(Math.random() * 480),
      width: Math.round(Math.random() * s),
      height: Math.round(Math.random() * s),
      speed: Math.round(Math.random() * speedFn(i)),
      id: i
    }));
  }
}

module.exports = function startSim() {
  boxes = [];
  lastTime = Date.now();
  createBoxes(totalBoxes, averageSize, speedFunction);
  pass = leave = 0;
  main(ctx, boxes);
}
