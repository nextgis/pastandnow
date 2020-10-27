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
import ngw, { BdPhotoProperties } from '../../api/ngw';
import { LayerMetaItem } from '../../api/ngw';
import { OralFeature, OralFilter, LegendItem } from '../../interfaces';

export const ALL_RAYON_STR = 'Все районы';

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
  meta: LayerMetaItem[] = [];
  detailItem: OralFeature | false = false;

  narrativeTypeSelected: string[] = [];
  specialFilterSelected: string[] = [];
  listSearchText = '';
  activeTypes: string[] | false = false;
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

  get features(): OralFeature[] {
    return this.filtered;
  }

  get activeCityItems(): OralFeature[] {
    return this.items.filter((x) => {
      return x.properties.city === this.activeCity;
    });
  }

  get propertiesFilter(): PropertiesFilter {
    return Object.values(this.filters).filter((x) => x);
  }

  get sortFeatures(): OralFeature[] {
    const filtered = [...this.filtered] as OralFeature[];
    return filtered.sort((a, b) => {
      const aName = a.properties.name || '';
      const bName = b.properties.name || '';
      return aName.toUpperCase() > bName.toUpperCase() ? 1 : -1;
    });
  }

  @Action({ commit: '_setItems' })
  async getAllItems(): Promise<OralFeature[]> {
    await this.setMeta();
    const items = await ngw.getLayerGeoJson();
    return items.features;
  }

  @Action({ commit: '_setMeta' })
  async setMeta(): Promise<LayerMetaItem[]> {
    const meta = await ngw.getLayerMeta();
    return meta;
  }

  @Action({ commit: '_setPhotos' })
  async getPhotos(): Promise<BdPhotoProperties[]> {
    const photos = await ngw.getPhotos();
    return photos;
  }

  @Action({ commit: '_updateFilter' })
  async updateFilter(filters: FilterProperties): Promise<OralFilter> {
    const filters_ = { ...this.filters, ...filters };
    return filters_;
  }

  @Action({ commit: '_updateFilter' })
  async resetFilter(): Promise<OralFilter> {
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
  async setFullTextFilter(query: string): Promise<OralFilter> {
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
  async setTypesFilter(types: string[] | undefined): Promise<OralFilter> {
    if (!types) {
      return { ...this.filters, type: undefined };
    }
    const filters_ = { ...this.filters };

    filters_.type = [['type', 'in', types]];
    return filters_;
  }

  @Action({ commit: '_updateFilter' })
  async setSpecialFilter(selected: string[] | undefined): Promise<OralFilter> {
    if (!selected) {
      return { ...this.filters, specialFilter: undefined };
    }
    const filters_ = { ...this.filters };
    const properties: PropertyFilter[] = selected.map((x) => [x, 'eq', 1]);
    filters_.specialFilter = ['any', ...properties];
    return filters_;
  }

  @Action({ commit: '_updateFilter' })
  async setNarrativeType(selected: string[] | undefined): Promise<OralFilter> {
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
  setLegend(legendItem: { name: string; item: CirclePaint }): LegendItem {
    return legendItem;
  }

  @Action({ commit: '_setDetail' })
  async setDetail(id: number | null): Promise<false | OralFeature | undefined> {
    const item = this.filtered.find((x: OralFeature) => x.properties.id === id);
    const detail = this.detailItem;
    if (detail && detail.id === id) {
      return false;
    }
    if (id) {
      const feature = await ngw.fetchNgwLayerFeature(id);
      if (feature) {
        return feature;
      }
    }
    return item;
  }

  @MutationAction({ mutate: ['listSearchText'] })
  async setListSearchText(
    listSearchText: string
  ): Promise<{
    listSearchText: string;
  }> {
    return { listSearchText };
  }

  @MutationAction({ mutate: ['activeTypes'] })
  async setActiveTypes(
    activeTypes: string[]
  ): Promise<{
    activeTypes: string[];
  }> {
    return { activeTypes };
  }

  @MutationAction({ mutate: ['activeRayon'] })
  async setActiveRayon(
    activeRayon: string
  ): Promise<{
    activeRayon: string;
  }> {
    return { activeRayon };
  }

  @MutationAction({ mutate: ['specialFilterSelected'] })
  async setSpecialFilterSelected(
    specialFilterSelected: string[]
  ): Promise<{
    specialFilterSelected: string[];
  }> {
    return { specialFilterSelected };
  }

  @MutationAction({ mutate: ['narrativeTypeSelected'] })
  async setNarrativeTypeSelected(
    narrativeTypeSelected: string[]
  ): Promise<{
    narrativeTypeSelected: string[];
  }> {
    return { narrativeTypeSelected };
  }

  @MutationAction({ mutate: ['activeCity'] })
  async setActiveCity(
    activeCity: string
  ): Promise<{
    activeCity: string;
  }> {
    return { activeCity };
  }

  @Mutation
  _setItems(items: OralFeature[]): void {
    this.items = items;
    this.filtered = items;
  }

  @Mutation
  _updateFilter(filters: FilterProperties): void {
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
      const item = items.find((x: OralFeature) => {
        const id = x.properties.id;
        return id === detail.id;
      });
      if (!item) {
        this.detailItem = false;
      }
    }
  }

  @Mutation
  _setDetail(item: OralFeature): void {
    this.detailItem = item;
  }

  @Mutation
  _setMeta(meta: LayerMetaItem[]): void {
    this.meta = meta;
  }

  @Mutation
  _setPhotos(photos: BdPhotoProperties[]): void {
    this.photos = photos;
  }

  @Mutation
  _setLegend(legendItem: { name: string; item: CirclePaint }): void {
    const exist = this.legendItems.find((x) => x.name === legendItem.name);
    if (!exist) {
      this.legendItems.push(legendItem);
    }
  }
}

export const oralModule = getModule(OralState);
