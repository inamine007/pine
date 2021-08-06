<template>
  <div class="search-area">
    <label>
      <input type="text" placeholder="検索">
    </label>
  </div>
</template>

<script>
export default {
  name: 'Search',
  computed: {
    
  },
  methods: {
    async pageTransfer(pathName) {
      let currentPath = this.$route.name.split('-')[0];
      if (pathName === currentPath) return;
      this.$router.push({path: '/' + pathName});
    }
  }
}
</script>

<style lang="scss" scoped>
.search-area {
  input {
    width: 100%;
    background-color: $color-sub;
    border-radius: 11px;
    font-size: 1.125rem;
    padding: $spacing $spacing-xs $spacing $spacing-md;
    line-height: 1;
  }
  label {
    position: relative;
    &::before {
      content: "";
      position: absolute;
      left: 10px;
      top: 1px;
      bottom: 0;
      width: 15px;
      background: url('../assets/images/i_search.svg') no-repeat;
      background-size: contain;
    }
  }
}
</style>