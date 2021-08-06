<template>
  <v-app>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <footer>
      <Footer />
    </footer>
  </v-app>
</template>

<script>
import Footer from '../components/Footer.vue';

export default {
  components: { Footer }
}
</script>
<style lang="scss" scoped>
footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>
