<template>
  <div
    class="credit-card__info d-flex flex-column justify-content-between">
    <div
      v-if="!isLangEn"
      class="credit-card__summary national py-4 border-bottom">
      <div class="px-4 px-xl-5">
        <div class="text-right">
          <p class="mb-1 text-primary">
            {{ $t('credit-card-info.national-amount') }}
          </p>
          <h4 class="text-primary">
            {{ card.availableQuotaCLP ? card.availableQuotaCLP : 0 | currency(currencyFormat) }}
          </h4>
        </div>

        <m-progress-bar :percentage="percentageCLP">
          <template #after="{percentage}">
            <p class="d-lg-block text-right mb-0 mt-2">
              <i18n path="credit-card-info.progress-message">
                <strong>{{ percentage }}</strong>
                <strong>{{ card.totalQuotaCLP |currency(currencyFormat) }}</strong>
              </i18n>
            </p>
          </template>
        </m-progress-bar>
      </div>
    </div>

    <div class="credit-card__summary international py-4 border-bottom">
      <div class="px-4 px-xl-5">
        <div class="text-right">
          <p class="mb-1 text-primary">
            {{ $t('credit-card-info.international-amount') }}
          </p>
          <h4 class="text-primary">
            {{ card.availableQuotaUSD ? card.availableQuotaUSD : 0 | currency(currencyFormatDolar) }}
          </h4>
        </div>

        <m-progress-bar :percentage="percentageUSD">
          <template #after="{percentage}">
            <p class="d-lg-block text-right mb-0 mt-2">
              <i18n path="credit-card-info.progress-message">
                <strong>{{ percentage }}</strong>
                <strong>{{ card.totalQuotaUSD |currency(currencyFormatDolar) }}</strong>
              </i18n>
            </p>
          </template>
        </m-progress-bar>
      </div>
    </div>

    <div class="credit-card__debt p-4 px-xl-5 flex-grow-1">
      <div
        v-if="!isLangEn"
        class="media">
        <div class="pr-3">
          <p class="mb-0">
            {{ $t('credit-card-info.national-debt') }}
          </p>
        </div>

        <div class="media-body text-right">
          <p class="mb-0">
            <strong>{{ card.usedQuotaCLP ? card.usedQuotaCLP : 0 | currency(currencyFormat) }}</strong>
          </p>
        </div>
      </div>

      <div class="media">
        <div class="pr-3">
          <p class="mb-0">
            {{ $t('credit-card-info.international-debt') }}
          </p>
        </div>

        <div class="media-body text-right">
          <p class="mb-0">
            <strong>{{ card.usedQuotaUSD ? card.usedQuotaUSD : 0 | currency(currencyFormatDolar) }}</strong>
          </p>
        </div>
      </div>
    </div>

    <div class="credit-card__actions px-4 px-xl-5 py-4">
      <div class="mb-2 mb-lg-0">
        <a
          href="#"
          class="btn btn-primary btn-block font-weight-bold py-3"
          @click.prevent="">
          {{ $t('credit-card-info.pay-debt') }}
        </a>
      </div>

      <div class="d-lg-none">
        <button
          class="btn btn-secondary btn-block py-3"
          @click="showMovements = true">
          {{ $t('credit-card-info.view-transactions-btn') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { MProgressBar, currency } from '@modyo/financial-commons';

export default {
  name: 'CreditCardInfo',
  filters: {
    currency,
  },
  components: {
    MProgressBar,
  },
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      currencyFormat: this.$t('currency.format'),
    };
  },
  computed: {
    last4numbers() {
      return this.card.cardNumber.substr(-4, 4);
    },
    percentageCLP() {
      // eslint-disable-next-line max-len
      if (parseFloat(this.card.totalQuotaCLP) !== 0) return Math.floor((this.card.usedQuotaCLP / this.card.totalQuotaCLP) * 100);
      return 0;
    },
    percentageUSD() {
      return Math.floor((this.card.usedQuotaUSD / this.card.totalQuotaUSD) * 100);
    },
    showMovements: {
      get() {
        return this.$store.state.showMovements;
      },
      set(val) {
        this.$store.commit('SET_SHOW_MOVEMENTS', val);
      },
    },
    isLangEn() {
      return this.$store.state.lang === 'en-US';
    },
    currencyFormatDolar() {
      if (!this.isLangEn) {
        return this.$t('currency.formatDolar');
      }
      return this.$t('currency.format', 'en-US');
    },
  },
};
</script>

<style lang="scss" scoped>
  .credit-card__info {
    height: 100%;
    overflow: auto;
  }
</style>
