<template>
  <div
    v-if="activeTab !== 'statements'"
    :class="[transaction.subject, transaction.transactionType]"
    class="card transaction px-4">
    <div
      :id="`transactionHeader${transaction.id}`"
      class="card-header transaction__header px-0">
      <button
        :class="selectedTransaction === transaction ? 'active' : ''"
        :data-target="`#transactionInfo${transaction.id}`"
        :aria-controls="`#transactionInfo${transaction.id}`"
        class="transaction__button btn btn-block text-left px-0 collapsed"
        type="button"
        aria-expanded="false"
        data-toggle="collapse"
        @click="selectTransaction">
        <div class="d-flex justify-content-between align-items-center">
          <div class="transaction__text text-capitalize">
            <p class="text-truncate mb-0 text-primary font-weight-bold">
              {{ transaction.description }}
            </p>
            <small
              v-if="transaction.installments > 1"
              class="d-block text-primary payment-info">
              {{ $t('transaction-item.installment-pyment') }}
              : {{ transaction.installmentNumber }}/{{ transaction.installments }}
            </small>
            <span v-if="transaction.transactionType === 'refund'">{{ $t('transaction-item.refund') }}</span>
          </div>

          <div class="transaction__amount">
            <p
              v-if="transaction.monthlyInstallment"
              class="text-primary font-weight-bold mb-0">
              {{ transaction.monthlyInstallment | currency(currencyFormat, transaction.subject) }}
            </p>
            <p
              v-else
              class="text-primary font-weight-bold mb-0">
              <strong>{{ transaction.amount | currency(currencyFormat, transaction.subject) }}</strong>
            </p>
          </div>

          <div class="transaction__icon">
            <font-awesome-icon
              icon="chevron-down"
              size="sm" />
          </div>
        </div>
      </button>
    </div>

    <div
      :id="`transactionInfo${transaction.id}`"
      class="transaction__info collapse"
      aria-labelledby="`transactionHeader${transaction.id}`"
      data-parent="#transactionsList">
      <div class="card-body transacion__body px-0">
        <h6>{{ $t('transaction-item.details') }}</h6>

        <div class="d-lg-flex">
          <div class="mr-5">
            <p class="text-capitalize mb-0">
              <small>{{ $t('transaction-item.product') }}:
                <span class="ml-2 font-weight-bold">{{ transaction.description }}</span>
              </small>
            </p>
            <p class="text-capitalize mb-0">
              <small>{{ $t('transaction-item.category') }}:
                <span class="ml-2 font-weight-bold">{{ transaction.category }}</span>
              </small>
            </p>
          </div>
          <div>
            <p class="text-capitalize mb-0">
              <small>
                {{ $t('transaction-item.reference-number') }}:
                <span class="ml-2 font-weight-bold">{{ transaction.referenceCode }}</span>
              </small>
            </p>
            <p class="text-capitalize mb-0">
              <small>{{ $t('transaction-item.total-purchase') }}:
                <span class="ml-2 font-weight-bold">
                  {{ transaction.totalAmount | currency(currencyFormat) }}
                </span>
              </small>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    v-else
    :class="[transaction.subject, transaction.transactionType]"
    class="card transaction px-4">
    <div
      :id="`transactionHeader${transaction.id}`"
      class="card-header transaction__header px-0">
      <div class="d-flex justify-content-between align-items-center">
        <div class="transaction__text text-capitalize">
          <p class="ellipsis mb-0 text-primary font-weight-bold">
            {{ transaction.description }}
          </p>
        </div>

        <div class="transaction__icon">
          <font-awesome-icon
            :icon="['far', 'file-pdf']"
            size="lg" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { currency, date } from '@modyo/financial-commons';

export default {
  name: 'TransactionItem',
  filters: {
    currency,
    date,
  },
  props: {
    transaction: {
      type: Object,
      required: true,
    },
  },
  computed: {
    isSelected() {
      return this.transacion === this.selectedTransaction;
    },

    selectedTransaction() {
      return this.$store.state.selectedTransaction;
    },
    activeTab() {
      return this.$store.state.activeTab;
    },

    filterBy() {
      return this.$store.state.filterBy;
    },
    isLangEn() {
      return this.$store.state.lang === 'en-US';
    },
    currencyFormat() {
      if (!this.isLangEn) {
        return this.filterBy.value === 'clp' ? this.$t('currency.format') : this.$t('currency.formatDolar');
      }
      return this.$t('currency.format', 'en-US');
    },
  },
  methods: {
    selectTransaction() {
      this.$store.commit('SET_SELECTED_TRANSACTION', this.transaction);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../scss/variables";

.accordion > .transaction.card {
  margin-bottom: 10px;

  border: 0;
  border-radius: 10px;
}

.transaction__header.card-header {
  background-color: #fff;
  border-color: $secondary-20;
}

.transaction__text {
  flex: 1 auto;

  margin-right: 20px;

  overflow: hidden;

  font-size: 14px;
}

.transaction__amount {
  flex: 0 auto;

  margin-right: 20px;

  font-size: 14px;

  p {
    white-space: nowrap;
  }
}

.transaction__button:not(.collapsed) {
  .transaction__icon {
    transform: rotate(180deg);
  }
}

.transaction__icon {
  flex: 0 auto;
}

.transacion__body {
  h6 {
    font-size: 14px;
    color: $primary-80;
  }

  p {
    color: $primary-80;
  }
}

</style>
