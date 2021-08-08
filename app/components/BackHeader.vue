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
