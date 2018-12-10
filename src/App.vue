<template>
  <v-app>
  <main-component></main-component>
  <v-dialog :value="page === 'table'" fullscreen  scrollable transition="dialog-bottom-transition">
      <v-card class="fullscreen-dialog">
        <v-toolbar dark color="primary" class="dialog-titlebar">
          <v-btn icon dark @click.native="page = 'main'" >
            <v-icon>close</v-icon>
          </v-btn>
        <span class="title ml-3 mr-5">Устная память Москвы&nbsp;<span class="font-weight-light">Таблица</span></span>
        <v-text-field
          v-model="tableSearch"
          solo-inverted
          flat
          hide-details
          label="Поиск"
          prepend-inner-icon="search"
        ></v-text-field>

          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat>Сохранить</v-btn>
          </v-toolbar-items>
        </v-toolbar>


        <div class='dialog-body'>
          <table-component v-if="page === 'table'" :search="tableSearch" :paginationSync="paginationSync"></table-component>
          <about-component v-else-if="page === 'about'"></about-component>
        </div>

        <v-footer class="pt-3 pb-4" v-if="pagination && pagination.page">
          <div class="text-xs-center pt-1" >
            <v-pagination v-model="pagination.page" :length="pages" :total-visible="7"></v-pagination>
          </div>
        </v-footer>

      </v-card>
    </v-dialog>
  </v-app>
</template>

<script lang="ts">

export { App as default } from './App';

</script>


<style lang="scss">

* {
  padding: 0;
  margin: 0;
}

html, body {
  width: 100%;
  height: 100%;
  overflow: hidden !important;
}

.fullscreen-dialog {

  .dialog-titlebar {
    flex-shrink: 0;
  }

  .dialog-body {
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: auto;
  }
}

</style>
