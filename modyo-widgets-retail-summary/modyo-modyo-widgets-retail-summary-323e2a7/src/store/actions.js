/* eslint-disable no-useless-catch */
import axios from 'axios';

const LANG = window.liquid ? window.liquid.lang : 'es-CL';
const BASE_URL = LANG === 'es-CL' ? 'https://api-bank.herokuapp.com' : 'https://dynamic-bank-api.herokuapp.com';

export default {
  async DO_DATA_INITIALIZATION(context) {
    context.commit('SET_API_STATUS', 'isLoading');
    try {
      const values = await Promise.all([context.dispatch('GET_ACCOUNTS'), context.dispatch('GET_CARDS')]);
      return values;
    } catch (err) {
      context.commit('SET_API_STATUS', 'hasError');
      return err;
    }
  },
  async GET_ACCOUNTS(context) {
    try {
      const accounts = await axios.get(`${BASE_URL}/api/v1/clients/${context.state.clientId}/accounts`, {
        params: {
          'filter[include]': 'relatedAccount',
          'filter[order]': 'accountType',
        },
      });
      if (accounts.data.length <= 0) {
        context.commit('SET_API_STATUS', 'isEmpty');
      } else {
        context.commit('SET_ACCOUNTS', accounts.data);
        context.commit('SET_API_STATUS', false);
      }
      return accounts.data;
    } catch (err) {
      throw err;
    }
  },
  async GET_TRANSACTIONS_FOR_ACCOUNT(context, payload) {
    try {
      const transactions = await axios.get(`${BASE_URL}/api/v1/clients/${context.state.clientId}/accounts/${payload.accountId}/transactions/`, {
        params: {
          'filter[limit]': payload.limit,
        },
      });
      return transactions;
    } catch (err) {
      return err;
    }
  },
  async GET_CARDS(context) {
    try {
      const creditCards = await axios.get(`${BASE_URL}/api/v1/clients/${context.state.clientId}/creditCards`);
      if (creditCards.data.length <= 0) {
        context.commit('SET_API_STATUS', 'isEmpty');
      } else {
        context.commit('SET_CARDS', creditCards.data);
        context.commit('SET_API_STATUS', false);
      }
      return creditCards;
    } catch (err) {
      context.commit('SET_API_STATUS', 'hasError');
      throw err;
    }
  },
};
