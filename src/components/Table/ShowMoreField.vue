<template>
  <span>
    <span v-if="(text && text.length > charCount) || !disableExpand">
      <span>{{ toShow }}</span>
      <a @click="onClick">
        <span v-if="!expand">>>></span>
        <span v-else>&#60;&#60;&#60;</span>
      </a>
    </span>
    <span v-else>{{ text }}</span>
  </span>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

export default defineComponent({
  props: {
    text: {
      type: String,
      default: '',
    },
    charCount: {
      type: Number,
      default: 40,
    },
    disableExpand: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const expand = ref(true);

    const toShow = computed(() => {
      if (expand.value) {
        return props.text;
      } else {
        return props.text.slice(0, props.charCount) + '...';
      }
    });

    const onClick = () => {
      expand.value = !expand.value;
    };

    return {
      expand,
      toShow,
      onClick,
    };
  },
});
</script>

<style lang="scss"></style>
