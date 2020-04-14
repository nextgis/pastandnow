<template>
  <v-form ref="form" v-model="form" class="filter-form">
    <v-autocomplete
      class="mx-4 pt-2 pb-2"
      v-model="city"
      :items="cities"
      :disabled="cities.length < 2"
      dark
      cache-items
      flat
      hide-no-data
      hide-details
      solo-inverted
      no-data-text="Не найдено"
    >
      <template v-slot:selection="data">{{ data.item.value }}</template>
      <template v-slot:item="data">
        <template>
          <v-list-item-content v-text="data.item.text" v-bind:style="getItemStyle(data.item)"></v-list-item-content>
        </template>
      </template>
    </v-autocomplete>
    <v-autocomplete
      class="mx-4 pt-2 pb-2"
      v-model="rayon"
      :items="areas"
      :disabled="areas.length < 2"
      dark
      flat
      hide-no-data
      hide-details
      solo-inverted
      no-data-text="Не найдено"
    >
      <template v-slot:selection="data">{{ data.item.value }}</template>
      <template v-slot:item="data">
        <template>
          <v-list-item-content v-text="data.item.text" v-bind:style="getItemStyle(data.item)"></v-list-item-content>
        </template>
      </template>
    </v-autocomplete>
  </v-form>
</template>

<script lang="ts">
export { ItemsFilter as default } from "./ItemsFilter";
</script>

<style lang="scss" scoped>
.filter-form {
  background: $primary;
}
</style>
