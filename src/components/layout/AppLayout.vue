<template>
  <div id="layout">
    <page-header></page-header>
    <slot></slot>
    <page-footer></page-footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import PageHeader from '@/components/layout/header/PageHeader.vue';
import PageFooter from '@/components/layout/footer/PageFooter.vue';

export default Vue.extend({
  components: {
    PageHeader,
    PageFooter
  }
})
</script>