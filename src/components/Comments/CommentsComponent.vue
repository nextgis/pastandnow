<template>
  <div id="remark42" ref="remark42"></div>
</template>

<script setup lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';

import { initRemark42, remarkConfig } from './remark42';

import type { Remark } from './remark42';

defineComponent({
  name: 'CommentsComponent',
  props: {
    id: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const remark42Instance = ref<Remark | null>(null);
    const remark42Ref = ref<HTMLElement | null>(null);

    const init = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).REMARK42) {
        init();
      } else {
        initRemark42();
        window.addEventListener('REMARK42::ready', () => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  },
});
</script>

<style lang="scss" scoped>
#remark42 {
  height: 100%;
  width: 100%;
}
</style>
