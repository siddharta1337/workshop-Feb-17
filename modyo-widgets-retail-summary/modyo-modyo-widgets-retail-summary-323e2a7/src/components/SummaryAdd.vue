<template>
  <section
    class="add-product-summary card shadow">
    <div class="add-product-summary__body d-flex align-items-center justify-content-center p-0 h-100">
      <p class="text-center h4">
        <font-awesome-icon
          class="mb-2"
          :icon="['far', 'clone']"
          size="3x" />
        <span class="d-block">Agregar producto</span>
      </p>
    </div>
  </section>
</template>

<script>

export default {
  name: 'SummaryAdd',
};
</script>

<style lang="scss" scoped>
@import "../scss/variables";

.add-product-summary.card {
  flex: 0 0 85%;

  max-width: 85%;
  margin: 0 10px 20px;

  color: $secondary-20;

  background-color: transparent;

  border: 2px dashed $secondary-20;

  border-radius: 12px;

  &:first-child {
    margin-left: 20px;
  }

  &:last-child {
    margin-right: 20px;
  }
}

@media (min-width: 576px) {
  .add-product-summary.card {
    flex: 0 0 360px;

    max-width: 360px;
    margin: 0 10px 20px;

    border-radius: 12px;
  }

}

@media (min-width: 1200px) {
  .add-product-summary.card {
    &:first-child {
      margin-left: 140px;
    }

    &:last-child {
      margin-right: 20px;
    }
  }
}

</style>
