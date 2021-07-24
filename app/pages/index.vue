<template>
  <div :class="section">
    <div>
      <IconTop />
      <p>Chat Application</p>
      <h1>PINE</h1>
      <transition name="fade">
        <Login v-if="loginShow" />
        <SignUp v-if="signupShow" />
      </transition>
      <div class="btn-area">
        <a class="button btn-clarity" @click="changeView('signup')"><span class="label">SIGN UP</span></a>
        <a class="button btn-white" @click="changeView('login')"><span class="label">LOGIN</span></a>
      </div>
      <transition name="fade">
        <div class="change-view" v-if="signupShow">
          <span>or</span><br>
          <a @click="changeView('login')">LOGIN</a>
        </div>
        <div class="change-view" v-if="loginShow">
          <span>or</span><br>
          <a @click="changeView('signup')">SIGN UP</a>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import IconTop from "@/assets/images/i_top.svg?inline";
import Login from '../components/Login.vue';
import SignUp from '../components/SignUp.vue';

export default {
  layout: "top",
  components: { IconTop, Login, SignUp },
  middleware({ store, redirect }) {
    if (store.$auth.loggedIn) {
      return redirect('/home')
    }
  },
  data() {
    return {
      section: 'main-section',
      loginShow: false,
      signupShow: false,
    }
  },
  methods: {
    changeView(args) {
      if (args === "login") {
        this.loginShow = true;
        this.signupShow = false;
      } else {
        this.loginShow = false;
        this.signupShow = true;
      }
      this.section = 'active-section';
      this.$nuxt.$emit('changeView', 'active');
    },
  }
}
</script>

<style lang="scss" scoped>
.btn-area {
  margin-top: 40%;
  .button {
    margin-bottom: $spacing-sm;
  }
}
svg {
  width: 164px;
  height: 120px;
}
.main-section {
  fill: $color-f-accent;
  margin: 30% auto 0 auto;
  text-align: center;
  color: $color-f-accent;
  p {
    font-family: $font-pt;
    font-size: 0.875rem;
    line-height: 1;
    margin-bottom: $spacing-xs;
  }
  h1 {
    font-family: $font-pt;
    font-weight: bold;
    font-size: 2rem;
    line-height: 1;
  }
}
.active-section {
  transition: all .5s ease;
  fill: $color-main;
  margin: 10% auto 0 auto;
  text-align: center;
  p {
    display: none;
  }
  h1 {
    display: none;
  }
  .btn-area {
    display: none;
  }
}
.change-view {
  margin-top: 10%;
  a {
    text-decoration-line: underline;
    color: $color-main;
  }
}
.fade-enter-active {
  transition: all .8s ease;
}
.fade-leave-active {
  transition: all .1s ease;
}
.fade-enter, .fade-leave-to
/* .slide-fade-leave-active below version 2.1.8 */ {
  transform: translateX(20px);
  opacity: 0;
}
</style>