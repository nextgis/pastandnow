import { Point } from 'geojson';
import { FilterData } from './FilterData';
// import { BdMainItemProperties } from '../src/api/ngw';
import { fetchNgwLayerItems } from '@nextgis/ngw-kit';
const NgwConnector = require('@nextgis/ngw-connector');
const config = require('../config.json');

const connector = new NgwConnector({ baseUrl: config.baseUrl });

async function prepareFilterData() {
  const features = await fetchNgwLayerItems<Point>({
    connector,
    resourceId: config.ngwMarkerLayerId,
    fields: [],
  });

  const filterData: FilterData = {
    cities: {},
    rayonDict: {},
  };
  features.forEach((x) => {
    const fields = x.fields;
    const cityStr = fields.city as string;
    if (cityStr) {
      const cities = cityStr.split(';').map((y) => y.trim());
      cities.forEach((x) => {
        if (x) {
          const cityCount: number = filterData.cities[x] || 0;
          filterData.cities[x] = cityCount + 1;
          const rayonStr = fields.rayon as string;

          if (rayonStr) {
            const rayonList = cityStr.split(';').map((y) => y.trim());
            rayonList.forEach((y) => {
              if (y) {
                const existRayon = filterData.rayonDict[x];
                if (!existRayon) {
                  filterData.rayonDict[x] = {};
                }
                const rayonCount: number = filterData.rayonDict[x][y] || 0;
                filterData.cities[y] = rayonCount + 1;
              }
            });
          }
        }
      });
    }
  });
  // fs.writeFile(out, JSON.stringify(filterData), () =>
  //   console.log('Data write in `' + out + '` file')
  // );
}

prepareFilterData().catch((er) => {
  console.log(er);
});
