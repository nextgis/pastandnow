import type { NgwMap, NgwMapOptions } from '@nextgis/ngw-map';
import type { Cursor } from '@nextgis/webmap';

export interface VueNgwMapData<M = any> {
  ngwMap: NgwMap<M>;
  ready: boolean;
}

export interface VueNgwMapProps extends NgwMapOptions {
  fullFilling?: boolean;
  cursor?: Cursor;
  mapOptions?: NgwMapOptions;
}
