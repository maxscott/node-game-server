var expect = require('chai').expect;
var SocketManager;
var stateManager;

describe('SocketManager', function () {
  beforeEach(function () {
    SocketManager = require('../js/stateManager');
  })

  describe('connection', function () {
    beforeEach(function () {
      stateManager = new SocketManager();
    });

    it('should create a room and add the player id', function () {
      stateManager.connection({ conn: { id: 123 } });
      var rooms = stateManager.getRooms();

      expect(rooms.length).to.equal(1);
      expect(Object.keys(rooms[0].players).length).to.equal(1);
      expect(rooms[0].players[123]).to.be.ok;
      expect(rooms[0].players[123].state).to.equal('joining');
    });

    it('should create 2 rooms for 5 players', function () {
      [ { conn: { id: 123 } }, { conn: { id: 234 } },
        { conn: { id: 345 } }, { conn: { id: 456 } },
        { conn: { id: 567 } }
      ].forEach(function (fakeSocket) {
        stateManager.connection(fakeSocket);
      });

      var rooms = stateManager.getRooms();
      expect(rooms.length).to.equal(2);
      expect(rooms[1].players[567].state).to.equal('joining');
    });
  });

  describe('disconnect', function () {
    beforeEach(function () {
      stateManager = new SocketManager();
    });

    it('should remove player from remove, and remove empty room', function () {
      [ { conn: { id: 123 } }, { conn: { id: 234 } },
        { conn: { id: 345 } }, { conn: { id: 456 } },
        { conn: { id: 567 } }
      ].forEach(function (fakeSocket) {
        stateManager.connection(fakeSocket);
      });
      stateManager.disconnect({ conn: { id: 567 }});
      var rooms = stateManager.getRooms();
      expect(rooms.length).to.equal(1);
    });
  });
});
