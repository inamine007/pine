<template>
  <div>
    <h1>Hello!!</h1>
    {{test}}
  </div>
</template>

<script>
export default {
  data() {
    return {
      test: this.$route.name
    }
  }
  
}
</script>