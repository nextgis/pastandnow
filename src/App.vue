<template>
  <VApp>
    <MainComponent></MainComponent>
  </VApp>
</template>

<script setup lang="ts">
import { VApp } from 'vuetify/components';

import MainComponent from './MainComponent.vue';
</script>

<style lang="scss">
* {
  padding: 0;
  margin: 0;
}

html,
body {
  width: 100%;
  height: 100%;
  overflow: hidden !important;
  font-size: 14px;
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

*::-webkit-scrollbar-track {
  background-color: inherit;
}

*::-webkit-scrollbar {
  width: 8px;
  background-color: inherit;
}

*::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.35);
}
*::-webkit-scrollbar-corner {
  background-color: transparent;
}

.theme--dark {
  *::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.55);
  }
}
</style>
