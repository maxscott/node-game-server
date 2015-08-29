
var Notifier = function Notifier (socketio) {
  this.io = socketio;
}

Notifier.prototype.joined = function(joiningPlayer, room) {
  var joinersMessage = { players: room.players };
  var roomsMessage = { players: {} };
  roomsMessage.players[joiningPlayer.id] = joiningPlayer;
  
  for (var playerId in room.players) {
    if (playerId === joiningPlayer.id) {
      this.io.to(playerId).emit('joined', joinersMessage);
    } else {
      this.io.to(playerId).emit('joined', roomsMessage);
    }
  }
}

Notifier.prototype.left = function(playerId, room) {
  var message = {
    who: playerId
  };

  for (var player in room.players) {
    this.io.to(player).emit('left', message);
  }
}

module.exports = Notifier;
