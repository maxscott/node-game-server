var expect = require('chai').expect;
var ConnectionManager;
var connectionManager;

describe('ConnectionManager', function () {
  beforeEach(function () {
    ConnectionManager = require('../js/connectionManager');
  })

  describe('joining', function () {
    beforeEach(function () {
      connectionManager = new ConnectionManager();
    });

    it('should return a room and add the player id', function () {
      var joinObj = connectionManager.join(123);

      expect(connectionManager.getRooms().length).to.equal(1);
      expect(Object.keys(joinObj.room.players).length).to.equal(1);
    });

    it('should create 2 rooms for 5 players', function () {
      var joinObj;
      [ { conn: { id: 123 } }, { conn: { id: 234 } },
        { conn: { id: 345 } }, { conn: { id: 456 } },
        { conn: { id: 567 } }
      ].forEach(function (fakeSocket) {
        joinObj = connectionManager.join(fakeSocket.conn.id);
      });

      expect(connectionManager.getRooms().length).to.equal(2);
    });
  });

  describe('leaving', function () {
    beforeEach(function () {
      connectionManager = new ConnectionManager();
    });

    it('should remove player from remove, and remove empty room', function () {
      [ { conn: { id: 123 } }, { conn: { id: 234 } },
        { conn: { id: 345 } }, { conn: { id: 456 } },
        { conn: { id: 567 } }
      ].forEach(function (fakeSocket) {
        connectionManager.join(fakeSocket);
      });
      var joinObj = connectionManager.leave({ conn: { id: 567 }});
      expect(joinObj.room.players).to.deep.equal({});
    });
  });
});
