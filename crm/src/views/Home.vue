<template>
  <div>
    <div class="page-title">
      <h3>Счет</h3>

      <button class="btn waves-effect waves-light btn-small" @click="refresh">
        <i class="material-icons">refresh</i>
      </button>
    </div>
    <Loader v-if="loading"></Loader>
    <div v-else class="row">
      <HomeBill
          :rates="currency.rates"
      ></HomeBill>
      <HomeCurrency
          :rates="currency.rates"
          :date="currency.date"
      ></HomeCurrency>
    </div>
  </div>
</template>

<script>
import HomeBill from "@/components/HomeBill";
import HomeCurrency from "@/components/HomeCurrency";

export default {
  components: {HomeCurrency, HomeBill},
  data: () => ({
    loading: true,
    currency: null,
  }),
  methods: {
    refresh() {
      this.loading = true;
      this.fetch();
    },
    async fetch() {
      this.currency = await this.$store.dispatch('fetchCurrency');
      this.loading = false;
    }
  },
  mounted() {
    this.fetch();
  },
}
</script>
