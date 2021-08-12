<template>
  <div>
    <v-list class="items-list" dense >
      <v-list-item-group v-model="active">
        <v-list-item
          v-for="(item, i) in portion"
          :key="i"
          @click="setDetail(item.id1)"
          class="align-start"
        >
          <SymbolComponent
            :paint="getItemPaint(item)"
            :geo="item.geo || 'point'"
            class="mr-2 mt-2 list-item-icon"
          ></SymbolComponent>
          <v-list-item-content>
            <div>{{ item.name }}</div>
            <v-list-item-subtitle>{{ item.type }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
    <div v-if="displayItems.length > portion.length" class="text-center">
      <v-btn text color="primary" @click="addPortion">Показать ещё</v-btn>
    </div>
  </div>
</template>

<script lang="ts">
export { List as default } from './List';
</script>

<style lang="scss" scoped>
.items-list {
  font-size: 14px;
}

// .items-list .v-list-item{
//   align-items: start;
// }

// .list-item-icon {
//   margin-top: 12px;
// }
</style>
