var expect = require('chai').expect;
var Notifier, notifier;
var messages = [];

var fakeSocketIO = {
  temp: "(no id specified)",
  emit: function (name, message) {
    messages.push({ type: name, to: fakeSocketIO.temp, message: message });
  },
  to: function (whatever) {
    fakeSocketIO.temp = whatever;
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
      var newPlayer = { id: "123" };
      var roomMessage = { players: { "123": newPlayer } };
      var allPlayers = { players: { "123": {}, "456": {}, "another": {} } };
      notifier.joined(newPlayer, allPlayers);

      expect(messages).to.deep.equal([
        { to: "123", type: "joined", message: allPlayers },
        { to: "456", type: "joined", message: roomMessage },
        { to: "another", type: "joined", message: roomMessage }
      ]);
    });
  });

  describe('left', function () {
    beforeEach(function () {
      messages = [];
    });

    it('sends a left message to everyone in the room', function () {
      notifier.left("123", { players: { "123": {}, "456": {} }});

      var expectMsg = { who: "123" };
      expect(messages).to.deep.equal([
        { to: "123", type: "left", message: expectMsg },
        { to: "456", type: "left", message: expectMsg }
      ]);
    });
  });
});
