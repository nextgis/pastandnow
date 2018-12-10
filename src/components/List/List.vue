<template>
    <v-list dense>
      <v-list-tile v-for="item in items" :key="item.id">
        <v-list-tile-content>
          <v-list-tile-title :title="item.name">{{ item.name }}</v-list-tile-title>
        </v-list-tile-content>

        <v-list-tile-action class="pa-0">
          <v-btn @click="setDetail(item.id)" icon ripple>
            <v-icon
              color="lighten-1"
              v-bind:style="{ color: item.id === (detail && detail.id) ? 'orange' : 'grey' }"
            >
              info
            </v-icon>
          </v-btn>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
</template>

<script lang="ts">
export { List as default } from './List';
</script>

<style lang="scss">

</style>
