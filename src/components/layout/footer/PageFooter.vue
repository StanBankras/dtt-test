<template>
  <div id="footer">
    <footer class="container">
      <footer-section title="About us">
        Find the best games in our game library. Maybe you will finally find that game you have been looking for forever! 
      </footer-section>
      <footer-section title="Sitemap">
        <ul>
          <li v-for="(link, index) in links" :key="index">
            <router-link :to="link.path">{{ link.name }}</router-link>
          </li>
        </ul>
      </footer-section>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FooterSection from '@/components/layout/footer/FooterSection';

export default Vue.extend({
  data() {
    return {
      links: []
    }
  },
  components: {
    FooterSection
  },
  created() {
    this.$router.options.routes.forEach(route => {
      this.links.push({
        name: route.name, 
        path: route.path
      });
    });
  }
});
</script>

<style lang="scss" scoped>
@import '@/assets/css/main.scss';

#footer {
  background-color: $secondary-color;
  color: lighten($secondary-color, 50%);
  padding: 4rem 0;
  footer {
    padding: 0 2rem;
    display: flex;
    flex-wrap: wrap;
  }
}
</style>