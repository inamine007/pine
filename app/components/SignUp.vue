<template>
  <div>
    <div :class="['form-area', errActive]">
      <v-alert
        v-model="isVisible"
        dense
        outlined
        type="error"
        text
        transition="scale-transition"
      >
      <span v-if="isUniqueErr">{{ validMessages.isUniqueMail }}</span>
      <span v-else>{{ validMessages.isTypeMiss }}</span>
      </v-alert>
      <v-form ref="form" @submit.prevent="signUp">
        <v-text-field
          v-model="form.name"
          label="USERNAME"
          name="name"
          type="text"
          :color="inputColor"
          :dense="true"
          :rules="[validRules.isNotEmpty]"
        ></v-text-field>
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
        <v-text-field
          v-model="form.passwordConfirmation"
          label="PASSWORD CONFIRMATION"
          name="passwordConfirmation"
          type="password"
          :color="inputColor"
          :dense="true"
          :rules="[validRules.isNotEmpty]"
        ></v-text-field>
        <v-spacer></v-spacer>
        <button type="submit" class="button btn-red"><span class="label">SIGN UP</span></button>
      </v-form>
    </div>
  </div>
</template>

<script>
import validate from '../mixins/formValidation'

export default {
  name: 'SignUp',
  mixins: [ validate ],
  data() {
    return {
      inputColor: '#D45F5E',
      isVisible: false,
      isUniqueErr: false,
      form: {
        name: '',
        email: '',
        password: '',
        passwordConfirmation: '',
      },
    }
  },
  computed: {
    errActive() {
      const errActive = this.isVisible ? "mt-none" : "";
      return errActive;
    }
  },
  methods: {
    async signUp() {
      if (this.$refs.form.validate()) {
        if (this.form.password === this.form.passwordConfirmation) {
          try {
            await this.$axios.$post('/api/auth/signup', {
              name: this.form.name,
              email: this.form.email,
              password: this.form.password,
            }).then(res => {
              this.$auth.loginWith('local', {
                data: {
                  email: this.form.email, 
                  password: this.form.password} 
              }).catch(err => {
                document.cookie = 'auth._token.local=';
                localStorage.removeItem('auth._token.local');
                this.isVisible = true;
                console.log(err);
              });
            }).catch(err => {            
              if (err.data.err.name === "SequelizeUniqueConstraintError") {
                this.isUniqueErr = true;
              } else {
                this.isUniqueErr = false;
              }
              this.isVisible = true;
            })
          } catch(error) {
            console.log(err);
            this.isVisible = true;
          }
        } else {
          this.isVisible = true;
        }
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.form-area {
  margin-top: 20%;
  &.mt-none {
    margin-top: 0;
  }
}
</style>