<template>
  <v-app>
    <v-main class="talk-bk">
      <div class="header">
        <BackHeader :title="title"/>
      </div>
      <div class="header-dummy"></div>
      <v-container class="mt-1">
        <Nuxt />
      </v-container>
    </v-main>
    <div class="footer-dummy"></div>
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
    },
    titleAction(title) {
      this.title = title;
    },
    async pageBack() {
      this.$router.go(-1);
    },
  }
}
</script>
<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 5%;
  width: 100%;
  z-index: 1;
  background-color: $color-room;
  padding: $spacing;
}
.header-dummy {
  height: 30px;
}
.footer-dummy {
  height: 50px;
}
.talk-bk {
  background-color: $color-room;
}
</style>
