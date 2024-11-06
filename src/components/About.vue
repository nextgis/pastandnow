<template>
  <div class="my-app">
   <h1>{{ title }}</h1>
   <p>{{ info }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const info = ref('This is the skeleton to create an application using the Vue, Typescript and Webpack');
    const title = ref(['Hello', 'webpack'].join(' '));

    return {
      info,
      title
    };
  }
});
</script>

<style lang="scss" scoped>
</style>
