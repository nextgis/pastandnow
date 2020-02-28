<template>
  <div>
    <v-list>
      <v-list-item-group v-model="active">
        <v-list-item v-for="item in portion" :key="item.id" @click="setDetail(item.id)">
          <SymbolComponent :paint="getItemPaint(item)" class="mr-2"></SymbolComponent>
          <v-list-item-content>
            <div>{{ item.name }}</div>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
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
