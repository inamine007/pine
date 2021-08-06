<template>
  <div class="page-header" @click="pageBack()">
    <img src="../assets/images/i-arrow.svg">
    <h2>{{ title }}</h2>
  </div>
</template>

<script>

export default {
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  methods: {
    async pageBack() {
      this.$router.go(-1);
    },
  }
}
</script>
<style lang="scss" scoped>
.page-header {
  height: 40px;
  display: flex;
  align-items: center;
  img {
    width: 22px;
    height: auto;
    margin-right: $spacing-sm;
  }
  h2 {
    font-weight: bold;
    font-size: 1.125rem;
    line-height: 1.1;
  }
}
</style>
