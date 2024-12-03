import {
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onMounted,
  ref,
} from 'vue';

import { useNgwMap } from '../hooks/useNgwMap';
import { propsBinder } from '../utils';

import type {
  ControlPosition,
  CreateControlOptions,
  MapControl,
  MapControls,
} from '@nextgis/webmap';

export const VueNgwControl = defineComponent({
  name: 'VueNgwControl',
  props: {
    position: { type: String as () => ControlPosition, default: 'tol-left' },
    bar: { type: Boolean },
    margin: { type: Boolean },
    addClass: { type: String, default: '' },
    kind: { type: String, default: '' },
    controlOptions: {
      type: Object as () => CreateControlOptions,
      default: () => ({}),
    },
  },
  emits: ['ready', 'load'],
  setup(props, { emit }) {
    const control = ref<any>(undefined);
    const root = ref<HTMLElement>();
    const ready = ref(false);

    const ngwMap = useNgwMap();

    onBeforeUnmount(() => {
      if (ngwMap.value && control.value) {
        ngwMap.value.removeControl(control.value);
        control.value = undefined;
      }
    });

    const setControl = async () => {
      const currentNgwMap = ngwMap.value;
      const currentControl = control.value;

      if (currentNgwMap) {
        if (currentControl) {
          currentNgwMap.removeControl(currentControl);
        }

        const adControlOptions: CreateControlOptions = {
          ...props,
          ...props.controlOptions,
        };

        const controlObject: MapControl = {
          onAdd: () => root.value,
          onRemove: () => {
            // Handle on remove action
          },
        };

        let _control: keyof MapControls | any = props.kind;
        if (!_control) {
          _control = await currentNgwMap.createControl(
            controlObject,
            adControlOptions,
          );
        }

        control.value = currentNgwMap.addControl(_control, props.position);
      }
    };

    onMounted(() => {
      setControl();

      ready.value = true;
      propsBinder({ ...props }, props);

      nextTick(() => {
        emit('ready', control.value);
        emit('load', ngwMap.value);
      });
    });

    return { root };
  },
  render() {
    if (this.$slots.default) {
      return h(
        'div',
        {
          ref: 'root',
          class: ['vue-ngw-control'],
          style: {},
        },
        this.$slots.default(),
      );
    }
    return null;
  },
});
