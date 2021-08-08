<template>
  <div>
    <div class="page-header">
      <h2>{{ title }}</h2>
  </div>
  <Search />
  <ul v-for="(item, key) in listItems" :key="key">
    <li class="talk-list" @click="toUserPage(item.id)">
      <div class="flex user-box between">
        <div class="flex box">
          <img :src="require(`~/assets/uploads/${item.toUser.icon}`)" v-if="item.toUser.icon && item.toUser.icon != 'null'">
          <img src="../../assets/images/default.png" v-else>
          <div class="flex-item">
            <h2>{{item.toUser.name}}</h2>
            <p>{{item.message.message}}</p>
          </div>
        </div>
        <small>{{item.message.createdAt}}</small>
      </div>
    </li>
  </ul>
  </div>
</template>

<script>
export default {
  data() {
    return { 
      title: 'トーク',
      listItems: []
    }
  },
  mounted() {
    this.$axios.$get(`/api/rooms/${this.$auth.user.id}`).then(res => {
      let date = '';
      let dateFormat = '';
      for(let i=0; i < res.data.length; i++) {
        dateFormat = res.data[i].message.createdAt;
        date = new Date(dateFormat);
        if (this.$isToday(date)) {
          res.data[i].message['createdAt'] = dateFormat.substr(12, 4);
        } else if (this.$isYesterday(date)) {
          res.data[i].message['createdAt'] = '昨日';
        } else if (!this.$isThisYear(date)) {
          res.data[i].message['createdAt'] = dateFormat.substr(0, 10);
        } else {
          res.data[i].message['createdAt'] = dateFormat.substr(5, 5).replace('-', '/');
        }
      }
      return this.listItems = res.data;
    }).catch(err => {
      console.log(err);
    });
  },
  methods: {
    async toUserPage(userId) {
      this.$router.push({path: '/users/' + userId});
    }
  }
}
</script>

<style lang="scss" scoped>
.talk-list {
  margin-top: $spacing-xs;
  height: 80px;
  overflow: hidden;
  .user-box {
    font-size: 1.125rem;
    font-family: $font-base;
    .box {
      overflow: hidden;
    }
    img {
      width: 65px;
      height: 65px;
      margin: $spacing;
    }
    p, small {
      color: $color-f-main;
      line-height: 1.35;
    }
    small {
      font-size: 0.75rem;
      font-family: $font-pt;
    }
  }
}
</style>