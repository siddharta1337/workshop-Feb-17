<template>
  <div
    class="credit-card__movements col-lg-7"
    :class="{ 'active' : showMovements }">
    <div class="credit-card__movements-wrapper d-flex flex-column h-100 pb-4">
      <div
        v-if="isLoadingCards"
        class="credit-cards__loading h-100 d-flex justify-content-center align-items-center">
        <font-awesome-icon
          icon="circle-notch"
          size="5x"
          spin />
      </div>

      <div class="credit-card__movements-header shadow-sm d-lg-none px-2 py-3">
        <p class="font-weight-bold text-primary text-center mb-0 position-relative">
          <button
            class="credit-card__movements-close btn btn-link"
            @click="showMovements = false">
            <font-awesome-icon icon="arrow-left" />
          </button>
          {{ $t('transactions.view-transactions') }}
        </p>
      </div>

      <div
        v-if="!isLoadingCards"
        class="credit-card__movements-tabs mx-auto px-4 pt-4 mb-2 px-lg-0">
        <ul class="list-group list-group-horizontal text-center">
          <li
            class="list-group-item list-group-item-action font-weight-light px-0"
            :class="{active: activeTab === 'movements'}"
            @click.prevent="activeTab = 'movements'">
            {{ $t('transactions.title') }}
          </li>
          <li
            class="list-group-item list-group-item-action font-weight-light"
            :class="{active: activeTab === 'statements'}"
            @click.prevent="activeTab = 'statements'">
            {{ $t('statements.title') }}
          </li>
        </ul>
      </div>
      <div
        :class="activeTab"
        class="credit-card__movements-list px-4 px-xl-5">
        <transactions-list v-if="!isLoadingCards" />
      </div>
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
    </div>
  </div>
</template>

<script>
import { subDays } from 'date-fns';
import { MResponseControl } from '@modyo/financial-commons';
import TransactionsList from './TransactionsList.vue';

export default {
  name: 'CreditCardMovements',
  components: {
    MResponseControl,
    TransactionsList,
  },
  data() {
    return {
      apiStatus: false,
    };
  },
  computed: {
    activeTab: {
      get() {
        return this.$store.state.activeTab;
      },
      set(value) {
        return this.$store.commit('SET_ACTIVE_TAB', value);
      },
    },

    isLoadingCards() {
      return this.$store.state.isLoadingCards;
    },

    showMovements: {
      get() {
        return this.$store.state.showMovements;
      },
      set(val) {
        this.$store.commit('SET_SHOW_MOVEMENTS', val);
      },
    },
  },
  watch: {
    activeTab() {
      this.apiStatus = 'isLoading';
      if (this.activeTab === 'movements') {
        this.$store.commit('SET_FROM_DATE', subDays(new Date(), 20));
        this.$store.commit('SET_TO_DATE', new Date());
        this.$store.dispatch('GET_TRANSACTIONS')
          .then(() => {
            this.apiStatus = false;
          }).catch(() => {
            this.apiStatus = 'hasError';
          });
      } else if (this.activeTab === 'statements') {
        this.$store.commit('SET_FROM_DATE', subDays(new Date(), 30));
        this.$store.commit('SET_TO_DATE', new Date());
        this.$store.dispatch('GET_STATEMENTS')
          .then(() => {
            this.apiStatus = false;
          }).catch(() => {
            this.apiStatus = 'hasError';
          });
      }
    },
  },
};

</script>

<style lang="scss" scoped>
@import "../scss/variables";

.credit-card__movements {
  height: 100%;
  overflow: hidden;

  background-color: $tertiary-20;
}

.credit-card__movements-tabs {
  width: 100%;

  .list-group-item {
    font-size: 14px;
  }
}

.credit-card__movements-list {
  height: 100%;
  overflow: hidden;
}

@media (max-width: 991.92px) {
  .credit-card__movements {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;

    width: 100%;

    transition: all .2s ease-in-out;
    transform: translateX(100%);

    &.active {
      transform: translateX(0);
    }
  }

  .credit-card__movements-header {
    background: #fff;

    p {
      font-size: 18px;
    }

    button {
      position: absolute;
      top: -4px;
      left: 0;
    }
  }
}

@media (min-width: 992px) {
  .credit-card__movements-tabs {
    width: 60%;
  }
}

</style>
