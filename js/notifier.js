
var Notifier = function Notifier (socketio) {
  this.io = socketio;
}

Notifier.prototype.joined = function(playerId, room) {
  var message = {
    type: "joined",
    who: playerId
  };

  for (var player in room.players) {
    this.io.emit(player, message);
  }
}

Notifier.prototype.left = function(playerId, room) {
  var message = {
    type: "left",
    who: playerId
  };

  for (var player in room.players) {
    this.io.emit(player, message);
  }
}
module.exports = Notifier;
