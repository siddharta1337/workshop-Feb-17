<template>
  <div
    v-if="card.cardNumber"
    id="configModal"
    class="config-modal modal fade"
    tabindex="-1"
    role="dialog"
    aria-labelledby="configModal"
    aria-hidden="true"
    data-backdrop="static">
    <div
      class="modal-dialog"
      role="document">
      <div class="modal-content credit-card__config d-flex flex-column">
        <div
          class="modal-header credit-card__config-header mb-4 py-4 text-center
          d-block border-bottom position-relative">
          <h4 class="mb-0 text-primary">
            {{ $t('config-credit-card.title') }}
          </h4>
          <p class="mb-0 text-muted">
            {{ card.cardType }} XXX XXXX XXXX {{ last4numbers }}
          </p>

          <div class="credit-card__close-config">
            <button
              class="btn btn-link"
              data-dismiss="modal">
              <font-awesome-icon
                icon="times"
                size="1x" />
            </button>
          </div>
        </div>

        <div class="modal-body">
          <form
            action=""
            class="credit-card__config-form px-4 px-xl-5">
            <fieldset class="form-group border-bottom pb-5 mb-4">
              <input
                v-model="cardName"
                type="text"
                class="form-control py-4 mb-4"
                :placeholder="$t('config-credit-card.owner-name')">

              <input
                v-model="cardEmail"
                type="email"
                class="form-control py-4"
                :placeholder="$t('config-credit-card.owner-email')">
            </fieldset>

            <fieldset class="form-group">
              <m-switch-button
                v-model="notify"
                active-color="#2e4553"
                class="mb-4">
                {{ $t('config-credit-card.usage-notification-check') }}
              </m-switch-button>

              <m-switch-button
                v-model="viaEmail"
                active-color="#2e4553"
                class="mb-4">
                {{ $t('config-credit-card.monthly-statement-check') }}
              </m-switch-button>

              <m-switch-button
                v-model="status"
                active-color="#2e4553">
                {{ $t('config-credit-card.card-activation-check') }}
              </m-switch-button>
            </fieldset>
          </form>
        </div>

        <div class="modal-footer credit-card__config-action p-4 px-xl-5">
          <button
            class="btn btn-primary btn-block py-3"
            data-dismiss="modal">
            {{ $t('commons.update-btn') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// eslint-disable-next-line import/no-extraneous-dependencies
import { MSwitchButton } from '@modyo/financial-commons';

export default {
  name: 'ConfigCreditCard',
  components: {
    MSwitchButton,
  },
  props: {
    card: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      notify: true,
      viaEmail: true,
      status: true,
      cardEmail: '',
      cardName: '',
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
@import "../scss/variables";

.credit-card__config-form {
  flex: 1 0 auto;
}

.credit-card__config-header,
.credit-card__config-action {
  flex: 0 0 auto;
}

.credit-card__config-form input::placeholder {
  color: $primary-40;
}

.credit-card__close-config {
  position: absolute;
  top: 20px;
  right: 20px;
}

@media (max-width: 991.98px) {
  .config-modal .modal-dialog {
    height: 100%;
    margin: 0;
  }

  .config-modal .modal-content {
    height: 100%;

    border-radius: 0;
  }
}

</style>
