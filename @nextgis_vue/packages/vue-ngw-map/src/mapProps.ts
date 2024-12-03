import type NgwConnector from '@nextgis/ngw-connector';
import type { NgwMapOptions } from '@nextgis/ngw-map';
import type { NgwMap } from '@nextgis/ngw-map';
import type { LngLatBoundsArray } from '@nextgis/utils';
import type { Cursor, MapClickEvent } from '@nextgis/webmap';
import type { EmitFn } from 'vue';

export const mapProps = {
  connector: {
    type: Object as () => NgwConnector,
  },
  fullFilling: {
    type: Boolean,
    default: false,
  },
  baseUrl: {
    type: String,
    default: '',
  },
  qmsId: {
    type: String,
    default: '',
  },
  webMapId: {
    type: String,
    default: '',
  },
  mapOptions: {
    type: Object as () => NgwMapOptions,
    default: () => ({}),
  },
  mapAdapterOptions: {
    type: Object as () => Record<string, unknown>,
    default: () => ({}),
  },
  bounds: {
    type: Array as () => LngLatBoundsArray,
  },
  osm: {
    type: Boolean,
    default: false,
  },
  setViewDelay: {
    type: Number,
    default: 0,
  },
  cursor: {
    type: String as unknown as () => Cursor,
    default: 'default',
  },
} as const;

export const mapEmits = {
  load: (_ngwMap: NgwMap) => true,
  click: (_e: MapClickEvent) => true,
} as const;

export type PropTypes = typeof mapProps;

export type EmitsType = typeof mapEmits;
export type EmitNames = keyof EmitsType;
export type Capitalize<S extends string> = S extends `${infer F}${infer R}`
  ? `${Uppercase<F>}${R}`
  : S;
export type EventHandlers = {
  [K in EmitNames as `on${Capitalize<K>}`]: EmitsType[K] extends (
    ...args: infer P
  ) => any
    ? (...args: P) => void
    : never;
};

export const getEventHandlers = (emit: EmitFn<EmitsType>) =>
  Object.keys(mapEmits).reduce((acc, event) => {
    const eventName = event as EmitNames;
    const handlerName =
      `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}` as keyof EventHandlers;
    acc[handlerName] = (...args: Parameters<EmitsType[typeof eventName]>) => {
      (emit as EmitFn<any>)(eventName, ...args);
    };
    return acc;
  }, {} as EventHandlers);
