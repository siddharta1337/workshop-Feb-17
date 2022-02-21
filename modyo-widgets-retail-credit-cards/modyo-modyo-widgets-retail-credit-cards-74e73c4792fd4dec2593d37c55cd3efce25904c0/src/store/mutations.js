export default {
  SET_CARDS(state, data) {
    state.cards = data;
  },
  SET_SELECTED_TRANSACTION(state, data) {
    state.selectedTransaction = data;
  },
  SET_ACTIVE_CARD_ID(state, data) {
    state.activeCardId = Number(data);
  },
  SET_ACTIVE_TAB(state, data) {
    state.activeTab = data;
  },

  SET_FROM_DATE(state, data) {
    state.fromDate = data;
  },

  SET_FILTER_BY(state, data) {
    state.filterBy = data;
  },

  SET_IS_LOADING_CARDS(state, data) {
    state.isLoadingCards = data;
  },

  SET_IS_LOADING_TRANSACTIONS(state, data) {
    state.isLoadingTransactions = data;
  },

  SET_PARAM_CLIENT_ID(state, data) {
    state.paramClientId = data;
  },

  SET_PARAM_CARD_ID(state, data) {
    state.paramCardId = data;
  },

  SET_SHOW_MOVEMENTS(state, data) {
    state.showMovements = data;
  },

  SET_TO_DATE(state, data) {
    state.toDate = data;
  },

  SET_TRANSACTIONS(state, data) {
    state.transactions = data;
  },
};
