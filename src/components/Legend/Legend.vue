<template>
  <div class="legend" dense>
    <div class="legend__item" v-for="(item, i) in legendItems" :key="i">
      <div class="legend__item-label">
        <SymbolComponent class="mr-2" :paint="item.icon"></SymbolComponent>
        <span v-text="capitalize(item.text)" class=""></span>
      </div>
      <v-switch
        class="legend__item-switcher ml-3 mt-0"
        v-model="activeTypes"
        :value="item.text"
        inset
        dense
        hide-details
        color="primary"
      ></v-switch>
    </div>
  </div>
</template>

<script lang="ts" src="./Legend.ts"></script>

<style lang="scss" scoped>
  .legend{
    width: 200px;
    padding: 16px;

    &__item{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
    }

    &__item-label{
      display: flex;
      align-items: center;
    }
  }
</style>
