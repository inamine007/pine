<template>
  <div class="container">
    <ul v-for="(item, key) in msgs" :key="key"><li>{{ item.text }}</li></ul>
      <input id="input_msg" autocomplete="off" v-model="msg"/><button @click="sendMessage">Send</button>
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
  data() {
    return {
      msg: '',
      msgs: [],
      socket: ''
    }
  },
  mounted() {
    this.socket = io('http://localhost:3001');
    console.log(this.socket);
    this.socket.on('message', msg => {
      this.msgs.push(msg)
    });
  },
  methods: {
    sendMessage() {
      this.msg = this.msg.trim()
      if (this.msg) {
        const message = {
          name: this.socket.id,
          text: this.msg,
        }
        // イベント元はブロードキャストを受けないので自分でmessageを追加する
        this.msgs.push(message)
        // send-msgイベントでmessageをサーバーサイドに投げる
        this.socket.emit('message', message)
        this.msg = ''
      }
    }
  }
}
</script>

<style scoped>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}
.title {
  font-family:
    'Quicksand',
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}
.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}
.links {
  padding-top: 15px;
}
</style>