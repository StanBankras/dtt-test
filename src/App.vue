<template>
  <div id="app">
    <app-layout>
      <router-view/>
    </app-layout>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import AppLayout from '@/components/layout/AppLayout.vue';

export default Vue.extend({
  components: {
    AppLayout
  }
});
</script>

<style lang="scss">
</style>
