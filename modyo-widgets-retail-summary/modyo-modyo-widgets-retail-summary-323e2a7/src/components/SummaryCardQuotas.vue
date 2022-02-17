<template>
  <div class="product-summary__balance mb-5">
    <p class="mb-0 text-primary product-summary__amount font-weight-bold text-right">
      {{ availableQuota | currency(currencyFormat) }}
    </p>

    <slot />

    <div class="product-summary__totals mb-3">
      <div class="d-flex titles justify-content-between mb-1">
        <p class="mb-0">
          {{ $t('card-quotas.used') }}
        </p>
        <p class="mb-0">
          {{ $t('card-quotas.authorized') }}
        </p>
      </div>
      <div class="d-flex amounts justify-content-between">
        <p class="mb-0">
          {{ usedQuota | currency(currencyFormat) }}
        </p>
        <p class="mb-0">
          {{ totalQuota | currency(currencyFormat) }}
        </p>
      </div>
    </div>

    <m-progress-bar
      :percentage="percentage" />
  </div>
</template>

<script>
import { MProgressBar, currency } from '@modyo/financial-commons';

export default {
  name: 'SummaryCardQuotas',
  filters: {
    currency,
  },
  components: {
    MProgressBar,
  },
  props: {
    availableQuota: {
      type: [Number, String],
      required: true,
    },
    usedQuota: {
      type: [Number, String],
      required: true,
    },
    totalQuota: {
      type: [Number, String],
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  computed: {
    percentage() {
      const percentage = Math.floor((this.usedQuota / this.totalQuota) * 100);
      return percentage;
    },
    lang() {
      return this.$store.state.lang;
    },
    currencyFormat() {
      if (this.lang === 'es-CL') {
        return this.currency === 'CLP' ? this.$t('currency.format') : this.$t('currency.formatDolar');
      }
      return this.$t('currency.format', 'en-US');
    },
  },
};
</script>

<style>

@media (max-width: 575.98px) {
  .product-summary__amount {
    font-size: 24px;
  }

  .product-summary__totals .titles {
    font-size: 12px;
  }
}

@media (min-width: 1200px) {
  .product-summary__totals .titles {
    font-size: 14px;
  }
}
</style>
