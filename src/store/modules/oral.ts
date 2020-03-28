import { Feature, Point } from 'geojson';
import {
  VuexModule,
  Mutation,
  Action,
  Module,
  getModule,
  MutationAction,
} from 'vuex-module-decorators';
import { CirclePaint } from '@nextgis/paint';
import {
  PropertiesFilter,
  featureFilter,
  PropertyFilter,
} from '@nextgis/properties-filter';

import store from '..';
import ngw, {
  BdMainItem,
  BdMainItemProperties,
  BdPhotoProperties,
} from '../../api/ngw';
import { Alias } from '../../components/Detail/Detail';

export const ALL_RAYON_STR = 'Все районы';

export type OralFeature = Feature<Point, BdMainItemProperties>;

export interface FilterProperties {
  city?: PropertiesFilter;
  rayon?: PropertiesFilter;
  type?: PropertiesFilter;
  fullText?: PropertiesFilter;
  specialFilter?: PropertiesFilter;
  narrativeType?: PropertiesFilter;
}

@Module({ dynamic: true, store, name: 'oral' })
export class OralState extends VuexModule {
  items: OralFeature[] = [];
  filtered: OralFeature[] = [];
  photos: BdPhotoProperties[] = [];
  meta: Alias[] = [];
  detailItem: any | false = false;

  narrativeTypeSelected: string[] = [];
  specialFilterSelected: string[] = [];
  listSearchText = '';
  activeTypes: string[] = [];
  activeRayon = ALL_RAYON_STR;
  activeCity = 'Москва';

  legendItems: Array<{
    name: string;
    item: CirclePaint;
  }> = [];

  filters: FilterProperties = {
    city: undefined,
    rayon: undefined,
    type: undefined,
    fullText: undefined,
    specialFilter: undefined,
  };

  get features() {
    return this.filtered;
  }

  get propertiesFilter(): PropertiesFilter {
    return Object.values(this.filters).filter((x) => x);
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
  async resetFilter() {
    const filters = { ...this.filters };
    for (const f in filters) {
      const key = f as keyof FilterProperties;
      if (key !== 'city') {
        filters[key] = undefined;
      }
    }
    this.setActiveRayon(ALL_RAYON_STR);
    this.setListSearchText('');
    this.setSpecialFilterSelected(
      []
      // this.meta.filter((x) => x.type === 'Special').map((x) => x.value)
    );
    this.setActiveTypes(this.legendItems.map((x) => x.name));
    return filters;
  }

  @Action({ commit: '_updateFilter' })
  async setFullTextFilter(query: string) {
    if (!query) {
      return { ...this.filters, fullText: undefined };
    }
    const filters_ = { ...this.filters };
    const meta = await ngw.getLayerMeta();
    const searchField = meta.filter((x) => x.search).map((x) => x.value);
    const propertiesFilter: PropertiesFilter = ['any'];
    searchField.forEach((x) => {
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

  @Action({ commit: '_updateFilter' })
  async setSpecialFilter(selected: string[] | undefined) {
    if (!selected) {
      return { ...this.filters, specialFilter: undefined };
    }
    const filters_ = { ...this.filters };
    const properties: PropertyFilter[] = selected.map((x) => [x, 'eq', 1]);
    filters_.specialFilter = ['any', ...properties];
    return filters_;
  }

  @Action({ commit: '_updateFilter' })
  async setNarrativeType(selected: string[] | undefined) {
    if (!selected) {
      return { ...this.filters, narrativeType: undefined };
    }
    const filters_ = { ...this.filters };
    const properties: PropertyFilter[] = selected.map((x) => [
      '%narrativ_t%',
      'ilike',
      x,
    ]);
    filters_.narrativeType = ['any', ...properties];
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

  @MutationAction({ mutate: ['listSearchText'] })
  async setListSearchText(listSearchText: string) {
    return { listSearchText };
  }

  @MutationAction({ mutate: ['activeTypes'] })
  async setActiveTypes(activeTypes: string[]) {
    return { activeTypes };
  }

  @MutationAction({ mutate: ['activeRayon'] })
  async setActiveRayon(activeRayon: string) {
    return { activeRayon };
  }

  @MutationAction({ mutate: ['specialFilterSelected'] })
  async setSpecialFilterSelected(specialFilterSelected: string[]) {
    return { specialFilterSelected };
  }

  @MutationAction({ mutate: ['narrativeTypeSelected'] })
  async setNarrativeTypeSelected(narrativeTypeSelected: string[]) {
    return { narrativeTypeSelected };
  }

  @MutationAction({ mutate: ['activeCity'] })
  async setActiveCity(activeCity: string) {
    return { activeCity };
  }

  @Mutation
  _setItems(items: OralFeature[]) {
    this.items = items;
    this.filtered = items;
  }

  @Mutation
  _updateFilter(filters: FilterProperties) {
    this.filters = filters;

    const items: OralFeature[] = this.items.filter((x) =>
      featureFilter(
        x,
        Object.values(filters).filter((x) => x)
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
    const exist = this.legendItems.find((x) => x.name === legendItem.name);
    if (!exist) {
      this.legendItems.push(legendItem);
    }
  }
}

export const oralModule = getModule(OralState);
