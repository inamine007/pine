<template>
  <v-app>
    <v-main>
      <div class="user-bk">
        <img :src="require(`~/assets/uploads/${background}`)" v-if="background && background != 'null'">
        <img src="../assets/images/default.png" v-else>
      </div>
      <v-container fluid>
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      background: '',
    }
  },
  created() {
    this.setListener();
  },
  methods: {
    setListener() {
      // emitで発火させたイベント名にする
      this.$nuxt.$on('background', this.backAction)
    },
    backAction(background) {
      this.background = background;
    },
  }
}
</script>
<style lang="scss" scoped>
.theme--light.v-application {
  background: fixed;
} 
.user-bk {
  position: absolute;
  z-index: -1;
  height: 100vh;
  width: 100%;
  img {
    height: 100vh;
  }
}
</style>
