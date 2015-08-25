var Warbler = require('./shared/Warbler');

var ConnectionManager = function ConnectionManager (roomSize) {
  this.rooms = [];
  this.roomsByPlayer = {};
  this.roomSize = roomSize || 4;
}

ConnectionManager.prototype.join = function connection (socket) {
  var player;
  var room;

  function roomIsFull (r) {
    return r.players && Object.keys(r.players).length === this.roomSize;
  }
  function roomNotFull (r) {
    return Object.keys(r.players).length < this.roomSize;
  }

  // no rooms or all full
  if (this.rooms.length === 0 || this.rooms.every(roomIsFull.bind(this))) {
    room = { players: { } };
    player = new Warbler({
      x: 100, y: 100,
      radius: 20,
      color: 'salmon',
      color2: 'lightsalmon'
    });
    player.state = "joining";
    room.players[socket] = player;
    this.roomsByPlayer[socket] = room;
    this.rooms.push(room);
  } else {
    room = this.rooms.filter(roomNotFull.bind(this))[0];
    var numPlayers = Object.keys(room.players).length;
    player = new Warbler({
      x: 100 * numPlayers, y: 100 * numPlayers,
      radius: 20,
      color: 'white',
      color2: 'green'
    });
    player.state = "joining";
    room.players[socket] = player;
    this.roomsByPlayer[socket] = room;
  }

  return room;
}

ConnectionManager.prototype.leave = function disconnect (socket) {
  var room = this.roomsByPlayer[socket];
  if (!room) return;

  delete room.players[socket];
  if (Object.keys(room.players).length === 0) {
    this.rooms.splice(this.rooms.indexOf(room), 1);
  }
  return room;
}

ConnectionManager.prototype.getRooms = function getRooms () {
  return this.rooms;
}

module.exports = ConnectionManager;
