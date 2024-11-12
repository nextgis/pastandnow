<template>
  <span class="symbol-component-wrapper" :style="style">
    <span :class="'symbol-component symbol-fill ' + geo" :style="fillStyle" />
    <span
      :class="`symbol-component symbol-stroke ${geo}`"
      :style="strokeStyle"
    />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import type { PathPaint } from '@nextgis/paint';
import type { CSSProperties } from 'vue';

import type { OralGeomType } from '../interfaces';

const props = defineProps({
  paint: {
    type: Object as () => PathPaint,
    required: true,
  },
  geo: {
    type: String as () => OralGeomType,
    default: 'point',
  },
});

const style = computed<CSSProperties>(() => ({
  width: '15px',
  height: '15px',
  // width: props.paint.radius + 'px',
  // height: props.paint.radius + 'px'
}));

const fillStyle = computed<CSSProperties>(() => {
  const paint = props.paint;
  return {
    ...style.value,
    backgroundColor: String(paint.fillColor) || String(paint.color),
    opacity: String(paint.fillOpacity) || String(paint.opacity),
  };
});

const strokeStyle = computed<CSSProperties>(() => {
  const paint = props.paint;
  return {
    ...style.value,
    borderColor: String(paint.strokeColor) || String(paint.color),
  };
});
</script>

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
