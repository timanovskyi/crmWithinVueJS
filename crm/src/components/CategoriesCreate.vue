<template>
  <div class="col s12 m6">
    <div>
      <div class="page-subtitle">
        <h4>Создать</h4>
      </div>

      <form @submit.prevent="onsubmit">
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

        <button class="btn waves-effect waves-light" type="submit">
          Создать
          <i class="material-icons right">send</i>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import {minValue, required} from "vuelidate/lib/validators";
import * as M from 'materialize-css/dist/js/materialize.min';

export default {
  name: "CategoriesCreate",
  data: () => ({
    title: '',
    limit: 100
  }),
  validations: {
    title: {required},
    limit: {required, minValue: minValue(100)}
  },
  mounted() {
    M.updateTextFields();
  },
  methods: {
    async onsubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return
      }
      const value = {
        title: this.title,
        limit: this.limit
      }
      try {
        const category = await this.$store.dispatch('createCategory', value)
        await this.$message(`Категория ${category.title} была создана`);
        this.title = '';
        this.limit = 100;
        this.$v.$reset();
        this.$emit('created', category);

      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
