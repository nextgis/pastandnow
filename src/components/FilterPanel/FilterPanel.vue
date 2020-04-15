<template>
  <div class="filter-panel">
    <h5 class="light-text mb-1">СПЕЦИАЛЬНЫЕ ФИЛЬТРЫ</h5>
    <v-checkbox class="filter-panel__checkbox mt-0"
      v-for="v in specialFilterItems"
      v-model="specialFilters"
      dense
      hide-details
      :key="v.value"
      :label="v.text"
      :value="v.value"
    ></v-checkbox>
    <h5 class="light-text mt-5 mb-1">ТИПЫ СЮЖЕТОВ</h5>
    <v-autocomplete
      v-model="narrativeTypesSelected"
      :items="narrativeTypeItems"
      dense
      outlined
      chips
      item-text="name"
      item-value="name"
      multiple
    >
      <template v-slot:selection="data">
        <v-chip class="filter-panel__chip primary--text my-1 mx-0"
          small label
          v-bind="data.attrs"
          :input-value="data.selected"
          close
          close-icon="close"
          @click="data.select"
          @click:close="removeNarrativeType(data.item)"
        >
          <span class="text-truncate">{{ data.item.name }}</span>
        </v-chip>
      </template>
      <template v-slot:item="data">
        <template>
          <v-list-item-content>
            {{data.item.name}}
          </v-list-item-content>
        </template>
      </template>
    </v-autocomplete>
  </div>
</template>

<script lang="ts" src="./FilterPanel">
</script>

<style lang="scss" scoped>
  .filter-panel{
    padding: 0 20px 20px;

    &__checkbox{
      margin-left: -4px;
    }

    &__chip{
      &::v-deep .v-icon{
        color: inherit;
      }
    }
  }
</style>
