//socketIOモジュール
function socketIO(server){
  var io = require('socket.io')(server, {
    cors: {
      origin: '*',
    }
  });
  
  // let messageQueue = [];
  //socket処理を記載する
  io.on('connection', function(socket){

    // サーバー側で保持しているメッセージをクライアント側に送信する
    // if (messageQueue.length > 0) {  
    //   messageQueue.forEach(message => {
    //     socket.emit('new-message', message)
    //   })
    // }

    // クライアントから送信があった場合のイベントを作成する
    socket.on('send-message', message => {
      console.log(message);
      // サーバーで保持している変数にメッセージを格納する
      // messageQueue.push(message);
      // 送信を行ったクライアント以外のクライアントに対してメッセージを送信する
      socket.broadcast.emit('new-message', message)
    })
  });
};

//export
module.exports = socketIO;