<template>
  <div id="detail-item">
    <div class="genres">
      <span class="tag" v-for="(genre, index) in game.genres" :key="index">{{ genre.name }}</span>
    </div>

    <title-element size="h1">{{ game.name }}</title-element>

    <div class="wrapper">
      <article id="details">
        <div class="img-wrapper" v-if="game.background_image">
          <img :src="game.background_image" alt="">
          <div class="stars">
            <img src="@/assets/img/icons/star.svg" alt="">
            <img src="@/assets/img/icons/star.svg" alt="">
            <img src="@/assets/img/icons/star.svg" alt="">
            <img src="@/assets/img/icons/star.svg" alt="">
          </div>
        </div>

        <p class="meta">Meta <span>Released on {{ game.released }}</span> <span>Page last updated on {{ game.updated }}</span></p>

        <div class="description">
          <title-element size="h2">Description</title-element>
          <p>
            {{ game.description_raw }}
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
            <b v-for="publisher in game.publishers" :key="publisher.id">{{ publisher.name == game.publishers[game.publishers.length-1].name ? publisher.name : publisher.name + ',' }} </b>
          </section>
        </div>

        <div class="tags">
          <title-element size="h2">Tags</title-element>
          <div class="wrap">
            <span class="tag" v-for="(tag, index) in game.tags" :key="index">{{ tag.name }}</span>
          </div>
        </div>
        <a href="#" id="site-link">Go to the official website</a>
      </article>

      <div id="sidebar" v-if="similarGames != []">
        <title-element size="h2">Similar games</title-element>
        <section v-for="similarGame in similarGames" :key="similarGame.id">
          <img :src="similarGame.background_image" alt="">
          <a @click="selectOtherGame(similarGame.id)" :to="'../detail/' + similarGame.id">{{ similarGame.name }}</a>
        </section>
      </div>
      <div id="sidebar" v-else>
        <title-element size="h2">Similar games</title-element>
        <p>No similar games found...</p>
      </div>
    </div>    
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data() {
    return {
      game: {
        rating: 0,
        stars: []
      },
      similarGames: [] as object[]
    }
  },
  methods: {
    selectOtherGame(gameId: number) {
      // Get game details by pageId
      this.similarGames = [];
      this.getGameSeries(gameId);
      this.$router.push('/detail/' + gameId);

      this.$axios.get('https://api.rawg.io/api/games/' + gameId)
      .then((response) => {
        this.game = response.data;
      })
      .catch((err) => {
        console.error(err);
      })
    },
    getGameSeries(gameId: number) {
      const pageId = gameId ? gameId : this.$route.params.id;
      this.similarGames = [];

      this.$axios.get('https://api.rawg.io/api/games/' + pageId + '/game-series')
      .then((response) => {
        const similarGamesArray: object[] = response.data.results.filter(item => item.id != pageId);
      
        for (let i=0;i<Math.min(1, similarGamesArray.length);i++) {
          this.similarGames.push(similarGamesArray[i]);
        }
        this.getSimilarGames(gameId);
      })
      .catch((err) => {
        console.error(err);
      })
    },
    getSimilarGames(gameId: number) {
      const pageId = gameId ? gameId : this.$route.params.id;

      if (this.similarGames.length < 3) {
        const spaceLeft = 3-this.similarGames.length;

        this.$axios.get('https://api.rawg.io/api/games/' + pageId + '/suggested')
        .then((response) => {
          const visuallySimilarGames = response.data.results;
          for (let i=0;i<Math.min(spaceLeft, visuallySimilarGames.length);i++) {
            this.similarGames.push(visuallySimilarGames[i]);
          }
        })
        .catch((err) => {
          console.error(err);
        })
      }
    }
  },
  created() {
    // Get game details by pageId
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
})
</script>

<style lang="scss" scoped>
#detail-item {
  .wrapper {
    display: grid;
    grid-template-columns: 1fr 200px;
    grid-gap: 2rem;
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

#sidebar {
  img {
    width: 100%;
  }
}
</style>