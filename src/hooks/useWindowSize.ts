import { computed, onMounted, onUnmounted, ref } from 'vue';

export function useWindowSize() {
  const windowSize = ref({ x: 0, y: 0 });

  const onResize = () => {
    windowSize.value = { x: window.innerWidth, y: window.innerHeight };
  };

  const isMobile = computed(() => windowSize.value.x < 800);

  onMounted(() => {
    onResize();
    window.addEventListener('resize', onResize);
  });

  onUnmounted(() => {
    window.removeEventListener('resize', onResize);
  });

  return { windowSize, isMobile };
}
