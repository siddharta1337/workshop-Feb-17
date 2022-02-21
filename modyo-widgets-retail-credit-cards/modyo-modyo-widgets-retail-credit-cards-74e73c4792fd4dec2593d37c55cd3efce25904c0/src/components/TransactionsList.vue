<template>
  <div class="transactions-list d-flex flex-column h-100 mt-3">
    <div class="transactions-list__filters d-flex flex-wrap">
      <div class="filters__select mr-2 mr-md-3">
        <multiselect
          v-if="!isLangEn"
          v-model="filterBy"
          track-by="value"
          label="name"
          :options="filters"
          :close-on-select="true"
          :show-labels="false"
          :allow-empty="false"
          :searchable="false">
          <template
            slot="singleLabel"
            slot-scope="{ option }">
            {{ option.name }}
          </template>
        </multiselect>
      </div>

      <div class="filters__date mr-2 mr-md-3">
        <vue-date-picker
          v-model="fromToDates"
          :format="dateFormats.short"
          :locale="{lang: dateFormats.lang}"
          :range-presets="rangePresets"
          color="#2e4553"
          :name="$t('transactions-list.select-period')"
          fullscreen-mobile
          validate
          range
          no-input
          @input="setNewDates">
          <template #activator="{ date }">
            <button
              ref="activator"
              class="filters-date__btn-mobile btn btn-link d-lg-none p-2"
              type="button">
              <font-awesome-icon
                icon="calendar" />
            </button>
            <button
              ref="activator"
              class="filters-date__btn btn d-none d-lg-inline-block p-2"
              type="button">
              <font-awesome-icon
                icon="calendar"
                class="mr-2" />
              {{ date }}
            </button>
          </template>
        </vue-date-picker>
      </div>

      <div
        v-if="activeTab === 'movements'"
        class="filters__search-icon">
        <button
          class="btn"
          :class="{'btn-primary': showSearch}"
          @click="toggleSearch">
          <font-awesome-icon icon="search" />
        </button>
      </div>

      <div
        v-if="activeTab === 'movements'"
        v-show="showSearch"
        class="filters__search-bar mt-4">
        <input
          v-model="query"
          type="search"
          class="form-control py-2 border"
          :placeholder="$t('commons.search')+'...'">
      </div>
    </div>

    <div
      v-if="isLoadingTransactions"
      class="loading">
      <div class="loading-ico" />
    </div>

    <div
      v-if="!isLoadingTransactions && transactions.length === 0"
      class="transactions-list--empty">
      <font-awesome-icon
        icon="exclamation-triangle"
        size="2x"
        class="mb-2" />
      <p>{{ $t('transactions-list.empty') }}</p>
    </div>

    <m-shadow-scroll
      v-if="!isLoadingTransactions && transactions.length > 0"
      id="transactionsList"
      class="transactions-list__items mt-4">
      <div
        v-for="(group, keyName, index) in groupedTransactions"
        :key="index"
        class="accordion mb-4">
        <p class="text-primary font-weight-bold mb-2">
          {{ keyName }}
        </p>
        <transaction-item
          v-for="transaction in group"
          :key="transaction.id"
          :transaction="transaction" />
      </div>
    </m-shadow-scroll>
  </div>
</template>

<script>
import { MShadowScroll, date, groupBy } from '@modyo/financial-commons';
import { VueDatePicker } from '@mathieustan/vue-datepicker';
import Multiselect from 'vue-multiselect';
import TransactionItem from './TransactionItem.vue';

export default {
  name: 'TransactionsList',
  filter: {
    date,
    groupBy,
  },
  components: {
    VueDatePicker,
    Multiselect,
    TransactionItem,
    MShadowScroll,
  },

  data() {
    return {
      query: '',
      activeTransaction: null,
      dateFormats: this.$t('date.format'),
      localFromDate: null,
      localToDate: null,
      showSearch: false,
      filters: [{ name: this.$t('transactions-list.national'), value: 'clp' }, { name: this.$t('transactions-list.international'), value: 'usd' }],
      rangePresets: [
        {
          name: this.$t('transactions-list.this-month'),
          dates: {
            start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            end: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
          },
        },
        {
          name: this.$t('transactions-list.last-month'),
          dates: {
            start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            end: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
          },
        },
        {
          name: this.$t('transactions-list.last-3-months'),
          dates: {
            start: new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1),
            end: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
          },
        },
        {
          name: this.$t('transactions-list.last-6-months'),
          dates: {
            start: new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1),
            end: new Date(new Date().getFullYear(), new Date().getMonth(), 0),
          },
        },
      ],
    };
  },
  computed: {
    fromToDates: {
      get() {
        return {
          start: this.$store.state.fromDate,
          end: this.$store.state.toDate,
        };
      },
      set(values) {
        const { start, end } = values;
        this.localFromDate = start;
        this.localToDate = end;
      },
    },
    isLoadingTransactions() {
      return this.$store.state.isLoadingTransactions;
    },

    isLangEn() {
      return this.$store.state.lang === 'en-US';
    },

    transactions() {
      return this.$store.state.transactions;
    },

    activeTab() {
      return this.$store.state.activeTab;
    },

    filterBy: {
      get() {
        const filter = this.$store.state.filterBy;
        if (filter) return filter;
        return this.filters[0];
      },
      set(payload) {
        return this.$store.commit('SET_FILTER_BY', payload);
      },
    },

    filteredTransactions() {
      return this.transactions.filter((transaction) => {
        if (this.activeTab === 'statements') {
          if (!this.query.length) {
            return transaction;
          }
          return this.isInQuery(transaction);
        }

        return this.isInQuery(transaction) && (transaction.currency === this.filterBy.value);
      });
    },

    groupedTransactions() {
      const groupKey = this.activeTab === 'movements' ? 'bookingDate' : 'issueDate';
      return this.$options.filter.groupBy(this.filteredTransactions, (item) => {
        const isoDate = new Date(item[groupKey]);
        const GMTZeroDate = new Date(isoDate.valueOf() + new Date().getTimezoneOffset() * 60 * 1000);
        const key = this.$options.filter.date(GMTZeroDate, this.dateFormats.long, this.dateFormats.lang);
        return key;
      });
    },
  },
  methods: {
    toggleSearch() {
      this.query = '';
      this.showSearch = !this.showSearch;
    },

    isInQuery(transaction) {
      return this.searchByDescription(transaction) || this.searchByAmount(transaction);
    },

    searchByDescription(transaction) {
      return transaction.description.toLowerCase().indexOf(this.query.toLowerCase()) >= 0;
    },

    searchByAmount(transaction) {
      if (Object.prototype.hasOwnProperty.call(transaction, 'amount')) {
        return transaction.amount.indexOf(this.query) >= 0;
      }
      return true;
    },

    setNewDates() {
      this.$store.commit('SET_FROM_DATE', this.localFromDate);
      this.$store.commit('SET_TO_DATE', this.localToDate);
      if (this.activeTab === 'movements') {
        this.$store.dispatch('GET_TRANSACTIONS');
      } else if (this.activeTab === 'statements') {
        this.$store.dispatch('GET_STATEMENTS');
      }
    },
  },
};
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style src="@mathieustan/vue-datepicker/dist/vue-datepicker.min.css"></style>

<style lang="scss" scoped>
@import "../scss/variables";

.transactions-list--empty {
  width: 300px;
  margin: auto;
  margin-top: 100px;

  color: $primary-60;

  text-align: center;
}

.transactions-list__items {
  height: 100%;
  overflow: auto;
}

.transactions-list__filters {
  .filters__select {
    flex: 1 0 auto;

    .multiselect {
      color: $secondary-100;
    }

    .multiselect__tags {
      border-color: $tertiary-100;

      &:hover {
        border-color: $secondary-100;
      }
    }
  }

  .filter__date {
    flex: 1 0 auto;
  }

  .filters-date__btn.btn {
    font-size: 14px;
    color: $secondary-100;

    background-color: #fff;

    border-color: $tertiary-100;

    &:hover {
      border-color: $secondary-100;
    }
  }

  .filters__search-icon {
    flex: 0 1 auto;
  }

  .filters__search-bar {
    flex: 1 0 100%;

    .form-control {
      height: initial;
    }
  }
}

</style>
