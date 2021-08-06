<template>
  <div class="control-bar">
    <div v-for="(item, key) in controlItems" :key="key">
      <div :class="['i-' + key, 'box']" @click="pageTransfer(item.path)">
        <img :src="require(`~/assets/images/${item.img}`)">
        <p>{{item.label}}</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ControlBar',
  props: {
    controlItems: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
    }
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
.control-bar {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 60px;
  .box {
    text-align: center;
    img {
      width: 30px;
      height: auto;
    }
    p {
      font-size: 0.5rem;
      font-family: $font-pt;
      line-height: 1;
      margin-bottom: 0;
      color: $color-f-accent;
    }
  }
}
</style>