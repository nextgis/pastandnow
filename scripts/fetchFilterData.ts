// import { BdMainItemProperties } from '../src/api/ngw';
import { fetchNgwLayerItems } from '@nextgis/ngw-kit';

import type { Point } from 'geojson';
const NgwConnector = require('@nextgis/ngw-connector');
const config = require('../config.json');

const connector = new NgwConnector({ baseUrl: config.baseUrl });

function fetchFilterData() {
  return fetchNgwLayerItems<Point>({
    connector,
    resourceId: config.ngwMarkerLayerId,
    fields: [],
  });
}

fetchFilterData().catch((er) => {
  console.log(er);
});
