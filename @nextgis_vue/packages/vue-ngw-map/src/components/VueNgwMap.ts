import { NgwMap } from '@nextgis/ngw-map';
import {
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
  shallowRef,
  watch,
} from 'vue';

import { mapEmits, mapProps } from '../mapProps';

import type { NgwMapOptions } from '@nextgis/ngw-map';
import type { LngLatBoundsArray } from '@nextgis/utils';
import type { Cursor, MapAdapter } from '@nextgis/webmap';

import type { VueNgwMapProps } from '../interfaces';

export const VueNgwMap = defineComponent({
  name: 'VueNgwMap',

  props: {
    mapAdapter: {
      type: Object as () => MapAdapter,
      required: true,
    },
    ...mapProps,
  },

  emits: mapEmits,

  setup(props: VueNgwMapProps, { emit, slots, expose }) {
    const ready = ref(false);
    let ngwMap: NgwMap | null = null;
    const ngwMapRef = shallowRef<NgwMap | null>(null);

    const { mapOptions, fullFilling, ...restMapProps } = props;

    const onBoundsChange = (bounds: LngLatBoundsArray | undefined): void => {
      if (ngwMap && bounds) {
        ngwMap.fitBounds(bounds);
      }
    };

    const onCursorChange = (cursor: Cursor | undefined): void => {
      if (ngwMap) {
        ngwMap.setCursor(cursor || 'default');
      }
    };

    const onReady = (): void => {
      if (props.cursor) {
        onCursorChange(props.cursor);
      }
    };

    const addEventsListener = (): void => {
      if (ngwMap) {
        ngwMap.emitter.on('click', (e) => {
          emit('click', e);
        });
      }
    };

    watch(() => props.bounds, onBoundsChange);
    watch(() => props.cursor, onCursorChange);

    onMounted(() => {
      const propsForMap: NgwMapOptions = restMapProps;

      const element = document.getElementsByClassName(
        'vue-ngw-map',
      )[0] as HTMLElement;
      if (element) {
        ngwMap = new NgwMap({
          ...propsForMap,
          ...mapOptions,
          target: element,
        });
        ngwMapRef.value = ngwMap;

        ngwMap.onLoad().then(() => {
          nextTick().then(() => {
            onReady();
            ready.value = true;
            emit('load', ngwMap as NgwMap);
          });
          addEventsListener();
        });
      }
    });

    onBeforeUnmount(() => {
      if (ngwMap) {
        ngwMap.destroy();
      }
    });

    expose({
      ngwMap: ngwMapRef,
    });

    return () => {
      const staticStyle: Record<string, string> = {
        zIndex: '0',
      };

      if (fullFilling) {
        staticStyle.width = '100%';
        staticStyle.height = '100%';
      }

      return h(
        'div',
        {
          class: 'vue-ngw-map',
          style: staticStyle,
          'data-app': true,
        },
        ready.value && slots.default ? slots.default() : undefined,
      );
    };
  },
});

export default VueNgwMap;
