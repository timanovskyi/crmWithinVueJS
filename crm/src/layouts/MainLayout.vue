<template>
  <Loader v-if="loading"></Loader>
  <div v-else class="app-main-layout">

    <Navbar @click="isOpen = !isOpen"></Navbar>

    <Sidebar v-model="isOpen"></Sidebar>

    <main class="app-content" :class="{full: !isOpen}">
      <div class="app-page">
        <router-view></router-view>
      </div>
    </main>

    <div class="fixed-action-btn">
      <router-link class="btn-floating btn-large blue"
                   :to="'/record'"
      v-tooltip="'Создать новую запись'">
        <i class="large material-icons">add</i>
      </router-link>
    </div>
  </div>
</template>


<script>

import Navbar from '@/components/app/Navbar';
import Sidebar from '@/components/app/Sidebar';
import messages from "@/utils/messages";

export default {
  name: 'main-layout',
  components: {
    Navbar, Sidebar
  },
  data: () => ({
    isOpen: true,
    loading: true
  }),
  async mounted() {
    if (!Object.keys(this.$store.getters.info).length) {
      await this.$store.dispatch('fetchInfo')
    }
    this.loading = false;
  },
  computed: {
    error() {
      return this.$store.getters.error
    }
  },
  watch: {
    error(fbError) {
      this.$error(messages[fbError.code] || 'Something is wrong')
    }
  }
}

</script>
