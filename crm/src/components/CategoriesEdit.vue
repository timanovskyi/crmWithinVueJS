<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Редактировать</h4>
      </div>

      <form @submit.prevent="onsubmit">
        <div class="input-field">
          <select ref="select" v-model="current">
            <option v-for="ca of categories"
                    :key="ca.id"
                    :value="ca.id">{{ ca.title }}
            </option>
          </select>
          <label>Выберите категорию</label>
        </div>
        <div class="input-field">
          <input
              id="name"
              type="text"
              v-model="title"
              :class="{invalid: ($v.title.$dirty && !$v.title.required)}"
          >
          <label for="name">Название</label>
          <span v-if="$v.title.$dirty && !$v.title.required"
                class="helper-text invalid">Введите название категории</span>
        </div>

        <div class="input-field">
          <input
              id="limit"
              type="number"
              v-model.number="limit"
              :class="{invalid: ($v.limit.$dirty && !$v.limit.required) || ($v.limit.$dirty && !$v.limit.minValue)}"
          >
          <label for="limit">Лимит</label>
          <span v-if="$v.limit.$dirty && !$v.limit.minValue"
                class="helper-text invalid">Минимальная величина {{ $v.limit.$params.minValue.min }}</span>
        </div>

        <button class="btn waves-effect waves-light" type="submit" :disabled="noChanges">
          Редактировать
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>

import * as M from 'materialize-css/dist/js/materialize.min';
import {minValue, required} from "vuelidate/lib/validators";

export default {
  name: "CategoriesEdit",
  props: {
    categories: {
      type: Array,
      required: true
    }
  },
  validations: {
    title: {required},
    limit: {required, minValue: minValue(100)}
  },
  data: () => ({
    title: '',
    limit: 100,
    select: null,
    current: null,
    noChanges: true
  }),
  watch: {
    limit() {
     this.noChanges = false;
    },
    title() {
      this.noChanges = false;
    },
    current(v) {
      console.log('watch', v);
      const {limit, title} = this.categories.find(s => s.id === v);
      this.limit = limit;
      this.title = title;
      M.updateTextFields();
      this.noChanges = true;
    }
  },
  created() {
    if (this.categories.length > 0) {
      const {id, title, limit} = this.categories[0];
      this.limit = limit;
      this.title = title;
      this.current = id;
    }
  },
  mounted() {
    this.select = M.FormSelect.init(this.$refs.select);
    M.updateTextFields();
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  },
  methods: {
    async onsubmit() {
      if (this.$v.$invalid || this.noChanges) {
        this.$v.$touch();
        return
      }
      try {
        const data = {
          id: this.current,
          limit: this.limit,
          title: this.title
        }
        await this.$store.dispatch('updateCategory', data)
        await this.$message(`Категория ${this.title} была обновлена`);
        this.$emit('update', data)
      } catch (e) {
        console.log(e)
      }

    }
  }
}
</script>

<style scoped>

</style>
