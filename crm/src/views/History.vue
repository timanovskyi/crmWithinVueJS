<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="history-chart">
      <canvas></canvas>
    </div>

    <Loader v-if="loading"></Loader>
    <p v-else-if="records.length === 0">Записей пока нет</p>
    <section v-else>
      <HistoryTable :records="records">

      </HistoryTable>
    </section>
  </div>
</template>

<script>
import HistoryTable from "@/components/HistoryTable";
export default {
  name: 'history',
  components: {HistoryTable},
  data: () => ({
    loading: true,
    categories: [],
    records: [],
  }),
  async mounted() {
    // eslint-disable-next-line no-useless-catch
    try {
//      this.records = await this.$store.dispatch('fetchRecords');
      const records = await this.$store.dispatch('fetchRecords');
      this.temporaryCategories = await this.$store.dispatch('fetchCategories');
      this.records = records.map(r => {
        return {
          ...r,
          categoryName: this.temporaryCategories.find(c => c.id === r.categoryId).title,
          typeClass: r.type === 'income' ? 'green' : 'red',
          typeText: r.type === 'income' ? 'Доход' : 'Расход',

        }
      })
      setTimeout(() => this.loading = false)
    } catch (e) {
      throw e
    }
  }
}
</script>
