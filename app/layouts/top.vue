<template>
  <v-app>
    <v-main>
      <v-container fluid :class="['top-bk', background]">
        <Nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      background: ''
    }
  },
  mounted() {
    this.background = '';
  },
  created() {
    this.setListener()
  },
  methods: {
    setListener() {
      // emitで発火させたイベント名にする
      this.$nuxt.$on('changeView', this.action)
    },
    action(view) {
      this.background = view;
    }
  }
}
</script>
<style lang="scss" scoped>
.top-bk {
  background: url('../assets/images/top_bk.png') no-repeat;
  background-size: cover;
  height: 100vh;
  position: relative;
  &.active {
    transition: all .5s ease;
    background: url('../assets/images/login_bk.png') no-repeat;
    background-size: cover;
  }
}
</style>
