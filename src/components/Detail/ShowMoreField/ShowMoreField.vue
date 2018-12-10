<template>
  <span>
    <span>{{toShow}}</span>
    <span>
      <a @click="onClick">
        <span v-if="!expand">>>></span>
        <span v-else>&#60;&#60;&#60;</span>
      </a>
    </span>
  </span>
</template>

<script lang="ts">
export { ShowMoreField as default } from './ShowMoreField';
</script>

<style lang="scss">

</style>
