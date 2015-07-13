
// express
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/js'));

// socket io
var vanillaServer = require('http').createServer(app);
var io = require('socket.io')(vanillaServer);
vanillaServer.listen(process.env.PORT || 1234);

var rooms = [];
var roomsByPlayer = {};
var roomSize = 4;

io.on('connection', function onConnection(socket) {
  var player = { state: 'joining' };
  var socketId = socket.conn.id;
  
  var roomIsFull = function roomFull (r) {
    return r.players && Object.keys(r.players).length === roomSize;
  }

  var roomNotFull = function roomNotFull (r) {
    return Object.keys(r.players).length < roomSize;
  }

  // no rooms or all full
  if (rooms.length === 0 || rooms.every(roomIsFull)) {
    var room = { players: { } };
    room.players[socketId] = player;
    roomsByPlayer[socketId] = room;
    rooms.push(room);
  } else {
    var room = rooms.filter(roomNotFull)[0];
    room.players[socketId] = player;
    roomsByPlayer[socketId] = room;
  }

  socket.on('disconnect', function () {
    var room = roomsByPlayer[socket.conn.id];
    delete room.players[socket.conn.id];
    if (Object.keys(room.players).length === 0) {
      rooms.splice(rooms.indexOf(room), 1);
    }
    console.log(rooms);
  });

  console.log(rooms);
});
