<template>
  <span class="tag" :class="color == 'blue' ? 'blue' : 'grey'">
    <slot></slot>
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  props: ['color']
})
</script>

<style lang="scss" scoped>
.tag {
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  font-size: 13px;
  padding: 0.3rem 0.7rem;
  color: rgb(37, 37, 37);
  border-radius: 25px;
  &.blue {
    background-color: #1a6fa8;
    color:white;
  }
  &.grey {
    background-color: #CECECE;
  }
}
</style>