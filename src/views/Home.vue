<template>
  <div class="home">
    <h1>Title</h1>
    <hr>
    <section id="game-list">
      <article class="list-item" v-for="game in games" :key="game.id">
        <div class="img-wrapper">
          <img :src="game.background_image" alt="">
        </div>
        <h2><router-link :to="'/detail/' + game.id">{{ game.name }}</router-link></h2>
        <p>{{ getGameDetails(game.id) }}</p>
      </article>
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      games: [],
      gameDetails: {}
    }
  },
  methods: {
    getGameDetails(id) {
      let details;
      this.$axios.get('https://api.rawg.io/api/games/' + id)
      .then((response) => {
        details = response.data;
        console.log(details);
        return details;
      })
      .catch((err) => {
        console.error(err);
        return;
      })
    }
  },
  created() {
    // Get the first 10 games from the API
    this.$axios.get('https://api.rawg.io/api/games')
    .then((response) => {
      this.games = response.data.results.slice(0, 10);
    })
    .catch((err) => {
      console.error(err);
    })
  }
})
</script>

<style lang="scss" scoped>
#game-list {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 2rem;
  .list-item {
    .img-wrapper {
      width: 100%;
      height: 200px;
      overflow: hidden;
      position: relative;
      img {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
      }
    }
    h2 {
      a {
        color: #484848;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        } 
      }
    }
  }
}
</style>
