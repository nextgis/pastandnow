<template>
  <v-container fluid>
    <h5 class="font-weight-light">СПЕЦИАЛЬНЫЕ ФИЛЬТРЫ</h5>
    <v-checkbox
      v-for="v in specialFilterItems"
      v-model="specialFilters"
      dense
      hide-details
      on-icon="check_box"
      off-icon="check_box_outline_blank"
      :key="v.value"
      :label="v.text"
      :value="v.value"
    ></v-checkbox>
    <h5 class="font-weight-light pt-5">ТИПЫ СЮЖЕТОВ</h5>
    <v-autocomplete
      v-model="narrativeTypesSelected"
      :items="narrativeTypeItems"
      dense
      outlined
      chips
      small-chips
      item-text="name"
      item-value="name"
      multiple
    >
      <template v-slot:selection="data">
        <v-chip
          v-bind="data.attrs"
          :input-value="data.selected"
          close
          close-icon="cancel"
          @click="data.select"
          @click:close="removeNarrativeType(data.item)"
        >
          <span class="text-truncate" style="max-width: 150px;">{{ data.item.name }}</span>
        </v-chip>
      </template>
      <template v-slot:item="data">
        <template>
          <v-list-item-content>
            <v-list-item-title v-text="data.item.name"></v-list-item-title>
          </v-list-item-content>
        </template>
      </template>
    </v-autocomplete>
  </v-container>
</template>

<script lang="ts" src="./FilterPanel">
</script>

<style lang="scss" scoped>
</style>
