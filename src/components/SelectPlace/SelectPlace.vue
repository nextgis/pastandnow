<template>
  <v-form ref="form" v-model="form" class="filter-form">
    <div class="subtitle-1 font-weight-medium white--text mb-4">
      Выберите место
    </div>
    <!-- <v-row dense>
      <v-col cols="6">
        <v-autocomplete
          class="filter-form__control"
          :items="['Россия']"
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
        </v-autocomplete>
      </v-col>
      <v-col cols="6">
        <v-autocomplete
          class="filter-form__control"
          :items="['Московская обл.']"
          item-text="value"
          dense
          dark
          flat
          hide-no-data
          hide-details
          solo-inverted
          no-data-text="Не найдено"
        >
        </v-autocomplete>
      </v-col>
    </v-row> -->
    <v-row dense>
      <v-col>
        <v-autocomplete
          class="filter-form__control"
          v-model="activePlace"
          :items="items"
          :disabled="places.length < 2"
          :search-input.sync="search"
          :loading="!places.length"
          item-text="text"
          item-value="value"
          clearable
          dense
          dark
          flat
          hide-no-data
          hide-details
          solo-inverted
          return-object
          no-filter
          no-data-text="Не найдено"
        >
          <template v-slot:item="data">
            <template>
              <v-list-item-content
                v-html="getItemHtml(data.item.text)"
              ></v-list-item-content>
            </template>
          </template>
        </v-autocomplete>
      </v-col>
    </v-row>
  </v-form>
</template>

<script lang="ts">
export { SelectPlace as default } from './SelectPlace';
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
