<template>
  <div class='drawer-container'>
      <div class='drawer-titlebar' v-if="hasHeaderSlot">
        <v-toolbar>
          <v-toolbar-title class="drawer-title">
            <slot name="header"></slot>
          </v-toolbar-title>
        </v-toolbar>

        <v-divider></v-divider>
      </div>

      <div class="drawer-content">
        <slot></slot>
      </div>
      <div v-if="hasFooterSlot">
        <v-footer>
          <slot name="footer"></slot>
        </v-footer>
      </div>
    </div>
</template>

<script lang="ts">
export { DrawerContainer as default } from './DrawerContainer';
</script>

<style lang="scss">
  .drawer-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .drawer-titlebar {
    // height: 35px;
    flex-shrink: 0;
  }

  .drawer-content {
    flex-grow: 1;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .drawer-title {
    width: 100%
  }
</style>
