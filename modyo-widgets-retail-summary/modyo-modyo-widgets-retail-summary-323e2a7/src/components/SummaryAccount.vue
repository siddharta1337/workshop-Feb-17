<template>
  <section
    class="product-summary card border-0 shadow"
    :class="'wrap-' + account.accountType | slug">
    <div
      class="card-header product-summary__header py-3 px-4 d-flex
             align-items-center justify-content-between border-0 text-tertiary ">
      <h2 class="mb-0 text-capitalize h6">
        {{ account.accountType }}
        <span class="d-block mt-1">{{ $tc('commons.number', account.accountNumber) }}</span>
      </h2>

      <font-awesome-icon
        icon="wallet"
        size="lg" />
    </div>

    <div class="card-body product-summary__body px-4 pt-4 pb-0">
      <div class="product-summary__balance text-right">
        <p class="mb-0 text-primary product-summary__amount font-weight-bold">
          {{ parseFloat(account.availableBalance) | currency(currencyFormat) }}
        </p>
        <p class="product-summary__description text-primary">
          {{ $t('account.current-balance') }}
        </p>
      </div>

      <table class="product-summary__totals table table-condensed table-borderless mb-0">
        <tr>
          <td class="font-weight-light px-0">
            {{ $t('account.withdrawals') }}
          </td>
          <td class="text-right px-0">
            {{ account.totalCharges | currency(currencyFormat) }}
          </td>
        </tr>
        <tr>
          <td class="font-weight-light px-0">
            {{ $t('account.deposits') }}
          </td>
          <td class="text-right px-0">
            {{ account.totalIncomes | currency(currencyFormat) }}
          </td>
        </tr>
        <tr v-if="relatedAccount">
          <td class="font-weight-light px-0">
            {{ $t('account.credit-line') }}
            <span class="font-weight-bold d-block">{{ $tc('commons.number', relatedAccount.accountNumber) }}</span>
          </td>
        </tr>
      </table>

      <div
        v-if="relatedAccount"
        class="related-account product-summary__balance text-right">
        <p class="mb-0 text-primary product-summary__amount font-weight-bold">
          {{ relatedAccount.availableBalance | currency(currencyFormat) }}
        </p>
        <p class="product-summary__description mb-3 text-primary">
          {{ $t('account.available-balance') }}
        </p>
      </div>

      <summary-movements
        v-if="showMovements"
        :accountid="account.id"
        :limit="4" />

      <m-progress-bar
        v-if="showBar"
        :percentage="percentage" />
    </div>

    <div class="card-footer d-flex product-summary__footer bg-transparent border-0 p-4">
      <div class="col-sm-6 px-1">
        <a
          href="#"
          class="product-summary__footer-btn btn btn-primary btn-block py-2"
          @click.prevent="">{{ $t('account.transfer') }}</a>
      </div>
      <div class="col-sm-6 px-1">
        <a
          href="#"
          class="product-summary__footer-btn btn btn-primary btn-block py-2"
          @click.prevent="">
          {{ $t('commons.view-transactions') }}
        </a>
      </div>
    </div>
  </section>
</template>

<script>
import { MProgressBar, currency, slug } from '@modyo/financial-commons';
import SummaryMovements from './SummaryMovements.vue';

export default {
  name: 'SummaryAccount',
  components: {
    SummaryMovements,
    MProgressBar,
  },
  filters: {
    currency,
    slug,
  },
  props: {
    account: {
      type: Object,
      required: true,
    },
    clientId: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      currencyFormat: this.$t('currency.format'),
    };
  },
  computed: {
    relatedAccount() {
      return this.account.relatedAccount;
    },
    showMovements() {
      return this.account.accountType === 'cuenta vista' || this.account.accountType === 'savings account';
    },
    showBar() {
      return !!this.relatedAccount;
    },
    percentage() {
      let percentage = 0;
      if (this.relatedAccount) {
        percentage = Math.floor((this.relatedAccount.usedAmount / this.relatedAccount.authorizedAmount) * 100);
      }
      return percentage;
    },
  },
};
</script>

<style lang="scss">
@import "../scss/variables";

.product-summary.card {
  flex: 0 0 85%;

  max-width: 85%;
  margin: 0 10px 20px;

  border-radius: 12px;

  &:first-child {
    margin-left: 20px;
  }

  &:last-child {
    margin-right: 20px;
  }
}

.product-summary__header {
  color: $primary-100;

  background-color: $secondary-20;
}

.card-header.product-summary__header:first-child {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}

@media (max-width: 319.98px) {
  .product-summary__footer {
    .product-summary__footer-btn {
      padding-right: .25rem;
      padding-left: .25rem;

      font-size: .8rem;
    }
  }
}

@media (max-width: 575.98px) {
  .product-summary__header h2 {
    font-size: 12px;
  }

  .product-summary__amount {
    font-size: 24px;
  }

  .product-summary__footer a {
    font-size: 14px;
  }
}

@media (min-width: 576px) {
  .product-summary.card {
    flex: 0 0 360px;

    max-width: 360px;
    margin: 0 10px 20px;

    border-radius: 12px;
  }

  .product-summary__header h2 {
    font-size: 14px;
  }

  .product-summary__amount {
    font-size: 32px;
  }

  .related-account .product-summary__amount {
    font-size: 28px;
  }
}

@media (min-width: 1200px) {
  .product-summary.card {
    &:first-child {
      margin-left: 160px;
    }

    &:last-child {
      margin-right: 20px;
    }
  }
}

</style>
