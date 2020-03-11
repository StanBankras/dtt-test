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
*, *::before, *::after {
  padding:0;
  margin: 0;
  box-sizing: border-box;
  font-family: 'Open Sans', sans-serif;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Changa One', cursive;
}

.container {
  max-width: 1250px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
