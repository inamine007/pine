<template>
  <div>
    <div class="line-bc">
      <div class="balloon" v-for="(item, key) in messages" :key="`first-${key}`">
        <div v-if="item.User.id === user.id">
          <div class="faceicon">
            <img :src="require(`~/assets/uploads/${item.User.icon}`)" v-if="item.User.icon && item.User.icon != 'null'">
            <img src="../../assets/images/default.png" v-else>
          </div>
          <div class="chatting">
            <div class="says">
              <p>{{item.message}}</p>
            </div>
          </div>
        </div>
        <div class="mycomment" v-else>
          <p>{{item.message}}</p>
        </div>
      </div>
      <div class="balloon">
        <div v-for="(item, key) in msgs" :key="`third-${key}`" class="mycomment">
          <p>{{ item.text }}</p>
        </div>
      </div>
    </div>
    <footer>
      <TalkFooter @send-message="sendAction" />
    </footer>
  </div>
</template>

<script>
import TalkFooter from '../../components/TalksFooter.vue'

export default {
  layout: "talk",
  components: { TalkFooter },
  data() {
    return {
      user: this.$auth.user,
      msgs: ''
    }
  },
  async asyncData({ $axios, params, $auth }) {
    const messges = await $axios.$get(`api/rooms/directmessages/${params.id}`);
    const toUser = await $axios.$get(`api/rooms/${params.id}`);
    return {
      messages: messges.data.DirectMessages,
      toUser: toUser.data
    }
  },
  created() {
    this.setTitle();
  },
  methods: {
    setTitle() {
      this.$nuxt.$emit('setTitle', this.toUser.name)
    },
    sendAction(msgs) {
      this.msgs = msgs;
    }
  }
}
</script>

<style lang="scss" scoped>
.line-bc {
  margin: 15px 0;
  text-align: right;
  font-size: 0.875rem;
  .balloon {
    width: 100%;
    margin: 10px 0;
    overflow: hidden;
    .faceicon {
      float: left;
      margin-right: -50px;
      width: 40px;
      img{
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }
    }
    .chatting {
      width: 100%;
      text-align: left;
      .says {
        display: inline-block;
        position: relative; 
        margin: 0 0 0 50px;
        padding: 10px;
        max-width: 250px;
        border-radius: 12px;
        background: #edf1ee;
        width: 70%;
        &::after {
          content: "";
          display: inline-block;
          position: absolute;
          top: 3px; 
          left: -19px;
          border: 8px solid transparent;
          border-right: 18px solid #edf1ee;
          -webkit-transform: rotate(35deg);
          transform: rotate(35deg);
        }
        p {
          margin: 0;
          padding: 0;
        }
      }
    }
  }
}
.mycomment {
  p {
    display: inline-block;
    position: relative; 
    margin: 0 10px 0 0;
    padding: 8px;
    max-width: 250px;
    border-radius: 12px;
    background: #30e852;
    &::after {
      content: "";
      position: absolute;
      top: 3px; 
      right: -19px;
      border: 8px solid transparent;
      border-left: 18px solid #30e852;
      -webkit-transform: rotate(-35deg);
      transform: rotate(-35deg);
    }
  }
}
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>