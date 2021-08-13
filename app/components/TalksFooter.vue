<template>
  <div class="footer">
    <div class="i-image">
      <img src="../assets/images/i-image.svg">
    </div>
    <div class="FlexTextarea">
      <div class="FlexTextarea__dummy" aria-hidden="true" ref="dummy"></div>
      <textarea id="FlexTextarea" class="FlexTextarea__textarea" v-model="msg" @input="areaExpantion($event)"></textarea>
    </div>
    <div v-if="msg" @click="sendMessage()">
      <img class="i-air" src="../assets/images/i-air.svg">
    </div>
  </div>
</template>

<script>
import io from 'socket.io-client'

export default {
  name: 'TalksFooter',
  data() {
    return {
      msg: '',
      msgs: [],
      socket: '',
    }
  },
  mounted() {
    this.socket = io('http://localhost:3001');
    this.socket.on('new-message', msg => {
      this.msgs.push( msg || {} );
    });
  },
  methods: {
    async pageTransfer(pathName) {
      let currentPath = this.$route.name.split('-')[0];
      if (pathName === currentPath) return;
      this.$router.push({path: '/' + pathName});
    },
    async sendMessage() {
      this.msg = this.msg.trim();
      if (this.msg) {
        const message = {
          name: this.socket.id,
          text: this.msg,
        }
        await this.$axios.$post(`api/rooms/${this.$route.params.id}/directmessages`, {
          message: message.text
        }).then(res => {
          // イベント元はブロードキャストを受けないので自分でmessageを追加する
          this.msgs.push(message);
          this.$emit('send-message', this.msgs);
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
    areaExpantion(e) {
      this.$refs.dummy.textContent = e.target.value + '\u200b';
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  justify-content: space-evenly;
  min-height: 60px;
  box-shadow: 0 0 30px $color-shadow;
  background-color: $color-f-accent;
  padding: $spacing-xs $spacing-sm;
  .FlexTextarea {
    position: relative;
    font-size: 1rem;
    line-height: 1;
    flex-basis: 80%;
    .FlexTextarea__dummy {
      overflow: hidden;
      visibility: hidden;
      box-sizing: border-box;
      padding: 5px;
      min-height: 30px;
      white-space: pre-wrap;
      word-wrap: break-word;
      overflow-wrap: break-word;
      border: 1px solid;
    }
    .FlexTextarea__textarea {
      position: absolute;
      top: 0;
      left: 0;
      box-sizing: border-box;
      padding: 5px;
      width: 100%;
      height: 100%;
      background-color: $color-sub;
      border: 1px solid hsl(191, 12%, 75%);
      border-radius: 11px;
      letter-spacing: inherit;
      resize: none;
    }
  }
  .i-image {
    padding-top: 1.2%;
    img {
      width: 20px;
    }
  }
  .i-air {
    width: 23px;
    margin-left: 1%;
  }
}
</style>