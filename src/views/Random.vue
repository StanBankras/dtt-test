<template>
  <div>
    <detail-view v-if="false"></detail-view>
    <a @click="selectOtherGame(id)">Go</a>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Detail from './Detail.vue'

export default Vue.extend({
  data() {
    return {
      id: 0
    }
  },
  components: {
    'detail-view': Detail
  },
  methods: {
  }
})
</script>