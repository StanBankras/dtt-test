<template>
  <div class="title">
    <h1 v-if="size == 'h1'"><slot></slot></h1>
    <h2 v-if="size == 'h2'"><slot></slot></h2>
    <h3 v-if="size == 'h3'"><slot></slot></h3>
    <hr :class="size == 'h2' || size == 'h3' ? 'small' : ''">
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: [ 'size' ]
})
</script>

<style lang="scss" scoped>
.title {
  color: #1A6FA8;
  hr {
    margin: 1rem 0;
    color: rgb(196, 196, 196);
    &.small {
      max-width: 200px;
    }
  }
}
</style>