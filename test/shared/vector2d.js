var expect = require('chai').expect;
var Vector2d;

describe('Vector2d', function () {
  beforeEach(function () {
   Vector2d = require('../../js/shared/vector2d');
  });

  describe('new', function () {
    it('should be ok', function () {
      var newVector = new Vector2d();
      expect(newVector).to.be.ok;
    });
  });

  describe('add', function () {
    it('should make <1,1> + <2,2> = <3,3>', function() {
      var v1 = new Vector2d({x:1, y:1});
      var v2 = new Vector2d({x:2, y:2});
      var v3 = v1.add(v2);
      expect(v3.x).to.equal(3);
      expect(v3.y).to.equal(3);
    });
  });

  describe('subtract', function () {
    it('should make <1,1> - <2,2> = <-1,-1>', function() {
      var v1 = new Vector2d({x:1, y:1});
      var v2 = new Vector2d({x:2, y:2});
      var v3 = v1.subtract(v2);
      expect(v3.x).to.equal(-1);
      expect(v3.y).to.equal(-1);
    });
  });

  describe('dot product', function () {
    it('should make <1,1> · <2,2> = <3,3>', function() {
      var v1 = new Vector2d({x:3, y:3});
      var v2 = new Vector2d({x:2, y:2});
      var dot = v1.dot(v2);
      expect(dot).to.equal(12);
    });
  });

  describe('cross product', function () {
    it('should make <4,2> + <7,4> = 30', function() {
      var v1 = new Vector2d({x:4, y:-2});
      var v2 = new Vector2d({x:7, y:4});
      var cross = v1.cross(v2);
      expect(cross).to.equal(30);
    });
  });
});
