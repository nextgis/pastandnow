<template>
  <span class="symbol-component-wrapper" v-bind:style="style">
    <span
      :class="'symbol-component symbol-fill ' + geo"
      v-bind:style="fillStyle"
    ></span>
    <span
      :class="'symbol-component symbol-stroke ' + geo"
      v-bind:style="strokeStyle"
    ></span>
  </span>
</template>

<script lang="ts" src="./Symbol.ts"></script>

<style lang="scss" scoped>
.symbol-component-wrapper {
  position: relative;
  display: inline-block;
  vertical-align: middle;
}
.symbol-component {
  position: absolute;
}
.symbol-component.point {
  border-radius: 50%;
}
.symbol-component.point {
  border-radius: 50%;
}

.symbol-component.symbol-fill.line {
  display: none;
}
.symbol-component.symbol-stroke.line {
  height: 4px !important;
  top: 5px;
}

.symbol-stroke {
  border: 2px solid black;
}
</style>
