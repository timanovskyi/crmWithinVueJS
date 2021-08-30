<template>
  <div>
    <div class="page-title">
      <h3>Планирование</h3>
      <h4>{{ info.bill | currency }}</h4>
    </div>

    <Loader v-if="loading"></Loader>
    <p v-else-if="categories.length === 0">
      Категорий пока нет. Можна добавить в
      <router-link to="/categories"> на странице</router-link>
    </p>
    <section v-else>
      <div v-for="cat of categories"
           :key="cat.id"
      >
        <p>
          <strong>{{ cat.title }}</strong>
          {{cat.spend | currency }} из {{ cat.limit | currency}}
        </p>
        <div class="progress"
        v-tooltip="cat.tooltip"
        >
          <div
              class="determinate"
              :class="[cat.progressColor]"
              :style="{width: cat.progressPercent + '%'}"
          ></div>
        </div>
      </div>
    </section>
  </div>
</template>


<script>

import {mapGetters} from "vuex";
import currencyFilter from "@/filters/currency.filter";

export default {
  name: 'planning',
  data: () => ({
    loading: true,
    categories: []
  }),
  computed: {
    ...mapGetters(['info'])
  },
  async mounted() {
    // eslint-disable-next-line no-useless-catch
    try {
      const records = await this.$store.dispatch('fetchRecords');
      const temporaryCategories = await this.$store.dispatch('fetchCategories');

      this.categories = temporaryCategories.map(c => {
        const spend = records
            .filter(r => r.categoryId === c.id)
            .filter(r => r.type === 'outcome')
            .reduce((total, record) => {
              return total += +record.amount
            }, 0)

        const percent = 100 * spend / c.limit;
        const progressPercent = percent > 100 ? 100 : percent
        const progressColor = percent < 60
            ? 'green'
            : percent < 100
                ? 'yellow'
                : 'red'

        const tooltipValue = c.limit - spend;
        const tooltip = `${tooltipValue < 0 ? 'Превышен на' : 'Осталось'} ${currencyFilter(Math.abs(tooltipValue))}`;
        return {
          ...c,
          progressColor,
          progressPercent,
          spend,
          tooltip
        }
      })
      setTimeout(() => this.loading = false)
    } catch (e) {
      throw e
    }
  }
}

</script>
