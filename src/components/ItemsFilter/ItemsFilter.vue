<template>
  <v-form ref="form" v-model="form" class="filter-form">
    <div class="subtitle-1 font-weight-medium white--text mb-4">Выберите место</div>
    <v-row dense>
      <v-col cols="6">
        <v-autocomplete
          class="filter-form__control"
          v-model="city"
          :items="cities"
          :disabled="cities.length < 2"
          item-text="value"
          dense
          dark
          cache-items
          flat
          hide-no-data
          hide-details
          solo-inverted
          no-data-text="Не найдено"
        >
          <template v-slot:item="data">
            <template>
              <v-list-item-content
                v-text="data.item.text"
                v-bind:style="getItemStyle(data.item)"
              ></v-list-item-content>
            </template>
          </template>
        </v-autocomplete>
      </v-col>
      <v-col cols="6">

        <v-autocomplete
          class="filter-form__control"
          v-model="rayon"
          :items="areas"
          :disabled="areas.length < 2"
          item-text="value"
          dense
          dark
          flat
          hide-no-data
          hide-details
          solo-inverted
          no-data-text="Не найдено"
        >
          <template v-slot:item="data">
            <template>
              <v-list-item-content
                v-text="data.item.text"
                v-bind:style="getItemStyle(data.item)"
              ></v-list-item-content>
            </template>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
export { ItemsFilter as default } from "./ItemsFilter";
</script>

<style lang="scss" scoped>
.filter-form {
  // background: $primary;
  padding: 20px;
  font-size: 14px;

  &__control + &__control {
    margin-top: 10px;
  }
}
</style>
