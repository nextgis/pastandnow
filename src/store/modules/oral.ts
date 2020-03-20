import { Feature, Point } from 'geojson';
import {
  VuexModule,
  Mutation,
  Action,
  Module,
  getModule
} from 'vuex-module-decorators';
import { CirclePaint } from '@nextgis/paint';
import { PropertiesFilter, featureFilter } from '@nextgis/properties-filter';

import store from '..';
import ngw, {
  BdMainItem,
  BdMainItemProperties,
  BdPhotoProperties
} from '../../api/ngw';
import { Alias } from '../../components/Detail/Detail';

export type OralFeature = Feature<Point, BdMainItemProperties>;

export interface FilterProperties {
  city?: PropertiesFilter;
  rayon?: PropertiesFilter;
  type?: PropertiesFilter;
  fullText?: PropertiesFilter;
}

@Module({ dynamic: true, store, name: 'oral' })
export class OralState extends VuexModule {
  items: OralFeature[] = [];
  filtered: OralFeature[] = [];
  photos: BdPhotoProperties[] = [];
  meta: Alias[] = [];
  detailItem: any | false = false;
  legendItems: Array<{ name: string; item: CirclePaint }> = [];

  filters: FilterProperties = {
    city: undefined,
    rayon: undefined,
    type: undefined,
    fullText: undefined
  };

  get features() {
    return this.filtered;
  }

  get propertiesFilter(): PropertiesFilter {
    return Object.values(this.filters).filter(x => x);
  }

  get sortFeatures() {
    const filtered = [...this.filtered] as BdMainItem[];
    return filtered.sort((a, b) => {
      const aName = a.properties.name || '';
      const bName = b.properties.name || '';
      return aName.toUpperCase() > bName.toUpperCase() ? 1 : -1;
    });
  }

  @Action({ commit: '_setItems' })
  async getAllItems() {
    await this.setMeta();
    const items = await ngw.getLayerGeoJson();
    return items.features;
  }

  @Action({ commit: '_setMeta' })
  async setMeta() {
    const meta = await ngw.getLayerMeta();
    return meta;
  }

  @Action({ commit: '_setPhotos' })
  async getPhotos() {
    const photos = await ngw.getPhotos();
    return photos;
  }

  @Action({ commit: '_updateFilter' })
  async updateFilter(filters: FilterProperties) {
    const filters_ = { ...this.filters, ...filters };
    return filters_;
  }

  @Action({ commit: '_updateFilter' })
  async setFullTextFilter(query: string) {
    if (!query) {
      return { ...this.filters, fullText: undefined };
    }
    const filters_ = { ...this.filters };
    const meta = await ngw.getLayerMeta();
    const searchField = meta.filter(x => x.search).map(x => x.value);
    const propertiesFilter: PropertiesFilter = ['any'];
    searchField.forEach(x => {
      propertiesFilter.push([`%${x}%`, 'ilike', query]);
    });
    filters_.fullText = propertiesFilter;
    return filters_;
  }

  @Action({ commit: '_updateFilter' })
  async setTypesFilter(types: string[] | undefined) {
    if (!types) {
      return { ...this.filters, type: undefined };
    }
    const filters_ = { ...this.filters };

    filters_.type = [['type', 'in', types]];
    return filters_;
  }

  @Action({ commit: '_setLegend' })
  setLegend(legendItem: { name: string; item: CirclePaint }) {
    return legendItem;
  }

  @Action({ commit: '_setDetail' })
  setDetail(id: number | null) {
    const item = this.filtered.find((x: BdMainItem) => {
      const _id = x.properties.id;
      return _id === id;
    });
    const detail = this.detailItem;
    if (detail && detail.id === id) {
      return false;
    }
    return item;
  }

  @Mutation
  _setItems(items: OralFeature[]) {
    this.items = items;
    this.filtered = items;
  }

  @Mutation
  _updateFilter(filters: FilterProperties) {
    this.filters = filters;

    const items: OralFeature[] = this.items.filter(x =>
      featureFilter(
        x,
        Object.values(filters).filter(x => x)
      )
    );
    this.filtered = items;

    const detail = this.detailItem;
    if (detail) {
      const item = items.find((x: BdMainItem) => {
        const id = x.properties.id;
        return id === detail.id;
      });
      if (!item) {
        this.detailItem = false;
      }
    }
  }

  @Mutation
  _setDetail(item: number) {
    this.detailItem = item;
  }

  @Mutation
  _setMeta(meta: Alias[]) {
    this.meta = meta;
  }

  @Mutation
  _setPhotos(photos: BdPhotoProperties[]) {
    this.photos = photos;
  }

  @Mutation
  _setLegend(legendItem: { name: string; item: CirclePaint }) {
    const exist = this.legendItems.find(x => x.name === legendItem.name);
    if (!exist) {
      this.legendItems.push(legendItem);
    }
  }
}

export const oralModule = getModule(OralState);
