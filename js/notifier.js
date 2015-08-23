
var Notifier = function Notifier (socketio) {
  this.io = socketio;
}

Notifier.prototype.joined = function(playerId, room) {
  var message = {
    players: room.players
  };

  for (var player in room.players) {
    this.io.to(player).emit('joined', message);
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
