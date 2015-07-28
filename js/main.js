var io = require('socket.io/socket.io.js')();

io.on('joined', function (message) {
  console.log(message, 'joined');
});
io.on('left', function (message) {
  console.log(message, 'left');
});
