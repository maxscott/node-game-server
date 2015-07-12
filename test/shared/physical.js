var expect = require('chai').expect;
var Physical;

describe('Vector2d', function () {
  beforeEach(function () {
    Physical = require('../../js/shared/physical');
  });

  describe('new', function () {
    it('should be ok', function () {
      //var newVector = new Vector2d();
      expect(Physical).to.be.ok;
    });
  });

});
