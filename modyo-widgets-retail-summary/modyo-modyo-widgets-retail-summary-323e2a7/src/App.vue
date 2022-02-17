<template>
  <article
    id="summary-app"
    class="py-4 py-sm-5">
    <div class="container-fluid px-0">
      <m-response-control
        v-if="apiStatus"
        class="container-lg bg-white text-center py-5"
        :status="apiStatus">
        <template #loading>
          <div
            class="loading spinner-border"
            role="status">
            <span class="sr-only">{{ $t('commons.loading') }}</span>
          </div>
        </template>
        <template #error>
          <div class="d-flex flex-column justify-content-center p-4">
            <h5 class="text-center">
              {{ $t('commons.try-again') }}
            </h5>
          </div>
        </template>
        <template #empty>
          <div class="d-flex flex-column justify-content-center p-4">
            <h5 class="text-center">
              {{ $t('commons.empty') }}
            </h5>
          </div>
        </template>
      </m-response-control>

      <div
        v-else
        ref="viewport"
        class="products-viewport">
        <div
          ref="content"
          class="products-summary d-flex align-items-stretch">
          <summary-account
            v-for="account in accounts"
            :key="`account-${account.id}`"
            :account="account"
            :client-id="clientId" />

          <summary-card
            v-for="card in cards"
            :key="`card-${card.id}`"
            :card="card"
            :client-id="clientId" />

          <summary-add key="add" />
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import ScrollBooster from 'scrollbooster';
import { getURLParams, MResponseControl } from '@modyo/financial-commons';
import SummaryAccount from './components/SummaryAccount.vue';
import SummaryCard from './components/SummaryCard.vue';
import SummaryAdd from './components/SummaryAdd.vue';

export default {
  name: 'App',
  components: {
    MResponseControl,
    SummaryAccount,
    SummaryCard,
    SummaryAdd,
  },
  data() {
    return {
      carousel: {},
    };
  },
  computed: {
    apiStatus() {
      return this.$store.state.apiStatus;
    },
    accounts() {
      return this.$store.state.accounts;
    },
    cards() {
      return this.$store.state.cards;
    },
    clientId() {
      return this.$store.state.clientId;
    },
  },
  created() {
    const client = parseInt(getURLParams('client'), 10) || 1;
    this.$store.commit('SET_CLIENT_ID', client);
    this.$store.dispatch('DO_DATA_INITIALIZATION')
      .then(() => {
        this.initProductsCarousel();
      });
  },
  methods: {
    initProductsCarousel() {
      const { viewport } = this.$refs;
      const { content } = this.$refs;
      // eslint-disable-next-line no-unused-vars
      const sb = new ScrollBooster({
        viewport,
        content,
        direction: 'horizontal',
        emulateScroll: false,
        onUpdate: (state) => {
          if (state.borderCollision.right) {
            content.style.transform = `translateX(${-state.position.x - 20}px)`;
          } else {
            content.style.transform = `translateX(${-state.position.x}px)`;
          }

          if (state.isMoving) {
            viewport.style.cursor = 'grabbing';
          } else {
            viewport.style.cursor = 'grab';
          }
        },
        shouldScroll: (state, event) => {
          // disable scroll if clicked on button
          const isLink = event.target.nodeName.toLowerCase() === 'a';
          return !isLink;
        },
      });

      sb.updateMetrics();
    },
  },
};
</script>

<style lang="scss" scoped>
.products-viewport {
  overflow: hidden;

  cursor: grab;
}

@media (max-width: 575.98px) {
  .header-summary h2 {
    font-size: 24px;
  }
}

@media (min-width: 1200px) {
  .header-summary {
    margin-left: 140px;
  }
}
</style>
