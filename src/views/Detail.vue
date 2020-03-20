<template>
  <div>
    <div v-if="this.$route.path.split('/')[1] === 'random'">
      <a id="random-game" @click="findRandomGame()">Give me a new random game!</a>
    </div>
    <div id="detail-item">
      <div class="genres">
        <tag color="blue" v-for="(genre, index) in game.genres" :key="index">{{ genre.name }}</tag>
      </div>

      <title-element size="h1">{{ game.name }}</title-element>

      <div class="wrapper">
        <article id="details">
          <div class="img-wrapper" v-if="game.background_image">
            <img :src="game.background_image" :alt="game.name">
            <div class="stars">
              <img src="@/assets/img/icons/star.svg" alt="Star" v-for="index in getStars" :key="index">
            </div>
          </div>

          <p class="meta">Meta <span>Released on {{ game.released }}</span> <span>Page last updated on {{ game.updated ? game.updated.replace('T', ' at ') : 'unknown' }}</span></p>

          <div class="description">
            <title-element size="h2">Description</title-element>
            <p>
              {{ game.description_raw ? game.description_raw : game.description ? game.decription : 'Not specified' }}
            </p>
          </div>

          <div class="meta-wrapper">
            <section>
              <title-element size="h2">Platforms</title-element>
              <ul>
                <li v-for="(platform, index) in game.platforms" :key="index">{{ platform.platform.name }}</li>
              </ul>
            </section>
            <section>
              <title-element size="h2">Developed by</title-element>
              <span v-for="developer in game.developers" :key="developer.id">{{ developer.name == game.developers[game.developers.length-1].name ? developer.name : developer.name + ',' }} </span>
            </section>
            <section>
              <title-element size="h2">Published by</title-element>
              <b v-for="publisher in game.publishers" :key="publisher.id">
                {{ publisher.name == game.publishers[game.publishers.length-1].name ? publisher.name : publisher.name + ',' }} 
              </b>
            </section>
          </div>

          <div class="tags">
            <title-element size="h2">Tags</title-element>
            <div class="wrap">
              <tag color="grey" v-for="(tag, index) in game.tags" :key="index">{{ tag.name }}</tag>
            </div>
          </div>
          <a :href="game.website" id="site-link">Go to the official website</a>
        </article>

        <div id="sidebar" v-if="similarGames != []">
          <title-element size="h2">Similar games</title-element>
          <section v-for="similarGame in similarGames" :key="similarGame.id">
            <img :src="similarGame.background_image"  :alt="similarGame.name">
            <a @click="selectOtherGame(similarGame.id)" :to="'../detail/' + similarGame.id">{{ similarGame.name }}</a>
          </section>
        </div>
        <div id="sidebar" v-else>
          <title-element size="h2">Similar games</title-element>
          <p>No similar games found...</p>
        </div>
      </div>    
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Game } from '../models/Game';

export default Vue.extend({
  data() {
    return {
      game: {} as Game,
      similarGames: [] as Game[]
    } 
  },
  methods: {
    findRandomGame() {
      this.$store.dispatch('findRandomGame')
        .then(game => this.game = game)
        .catch(err => console.error(err));
    },
    selectOtherGame(gameId: number) {
      // Get game details by pageId
      this.similarGames = [];
      this.getGameSeries(gameId);
      this.$router.push('/detail/' + gameId);

      if (this.$store.state.loadedGames.find(x => x.id == gameId)) {
        // Load game from store
        this.game = this.$store.state.loadedGames.find(x => x.id == gameId);
      } else {
        // Else load game from API & add to store
        this.$axios.get('https://api.rawg.io/api/games/' + gameId)
        .then((response) => {
          this.game = response.data;
          this.$store.state.loadedGames.push(response.data);
        })
        .catch((err) => {
          console.error(err);
        })
      }
    },
    getGameSeries(gameId: number) {
      const pageId = gameId ? gameId : this.$route.params.id;
      this.similarGames = [];

      this.$axios.get('https://api.rawg.io/api/games/' + pageId + '/game-series')
      .then((response) => {
        // If the game-series request provides the game that's already shown, filter it out of the list
        const similarGamesArray: Game[] = response.data.results.filter(item => item.id != pageId);
        
        // Push a maximum of 2 games that are in the same series
        for (let i=0;i<Math.min(2, similarGamesArray.length);i++) {
          this.similarGames.push(similarGamesArray[i]);
        }
        this.getSimilarGames(gameId);
      })
      .catch((err) => {
        console.error(err);
      })
    },
    getSimilarGames(gameId: number) {
      // Check how many games can still be added
      const spaceLeft = 3-this.similarGames.length;

      this.$axios.get('https://api.rawg.io/api/games/' + gameId + '/suggested')
      .then((response) => {
        // If the suggested games contain the game that's also already in the series, remove it.
        response.data.results.forEach(item => {
          if (this.similarGames.find((x) => x.id === item.id)) {
            response.data.results.splice(item);
          }
        })
        // Push similargames, however many spaceLeft is
        for (let i=0;i<Math.min(spaceLeft, response.data.results.length);i++) {
          this.similarGames.push(response.data.results[i]);
        }
      })
      .catch((err) => {
        console.error(err);
      })
    }
  },
  computed: {
    getStars(): number {
      return Math.round(this.game.rating);
    }
  },
  created() {
    if (this.$route.path.split('/')[1] === 'random') {
      this.findRandomGame();
    } else {
      // Path is of /detail, so get game by id
      const pageId = this.$route.params.id;
      this.getGameSeries(parseInt(pageId));
      this.$axios.get('https://api.rawg.io/api/games/' + pageId)
      .then((response) => {
        this.game = response.data;
      })
      .catch((err) => {
        console.error(err);
      })
    }
  }
})
</script>

<style lang="scss" scoped>
#detail-item {
  .wrapper {
    display: grid;
    grid-template-columns: 1fr 200px;
    grid-gap: 2rem;
    @media(max-width: 767px) {
      grid-template-columns: 1fr;
    }
  }
  .genres {
    margin-top: 1rem;
    display: flex;
    flex-wrap: wrap;
  }
}

#details {
  .img-wrapper {
    position: relative;
    img {
      width: 100%;
    }
    .stars {
      position: absolute;
      bottom: 4px;
      padding: 1rem;
      background-color: rgba(0,0,0,0.3);
      width: 100%;
      display: flex;
      img {
        width: 30px;
        margin-right: 10px;
      }
    }
  }
  p.meta {
    font-weight: bold;
    span {
      font-weight: normal;
      margin-right: 1rem;
      font-size: 14px;
    }
  }
  .description {
    margin-top: 2rem;
    p {
      font-size: 15px !important;
    }
  }
  .meta-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    margin-top: 3rem;
    ul {
      padding-left: 20px;
      list-style-type:square;
    }
    .title { 
      margin-top: 1rem;
    }
    @media(max-width: 1000px) {
      grid-template-columns: 1fr 1fr;
    }
    @media(max-width: 767px) {
      grid-template-columns: 1fr;
    }
  }
  .tags {
    margin-top: 2rem;
    .wrap {
      display: flex;
      flex-wrap: wrap;
      max-width: 600px;
      .tag {
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
        padding: 0.2rem 0.9rem;
        border-radius: 25px;
        background-color: #CECECE;
        font-size: 14px;
      }
    }
  }
}

#site-link, #random-game {
  padding: 1rem 1.5rem;
  background-color: #0099FF;
  color: white;
  font-weight: bold;
  font-family: 'Changa One', cursive;
  font-size: 20px;
  text-decoration: none;
  display: inline-block;
  margin-top: 2rem;
  box-shadow: 0 3px 6px rgba(0,0,0,0.3);
  transition: .2s;
  font-weight: 400;
  cursor: pointer;
  &:hover {
    background-color: darken(#0099FF, 10%);
    box-shadow: 0px 0px 0px rbga(0,0,0,0);
  }
  &:active {
    transform: scale(1.1);
  }
}

#random-game {
  margin: 0;
  margin-bottom: 2rem;
}

#sidebar {
  section {
    margin-bottom: 1rem;
  }
  img {
    width: 100%;
  }
  a {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
}
</style>