var Warbler = require('./shared/Warbler');

var ConnectionManager = function ConnectionManager (roomSize) {
  this.rooms = [];
  this.roomsByPlayer = {};
  this.roomSize = roomSize || 4;
}

ConnectionManager.prototype.join = function join (socket) {
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
    player = Warbler.player1();
    player.id = socket;
    room.players[socket] = player;
    this.roomsByPlayer[socket] = room;
    this.rooms.push(room);
  } else {
    room = this.rooms.filter(roomNotFull.bind(this))[0];
    meow = Object.keys(room.players);

    playerNumbers = meow.map(function(k) { 
      return room.players[k].playerNumber 
    });

    if (!playerNumbers.some(function(a){ return a === 1 })) player = Warbler.player1();
    else if (!playerNumbers.some(function(a){ return a === 2 })) player = Warbler.player2();
    else if (!playerNumbers.some(function(a){ return a === 3 })) player = Warbler.player3();
    else if (!playerNumbers.some(function(a){ return a === 4 })) player = Warbler.player4();
    else console.log("WTF HAPPENED MATE");

    player.id = socket;
    room.players[socket] = player;
    this.roomsByPlayer[socket] = room;
  }

  return { room: room, player: player };
}

ConnectionManager.prototype.leave = function leave (socket) {
  var room = this.roomsByPlayer[socket];
  // wasn't really connected anyways, we hope
  if (!room) return; 
  delete room.players[socket];
  if (Object.keys(room.players).length === 0) {
    this.rooms.splice(this.rooms.indexOf(room), 1);
  }
  return { room: room };
}

ConnectionManager.prototype.getRooms = function getRooms () {
  return this.rooms;
}

module.exports = ConnectionManager;
