export default {
  activeCard: (state) => state.cards.find((card) => card.id === state.activeCardId),
};
