<template>
  <div>
    <Alert
      v-if="$store.state.flashMessage.text"
    >
      {{ $store.state.flashMessage.text }}
    </Alert>
    <v-form ref="form">
      <v-text-field
        v-model="user.name"
        label="名前"
        :color="inputColor"
        :dense="true"
        readonly
        @click="toEditPage('name')"
      ></v-text-field>
      <v-text-field
        v-model="user.email"
        label="メールアドレス"
        :color="inputColor"
        :dense="true"
        readonly
        @click="toEditPage('email')"
      ></v-text-field>
      <v-text-field
        value="プロフィール画像を設定"
        :color="inputColor"
        :dense="true"
        readonly
        @click="toEditPage('icon')"
      ></v-text-field>
      <v-text-field
        value="背景画像を設定"
        :color="inputColor"
        :dense="true"
        readonly
        @click="toEditPage('background')"
      ></v-text-field>
    </v-form>
  </div>
</template>

<script>
import Alert from '../../components/Alert.vue';

export default {
  layout: "profile",
  component: { Alert },
  middleware: 'clearFlash',
  data() {
    return {
      user: this.$auth.user,
      alertText: "プロフィールを更新しました",
      alertType: "success",
      inputColor: "#D45F5E"
    }
  },
  computed: {
    isAlertShow() {
      return this.$route.query.alert ? true : false;
    },
  },
  created() {
    this.setTitle();
    this.isReadOnly();
  },
  methods: {
    setTitle() {
      this.$nuxt.$emit('setTitle', 'プロフィール')
    },
    isReadOnly() {
      this.$nuxt.$emit('isReadOnly', true)
    },
    async toEditPage(params) {
      this.$router.push({path: '/custom/edit/' + params});
    }
  }
}
</script>

<style lang="scss" scoped>

</style>