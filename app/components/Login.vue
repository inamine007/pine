<template>
  <div>
    <div class="form-area">
      <v-alert
        v-model="isVisible"
        dense
        outlined
        type="error"
        text
        transition="scale-transition"
      >{{ validMessages.isTypeMiss }}
      </v-alert>
      <v-form ref="form" @submit.prevent="login">
        <v-text-field
          v-model="form.email"
          label="EMAIL"
          name="email"
          type="text"
          :color="inputColor"
          :dense="true"
          :rules="[validRules.isNotEmpty]"
        ></v-text-field>
        <v-text-field
          v-model="form.password"
          label="PASSWORD"
          name="password"
          type="password"
          :color="inputColor"
          :dense="true"
          :rules="[validRules.isNotEmpty]"
        ></v-text-field>
        <v-spacer></v-spacer>
        <button type="submit" class="button btn-white"><span class="label">LOGIN</span></button>
      </v-form>
    </div>
  </div>
</template>

<script>
import validate from '../mixins/formValidation'

export default {
  name: 'Login',
  mixins: [ validate ],
  data() {
    return {
      inputColor: '#D45F5E',
      isVisible: false,
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    async login() {
      if (this.$refs.form.validate()) {
        try {
          const response = await this.$auth.loginWith('local', {
            data: {
              email: this.form.email, 
              password: this.form.password} 
          });
          console.log(response);
        } catch(error) {
          document.cookie = 'auth._token.local=';
          localStorage.removeItem('auth._token.local');
          this.isVisible = true;
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.form-area {
  margin-top: 20%;
}
</style>