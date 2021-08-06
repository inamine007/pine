<template>
  <div>
    <div class="home-header user-box" @click="toProfilePage()">
      <img :src="require(`~/assets/uploads/${user.icon}`)" v-if="user.icon && user.icon != 'null'">
      <img src="../assets/images/default.png" v-else>
      <p>{{ user.name }}</p>
    </div>
    <Search />
    <DropDown :label="C_LABEL.group" :icon="C_ICON.group" :listItems="groupItemList" />
    <DropDown :label="C_LABEL.friend" :icon="C_ICON.friend" :listItems="groupItemList" />
  </div>
</template>

<script>
import DropDown from '../components/DropDown.vue'
import Search from '../components/Search.vue'
import common from '../mixins/common'

export default {
  components: { Search, DropDown },
  mixins: [ common ],
  data() {
    return {
      user: this.$auth.user,
    }
  },
  async asyncData({ $axios, $auth }) {
    const users = await $axios.$get('/api/users').then(res => {
      var id = $auth.user.id;
      var result = res.data.filter((user) => {
        return (user.id != id);
      })
      return result;
    });
    return { groupItemList: users };
  },
  methods: {
    async toProfilePage() {
      this.$router.push({path: '/users/me'});
    }
  }
}
</script>

<style lang="scss" scoped>
.home-header {
  display: flex;
  align-items: center;
  margin-bottom: $spacing-xs;
  p {
    margin-bottom: 0;
    margin-left: $spacing;
    font-size: 1.125rem;
  }
}
</style>