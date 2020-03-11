<template>
  <div class="footer-section">
    <h2>{{ title }}</h2>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: ['title']
});
</script>

<style lang="scss" scoped>
.footer-section {
  margin-right: 4rem;
  max-width: 300px;
  h2 {
    margin-bottom: 1.5rem;
  }
}
</style>