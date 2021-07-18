<template>
  <div class="container">
    <h1 style="margin: 8px">My Video Chat</h1>
    <div style="flex: 1;">
        <div id="div_join_screen">
          <input type="text" id="input_username" placeholder="Enter User name" autofocus>User name ( Nick name )<br /><br /><br />
          <input type="submit" value="Join" @click="onsubmitButton_Join();">
        </div>
        <div id="div_chat_screen" style="margin: 8px; display: none;">
          <input type="checkbox" id="checkbox_camera" @click="onclickCheckbox_CameraMicrophone()">Camera
          <input type="checkbox" id="checkbox_microphone" @click="onclickCheckbox_CameraMicrophone()">Microphone
          <br />
          <div id="div_userinfo" style="display: flex; flex-wrap: wrap">
            <div border="1px solid black"><input type="text" id="text_username" readonly="readonly"><br /><video id="video_local" width="320" height="240" style="border: 1px solid black;" autoplay></video></div>
            <div border="1px solid black"><input type="text" id="text_remote_username" readonly="readonly"><br /><video id="video_remote" width="320" height="240" style="border: 1px solid black;" autoplay></video><audio id="audio_remote" autoplay></audio></div>
          </div>
          <input type="text" id="text_message_for_send" size="40" /><input type="submit" value="Send message" @click="onsubmitButton_SendMessage();"/>
          <textarea id="textarea_message_received" rows="10" cols="60" readonly="readonly"></textarea>
          <br />
          <button @click="onclickButton_LeaveChat()">Leave Chat.</button>
        </div>
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
  data() {
    return {
      g_elementDivJoinScreen: "",
      g_elementDivChatScreen: "",
      g_elementInputUserName: "",
      g_elementCheckboxCamera: "",
      g_elementCheckboxMicrophone: "",
      g_elementTextUserName: "",
      g_elementTextRemoteUserName: "",
      g_elementVideoLocal: "",
      g_elementVideoRemote: "",
      g_elementAudioRemote: "",
      g_elementTextMessageForSend: "",
      g_elementTextareaMessageReceived: "",
      g_rtcPeerConnection: null,
      socket: ''
    }
  },
  async asyncData({ $axios, store }) {
    
  },
  mounted() {
    // ↓↓↓グローバル変数↓↓↓
    this.socket = io('http://localhost:3001');
    this.g_elementDivJoinScreen= document.getElementById( "div_join_screen" );
    this.g_elementDivChatScreen= document.getElementById( "div_chat_screen" );
    this.g_elementInputUserName= document.getElementById( "input_username" );
    this.g_elementCheckboxCamera= document.getElementById( "checkbox_camera" );
    this.g_elementCheckboxMicrophone= document.getElementById( "checkbox_microphone" );
    this.g_elementTextUserName= document.getElementById( "text_username" );
    this.g_elementTextRemoteUserName= document.getElementById( "text_remote_username" );
    this.g_elementVideoLocal= document.getElementById( "video_local" );
    this.g_elementVideoRemote= document.getElementById( "video_remote" );
    this.g_elementAudioRemote= document.getElementById( "audio_remote" );
    this.g_elementTextMessageForSend= document.getElementById( "text_message_for_send" );
    this.g_elementTextareaMessageReceived= document.getElementById( "textarea_message_received" );

    const socket = this.socket;
    const g_elementTextUserName= this.g_elementTextUserName;
    const g_elementVideoRemote= this.g_elementVideoRemote;
    const g_elementAudioRemote= this.g_elementAudioRemote;
    const g_elementTextareaMessageReceived= this.g_elementTextareaMessageReceived;
    window.addEventListener("beforeunload", ( event ) => {
      event.preventDefault(); // 既定の動作のキャンセル

      onclickButton_LeaveChat();        // チャットからの離脱
      this.socket.disconnect();    // Socket.ioによるサーバーとの接続の切断

      e.returnValue = ""; // Chrome では returnValue を設定する必要がある
      return ""; // Chrome 以外では、return を設定する必要がある
    });

    this.socket.on("connect", () => {
      console.log( "Socket Event : connect" );
    });

    this.socket.on("signaling", ( objData ) => {
      console.log( "Socket Event : signaling" );
      console.log( "- type : ", objData.type );
      console.log( "- data : ", objData.data );

      // 送信元のSocketID
      let strRemoteSocketID = objData.from;
      console.log( "- from : ", objData.from );
      if( !g_elementTextUserName.value ) {
        // 自身がまだ参加していないときは、"signaling"イベントを無視。
        console.log( "Ignore 'signaling' event because I haven't join yet." );
        return;
      }

      if( "join" === objData.type ) {
        // onclickButton_CreateOfferSDP()、onclickButton_SendOfferSDP()と同様の処理

        if( this.g_rtcPeerConnection ) {
          // 既にコネクションオブジェクトあり
          alert( "Connection object already exists." );
          return;
        }
        // RTCPeerConnectionオブジェクトの作成
        console.log( "Call : createPeerConnection()" );
        let rtcPeerConnection = createPeerConnection( this.g_elementVideoLocal.srcObject, strRemoteSocketID );
        this.g_rtcPeerConnection = rtcPeerConnection;    // グローバル変数に設定

        // DataChannelの作成
        let datachannel = rtcPeerConnection.createDataChannel( "datachannel" );
        // DataChannelオブジェクトをRTCPeerConnectionオブジェクトのメンバーに追加。
        rtcPeerConnection.datachannel = datachannel;
        // DataChannelオブジェクトのイベントハンドラの構築
        console.log( "Call : setupDataChannelEventHandler()" );
        setupDataChannelEventHandler( rtcPeerConnection );

        // OfferSDPの作成
        console.log( "Call : createOfferSDP()" );
        createOfferSDP( rtcPeerConnection );
      } else if( "offer" === objData.type ) {
        // onclickButton_SetOfferSDPandCreateAnswerSDP()と同様の処理
        // 設定するOffserSDPとして、テキストエリアのデータではなく、受信したデータを使用する。
        if( this.g_rtcPeerConnection ) {
          // 既にコネクションオブジェクトあり
          alert( "Connection object already exists." );
          return;
        }

        // RTCPeerConnectionオブジェクトの作成
        console.log( "Call : createPeerConnection()" );
        let rtcPeerConnection = createPeerConnection( this.g_elementVideoLocal.srcObject, strRemoteSocketID );
        this.g_rtcPeerConnection = rtcPeerConnection;    // グローバル変数に設定

        // OfferSDPの設定とAnswerSDPの作成
        console.log( "Call : setOfferSDP_and_createAnswerSDP()" );
        setOfferSDP_and_createAnswerSDP( rtcPeerConnection, objData.data );   // 受信したSDPオブジェクトを渡す。

        // リモートユーザー名の設定
        this.g_elementTextRemoteUserName.value = objData.username;
      } else if( "answer" === objData.type ) {
        // onclickButton_SetAnswerSDPthenChatStarts()と同様の処理
        // 設定するAnswerSDPとして、テキストエリアのデータではなく、受信したデータを使用する。

        if( !this.g_rtcPeerConnection ) {
          // コネクションオブジェクトがない
          alert( "Connection object does not exist." );
          return;
        }

        // AnswerSDPの設定
        console.log( "Call : setAnswerSDP()" );
        setAnswerSDP( this.g_rtcPeerConnection, objData.data );   // 受信したSDPオブジェクトを渡す。

        // リモートユーザー名の設定
        this.g_elementTextRemoteUserName.value = objData.username;
      } else if( "candidate" === objData.type ) {
        if( !this.g_rtcPeerConnection ) {
          // コネクションオブジェクトがない
          alert( "Connection object does not exist." );
          return;
        }

        // Vanilla ICEの場合は、ここには来ない。
        // Trickle ICEの場合は、相手側のICE candidateイベントで送信されたICE candidateを、コネクションに追加する。

        // ICE candidateの追加
        console.log( "Call : addCandidate()" );
        addCandidate( this.g_rtcPeerConnection, objData.data );   // 受信したICE candidateの追加
      } else {
        console.error( "Unexpected : Socket Event : signaling" );
      }
    });

    function setupDataChannelEventHandler( rtcPeerConnection ) {
      if( !( "datachannel" in rtcPeerConnection ) ) {
        console.error( "Unexpected : DataChannel does not exist." );
        return;
      }

      // message イベントが発生したときのイベントハンドラ
      rtcPeerConnection.datachannel.onmessage = ( event ) => {
        console.log( "DataChannel Event : message" );
        let objData = JSON.parse( event.data );
        console.log( "- type : ", objData.type );
        console.log( "- data : ", objData.data );

        if( "message" === objData.type ) {
          // 受信メッセージをメッセージテキストエリアへ追加
          let strMessage = objData.data;
          g_elementTextareaMessageReceived.value = strMessage + "\n" + g_elementTextareaMessageReceived.value; // 一番上に追加
          //this.g_elementTextareaMessageReceived.value += strMessage + "\n";  // 一番下に追加
        } else if( "offer" === objData.type ) {
          // 受信したOfferSDPの設定とAnswerSDPの作成
          console.log( "Call : setOfferSDP_and_createAnswerSDP()" );
          setOfferSDP_and_createAnswerSDP( rtcPeerConnection, objData.data );
        } else if( "answer" === objData.type ) {
          // 受信したAnswerSDPの設定
          console.log( "Call : setAnswerSDP()" );
          setAnswerSDP( rtcPeerConnection, objData.data );
        } else if( "candidate" === objData.type ) {
          // 受信したICE candidateの追加
          console.log( "Call : addCandidate()" );
          addCandidate( rtcPeerConnection, objData.data );
        } else if( "leave" === objData.type ) {
          console.log( "Call : endPeerConnection()" );
          endPeerConnection( rtcPeerConnection );
        }
      }
    }
    function isDataChannelOpen( rtcPeerConnection ) {
      if( !( "datachannel" in rtcPeerConnection ) ) {
        // datachannelメンバーが存在しない
        return false;
      }
      if( !rtcPeerConnection.datachannel ) {
        // datachannelメンバーがnull
        return false;
      }
      if( "open" !== rtcPeerConnection.datachannel.readyState ) {
        // datachannelメンバーはあるが、"open"でない。
        return false;
      }
      // DataCchannelが開いている
      return true;
    }
    function createPeerConnection( stream, strRemoteSocketID ) {
      // RTCPeerConnectionオブジェクトの生成
      let config = {
        "iceServers": [
          { "urls": "stun:stun.l.google.com:19302" },
          { "urls": "stun:stun1.l.google.com:19302" },
          { "urls": "stun:stun2.l.google.com:19302" },
        ]
      };
      let rtcPeerConnection = new RTCPeerConnection( config );

      // チャット相手のSocketIDをRTCPeerConnectionオブジェクトのメンバーに追加。
      rtcPeerConnection.strRemoteSocketID = strRemoteSocketID;

      // RTCPeerConnectionオブジェクトのイベントハンドラの構築
      setupRTCPeerConnectionEventHandler( rtcPeerConnection );

      // RTCPeerConnectionオブジェクトのストリームにローカルのメディアストリームを追加
      if( stream ) {
        // - 古くは、RTCPeerConnection.addStream(stream) を使用していたが、廃止予定となった。
        //   現在は、RTCPeerConnection.addTrack(track, stream) を使用する。
        stream.getTracks().forEach( ( track ) => {
          rtcPeerConnection.addTrack( track, stream );
        });
      } else {
        console.log( "No local stream." );
      }
      return rtcPeerConnection;
    }
    function endPeerConnection( rtcPeerConnection ) {
      // リモート映像の停止
      console.log( "Call : setStreamToElement( Video_Remote, null )" );
      setStreamToElement( g_elementVideoRemote, null );
      // リモート音声の停止
      console.log( "Call : setStreamToElement( Audio_Remote, null )" );
      setStreamToElement( g_elementAudioRemote, null );

      // DataChannelの終了
      if( "datachannel" in rtcPeerConnection ) {
        rtcPeerConnection.datachannel.close();
        rtcPeerConnection.datachannel = null;
      }

      // グローバル変数のクリア
      g_rtcPeerConnection = null;

      // ピアコネクションの終了
      rtcPeerConnection.close();
    }
    function setupRTCPeerConnectionEventHandler( rtcPeerConnection ) {
      // Negotiation needed イベントが発生したときのイベントハンドラ
      // - このイベントは、セッションネゴシエーションを必要とする変更が発生したときに発生する。
      //   一部のセッション変更はアンサーとしてネゴシエートできないため、このネゴシエーションはオファー側として実行されなければならない。
      //   最も一般的には、negotiationneededイベントは、RTCPeerConnectionに送信トラックが追加された後に発生する。
      //   ネゴシエーションがすでに進行しているときに、ネゴシエーションを必要とする方法でセッションが変更された場合、
      //   ネゴシエーションが完了するまで、negotiationneededイベントは発生せず、ネゴシエーションがまだ必要な場合にのみ発生する。
      //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onnegotiationneeded
      rtcPeerConnection.onnegotiationneeded = () => {
        console.log( "Event : Negotiation needed" );

        if( !isDataChannelOpen( rtcPeerConnection ) ) {
          // チャット前
          // OfferSDPの作成は、ユーザーイベントから直接呼び出すので、
          // Negotiation Neededイベントは無視する。
        } else {
          // チャット中
          // OfferSDPを作成し、DataChannelを通して相手に直接送信
          console.log( "Call : createOfferSDP()" );
          createOfferSDP( rtcPeerConnection );
        }
      };

      // ICE candidate イベントが発生したときのイベントハンドラ
      // - これは、ローカルのICEエージェントがシグナリング・サーバを介して
      //   他のピアにメッセージを配信する必要があるときはいつでも発生する。
      //   これにより、ブラウザ自身がシグナリングに使用されている技術についての詳細を知る必要がなく、
      //   ICE エージェントがリモートピアとのネゴシエーションを実行できるようになる。
      //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onicecandidate
      rtcPeerConnection.onicecandidate = ( event ) => {
        console.log( "Event : ICE candidate" );
        if( event.candidate ) {
          // ICE candidateがある
          console.log( "- ICE candidate : ", event.candidate );

          // Vanilla ICEの場合は、何もしない
          // Trickle ICEの場合は、ICE candidateを相手に送る

          if( !isDataChannelOpen( rtcPeerConnection ) ) {
            // チャット前
            // ICE candidateをサーバーを経由して相手に送信
            console.log( "- Send ICE candidate to server" );
            socket.emit( "signaling", { to: rtcPeerConnection.strRemoteSocketID, type: "candidate", data: event.candidate } );
          } else {
            // チャット中
            // ICE candidateをDataChannelを通して相手に直接送信
            console.log( "- Send ICE candidate through DataChannel" );
            rtcPeerConnection.datachannel.send( JSON.stringify( { type: "candidate", data: event.candidate } ) );
          }
        } else {
          // ICE candiateがない = ICE candidate の収集終了。
          console.log( "- ICE candidate : empty" );
        }
      };

      // ICE candidate error イベントが発生したときのイベントハンドラ
      // - このイベントは、ICE候補の収集処理中にエラーが発生した場合に発生する。
      //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onicecandidateerror
      rtcPeerConnection.onicecandidateerror = ( event ) => {
        console.error( "Event : ICE candidate error. error code : ", event.errorCode );
      };

      // ICE gathering state change イベントが発生したときのイベントハンドラ
      // - このイベントは、ICE gathering stateが変化したときに発生する。
      //   言い換えれば、ICEエージェントがアクティブに候補者を収集しているかどうかが変化したときに発生する。
      //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onicegatheringstatechange
      rtcPeerConnection.onicegatheringstatechange = () => {
        console.log( "Event : ICE gathering state change" );
        console.log( "- ICE gathering state : ", rtcPeerConnection.iceGatheringState );

        if( "complete" === rtcPeerConnection.iceGatheringState ) {
          // Vanilla ICEの場合は、ICE candidateを含んだOfferSDP/AnswerSDPを相手に送る
          // Trickle ICEの場合は、何もしない
          
          if( "offer" === rtcPeerConnection.localDescription.type ) {
            // OfferSDPをサーバーに送信
            //console.log( "- Send OfferSDP to server" );
            //this.socket.emit( "signaling", { type: "offer", data: rtcPeerConnection.localDescription } );
          } else if( "answer" === rtcPeerConnection.localDescription.type ) {
            // AnswerSDPをサーバーに送信
            //console.log( "- Send AnswerSDP to server" );
            //this.socket.emit( "signaling", { type: "answer", data: rtcPeerConnection.localDescription } );
          } else {
            console.error( "Unexpected : Unknown localDescription.type. type = ", rtcPeerConnection.localDescription.type );
          }
        }
      };

      // ICE connection state change イベントが発生したときのイベントハンドラ
      // - このイベントは、ネゴシエーションプロセス中にICE connection stateが変化するたびに発生する。 
      // - 接続が成功すると、通常、状態は「new」から始まり、「checking」を経て、「connected」、最後に「completed」と遷移します。 
      //   ただし、特定の状況下では、「connected」がスキップされ、「checking」から「completed」に直接移行する場合があります。
      //   これは、最後にチェックされた候補のみが成功した場合に発生する可能性があり、成功したネゴシエーションが完了する前に、
      //   収集信号と候補終了信号の両方が発生します。
      //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/iceconnectionstatechange_event
      rtcPeerConnection.oniceconnectionstatechange = () => {
        console.log( "Event : ICE connection state change" );
        console.log( "- ICE connection state : ", rtcPeerConnection.iceConnectionState );
        // "disconnected" : コンポーネントがまだ接続されていることを確認するために、RTCPeerConnectionオブジェクトの少なくとも
        //                  1つのコンポーネントに対して失敗したことを確認します。これは、"failed "よりも厳しいテストではなく、
        //                  断続的に発生し、信頼性の低いネットワークや一時的な切断中に自然に解決することがあります。問題が
        //                  解決すると、接続は "接続済み "の状態に戻ることがあります。
        // "failed"       : ICE candidateは、すべての候補のペアを互いにチェックしたが、接続のすべてのコンポーネントに
        //                  互換性のあるものを見つけることができなかった。しかし、ICEエージェントがいくつかの
        //                  コンポーネントに対して互換性のある接続を見つけた可能性がある。
        // see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/iceConnectionState
      };

      // Signaling state change イベントが発生したときのイベントハンドラ
      // - このイベントは、ピア接続のsignalStateが変化したときに送信される。
      //   これは、setLocalDescription（）またはsetRemoteDescription（）の呼び出しが原因で発生する可能性がある。
      //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onsignalingstatechange
      rtcPeerConnection.onsignalingstatechange = () => {
        console.log( "Event : Signaling state change" );
        console.log( "- Signaling state : ", rtcPeerConnection.signalingState );
      };

      // Connection state change イベントが発生したときのイベントハンドラ
      // - このイベントは、ピア接続の状態が変化したときに送信される。
      //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onconnectionstatechange
      rtcPeerConnection.onconnectionstatechange = () => {
        console.log( "Event : Connection state change" );
        console.log( "- Connection state : ", rtcPeerConnection.connectionState );
        // "disconnected" : 接続のためのICEトランスポートの少なくとも1つが「disconnected」状態であり、
        //                  他のトランスポートのどれも「failed」、「connecting」、「checking」の状態ではない。
        // "failed"       : 接続の1つ以上のICEトランスポートが「失敗」状態になっている。
        // see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionState

        if( "failed" === rtcPeerConnection.connectionState ) {
          // 「ビデオチャット相手との通信が切断」が「しばらく」続き、通信が復帰しないとき、Connection state「failed」となる。
          // - 「ビデオチャット相手との通信が切断」になると「すぐに」Connection state「failed」となるわけではない。
          // - 相手のチャット離脱後、速やかにコネクション終了処理を行うためには、離脱側からチャット離脱メッセージを送信し、受信側でコネクション終了処理を行うようにする。
          console.log( "Call : endPeerConnection()" );
          endPeerConnection( rtcPeerConnection );
        }
      };

      // Track イベントが発生したときのイベントハンドラ
      // - このイベントは、新しい着信MediaStreamTrackが作成され、
      //   コネクション上のレシーバーセットに追加されたRTCRtpReceiverオブジェクトに関連付けられたときに送信される。
      //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/ontrack
      // - 古くは、rtcPeerConnection.onaddstream に設定していたが、廃止された。
      //   現在は、rtcPeerConnection.ontrack に設定する。
      rtcPeerConnection.ontrack = ( event ) => {
        console.log( "Event : Track" );
        console.log( "- stream", event.streams[0] );
        console.log( "- track", event.track );

        // HTML要素へのリモートメディアストリームの設定
        let stream = event.streams[0];
        let track = event.track;
        if( "video" === track.kind ) {
          console.log( "Call : setStreamToElement( Video_Remote, stream )" );
          setStreamToElement( g_elementVideoRemote, stream );
        } else if( "audio" === track.kind ) {
          console.log( "Call : setStreamToElement( Audio_Remote, stream )" );
          setStreamToElement( g_elementAudioRemote, stream );
        } else {
          console.error( "Unexpected : Unknown track kind : ", track.kind );
        }

        // 相手のメディアストリームがRTCPeerConnectionから削除されたときのイベントハンドラ
        // - 相手の RTCPeerConnection.removeTrack( sender );
        //   の結果として、streamの「removetrack」イベントが発生する。
        // - 古くは、rtcPeerConnection.onremovetrack に設定していたが、廃止された。
        //   現在は、stream.onremovetrack に設定する。
        stream.onremovetrack = ( evt ) => {
          console.log( "Stream Event : remove track" );
          console.log( "- stream", stream );
          console.log( "- track", evt.track );

          // HTML要素のメディアストリームの解除
          let trackRemove = evt.track;
          if( "video" === trackRemove.kind ) {
            console.log( "Call : setStreamToElement( Video_Remote, null )" );
            setStreamToElement( g_elementVideoRemote, null );
          } else if( "audio" === trackRemove.kind ) {
            console.log( "Call : setStreamToElement( Audio_Remote, null )" );
            setStreamToElement( g_elementAudioRemote, null );
          } else {
            console.error( "Unexpected : Unknown track kind : ", trackRemove.kind );
          }
        };
      };

      // Data channel イベントが発生したときのイベントハンドラ
      // - このイベントは、createDataChannel() を呼び出すリモートピアによって
      //   RTCDataChannelが接続に追加されたときに送信されます。
      //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/ondatachannel
      rtcPeerConnection.ondatachannel = ( event ) => {
        console.log( "Event : Data channel" );

        // DataChannelオブジェクトをRTCPeerConnectionオブジェクトのメンバーに追加。
        rtcPeerConnection.datachannel = event.channel;
        // DataChannelオブジェクトのイベントハンドラの構築
        console.log( "Call : setupDataChannelEventHandler()" );
        setupDataChannelEventHandler( rtcPeerConnection );
        
        // オファーをされた側として、OfferSDPを作成し、DataChannelを通して相手に直接送信
        // （オファーした側でカメラや（orマイク）をOnにしなかった場合、
        //   オファーされた側でカメラ（orマイク）をOnにしても、
        //   カメラ映像（orマイク音声）の通信ストリームは作成されず、カメラ映像（マイク音声）は相手に送信されない。
        //   オファーされた側として、OfferSDPを作成、送信することで、
        //   オファーした側、オファーされた側、双方で必要な通信ストリームが整う。）
        console.log( "Call : createOfferSDP()" );
        createOfferSDP( rtcPeerConnection );
      };
    }
    function createOfferSDP( rtcPeerConnection ) {
      // OfferSDPの作成
      console.log( "Call : rtcPeerConnection.createOffer()" );
      rtcPeerConnection.createOffer().then( ( sessionDescription ) => {
        // 作成されたOfferSDPををLocalDescriptionに設定
        console.log( "Call : rtcPeerConnection.setLocalDescription()" );
        return rtcPeerConnection.setLocalDescription( sessionDescription );
      }).then( () => {
        // Vanilla ICEの場合は、まだSDPを相手に送らない
        // Trickle ICEの場合は、初期SDPを相手に送る

        if( !isDataChannelOpen( rtcPeerConnection ) ) {
          // チャット前
          // 初期OfferSDPをサーバーを経由して相手に送信
          console.log( "- Send OfferSDP to server" );
          socket.emit( "signaling", { to: rtcPeerConnection.strRemoteSocketID, type: "offer", data: rtcPeerConnection.localDescription, username: g_elementTextUserName.value } );
        } else {
          // チャット中
          // 初期OfferSDPをDataChannelを通して相手に直接送信
          console.log( "- Send OfferSDP through DataChannel" );
          rtcPeerConnection.datachannel.send( JSON.stringify( { type: "offer", data: rtcPeerConnection.localDescription } ) );
        }
      }).catch( ( error ) => {
        console.error( "Error : ", error );
      });
    }
    function setOfferSDP_and_createAnswerSDP( rtcPeerConnection, sessionDescription ) {
      console.log( "Call : rtcPeerConnection.setRemoteDescription()" );
      rtcPeerConnection.setRemoteDescription( sessionDescription ).then( () => {
        // AnswerSDPの作成
        console.log( "Call : rtcPeerConnection.createAnswer()" );
        return rtcPeerConnection.createAnswer();
      }).then( ( sessionDescription ) => {
        // 作成されたAnswerSDPををLocalDescriptionに設定
        console.log( "Call : rtcPeerConnection.setLocalDescription()" );
        return rtcPeerConnection.setLocalDescription( sessionDescription );
      }).then( () => {
        // Vanilla ICEの場合は、まだSDPを相手に送らない
        // Trickle ICEの場合は、初期SDPを相手に送る

        if( !isDataChannelOpen( rtcPeerConnection ) ) {
          // チャット前
          // 初期AnswerSDPをサーバーを経由して相手に送信
          console.log( "- Send AnswerSDP to server" );
          socket.emit( "signaling", { to: rtcPeerConnection.strRemoteSocketID, type: "answer", data: rtcPeerConnection.localDescription, username: g_elementTextUserName.value } );
        } else {
          // チャット中
          // 初期AnswerSDPをDataChannelを通して相手に直接送信
          console.log( "- Send AnswerSDP through DataChannel" );
          rtcPeerConnection.datachannel.send( JSON.stringify( { type: "answer", data: rtcPeerConnection.localDescription } ) );
        }
      }).catch( ( error ) => {
        console.error( "Error : ", error );
      });
    }
    function setAnswerSDP( rtcPeerConnection, sessionDescription ) {
      console.log( "Call : rtcPeerConnection.setRemoteDescription()" );
      rtcPeerConnection.setRemoteDescription( sessionDescription ).catch( ( error ) => {
        console.error( "Error : ", error );
      });
    }
    function addCandidate( rtcPeerConnection, candidate ) {
      console.log( "Call : rtcPeerConnection.addIceCandidate()" );
      rtcPeerConnection.addIceCandidate( candidate ).catch( ( error ) => {
        console.error( "Error : ", error );
      });
    }
    function setStreamToElement( elementMedia, stream ) {
      // メディアストリームを、メディア用のHTML要素のsrcObjに設定する。
      // - 古くは、elementVideo.src = URL.createObjectURL( stream ); のように書いていたが、URL.createObjectURL()は、廃止された。
      //   現在は、elementVideo.srcObject = stream; のように書く。
      elementMedia.srcObject = stream;

      if( !stream ) {
        // メディアストリームの設定解除の場合は、ここで処理終了
        return;
      }
      // 音量
      if( "VIDEO" === elementMedia.tagName ) {
        // VIDEO：ボリュームゼロ、ミュート
        elementMedia.volume = 0.0;
        elementMedia.muted = true;
      } else if( "AUDIO" === elementMedia.tagName ) {
        // AUDIO：ボリュームあり、ミュートでない
        elementMedia.volume = 1.0;
        elementMedia.muted = false;
      } else {
        console.error( "Unexpected : Unknown ElementTagName : ", elementMedia.tagName );
      }
    }
  },  
  beforeDestroy() {
    window.addEventListener(
    "beforeunload",
    ( event ) =>
    {
        event.preventDefault(); // 既定の動作のキャンセル

        onclickButton_LeaveChat();        // チャットからの離脱
        this.socket.disconnect();    // Socket.ioによるサーバーとの接続の切断

        e.returnValue = ""; // Chrome では returnValue を設定する必要がある
        return ""; // Chrome 以外では、return を設定する必要がある
    } );
  },
  methods: {
    setStreamToElement( elementMedia, stream ) {
      // メディアストリームを、メディア用のHTML要素のsrcObjに設定する。
      // - 古くは、elementVideo.src = URL.createObjectURL( stream ); のように書いていたが、URL.createObjectURL()は、廃止された。
      //   現在は、elementVideo.srcObject = stream; のように書く。
      elementMedia.srcObject = stream;

      if( !stream ) {
        // メディアストリームの設定解除の場合は、ここで処理終了
        return;
      }
      // 音量
      if( "VIDEO" === elementMedia.tagName ) {
        // VIDEO：ボリュームゼロ、ミュート
        elementMedia.volume = 0.0;
        elementMedia.muted = true;
      } else if( "AUDIO" === elementMedia.tagName ) {
        // AUDIO：ボリュームあり、ミュートでない
        elementMedia.volume = 1.0;
        elementMedia.muted = false;
      } else {
        console.error( "Unexpected : Unknown ElementTagName : ", elementMedia.tagName );
      }
    },
    onsubmitButton_Join() {
      console.log( "UI Event : 'Join' button clicked." );

      // ユーザー名
      let strInputUserName = this.g_elementInputUserName.value;
      console.log( "- User name :", strInputUserName );
      if( !strInputUserName ) {
        return;
      }
      this.g_elementTextUserName.value = strInputUserName;

      // サーバーに"join"を送信
      console.log( "- Send 'Join' to server" );
      this.socket.emit( "join", {} );

      // 画面の切り替え
      this.g_elementDivJoinScreen.style.display = "none";  // 参加画面の非表示
      this.g_elementDivChatScreen.style.display = "block";  // チャット画面の表示
    },
    onclickCheckbox_CameraMicrophone() {
      // これまでの状態
      let trackCamera_old = null;
      let trackMicrophone_old = null;
      let bCamera_old = false;
      let bMicrophone_old = false;
      let idCameraTrack_old = "";
      let idMicrophoneTrack_old = "";
      let stream = this.g_elementVideoLocal.srcObject;
      if( stream ) {
        trackCamera_old = stream.getVideoTracks()[0];
        if( trackCamera_old ) {
          bCamera_old = true;
          idCameraTrack_old = trackCamera_old.id;
        }
        trackMicrophone_old = stream.getAudioTracks()[0];
        if( trackMicrophone_old ) {
          bMicrophone_old = true;
          idMicrophoneTrack_old = trackMicrophone_old.id;
        }
      }
      
      // 今後の状態
      let bCamera_new = false;
      if( this.g_elementCheckboxCamera.checked ) {
        bCamera_new = true;
      }
      let bMicrophone_new = false;
      if( this.g_elementCheckboxMicrophone.checked ) {
        bMicrophone_new = true;
      }

      // 状態変化
      console.log( "Camera :  %s => %s", bCamera_old, bCamera_new );
      console.log( "Microphoneo : %s = %s", bMicrophone_old, bMicrophone_new );

      if( bCamera_old === bCamera_new && bMicrophone_old === bMicrophone_new ) {  
        // チェックボックスの状態の変化なし
        return;
      }

      if( this.g_rtcPeerConnection ) {
        // コネクションオブジェクトに対してTrack削除を行う。
        // （コネクションオブジェクトに対してTrack削除を行わなかった場合、使用していないstream通信が残る。）
        let senders = this.g_rtcPeerConnection.getSenders();
        senders.forEach( ( sender ) => {
          if( sender.track ) {
            if( idCameraTrack_old === sender.track.id
              || idMicrophoneTrack_old === sender.track.id)
            {
              this.g_rtcPeerConnection.removeTrack( sender );
              // removeTrack()の結果として、通信相手に、streamの「removetrack」イベントが発生する。
            }
          }
        });
      }

      // 古いメディアストリームのトラックの停止（トラックの停止をせず、HTML要素のstreamの解除だけではカメラは停止しない（カメラ動作LEDは点いたまま））
      if( trackCamera_old ) {
        console.log( "Call : trackCamera_old.stop()" );
        trackCamera_old.stop();
      }
      if( trackMicrophone_old ) {
        console.log( "Call : trackMicrophone_old.stop()" );
        trackMicrophone_old.stop();
      }
      // HTML要素のメディアストリームの解除
      console.log( "Call : setStreamToElement( Video_Local, null )" );
      this.setStreamToElement( this.g_elementVideoLocal, null );

      if( !bCamera_new && !bMicrophone_new ) {
        // （チェックボックスの状態の変化があり、かつ、）カメラとマイクを両方Offの場合
        return;
      }

      // （チェックボックスの状態の変化があり、かつ、）カメラとマイクのどちらかもしくはどちらもOnの場合

      // 自分のメディアストリームを取得する。
      // - 古くは、navigator.getUserMedia() を使用していたが、廃止された。
      //   現在は、navigator.mediaDevices.getUserMedia() が新たに用意され、これを使用する。
      navigator.mediaDevices.getUserMedia( { video: bCamera_new, audio: bMicrophone_new } ).then( ( stream ) => {
        if( this.g_rtcPeerConnection ) {
          // コネクションオブジェクトに対してTrack追加を行う。
          stream.getTracks().forEach( ( track ) => {
            this.g_rtcPeerConnection.addTrack( track, stream );
            // addTrack()の結果として、「Negotiation needed」イベントが発生する。
          });
        }

        // HTML要素へのメディアストリームの設定
        console.log( "Call : setStreamToElement( Video_Local, stream )" );
        this.setStreamToElement( this.g_elementVideoLocal, stream );
      }).catch( ( error ) => {
        // メディアストリームの取得に失敗⇒古いメディアストリームのまま。チェックボックスの状態を戻す。
        console.error( "Error : ", error );
        alert( "Could not start Camera." );
        this.g_elementCheckboxCamera.checked = false;
        this.g_elementCheckboxMicrophone.checked = false;
        return;
      });
    },
    onsubmitButton_SendMessage() {
      console.log( "UI Event : 'Send Message' button clicked." );
      if( !this.g_rtcPeerConnection ) {
        // コネクションオブジェクトがない
        alert( "Connection object does not exist." );
        return;
      }
      if( !isDataChannelOpen( this.g_rtcPeerConnection ) ) {
        // DataChannelオブジェクトが開いていない
        alert( "Datachannel is not open." );
        return;
      }

      if( !this.g_elementTextMessageForSend.value ) {
        alert( "Message for send is empty. Please enter the message for send." );
        return;
      }

      // メッセージをDataChannelを通して相手に直接送信
      console.log( "- Send Message through DataChannel" );
      this.g_rtcPeerConnection.datachannel.send( JSON.stringify( { type: "message", data: this.g_elementTextMessageForSend.value } ) );

      // 送信メッセージをメッセージテキストエリアへ追加
      this.g_elementTextareaMessageReceived.value = this.g_elementTextMessageForSend.value + "\n" + this.g_elementTextareaMessageReceived.value; // 一番上に追加
      //this.g_elementTextareaMessageReceived.value += this.g_elementTextMessageForSend.value + "\n"; // 一番下に追加
      this.g_elementTextMessageForSend.value = "";
    }
  },
  onclickButton_LeaveChat() {
    console.log( "UI Event : 'Leave Chat.' button clicked." );

    if( this.g_rtcPeerConnection ) {
      if( isDataChannelOpen( this.g_rtcPeerConnection ) ) {
        // チャット中
        // チャット離脱の通知をDataChannelを通して相手に直接送信
        console.log( "- Send 'leave' through DataChannel" );
        this.g_rtcPeerConnection.datachannel.send( JSON.stringify( { type: "leave", data: "" } ) );
        }

        console.log( "Call : endPeerConnection()" );
        endPeerConnection( this.g_rtcPeerConnection );
    }
    
    // ユーザー名のクリア
    this.g_elementTextUserName.value = "";

    // 画面の切り替え
    this.g_elementDivChatScreen.style.display = "none";  // チャット画面の非表示
    this.g_elementDivJoinScreen.style.display = "flex";  // 参加画面の表示
  },
}
</script>

<style scoped>
#myVideo {
  display: grid;
  grid-template-columns: repeat(auto-fill, 300px);
  grid-auto-rows: 300px;
}
video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>