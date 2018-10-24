<template>
  <v-app>
  <main-component></main-component>
  <v-dialog :value="page === 'table'" fullscreen  scrollable transition="dialog-bottom-transition">
      <v-card class="fullscreen-dialog">
        <v-toolbar dark color="primary" class="dialog-titlebar">
          <v-btn icon dark @click.native="page = 'main'">
            <v-icon>close</v-icon>
          </v-btn>
          <v-toolbar-title>Таблица</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark flat>Сохранить</v-btn>
          </v-toolbar-items>
        </v-toolbar>


        <div class='dialog-body'>
          <table-component v-if="page === 'table'"></table-component>
          <about-component v-else-if="page === 'about'"></about-component>
        </div>


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
    overflow-x: hidden;
  }
}

</style>
