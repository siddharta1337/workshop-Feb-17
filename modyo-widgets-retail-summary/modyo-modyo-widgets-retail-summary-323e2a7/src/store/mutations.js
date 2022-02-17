export default {
  SET_CLIENT_ID(state, data) {
    state.clientId = data;
  },
  SET_ACCOUNTS(state, data) {
    state.accounts = data;
  },
  SET_CARDS(state, data) {
    state.cards = data;
  },
  SET_API_STATUS(state, data) {
    state.apiStatus = data;
  },
};
