//socketIOモジュール
function socketIO(server){
  var io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });
  
  //socket処理を記載する
  io.on('connection', function(socket){
    //socket処理
    socket.on('message',function(msg){
      console.log('message: ' + msg);
      io.emit('message', msg);
      socket.broadcast.emit('message', msg)
    });

  });
};

//export
module.exports = socketIO;