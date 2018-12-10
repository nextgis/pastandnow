<template>

  <v-form
    ref="form"
    v-model="form"
    class="pl-3 pr-3 pt-0 pb-0"
  >
    <!-- <v-range-slider
      v-model="years"
      thumb-label="always"
      thumb-size="26"
      :max="maxYear"
      :min="minYear"
      :step="1"
      @change ="updateFilter"
    ></v-range-slider> -->

    <v-select
      :items="areas"
      v-model="rayon"
      label="Район"
      @change ="updateFilter"
    ></v-select>

    <!-- <v-checkbox class="pa-0 ma-0" v-for="mos in moscow" :key="mos.param"
      v-model="mos.value"
      @change ="updateFilter"
    >
      <template slot="label">
        {{ mos.name }}
      </template>
    </v-checkbox> -->
  </v-form>

</template>

<script lang="ts">
export { ItemsFilter as default } from './ItemsFilter';
</script>

<style lang="scss">

</style>
