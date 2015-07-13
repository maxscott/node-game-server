var expect = require('chai').expect;
var pubsub;

describe('Pubsub', function () {
  describe('subscribe', function () {
    beforeEach(function () {
      pubsub = require('../js/pubsub');
    });
    it('should return a remove function', function () {
      var handle = pubsub.subscribe('enfatten', function(msg) {});
      expect(typeof handle).to.equal('object');
      expect(typeof handle.remove).to.equal('function');
    });
    it('should create a topic', function () {
      pubsub.subscribe('enfatten', function(msg) {});
      var cbs = pubsub.getTopics()['enfatten'];
      expect(typeof cbs[0]).to.equal('function');
    });
  });
  describe('publish', function () {
    beforeEach(function () {
      pubsub = require('../js/pubsub');
    });
    it('shouldn\'t blow up', function () {
      pubsub.publish('enfatten', 'nothing important');
      pubsub.publish('word', 'no problems');
      expect(pubsub).to.be.ok;
    });
    it('call all subscribers of the topic', function () {
      var testSubscriber = function (msg) { testSubscriber.called = true; };
      pubsub.subscribe('enfatten', testSubscriber);
      pubsub.publish('enfatten', 'nothing important');
      expect(testSubscriber.called).to.be.true;
    });
  });
});
