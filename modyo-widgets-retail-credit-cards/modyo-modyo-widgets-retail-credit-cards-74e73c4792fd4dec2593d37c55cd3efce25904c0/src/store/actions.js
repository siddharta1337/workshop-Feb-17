/* eslint-disable no-useless-catch */
import axios from 'axios';
import { addDays } from 'date-fns';

const LANG = window.liquid ? window.liquid.lang : 'es-CL';

const BASE_URL = LANG === 'es-CL' ? 'https://api-bank.herokuapp.com' : 'https://dynamic-bank-api.herokuapp.com';

export default {
  DO_DATA_INITIALIZATION(context) {
    return new Promise((resolve, reject) => {
      context.dispatch('GET_CARDS')
        .then(() => {
          context.commit(
            'SET_ACTIVE_CARD_ID',
            context.state.cards[0].id,
          );
          context.dispatch('GET_TRANSACTIONS');
          resolve();
        })
        .catch(() => reject());
    });
  },

  async GET_CARDS(context) {
    context.commit('SET_ACTIVE_TAB', 'movements');
    context.commit('SET_CARDS', []);

    try {
      const creditCards = await axios.get(`${BASE_URL}/api/v1/clients/${context.state.paramClientId}/creditCards`);
      context.commit('SET_CARDS', creditCards.data);
      context.commit('SET_IS_LOADING_CARDS', false);
      return creditCards;
    } catch (err) {
      throw err;
    }
  },

  async GET_TRANSACTIONS(context) {
    context.commit('SET_TRANSACTIONS', []);
    context.commit('SET_IS_LOADING_TRANSACTIONS', true);

    try {
      const movements = await axios.get(`${BASE_URL}/api/v1/creditCards/${context.state.activeCardId}/movements/`, {
        params: {
          from: new Date(context.state.fromDate),
          to: addDays(new Date(context.state.toDate), 1),
        },
      });
      context.commit('SET_TRANSACTIONS', movements.data);
      context.commit('SET_IS_LOADING_TRANSACTIONS', false);
      return movements;
    } catch (err) {
      throw err;
    }
  },

  async GET_STATEMENTS(context) {
    context.commit('SET_TRANSACTIONS', []);
    context.commit('SET_IS_LOADING_TRANSACTIONS', true);
    try {
      const statements = await axios.get(`${BASE_URL}/api/v1/creditCards/${context.state.activeCardId}/statements/`, {
        params: {
          from: new Date(context.state.fromDate),
          to: new Date(context.state.toDate),
        },
      });
      context.commit('SET_TRANSACTIONS', statements.data);
      context.commit('SET_IS_LOADING_TRANSACTIONS', false);
      return statements;
    } catch (err) {
      throw err;
    }
  },
};
