
var Vector2d = function Vector2d(args) {
  args = args || { x: 0, y: 0 };
  this.x = args.x;
  this.y = args.y;
}

Vector2d.prototype.add = function add(vector) {
  return new Vector2d({
    x: this.x + vector.x,
    y: this.y + vector.y
  });
}

Vector2d.prototype.subtract = function subtract(vector) {
  return new Vector2d({
    x: this.x - vector.x,
    y: this.y - vector.y
  });
}

Vector2d.prototype.dot = function dot(vector) {
  return this.x * vector.x + this.y * vector.y;
}

Vector2d.prototype.cross = function cross(vector) {
  return this.x * vector.y - this.y * vector.x;
}

module.exports = Vector2d;
