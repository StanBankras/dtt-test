<template>
  <div class="home">
    <title-element size="h1">Find your favorite games</title-element>
    <section id="game-list" v-if="games[0].name != ''">
      <article class="list-item" v-for="game in games.slice(0, 10)" :key="game.id">
        <div class="img-wrapper">
          <img :src="game.background_image" alt="">
        </div>
        <h2><router-link :to="'/detail/' + game.id">{{ game.name }}</router-link></h2>
        <p>{{ game.description_raw ? game.description_raw : game.description }}</p>
        <div class="genres">
          <tag color="grey" v-for="(genre, index) in game.genres" :key="index">{{ genre.name }}</tag>
        </div>
      </article>
    </section>
    <section v-else>Loading games...</section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data() {
    return {
      games: [
        {
          name: ''
        }
      ]
    }
  },
  created() {
    if (this.$store.state.loadedGames.length > 0) {
      this.games = this.$store.state.loadedGames;
    } else {
      // Get the first 10 games from the API
      let gameArray;
      this.$axios.get('https://api.rawg.io/api/games')
      .then((response) => { 
        gameArray = response.data.results.splice(0,10);
        const promises: Promise<void>[] = [];

        for (let i = 0; i < gameArray.length; i++) {
          promises.push(this.$axios.get('https://api.rawg.io/api/games/' + gameArray[i].id)
            .then((response) => {
              gameArray[i].description = response.data.description_raw;
            })
          )
        }
        return Promise.all(promises);
      })
      .then(() => {
        this.games = gameArray;
        this.$store.state.loadedGames = gameArray;
      })
      .catch((err) => {
        console.error(err);
      })
    }
  }
})
</script>

<style lang="scss" scoped>
#game-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 2rem;
  @media(max-width: 1000px) {
    grid-template-columns: 1fr 1fr;
  }
  @media(max-width: 767px) {
    grid-template-columns: 1fr;
  }
  .list-item {
    .img-wrapper {
      width: 100%;
      height: 200px;
      overflow: hidden;
      position: relative;
      img {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translate(0, -50%);
        height: 100%;
      }
    }
    h2 {
      min-height: 30px;
      margin-bottom: 10px;
      a {
        color: #484848;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        } 
      }
    }
    p { 
      font-size: 14px;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      line-height: 1.1rem;
      @media(max-width: 767px) {
        max-width: 400px;
      }
    }
    .genres {
      margin-top: 1rem;
      display: flex;
      flex-wrap: wrap;
    }
  }
}
</style>
