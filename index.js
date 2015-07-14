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

io.on('connection', function onConnection(socket) {
  stateManager.connection(socket);
  console.log(stateManager.getRooms());

  socket.on('disconnect', function () {
    stateManager.disconnect(socket);
    console.log(stateManager.getRooms());
  });
});
