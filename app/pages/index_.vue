<template>
  <div class="container">
    <ul v-for="(item, key) in messages" :key="`first-${key}`">
      <li>{{item.message}}</li>
    </ul>
    <ul v-for="(item, key) in msgs" :key="`third-${key}`"><li>{{ item.text }}</li></ul>
      <input id="input_msg" autocomplete="off" v-model="msg"/><button @click="sendMessage">Send</button>
    <button @click="login">ログイン</button>
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
  data() {
    return {
      msg: '',
      msgs: [],
      socket: '',
    }
  },
  async asyncData({ $axios, store }) {
    const res = await $axios.$get('api/rooms/14');
    console.log(res);
    return {
      messages: res.data.DirectMessages
    }
  },
  mounted() {
    this.socket = io('http://localhost:3001');
    this.socket.on('new-message', msg => {
      this.msgs.push( msg || {} );
    });
  },
  methods: {
    async sendMessage() {
      this.msg = this.msg.trim();
      if (this.msg) {
        const message = {
          name: this.socket.id,
          text: this.msg,
        }
        await this.$axios.$post('api/rooms/14/directmessages', {
          message: message.text
        }).then(res => {
          // イベント元はブロードキャストを受けないので自分でmessageを追加する
          this.msgs.push(message);
          // send-msgイベントでmessageをサーバーサイドに投げる
          this.socket.emit('send-message', message);
          this.msg = ''
        }).catch(err => {
          console.log(err);
        });
      } else {
        return
      }
    },
    async login() {
      try {
        const response = await this.$auth.loginWith('local', { data: {email: 'koja@example.com', password: 'koja'} });
        console.log(response);
      } catch(error) {
        console.log(error);
      }
    },
  }
}
</script>

<style scoped>
.container {
  width: 960px;
  margin: 0 auto;
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