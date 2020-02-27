<template>
  <div class="" v-bind:style="style">
    <div class="symbol-component symbol-fill" v-bind:style="fillStyle"></div>
    <div class="symbol-component symbol-stroke" v-bind:style="strokeStyle"></div>
  </div>
</template>

<script lang="ts" src="./Symbol.ts"></script>

<style lang="scss" scoped>
.symbol-component {
  position: absolute;
  border-radius: 50%;
}
.symbol-stroke {
  border: 2px solid black;
}
</style>
