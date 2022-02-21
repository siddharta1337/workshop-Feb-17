<template>
  <div
    :data-card="card.id"
    class="credit-card pt-4 pb-2 px-3">
    <div
      :class="card.cardType.toLowerCase()"
      class="credit-card__container mb-3">
      <div class="credit-card__map" />

      <div class="credit-card__info p-4 w-100 h-100">
        <p class="credit-card__name text-uppercase text-white mb-4">
          Dynamic Bank
        </p>

        <div class="credit-card__open-config">
          <button
            class="btn btn-outline-light"
            data-toggle="modal"
            data-target="#configModal">
            {{ $t('credit-card.customize-btn') }}
          </button>
        </div>

        <p class="credit-card__font credit-card__number">
          XXXX XXXX XXXX {{ last4numbers }}
        </p>

        <p class="credit-card__font credit card__holder text-uppercase">
          {{ card.cardHolderName }}
        </p>

        <p class="credit-card__font credit card__holder text-uppercase">
          {{ card.status ? $t('credit-card.active') : $t('credit-card.locked') }}
        </p>

        <div class="credit-card__logo">
          <font-awesome-icon
            :icon="['fab', `cc-${card.cardType.toLowerCase()}`]"
            :style="{ color: 'white', opacity: 0.7}"
            size="3x" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CreditCard',
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      status: this.card.status,
    };
  },
  computed: {
    last4numbers() {
      return this.card.cardNumber.substr(-4, 4);
    },
  },
};
</script>

<style lang="scss" scoped>
.credit-card__container {
  position: relative;

  max-width: 320px;
  height: 200px;
  margin: 0 auto;

  background: #5d4157;

  border-radius: 20px;

  .credit-card__map {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    width: 100%;
    height: 100%;

    overflow: hidden;

    background-image:
      url(
        "https://cloud.modyocdn.com/uploads/9d12cad9-6535-4ba3-b176-13bb2e509d7e/original/img_tarjeta.jpg"
      );
    background-size: cover;

    border-radius: inherit;
  }

  .credit-card__open-config {
    position: absolute;
    top: 14px;
    right: 20px;

    > button {
      font-size: 12px;
    }
  }

  .credit-card__info {
    position: relative;
    z-index: 100;
  }

  .credit-card__font {
    font-family: "ocr_a_std", sans-serif;
    color: #fff;
    text-shadow: -1px -1px 0 rgba(255, 255, 255, .3), 1px 1px 0 rgba(0, 0, 0, .6);
  }

  .credit-card__number,
  .credit-card__holder {
    font-size: 16px;
    letter-spacing: 1px;
    white-space: nowrap;
  }

  .credit-card__logo {
    position: absolute;
    right: 20px;
    bottom: 20px;
  }
}
</style>
