import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

import { Game } from '../models/Game';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    loadedGames: [] as Game[]
  },
  mutations: {
    addGames(state, games) {
      games.forEach(game => state.loadedGames.push(game));
    }
  },
  actions: {
    loadGames(context, page = 1) {
      if (context.state.loadedGames.length >= 10) return;

      let gameArray: Game[] = [];
      
      axios
        .get('https://api.rawg.io/api/games?page=' + page)
        .then(response => {
          gameArray = response.data.results.splice(0,10);
          const promises: Promise<void>[] = [];
          gameArray.forEach(game => {
            promises.push(axios.get('https://api.rawg.io/api/games/' + game.id)
              .then((response) => {
                game.description = response.data.description_raw;
              })
            )
          });
          return Promise.all(promises);
        })
        .then(() => {
          context.commit('addGames', gameArray);
        })
        .catch(err => console.log(err));
    }
  },
  getters: {

  }
})