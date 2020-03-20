<template>
  <v-form ref="form" v-model="form" class="filter-form">
    <!-- <v-range-slider
      v-model="years"
      thumb-label="always"
      thumb-size="26"
      :max="maxYear"
      :min="minYear"
      :step="1"
      @change ="updateFilter"
    ></v-range-slider>-->

    <!-- <v-select
      :items="areas"
      v-model="rayon"
      label="Район"
      @change ="updateFilter"
    ></v-select>-->

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
    <!-- label="Город" -->
      <!-- label="Район" -->
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

    <!-- <v-checkbox class="pa-0 ma-0" v-for="mos in moscow" :key="mos.param"
      v-model="mos.value"
      @change ="updateFilter"
    >
      <template slot="label">
        {{ mos.name }}
      </template>
    </v-checkbox>-->
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
