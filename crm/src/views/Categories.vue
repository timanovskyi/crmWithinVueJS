<template>
  <div>
    <div class="page-title">
      <h3>Категории</h3>
    </div>
    <section>
      <div class="row">
        <CategoriesCreate @created="addNewCategory($event)"
        ></CategoriesCreate>

        <CategoriesEdit v-if="categories.length > 0"
                        :key="categories.length + updateCount"
                        :categories="categories"
                        @update="update"
        ></CategoriesEdit>
        <p v-else>Категорий нет</p>
      </div>
    </section>
  </div>
</template>

<script>

import CategoriesCreate from "@/components/CategoriesCreate";
import CategoriesEdit from "@/components/CategoriesEdit";

export default {
  name: 'Categories',
  data: () => ({
    categories: [],
    updateCount: 0
  }),
  async mounted() {
    // eslint-disable-next-line no-useless-catch
    try {
      this.categories = await this.$store.dispatch('fetchCategories');
    } catch (e) {
      throw e
    }
  },
  components: {CategoriesEdit, CategoriesCreate},
  methods: {
    update({id, title, limit}) {
      const caIndex = this.categories.findIndex(i => i.id === id);
      this.categories[caIndex].title = title;
      this.categories[caIndex].limit = limit;
      this.updateCount++;
    },
    addNewCategory(category) {
      this.categories.push(category);
    }
  }
}
</script>
