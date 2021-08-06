<template>
  <div class="dropdown">
    <div class="has-child" @click="active()">
      <div class="flex align-center">
        <img :src="icon" alt="">
        <h2>{{label}}　{{listItems.length}}</h2>
      </div>
      <span v-if="show">▼</span><span v-else>▲</span>
    </div>
    <ul v-for="(item, key) in listItems" :key="key" v-show="show">
      <li class="dropdown-list" @click="toUserPage(item.id)">
        <div class="flex align-center user-box">
          <img :src="require(`~/assets/uploads/${item.icon}`)" v-if="item.icon && item.icon != 'null'">
          <img src="../assets/images/default.png" v-else>
          <p>{{item.name}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'DropDown',
  props: {
    label: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: true
    },
    listItems: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      show: false,
    }
  },
  methods: {
    async active() {
      this.show = this.show ? false : true;
    },
    async toUserPage(userId) {
      this.$router.push({path: '/users/' + userId});
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown {
  .has-child {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 48px;
    h2 {
      font-weight: bold;
      font-size: 1.125rem;
      margin-left: $spacing-md;
    }
    img {
      width: 30px;
      height: auto;
    }
  }
  .dropdown-list {
    height: 80px;
    .user-box {
      img {
        width: 65px;
        height: 65px;
      }
      p {
        margin-left: $spacing-xs;
        font-size: 1.125rem;
      }
    }
  }
}
</style>