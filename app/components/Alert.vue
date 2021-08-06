<template>
  <div>
    <v-snackbar
      :value="true"
      bottom
      color="success"
      outlined
    >
      <slot />
    </v-snackbar>
  </div>
</template>

<script>
export default {
  inheritAttrs: false,
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
}
</script>