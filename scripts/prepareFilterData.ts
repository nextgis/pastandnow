import { OralProperties } from '../src/services/interfaces';
import { FilterData } from './FilterData';

export function prepareFilterData(items: OralProperties[]): FilterData {
  const filterData: FilterData = {
    cities: {},
    rayonDict: {},
    narrativeTypeItems: {},
  };
  items.forEach((props) => {
    const cityStr = props.city as string;
    if (cityStr) {
      const cities = cityStr.split(';').map((y) => y.trim());
      cities.forEach((city) => {
        if (city) {
          const cityCount: number = filterData.cities[city] || 0;
          filterData.cities[city] = cityCount + 1;
          const rayonStr = props.rayon as string;

          if (rayonStr) {
            const rayonList = rayonStr.split(';').map((y) => y.trim());
            rayonList.forEach((rayon) => {
              if (rayon) {
                const existRayon = filterData.rayonDict[city];
                if (!existRayon) {
                  filterData.rayonDict[city] = {};
                }
                const rayonCount: number =
                  filterData.rayonDict[city][rayon] || 0;
                filterData.rayonDict[city][rayon] = rayonCount + 1;
              }
            });
          }

          const narrativeType = props['narrativ_t'];
          if (narrativeType) {
            if (!filterData.narrativeTypeItems[city]) {
              filterData.narrativeTypeItems[city] = [];
            }
            const split = narrativeType.split('.').map((x) => x.trim());
            split.forEach((y) => {
              if (y && filterData.narrativeTypeItems[city].indexOf(y) === -1) {
                filterData.narrativeTypeItems[city].push(y);
              }
            });
          }
        }
      });
    }
  });
  for (const n in filterData.narrativeTypeItems) {
    filterData.narrativeTypeItems[n].sort();
  }
  return filterData;
}
