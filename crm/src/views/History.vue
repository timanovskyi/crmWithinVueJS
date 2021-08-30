<template>
  <div>
    <div class="page-title">
      <h3>История записей</h3>
    </div>

    <div class="history-chart">
      <canvas ref="canvas"></canvas>
    </div>

    <Loader v-if="loading"></Loader>
    <p v-else-if="records.length === 0">Записей пока нет</p>
    <section v-else>
      <HistoryTable :records="items"></HistoryTable>
      <Paginate
          v-model="page"
          :page-count="pageCount"
          :click-handler="clickPagiEvent"
          :prev-text="'Назад'"
          :next-text="'Вперед'"
          :container-class="'pagination'"
          :page-class="'waves-effect'"
      ></Paginate>
    </section>
  </div>
</template>

<script>
import HistoryTable from "@/components/HistoryTable";
import paginationMixin from "@/mixins/pagination.mixin";
import {Pie} from 'vue-chartjs'

export default {
  name: 'history',
  extends: Pie,
  components: {HistoryTable},
  mixins: [paginationMixin],
  data: () => ({
    loading: true,
  }),
  async mounted() {
    // eslint-disable-next-line no-useless-catch
    try {
      this.records = await this.$store.dispatch('fetchRecords');
      const temporaryCategories = await this.$store.dispatch('fetchCategories');

      this.setup(temporaryCategories)

      setTimeout(() => this.loading = false)
    } catch (e) {
      throw e
    }
  },
  methods: {
    getColor() {
      return `#${Math.floor(Math.random()*16777215).toString(16)}`
    },
    setup(arr) {
      this.setupPagination(this.records.map(r => {
        return {
          ...r,
          categoryName: arr.find(c => c.id === r.categoryId).title,
          typeClass: r.type === 'income' ? 'green' : 'red',
          typeText: r.type === 'income' ? 'Доход' : 'Расход',
        }
      }))

      this.renderChart({
        labels: arr.map(s => s.title),
        datasets: [
          {
            label: 'Расходы по катеориям',
            data: arr.map(s => {
              return this.records.reduce((total, r) => {
                if (r.categoryId === s.id && r.type === 'outcome') {
                  total += r.amount
                }
                return total
              }, 0)
            }),
            backgroundColor: arr.map(() => this.getColor()),
          }
        ]
      })
    }
  }
}
</script>
