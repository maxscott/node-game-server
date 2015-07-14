
var StateManager = function StateManager (roomSize) {
  this.rooms = [];
  this.roomsByPlayer = {};
  this.roomSize = roomSize || 4;
}

StateManager.prototype.connection = function connection (socket) {
  var player = { state: 'joining' };
  var socketId = socket.conn.id;

  function roomIsFull (r) {
    return r.players && Object.keys(r.players).length === this.roomSize;
  }
  function roomNotFull (r) {
    return Object.keys(r.players).length < this.roomSize;
  }

  // no rooms or all full
  if (this.rooms.length === 0 || this.rooms.every(roomIsFull.bind(this))) {
    var room = { players: { } };
    room.players[socketId] = player;
    this.roomsByPlayer[socketId] = room;
    this.rooms.push(room);
  } else {
    var room = this.rooms.filter(roomNotFull.bind(this))[0];
    room.players[socketId] = player;
    this.roomsByPlayer[socketId] = room;
  }
}

StateManager.prototype.disconnect = function disconnect (socket) {
  var room = this.roomsByPlayer[socket.conn.id];
  delete room.players[socket.conn.id];
  if (Object.keys(room.players).length === 0) {
    this.rooms.splice(this.rooms.indexOf(room), 1);
  }
}

StateManager.prototype.getRooms = function getRooms () {
  return this.rooms;
}

module.exports = StateManager;
