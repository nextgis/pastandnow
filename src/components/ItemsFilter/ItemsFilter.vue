<template>
  <v-form ref="form" v-model="form" class="filter-form">
    <v-autocomplete
      dark
      cache-items
      class="mx-4 pt-2 pb-2"
      flat
      hide-no-data
      hide-details
      solo-inverted
      v-model="city"
      :items="cities"
      @change="updateCity"
      no-data-text="Не найдено"
    ></v-autocomplete>
    <v-autocomplete
      dark
      cache-items
      class="mx-4 pt-2 pb-2"
      flat
      hide-no-data
      hide-details
      solo-inverted
      v-model="rayon"
      :items="areas"
      @change="updateFilter"
      no-data-text="Не найдено"
    ></v-autocomplete>
  </v-form>
</template>

<script lang="ts">
export { ItemsFilter as default } from "./ItemsFilter";
</script>

<style lang="scss" scoped>


@import "../../style/variables.scss";

.filter-form {
  background: $dark;
}

</style>
