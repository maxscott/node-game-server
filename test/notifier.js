var expect = require('chai').expect;
var Notifier, notifier;
var messages = [];

var fakeSocketIO = {
  emit: function (name, message) {
    messages.push({ type: name, message: message });
  },
  to: function (whatever) {
    return fakeSocketIO;
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
      messages = [];
    });

    it('sends a joined message to everyone in the room', function () {
      notifier.joined("123", { players: { "123": {}, "456": {}, "another": {} }});

      var expectMsg = { who: "123" };
      expect(messages).to.deep.equal([
        { type: "joined", message: expectMsg },
        { type: "joined", message: expectMsg },
        { type: "joined", message: expectMsg }
      ]);
    });
  });

  describe('left', function () {
    beforeEach(function () {
      messages = [];
    });

    it('sends a joined message to everyone in the room', function () {
      notifier.left("123", { players: { "123": {}, "456": {} }});

      var expectMsg = { who: "123" };
      expect(messages).to.deep.equal([
        { type: "left", message: expectMsg },
        { type: "left", message: expectMsg }
      ]);
    });
  });
});
