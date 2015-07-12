
(function (module) {

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

  if (module.exports) {
    module.exports = Vector2d;
  } else {
    module.Vector2d = Vector2d;
  }

})(typeof module === 'undefined' ? this : module);
