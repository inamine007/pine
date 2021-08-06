<template>
  <div>
    <div>
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
    </div>
    <v-form ref="form" @submit.prevent="update()">
      <v-text-field
        v-model="form.name"
        label="名前"
        name="name"
        type="text"
        :color="inputColor"
        v-if="isName"
        :rules="[validRules.isNotEmpty]"
      ></v-text-field>
      <v-text-field
        v-model="form.email"
        label="メールアドレス"
        name="email"
        type="text"
        :color="inputColor"
        v-else-if="isEmail"
        :rules="[validRules.isNotEmpty]"
      ></v-text-field>
      <v-file-input
        :value="form.icon"
        label="アイコン"
        name="icon"
        :color="inputColor"
        v-else-if="isIcon"
        @change="onUpload('icon')"
        :rules="[validRules.isNotEmpty]"
      ></v-file-input>
      <v-file-input
        :value="form.background"
        label="背景画像"
        name="background"
        :color="inputColor"
        v-else-if="isBackground"
        @change="onUpload('background')"
        :rules="[validRules.isNotEmpty]"
      ></v-file-input>
      <v-spacer></v-spacer>
      <button type="submit" class="button btn-green"><span class="label">保存</span></button>
    </v-form>
  </div>
</template>

<script>
import validate from '../../../mixins/formValidation'

export default {
  layout: "profile",
  mixins: [ validate ],
  data() {
    return {
      user: this.$auth.user,
      inputColor: "#D45F5E",
      isVisible: false,
      isUniqueErr: false,
      form: {
        name: this.$auth.user.name,
        email: this.$auth.user.email,
        icon: null,
        background: null,
      },
    }
  },
  computed: {
    isName() {
      return this.$route.params.form === "name" ? true : false;
    },
    isEmail() {
      return this.$route.params.form === "email" ? true : false;
    },
    isIcon() {
      return this.$route.params.form === "icon" ? true : false;
    },
    isBackground() {
      return this.$route.params.form === "background" ? true : false;
    },
  },
  created() {
    this.setTitle();
    this.isReadOnly();
  },
  methods: {
    onUpload(imgKind) {
      if (imgKind === "icon") {
        this.form.icon = event.target.files[0];
      } else {
        this.form.background = event.target.files[0];
      }
    },
    setTitle() {
      let title = '';
      switch (this.$route.params.form) {
        case 'name':
          title = '名前';
          break;
        case 'email':
          title = 'メールアドレス';
          break;
        case 'icon':
          title = 'アイコン';
          break;
        case 'background':
          title = '背景画像';
          break;
      }
      this.$nuxt.$emit('setTitle', title);
    },
    isReadOnly() {
      this.$nuxt.$emit('isReadOnly', false)
    },
    async update() {
      if (this.$refs.form.validate()) {
        try {
          let formData = new FormData();
          formData.append('name', this.form.name);
          formData.append('email', this.form.email);
          let config = {
            headers: {
              'Content-Type': 'multipart/form-data;',
            }
          };
          if (!this.form.icon && !this.form.background) {
            formData.append('icon', this.$auth.user.icon);
            formData.append('background', this.$auth.user.background);
            await this.$axios.$put('/api/users/me', formData, config).then(res => {
              this.$axios.$get('/api/users/me').then(res => {
                this.$auth.setUser(res.data);
                this.$store.dispatch('flashMessage/showFlashMessage', {text: "プロフィールを更新しました"});
                this.$router.push({path: '/custom'}); 
              }).catch(err => {
                console.log(err);
              });
            }).catch(err => {
              if (err.data.err.name === "SequelizeUniqueConstraintError") {
                this.isUniqueErr = true;
              } else {
                this.isUniqueErr = false;
              }
              this.isVisible = true;
            });
          } else {
            let file = ''
            let icon = ''
            let background = ''
            if (this.form.icon) {
              file = 'icon';
              icon = this.form.icon;
            } else {
              icon = this.$auth.user.icon;
            }
            if(this.form.background) {
              file = 'background';
              background = this.form.background;
            } else {
              background = this.$auth.user.background;
            }
            formData.append('icon', icon);
            formData.append('background', background);
            await this.$axios.$put(`/api/users/me/${file}`, formData, config).then(res => {
              this.$axios.$get('/api/users/me').then(res => {
                this.$auth.setUser(res.data);
                this.$store.dispatch('flashMessage/showFlashMessage', {text: "プロフィールを更新しました"});
                this.$router.push({path: '/custom'}); 
              }).catch(err => {
                console.log(err);
              });
            }).catch(err => {            
              console.log(err);
              this.isVisible = true;
            })
          }
        } catch(error) {
          console.log(error);
          this.isVisible = true;
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>