<template>
  <div>
    <div class="container">
      <div class="i-back" @click="pageBack()">
        <img src="../../assets/images/i-page-back.svg">
      </div>
      <div class="user-box abs-center">
        <img :src="require(`~/assets/uploads/${user.icon}`)" v-if="user.icon && user.icon != 'null'">
        <img src="../../assets/images/default.png" v-else>
        <p>{{ user.name }}</p>
      </div>
    </div>
    <ControlBar :controlItems="controlItems"/>
  </div>
</template>

<script>
import ControlBar from '../../components/ControlBar.vue'
export default {
  components: { ControlBar },
  layout: "user",
  data() {
    return {
      controlItems: [
      {
        label: 'トーク',
        img: 'i_talk_bw.svg',
        path: 'talks',
      },
      {
        label: '音声通話',
        img: 'i_call.svg',
        path: 'talks',
      },
      {
        label: 'ビデオ通話',
        img: 'i_movie.svg',
        path: 'talks',
      },
      ]
    }
  },
  async asyncData({ $axios, params }) {
    const result = $axios.$get(`/api/users/${params.id}`).then(res => {
      return {user: res.data};
    }).catch(err => {
      console.log(err);
    });
    return result;
  },
  created() {
    this.setBack();
  },
  methods: {
    async pageBack() {
      this.$router.go(-1);
    },
    setBack() {
      this.$nuxt.$emit('background', this.user.background);
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  height: 70vh;
  .user-box {
    width: 100%;
    text-align: center;
    img {
      width: 120px;
      height: 120px;
    }
    p {
      color: $color-f-accent;
      text-align: center;
      font-size: 1.5rem;
      line-height: 1;
      margin-bottom: 0;
    }
  }
}
</style>