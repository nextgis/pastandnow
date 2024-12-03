import MapAdapter from '@nextgis/maplibre-gl-map-adapter';
import { getEventHandlers, VueNgwMap } from '@nextgis/vue-ngw-map';
import { mapEmits, mapProps } from '@nextgis/vue-ngw-map';
import { defineComponent, h } from 'vue';

import 'maplibre-gl/dist/maplibre-gl.css';

export const VueNgwMaplibregl = defineComponent({
  name: 'VueNgwMaplibregl',

  props: { ...mapProps },

  emits: mapEmits,

  setup(props, { attrs, slots, emit }) {
    return () =>
      h(
        VueNgwMap,
        {
          ...attrs,
          ...props,
          ...getEventHandlers(emit),
          mapAdapter: new MapAdapter(),
        },
        slots,
      );
  },
});

export default VueNgwMaplibregl;
