<template>
  <div class="home">
    <title-element size="h1">Find your favorite games</title-element>
    <section id="game-list" v-if="games[0].name != ''">
      <article class="list-item" v-for="game in games" :key="game.id">
        <div class="img-wrapper">
          <img :src="game.background_image" alt="">
        </div>
        <h2><router-link :to="'/detail/' + game.id">{{ game.name }}</router-link></h2>
        <p>{{ game.description }}</p>
        <div class="genres">
          <span class="tag" v-for="(genre, index) in game.genres" :key="index">{{ genre.name }}</span>
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
    // Get the first 10 games from the API
    let gameArray;
    this.$axios.get('https://api.rawg.io/api/games')
    .then((response) => { 
      gameArray = response.data.results.splice(0,10);
      const promises = [];

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
        width: 110%;
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
    }
    .genres {
      margin-top: 1rem;
      display: flex;
      flex-wrap: wrap;
      .tag {
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
        font-size: 13px;
        padding: 0.3rem 0.7rem;
        background-color: grey;
        border-radius: 25px;
      }
    }
  }
}
</style>
