<template>
  <div>
    <div class="page-title">
      <h3>{{ 'ProfileTitle' | localize }}</h3>
    </div>

    <form class="form" @submit.prevent="onSubmit">
      <div class="input-field">
        <input
            v-model="name"
            id="description"
            type="text"
            :class="{invalid: ($v.name.$dirty && !$v.name.required)}"
        >
        <label for="description">Имя</label>
        <span
            v-if="$v.name.$dirty && !$v.name.required"
            class="helper-text invalid">name</span>
      </div>

      <div class="switch">
        <label>
          English
          <input type="checkbox" v-model="isRuLocale">
          <span class="lever"></span>
          Русский
        </label>
      </div>

      <button class="btn waves-effect waves-light" type="submit">
        Обновить
        <i class="material-icons right">send</i>
      </button>
    </form>
  </div>
</template>

<script>
import {mapActions, mapGetters} from "vuex";
import * as M from 'materialize-css/dist/js/materialize.min';
import {required} from "vuelidate/lib/validators";

export default {
  name: 'profile',
  data: () => ({
    name: '',
    isRuLocale: true
  }),
  validations: {
    name: {required},
  },
  mounted() {
    this.name = this.info.name;
    this.isRuLocale = this.info.locale === 'ru-RU';
    setTimeout(() => {
      M.updateTextFields();
    })
  },
  computed: {
    ...mapGetters(['info'])
  },
  methods: {
    ...mapActions['updateInfo'],
    async onSubmit() {
      if (this.$v.$invalid) {
        this.$v.$touch();
        return
      }

      try {
        await this.$store.dispatch('updateInfo', {
          name: this.name,
          locale: this.isRuLocale ? 'ru-RU' : 'en-US'
        })
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style scoped>
.switch {
  margin-bottom: 2rem;
}
</style>
