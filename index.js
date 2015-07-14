// express
var express = require('express');
var app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/js'));

// socket io
var vanillaServer = require('http').createServer(app);
var io = require('socket.io')(vanillaServer);
vanillaServer.listen(process.env.PORT || 1234);

// routing socket io events
var StateManager = require('./js/stateManager');
var stateManager = new StateManager(4);

// put this elsewhere, here for now
var Vector2d = require('./js/vector2d');

io.on('connection', function onConnection(socket) {
  stateManager.connection(socket);
  console.log(stateManager.getRooms());

  socket.on('disconnect', function () {
    stateManager.disconnect(socket);
    console.log(stateManager.getRooms());
  });

  // Pure spitballing here
  socket.on('game update', function (update) {
    var MOVED = 1,
        FIRED = 2,
        HIT = 4;

    var emissions = [];

    if (update.type && MOVED) {
      emissions = emissions.concat(stateManager.moved(socket, new Vector2d(update[MOVED])));
    }

    if (update.type && FIRED) {
      emissions = emissions.concat(stateManager.fired(socket, new Vector2d(update[FIRED])));
    }

    if (update.type && HIT) {
      emissions = emissions.concat(stateManager.hit(socket, update[HIT]));
    }

    emissions.forEach(function (em) {
      io.emit(em.id, em.message);
    });
  });
});
