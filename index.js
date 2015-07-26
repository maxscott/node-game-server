// express
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/js'));

// socket io
var server = require('http').createServer(app);
var io = require('socket.io')(server);
server.listen(process.env.PORT || 1234);

// routing socket io events
var ConnectionManager = require('./js/connectionManager');
var connectionManager = new ConnectionManager(4);

// used to socketio emit to players
var Notifer = require('./js/notifier');
var notifier = new Notifier(io);

// put this elsewhere, here for now
var Vector2d = require('./js/vector2d');

io.on('connection', function onConnection(socket) {
  var room = connectionManager.connection(socket.conn.id);
  notifier.joined(socket.conn.id, room);
  //gameSim.init(room);

  socket.on('disconnect', function onDisconnection () {
    connectionManager.disconnect(socket.conn.id);
    notifier.left(socket.conn.id, room);
  });

  // Pure spitballing here
  socket.on('gameupdate', function onGameUpdate (update) {
    var MOVED = 1,
        FIRED = 2,
        HIT = 4;

    var emissions = [];

    if (update.type && MOVED) {
      emissions = emissions.concat(connectionManager.moved(socket, new Vector2d(update[MOVED])));
    }

    if (update.type && FIRED) {
      emissions = emissions.concat(connectionManager.fired(socket, new Vector2d(update[FIRED])));
    }

    if (update.type && HIT) {
      emissions = emissions.concat(connectionManager.hit(socket, update[HIT]));
    }

    emissions.forEach(function (em) {
      io.emit(em.id, em.message);
    });
  });
});
