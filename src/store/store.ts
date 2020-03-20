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
      if (!Array.isArray(games)) {
        const exists = state.loadedGames.find(loadedGame => loadedGame.id === games.id);
        if(exists) return;
        state.loadedGames.push(games)
      } else {
        games.forEach(game => {
          console.log(game.id);
          const exists = state.loadedGames.find(loadedGame => loadedGame.id === game.id);
          if(exists) return;
          state.loadedGames.push(game);
        })
      }
    }
  },
  actions: {
    loadGames({ commit }, page = 1): Promise<Game[]> {
      let gameArray: Game[] = [];
      console.log('Page: ', page)
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
    findGameById({ commit, state }, id) {
      const loadedGame = state.loadedGames.find(x => x.id == id);
      if (loadedGame && loadedGame.description_raw) {
        // Load game from store
        console.log(state.loadedGames.find(x => x.id == id));
        return state.loadedGames.find(x => x.id == id);
      } else {
        // Else load game from API & add to store
        return axios.get('https://api.rawg.io/api/games/' + id)
        .then((response) => {
          commit('ADD_GAMES', response.data);
          return response.data;
        })
      }
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
    },
    findVisuallySimilarGames(context, id): Promise<Game[]> {
      // Check how many games can still be added
      const similarGamesArray: Game[] = [];
      return axios.get('https://api.rawg.io/api/games/' + id + '/suggested')
        .then((response) => {
          response.data.results.forEach(item => {
            similarGamesArray.push(item);
          })
          return similarGamesArray;
        })
    }
  }
})