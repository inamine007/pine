<template>
  <div>
    <div class="flex between">
      <div class="i-back" @click="pageBack()">
        <img src="../../assets/images/i-page-back.svg">
      </div>
      <div class="i-custom-s" @click="toCustomPage()">
        <img src="../../assets/images/i-costom-s.svg">
      </div>
    </div>
    <div class="user-box abs-center">
      <img src="../../assets/images/default.png">
      <p>{{ user.name }}</p>
    </div>
  </div>
</template>

<script>
export default {
  layout: "user",
  data() {
    return {
      user: this.$auth.user
    }
  },
  methods: {
    async pageBack() {
      this.$router.go(-1);
    },
    async toCustomPage() {
      this.$router.push({path: '/custom'});
    },
  }
}
</script>

<style lang="scss" scoped>
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
</style>