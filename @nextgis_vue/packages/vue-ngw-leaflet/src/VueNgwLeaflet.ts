// /* eslint-disable import/order */
// import MapAdapter from '@nextgis/leaflet-map-adapter';
// import { VueNgwMap } from '@nextgis/vue2-ngw-map';
// import { Icon } from 'leaflet';
// import iconUrl from 'leaflet/dist/images/marker-icon.png';
// import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
// import shadowUrl from 'leaflet/dist/images/marker-shadow.png';
// import { Component, Mixins, Prop } from 'vue-property-decorator';

// import type { NgwMap } from '@nextgis/ngw-map';
// import type { Map } from 'leaflet';

// import 'leaflet/dist/leaflet.css';

// delete (Icon.Default as any).prototype._getIconUrl;

// Icon.Default.mergeOptions({
//   iconRetinaUrl: iconRetinaUrl,
//   iconUrl: iconUrl,
//   shadowUrl: shadowUrl,
// });

// @Component
// export class VueNgwLeaflet extends Mixins<VueNgwMap<Map>>(VueNgwMap) {
//   @Prop({ type: Function, default: () => new MapAdapter() })
//   mapAdapter!: () => MapAdapter;
//   _ngwMap!: NgwMap<Map>;
// }
