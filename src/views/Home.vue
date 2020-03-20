<template>
  <div class="home">
    <title-element size="h1">Find your favorite games</title-element>
    <nav class="sorting">
      <p>Sorting</p>
      <a @click="sorting = 'alphabetical'" :class="sorting == 'alphabetical' ? 'active' : ''">Alphabetical</a>
      <a @click="sorting = 'rating'" :class="sorting == 'rating' ? 'active' : ''">Rating high to low</a>
    </nav>
    <section id="game-list" v-if="games.length != 0">
      <article class="list-item" v-for="game in gamesSorted.slice(0, 10)" :key="game.id">
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
import { Game } from '../models/Game';

export default Vue.extend({
  data() {
    return {
      sorting: '',
      games: [] as Game[]
    }
  },
  computed: {
    gamesSorted(): Game[] {
      const sortedGames: Game[] = this.games.slice();
      if (this.sorting == 'alphabetical') {
        sortedGames.sort((a, b) => a.name.localeCompare(b.name));
      }
      if (this.sorting == 'rating') {
        sortedGames.sort((a, b) => b.rating > a.rating ? +1 : -1);
      }
      return sortedGames;
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
        gameArray.forEach(game => {
          promises.push(this.$axios.get('https://api.rawg.io/api/games/' + game.id)
            .then((response) => {
              game.description = response.data.description_raw;
            })
          )
        });
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
.sorting {
  padding: 0.75rem 1rem 0.25rem 1rem;
  background-color: #ECECEC;
  margin-top: 1rem;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  position: sticky;
  top: 83px;
  z-index: 999;
  @media(max-width: 500px) {
    position: relative;
  }
  p {
    margin-right: 1rem;
    font-size: 13px;
  }
  a {
    display: block;
    padding: 0.2rem 1.2rem;
    border-radius: 25px;
    background-color: #0099FF;
    color: white;
    font-weight: bold;
    font-size: 14px;
    cursor: pointer;
    transition: .2s;
    user-select: none;
    margin-right: 1rem;
    margin-bottom: 0.5rem;
    &:hover, &.active {
      background-color: #006CB4;
    }
    &:active {
      transform: scale(1.1);
    }
  }
}

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
