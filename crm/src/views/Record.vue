<template>
  <div>
    <div class="page-title">
      <h3>Новая запись</h3>
    </div>

    <Loader v-if="loading"></Loader>
    <p v-else-if="categories.length === 0">
      Категорий пока нет. Можна добавить в
      <router-link to="/categories"> на странице</router-link>
    </p>
    <form v-else class="form" @submit.prevent="onsubmit">
      <div class="input-field">
        <select ref="select" v-model="current">
          <option v-for="ca of categories"
                  :key="ca.id"
                  :value="ca.id">{{ ca.title }}
          </option>
        </select>
      </div>

      <p>
        <label>
          <input
              class="with-gap"
              name="type"
              type="radio"
              v-model="type"
              value="income"
          />
          <span>Доход</span>
        </label>
      </p>

      <p>
        <label>
          <input
              class="with-gap"
              name="type"
              type="radio"
              v-model="type"
              value="outcome"
          />
          <span>Расход</span>
        </label>
      </p>

      <div class="input-field">
        <input
            id="amount"
            v-model.number="amount"
            type="number"
            :class="{invalid: ($v.amount.$dirty && !$v.amount.minValue)}"
        >
        <label for="amount">Сумма</label>
        <span v-if="$v.amount.$dirty && !$v.amount.minValue"
              class="helper-text invalid">Минимальная величина {{ $v.amount.$params.minValue.min }}</span>
      </div>

      <div class="input-field">
        <input
            id="description"
            type="text"
            v-model.trim="description"
            :class="{invalid: ($v.description.$dirty && !$v.description.required)}"
        >
        <label for="description">Описание</label>
        <span v-if="$v.description.$dirty && !$v.description.required"
              class="helper-text invalid">Введите описание категории</span>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Создать
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>


<script>
import * as M from 'materialize-css/dist/js/materialize.min';
import {minValue, required} from "vuelidate/lib/validators";
import {mapGetters} from "vuex";


export default {
  data: () => ({
    loading: true,
    categories: [],
    select: null,
    current: null,
    type: 'outcome',
    amount: 1,
    description: '',
  }),
  validations: {
    amount: {minValue: minValue(1)},
    description: {required}
  },
  computed: {
    ...mapGetters(['info']),
    canCreateRecord() {
      if (this.type === 'income') {
        return true
      }
      return this.info.bill >= this.amount
    }
  },
  async mounted() {
    // eslint-disable-next-line no-useless-catch
    try {
      this.categories = await this.$store.dispatch('fetchCategories');
      this.loading = false;

      if (this.categories.length > 0) {
        this.current = this.categories[0].id;
      }
      setTimeout(() => {
        this.select = M.FormSelect.init(this.$refs.select);
        M.updateTextFields();
      })
    } catch (e) {
      throw e
    }
  },
  destroyed() {
    if (this.select && this.select.destroy) {
      this.select.destroy();
    }
  },
  methods: {
    async onsubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return
      }
      if (this.canCreateRecord) {
        try {
          const data = {
            categoryId: this.current,
            amount: this.amount,
            description: this.description,
            type: this.type,
            date: new Date().toJSON()
          }
          await this.$store.dispatch('createRecord', data)
          await this.$message(`Запись была обновлена`);

          const bill = this.type === 'income' ?
              this.info.bill + this.amount :
              this.info.bill - this.amount

          await this.$store.dispatch('updateInfo', {bill})
          this.$v.$reset();
          this.amount = 1;
          this.description = '';
        } catch (e) {
          console.log(e)
        }
      } else {
        this.$message(`Недостаточно средств`);
      }
    }
  },
}
</script>
