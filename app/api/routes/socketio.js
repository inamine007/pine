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

    // 切断時の処理
        // ・クライアントが切断したら、サーバー側では"disconnect"イベントが発生する
        socket.on(
          "disconnect",
          () =>
          {
              console.log( "disconnect : ", socket.id );
          } );

      // signalingデータ受信時の処理
      // ・クライアント側のsignalingデータ送信「socket.emit( "signaling", objData );」に対する処理
      socket.on(
          "signaling",
          ( objData ) =>
          {
              console.log( "signaling : ", socket.id );
              console.log( "- type : ", objData.type );

              // 指定の相手に送信
              if( "to" in objData )
              {
                  console.log( "- to : ", objData.to );
                  // 送信元SocketIDを送信データに付与し、指定の相手に送信
                  objData.from = socket.id;
                  socket.to( objData.to ).emit( "signaling", objData );
              }
              else
              {
                  console.error( "Unexpected : Unknown destination" );
              }
          } );

      // ビデオチャット参加時の処理
      socket.on(
          "join",
          ( objData ) =>
          {
              console.log( "join : ", socket.id );

              // 「join」を送信元以外の全員に送信
              // 送信元SocketIDを送信データに付与し、送信元以外の全員に送信
              socket.broadcast.emit( "signaling", { from: socket.id, type: "join" } );
          } );

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