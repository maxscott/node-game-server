var expect = require('chai').expect;
var Notifier, notifier;
var messages = {};

var fakeSocketIO = { 
  emit: function (socket, message) {
    messages[socket] = message;
  }
};

describe('Notifier', function () {
  beforeEach(function () {
    Notifier = require('../js/notifier');
    notifier = new Notifier(fakeSocketIO);
  });

  it('can be created with a socketio handle', function () {
    expect(notifier.io).to.deep.equal(fakeSocketIO);
  });

  describe('joined', function () {
    beforeEach(function () {
      messages ={};
    });

    it('sends a joined message to everyone in the room', function () {
      notifier.joined("123", { players: { "123": {}, "456": {} }});

      var expectMsg = { type: "joined", who: "123" };
      expect(messages).to.deep.equal({
        "123": expectMsg,
        "456": expectMsg
      });
    });
  });

  describe('left', function () {
    beforeEach(function () {
      messages ={};
    });

    it('sends a joined message to everyone in the room', function () {
      notifier.left("123", { players: { "123": {}, "456": {} }});
      
      var expectMsg = { type: "left", who: "123" };
      expect(messages).to.deep.equal({
        "123": expectMsg,
        "456": expectMsg
      });
    });
  });
});
