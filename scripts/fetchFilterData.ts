import { Point } from 'geojson';
// import { BdMainItemProperties } from '../src/api/ngw';
import { fetchNgwLayerItems } from '@nextgis/ngw-kit';
const NgwConnector = require('@nextgis/ngw-connector');
const config = require('../config.json');

const connector = new NgwConnector({ baseUrl: config.baseUrl });

async function fetchFilterData() {
  const features = await fetchNgwLayerItems<Point>({
    connector,
    resourceId: config.ngwMarkerLayerId,
    fields: [],
  });
}

fetchFilterData().catch((er) => {
  console.log(er);
});
