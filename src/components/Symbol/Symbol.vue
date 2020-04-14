<template>
  <span class="symbol-component-wrapper" v-bind:style="style">
    <span class="symbol-component symbol-fill" v-bind:style="fillStyle"></span>
    <span class="symbol-component symbol-stroke" v-bind:style="strokeStyle"></span>
  </span>
</template>

<script lang="ts" src="./Symbol.ts"></script>

<style lang="scss" scoped>
.symbol-component-wrapper{
  position: relative;
  display: inline-block;
  vertical-align: middle;
}
.symbol-component {
  position: absolute;
  border-radius: 50%;
}
.symbol-stroke {
  border: 2px solid black;
}
</style>
