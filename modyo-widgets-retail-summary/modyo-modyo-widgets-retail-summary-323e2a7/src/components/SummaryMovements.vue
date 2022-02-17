<template>
  <div class="product-summary__movements mt-3">
    <h4 class="h6 mb-2 text-primary">
      <strong>{{ $t('transactions.recent-activity') }}</strong>
    </h4>

    <div
      v-for="transaction in transactions"
      :key="transaction.id"
      class="row row-small">
      <div class="col-8">
        <p class="text-truncate mb-0">
          {{ transaction.description }}
        </p>
        <p class="date mb-2">
          <small class="font-weight-light">{{ transaction.bookingDate | date }}</small>
        </p>
      </div>
      <div class="col-4 text-right">
        <p>
          {{ transaction.amount | currency(currencyFormat) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { currency, date } from '@modyo/financial-commons';

export default {
  name: 'SummaryMovements',
  filters: {
    currency,
    date,
  },
  props: {
    accountid: {
      type: Number,
      required: true,
    },
    limit: {
      type: Number,
      default: 4,
    },
  },
  data() {
    return {
      transactions: null,
      currencyFormat: this.$t('currency.format'),
    };
  },
  created() {
    this.getTransactions();
  },
  methods: {
    getTransactions() {
      const request = {
        accountId: this.accountid,
        limit: this.limit,
      };
      const vm = this;
      this.$store.dispatch('GET_TRANSACTIONS_FOR_ACCOUNT', request)
        .then((transactions) => {
          vm.transactions = transactions.data;
        }, (err) => err.statusText);
    },
  },
};
</script>

<style lang="scss" scoped>
  .date {
    margin-top: -5px;

    small {
      font-size: 12px;
    }
  }

  @media (min-width: 576px) {
    .date {
      margin-top: -3px;

      small {
        font-size: 14px;
      }
    }
  }

</style>
