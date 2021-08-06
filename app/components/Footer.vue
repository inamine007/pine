<template>
  <div class="footer">
    <div class="i-home box" @click="pageTransfer('home')">
      <img src="../assets/images/i_home_b.svg" v-if="homeActive">
      <img src="../assets/images/i_home_w.svg" v-else>
      <p>ホーム</p>
    </div>
    <div class="i-talk box" @click="pageTransfer('talks')">
      <img src="../assets/images/i_talk_b.svg" v-if="talkActive">
      <img src="../assets/images/i_talk_w.svg" v-else>
      <p>トーク</p>
    </div>
    <div class="i-adduser box" @click="pageTransfer('users')">
      <img src="../assets/images/i_adduser_b.svg" v-if="adduserActive">
      <img src="../assets/images/i_adduser_w.svg" v-else>
      <p>友達追加</p>
    </div>
    <div class="i-custom box" @click="pageTransfer('custom')">
      <img src="../assets/images/i_custom_b.svg" v-if="customActive">
      <img src="../assets/images/i_custom_w.svg" v-else>
      <p>設定</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    homeActive() {
      return this.$route.name.split('-')[0] === "home" ? true : false;
    },
    talkActive() {
      return this.$route.name.split('-')[0] === "talks" ? true : false;
    },
    adduserActive() {
      return this.$route.name.split('-')[0] === "users" ? true : false;
    },
    customActive() {
      return this.$route.name.split('-')[0] === "custom" ? true : false;
    },
  },
  methods: {
    async pageTransfer(pathName) {
      let currentPath = this.$route.name.split('-')[0];
      if (pathName === currentPath) return;
      this.$router.push({path: '/' + pathName});
    }
  }
}
</script>

<style lang="scss" scoped>
.footer {
  display: flex;
  justify-content: space-evenly;
  height: 60px;
  box-shadow: 0 0 30px $color-shadow;
  background-color: $color-f-accent;
  .box {
    width: 20%;
    align-self: center;
    text-align: center;
    svg {
      width: 30px;
      height: auto;
    }
    img {
      width: 30px;
      height: auto;
    }
    p {
      font-size: 0.5rem;
      font-family: $font-pt;
      line-height: 1;
      margin-bottom: 0;
    }
  }
}
</style>