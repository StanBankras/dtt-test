<template>
  <div id="app">
    <app-layout>
      <main class="content">
        <div class="container">
          <router-view :key="$route.fullPath" />
        </div>
      </main>
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
@import '@/assets/css/main.scss';

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
  max-width: 1150px;
  margin: 0 auto;
  padding: 0 1rem;
}

.content {
  background-color: $grey-dark;
  min-height: calc(100vh - 348px);
  > .container {
    background-color: $grey-light;
    padding: 3rem 2rem;
  }
}
</style>
