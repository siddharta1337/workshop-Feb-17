<template>
  <section
    class="product-summary card border-0 shadow"
    :class="'wrap-' + card.cardType | slug">
    <div
      class="card-header product-summary__header py-3 px-4 d-flex
             align-items-center justify-content-between border-0 text-tertiary ">
      <h2 class="h6 mb-0 text-capitalize h6">
        {{ card.cardType }}
        <span class="d-block mt-1">{{ $tc('commons.number',last4numbers) }}</span>
      </h2>

      <font-awesome-icon
        icon="credit-card"
        size="lg" />
    </div>

    <div class="card-body product-summary__body p-4">
      <card-quotas
        v-if="!isLangEN"
        :available-quota="card.availableQuotaCLP"
        :used-quota="card.usedQuotaCLP"
        :total-quota="card.totalQuotaCLP"
        currency="CLP">
        <template #default>
          <p class="text-primary text-right">
            {{ $t('card.national-availability') }}
          </p>
        </template>
      </card-quotas>

      <card-quotas
        :available-quota="card.availableQuotaUSD"
        :used-quota="card.usedQuotaUSD"
        :total-quota="card.totalQuotaUSD"
        currency="USD">
        <template #default>
          <p class="text-primary text-right">
            {{ $t('card.international-availability') }}
          </p>
        </template>
      </card-quotas>
    </div>

    <div class="card-footer d-flex product-summary__footer bg-transparent border-0 p-4">
      <div class="col-sm-6 px-1">
        <a
          href="#"
          class="product-summary__footer-btn btn btn-primary btn-block py-2"
          @click.prevent="">{{ $t('card.pay') }}</a>
      </div>
      <div class="col-sm-6 px-1">
        <a
          href="#"
          class="product-summary__footer-btn btn btn-primary btn-block py-2"
          @click.prevent="">{{ $t('commons.view-transactions') }}</a>
      </div>
    </div>
  </section>
</template>

<script>
import { date, slug } from '@modyo/financial-commons';
import CardQuotas from './SummaryCardQuotas.vue';

export default {
  name: 'SummaryCard',
  filters: {
    date,
    slug,
  },
  components: {
    CardQuotas,
  },
  props: {
    card: {
      type: Object,
      required: true,
    },
    clientId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    last4numbers() {
      return this.card.cardNumber.substr(-4, 4);
    },

    isLangEN() {
      return this.$store.state.lang === 'en-US';
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
  color: $tertiary-100;

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
}

@media (min-width: 1200px) {
  .product-summary.card {
    &:first-child {
      margin-left: 140px;
    }

    &:last-child {
      margin-right: 20px;
    }
  }
}

</style>
