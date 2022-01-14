import { FilterData } from './FilterData';
import type { OralProperties } from '../src/interfaces';

export function prepareFilterData(items: OralProperties[]): FilterData {
  const filterData: FilterData = {
    // cities: {},
    // rayonDict: {},
    narrativeTypeItems: {},
  };
  for (const props of items) {
    const cityStr = props.city as string;
    if (cityStr) {
      const cities = cityStr.split(';').map((y) => y.trim());
      if (cities.length > 1) {
        console.log(props);
      }
      for (const city of cities) {
        if (city) {
          //   const cityCount: number = filterData.cities[city] || 0;
          //   filterData.cities[city] = cityCount + 1;
          //   const rayonStr = props.rayon as string;

          //   if (rayonStr) {
          //     const rayonList = rayonStr.split(';').map((y) => y.trim());
          //     for (const rayon of rayonList) {
          //       if (rayon) {
          //         const existRayon = filterData.rayonDict[city];
          //         if (!existRayon) {
          //           filterData.rayonDict[city] = {};
          //         }
          //         const rayonCount: number =
          //           filterData.rayonDict[city][rayon] || 0;
          //         filterData.rayonDict[city][rayon] = rayonCount + 1;
          //       }
          //     }
          //   }

          const narrativeTypeStr = props['narrativ_t'];
          if (narrativeTypeStr) {
            if (!filterData.narrativeTypeItems[city]) {
              filterData.narrativeTypeItems[city] = [];
            }
            const narrativeType = narrativeTypeStr
              .split('.')
              .map((x) => x.trim());
            for (const y of narrativeType) {
              if (y && filterData.narrativeTypeItems[city].indexOf(y) === -1) {
                filterData.narrativeTypeItems[city].push(y);
              }
            }
          }
        }
      }
    }
  }
  for (const n in filterData.narrativeTypeItems) {
    filterData.narrativeTypeItems[n].sort();
  }
  return filterData;
}
