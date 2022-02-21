<template>
  <div
    id="credit-cards-app"
    clasS="py-lg-4 py-xl-5">
    <div class="container-fluid container-lg credit-cards px-0">
      <div class="row no-gutters">
        <div class="credit-cards__sidebar d-flex flex-column col-lg-5">
          <m-response-control
            v-if="apiStatus"
            class="credit-cards__loading h-100 d-flex justify-content-center align-items-center"
            :status="apiStatus">
            <template #loading>
              <font-awesome-icon
                icon="circle-notch"
                size="5x"
                spin />
            </template>
            <template #error>
              <div class="d-flex flex-column justify-content-center p-4 h-100">
                <h5 class="text-center">
                  {{ $t('commons.try-again') }}
                </h5>
              </div>
            </template>
            <template #empty>
              <div class="d-flex flex-column justify-content-center p-4 h-100">
                <h5 class="text-center">
                  {{ $t('commons.empty') }}
                </h5>
              </div>
            </template>
          </m-response-control>
          <div
            class="credit-cards__slider-wrapper pb-4">
            <div
              v-show="!isLoadingCards"
              ref="credit-cards-slider"
              class="credit-cards__slider">
              <credit-card
                v-for="card in cards"
                ref="credit-card-slide"
                :key="`card-${card.id}`"
                :card="card"
                class="credit-cards__slide" />
            </div>
            <div class="credit-cards-slider__indicators px-4 d-flex justify-content-center">
              <span
                v-for="(card, index) in cards"
                :key="`indicator-${index}`"
                class="indicator"
                :class="{'active': creditCardsSlider.currentSlide == index}"
                @click="sliderGoTo(index)" />
            </div>
          </div>

          <credit-card-info
            v-if="!isLoadingCards && activeCard"
            :card="activeCard" />
        </div>

        <credit-card-movements />
      </div>
    </div>
    <!-- CONFIG MODAL -->
    <config-credit-card :card="activeCard" />
  </div>
</template>

<script>
import Siema from 'siema';
import { getURLParams, MResponseControl } from '@modyo/financial-commons';

import CreditCard from './components/CreditCard.vue';
import CreditCardInfo from './components/CreditCardInfo.vue';
import ConfigCreditCard from './components/ConfigCreditCard.vue';
import CreditCardMovements from './components/CreditCardMovements.vue';

export default {
  name: 'App',
  components: {
    CreditCard,
    CreditCardInfo,
    ConfigCreditCard,
    CreditCardMovements,
    MResponseControl,
  },
  data() {
    return {
      creditCardsSlider: {},
      apiStatus: false,
    };
  },
  computed: {
    activeCard() {
      return this.$store.getters.activeCard;
    },

    isLoadingCards() {
      return this.$store.state.isLoadingCards;
    },

    cards() {
      return this.$store.state.cards;
    },
    isLangEn() {
      return this.$store.state.lang === 'en-US';
    },
  },
  watch: {
    activeCard() {
      this.$store.dispatch('GET_TRANSACTIONS');
    },
  },
  created() {
    this.apiStatus = 'isLoading';
    const client = parseInt(getURLParams('client'), 10) || 1;
    const card = parseInt(getURLParams('card'), 10) || 1;
    this.$store.commit('SET_PARAM_CLIENT_ID', client);
    this.$store.commit('SET_PARAM_CARD_ID', card);
    this.$store.dispatch('DO_DATA_INITIALIZATION')
      .then(() => {
        this.initCreditCardsSlider();
        this.apiStatus = false;
      })
      .catch(() => {
        this.apiStatus = 'hasError';
      });
  },
  methods: {
    initCreditCardsSlider() {
      this.$nextTick(() => {
        this.creditCardsSlider = new Siema({
          selector: '.credit-cards__slider',
          onChange: this.setActiveCard,
        });
      });
    },

    sliderGoTo(index) {
      this.creditCardsSlider.goTo(index);
    },
    setActiveCard() {
      const cards = this.$refs['credit-card-slide'];
      if (this.isLangEn) {
        this.$store.commit('SET_FILTER_BY', { name: this.$t('transactions-list.international'), value: 'usd' });
      } else {
        this.$store.commit('SET_FILTER_BY', { name: this.$t('transactions-list.national'), value: 'clp' });
      }
      this.$store.commit('SET_ACTIVE_CARD_ID', cards[this.creditCardsSlider.currentSlide].$el.dataset.card);
      this.$store.commit('SET_ACTIVE_TAB', 'movements');
      this.$store.dispatch('GET_TRANSACTIONS');
      cards.forEach((slide, i) => {
        if (i === this.creditCardsSlider.currentSlide) {
          cards[i].$el.classList.add('active');
        } else {
          cards[i].$el.classList.remove('active');
        }
      });
    },
  },
};
</script>

<style src="./scss/fonts.css"></style>

<style lang="scss" scoped>
@import "scss/variables";

#credit-cards-app {
  height: 100%;

  .credit-cards {
    height: 100%;

    > .row {
      height: 100%;
    }
  }

  .credit-cards__sidebar {
    position: relative;

    height: 100%;
    overflow: hidden;

    background-color: $tertiary-20;
  }

  .credit-cards__slider-wrapper {
    background-color: #fff;
  }

  .credit-cards-slider__indicators {
    .indicator {
      width: 60px;
      height: 8px;
      margin: 0 5px;

      cursor: pointer;

      background-color: $primary-20;
      border-radius: 8px;

      &.active {
        background-color: $primary-100;
      }
    }
  }

}

@media (min-width: 992px) {
  #credit-cards-app {
    .credit-cards__sidebar {
      background-color: #fff;
    }

    .credit-cards__slider-wrapper {
      border-bottom: 1px solid $secondary-20;
    }
  }
}
</style>
