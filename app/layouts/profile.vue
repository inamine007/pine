<template>
  <v-app>
    <v-main>
      <v-container>
        <BackHeader :title="title" />
      </v-container>
      <div class="user-image-area" v-if="isReadOnly">
        <img class="background" :src="require(`~/assets/uploads/${user.background}`)" v-if="user.background && user.background != 'null'">
        <img class="background" src="../assets/images/default.png" v-else>
        <div class="user-box abs-center">
          <img :src="require(`~/assets/uploads/${user.icon}`)" v-if="user.icon && user.icon != 'null'">
          <img src="../assets/images/default.png" v-else>
        </div>
      </div>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import BackHeader from '../components/BackHeader.vue';

export default {
  components: { BackHeader },
  data() {
    return {
      user: this.$auth.user,
      title: '',
      isReadOnly: false
    }
  },
  created() {
    this.setListener();
  },
  methods: {
    setListener() {
      // emitで発火させたイベント名にする
      this.$nuxt.$on('setTitle', this.titleAction)
      this.$nuxt.$on('isReadOnly', this.readAction)
    },
    titleAction(title) {
      this.title = title;
    },
    readAction(bool) {
      this.isReadOnly = bool;
    },
    async pageBack() {
      this.$router.go(-1);
    },
  }
}
</script>
<style lang="scss" scoped>
.user-image-area {
  position: relative;
  .background {
    height: 180px;
  }
  .user-box {
  width: 100%;
  text-align: center;
    img {
      width: 120px;
      height: 120px;
    }
  }
}
</style>
