<template>
  <div>
    <v-list dense>
      <v-list-item v-for="item in portion" :key="item.id">
        <v-list-item-action class="pa-0">
          <v-btn @click="setDetail(item.id)" icon ripple>
            <v-icon
              color="lighten-1"
              v-bind:style="{ color: item.id === (detail && detail.id) ? 'orange' : 'grey' }"
            >info</v-icon>
          </v-btn>
        </v-list-item-action>
        <v-list-item-content>
          <div>{{ item.name }}</div>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    <div v-if="displayItems.length > portion.length" class="text-center">
      <v-btn text small @click="addPortion">Показать ещё</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
export { List as default } from "./List";
</script>

<style lang="scss">
</style>
