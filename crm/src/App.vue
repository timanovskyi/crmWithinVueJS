<template>
  <div id="app">
    <keep-alive>
      <component :is="layout">
        <router-view/>
      </component>
    </keep-alive>
  </div>
</template>

<script>

import EmptyLayout from './layouts/EmptyLayout';
import MainLayout from './layouts/MainLayout';

export default {
  computed: {
    layout() {
      return (this.$route.meta.layout || 'empty') + '-layout'
    }
  },
  components: {
    EmptyLayout,
    MainLayout,
  }
}
</script>

<style lang="scss">
@import "~materialize-css/dist/css/materialize.min.css";
@import "assets/index.css";
</style>
