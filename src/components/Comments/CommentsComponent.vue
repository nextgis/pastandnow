<template>
  <div id="remark42" ref="remark42" />
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import { initRemark42, remarkConfig } from './remark42';

import type { Remark } from './remark42';

const props = defineProps({
  id: {
    type: [Number, String],
    required: true,
  },
});

const remark42Instance = ref<Remark | null>(null);
const remark42Ref = ref<HTMLElement | null>(null);

const init = () => {
  const REMARK42 = (window as any).REMARK42;
  if (REMARK42) {
    if (remark42Instance.value) {
      remark42Instance.value.destroy();
    }
    const opt = {
      ...remarkConfig,
      url: `https://pastandnow.ru/?id=${props.id}`,
    };
    remark42Instance.value = REMARK42.createInstance({
      node: remark42Ref.value as HTMLElement,
      ...opt,
    });
  }
};

onMounted(() => {
  if ((window as any).REMARK42) {
    init();
  } else {
    initRemark42();
    window.addEventListener('REMARK42::ready', () => {
      (window as any).REMARK42.destroy();
      init();
    });
  }
});

onBeforeUnmount(() => {
  if (remark42Instance.value) {
    remark42Instance.value.destroy();
  }
});
</script>

<style lang="scss" scoped>
#remark42 {
  height: 100%;
  width: 100%;
}
</style>
