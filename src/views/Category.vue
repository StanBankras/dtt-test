<template>
  <div id="category">
    <title-element size="h1">Find games by category</title-element>
    <div v-if="selectedGenre != ''">
      <nav class="categories">
        <a 
          @click="changeCategory(category)" 
          class="category" 
          v-for="(category, index) in categories" :key="index"
          :class="selectedGenre === category ? 'active' : ''"
        >{{ category }}</a>
      </nav>
      
      <section id="game-list">
        <article class="list-item" v-for="game in activeGames.slice(0,10)" :key="game.id">
          <div class="img-wrapper">
            <img :src="game.background_image" :alt="game.name">
          </div>
          <h2><router-link :to="'/detail/' + game.id">{{ game.name }}</router-link></h2>
          <p>{{ game.description ? game.description : 'No description found ;(' }}</p>
          <div class="genres">
            <tag color="grey" v-for="genre in game.genres" :key="genre.id">{{ genre.name }}</tag>
          </div>
        </article>
      </section>
    </div>
    <div v-else>
      Loading categories...
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Game } from '../models/Game';

export default Vue.extend({
  data() {
    return {
      games: [] as Game[],
      genres: {} as Record<string, number>,
      categories: [] as string[],
      selectedGenre: ''
    }
  },
  methods: {
    changeCategory(category) {
      this.selectedGenre = category;
    },
    getDescriptions() {
      // Descriptions for the games need an extra API call
      this.activeGames.forEach(activeGame => {
        this.$store.dispatch('findGameById', activeGame.id)
          .then(game => {
            activeGame.description = game.description_raw;
          })
          .catch(err => console.error(err));      
      })
    },
    // Requests as many games as needed to fill 5 categories with at least 10 games per.
    requestGames(page = 1) {
      this.$axios.get('https://api.rawg.io/api/games?page=' + page)
      .then(response => {
        response.data.results.forEach(element => {
          // Add description property to each object, so Vue knows it exists
          element.description = '';
          this.games.push(element);
          // Count amount of each genre in this.genres
          element.genres.forEach(genre => {
            this.genres[genre.name] = (this.genres[genre.name] || 0) + 1
          })
        });

        // Create a list of categories (genres) that already have more than 10 games
        const values: number[] = Object.values(this.genres);
        const filledCategoryAmount = values.filter(value => value >= 10).length;
        
        if(filledCategoryAmount < 5) {
          // If there are less than 5 categories ready, run the function again
          this.requestGames(page+1);
        } else {
          // There are 5 or more categories with more than 10 games: ready for display

          // Sort biggest categories to the front & slice the first 5
          let sortedCategories: string[] = Object.keys(this.genres).sort((a,b) => this.genres[b]-this.genres[a]);
          sortedCategories = sortedCategories.slice(0,5);
          this.categories = sortedCategories;

          // For each game in the list, check if they include the selected category (genre)
          this.games = this.games.filter(game => {
            let found = false;
            game.genres.forEach(genre => {
              if (sortedCategories.includes(genre.name)) {
                found = true;
              }
            });
            return found;
          });
          this.selectedGenre = sortedCategories[0];
        }
        this.getDescriptions();
      })
    }
  },
  computed: {
    // Changes active game array upon a change in category
    activeGames(): Game[] {
      return this.games.filter(game => {
        let found = false;
        game.genres.forEach(genre => {
          if (genre.name == this.selectedGenre) {
            found = true;
          }
        });
        return found;
      });
    }
  },
  mounted() {
    this.requestGames();
  }
})
</script>

<style lang="scss" scoped>
.categories {
  padding: 0.75rem 1rem 0.25rem 1rem;
  background-color: #ECECEC;
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  position: sticky;
  top: 83px;
  z-index: 999;
  @media(max-width: 500px) {
    position: relative;
  }
  .category {
    padding: 0.5rem 1.6rem;
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