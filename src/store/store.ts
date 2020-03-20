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
    ADD_GAMES(state, games) {
      games.forEach(game => state.loadedGames.push(game));
    }
  },
  actions: {
    loadGames({ commit, state }, page = 1): Promise<Game[]> {
      if (state.loadedGames.length >= 10) return Promise.resolve(state.loadedGames);

      let gameArray: Game[] = [];
      
      return axios.get('https://api.rawg.io/api/games?page=' + page)
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
          commit('ADD_GAMES', gameArray);
          return gameArray;
        });
    },
    findRandomGame(): Promise<Game> {
      return axios.get('https://api.rawg.io/api/games')
      .then((response) => {
        const id = Math.floor(Math.random() * Math.floor(response.data.count));
        return axios.get('https://api.rawg.io/api/games/' + id)
      })
      .then((response) => {
        return response.data;
      })
    },
    findGamesInSameSeries(context, id) {
      const similarGames: Game[] = [];
      return axios.get('https://api.rawg.io/api/games/' + id + '/game-series')
      .then((response) => {
        // If the game-series request provides the game that's already shown, filter it out of the list
        const similarGamesArray: Game[] = response.data.results.filter(item => item.id != id);
        
        // Push a maximum of 2 games that are in the same series
        for (let i=0;i<Math.min(2, similarGamesArray.length);i++) {
          similarGames.push(similarGamesArray[i]);
        }
        return similarGames;
      })
    }
  }
})