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

import store from '../index';
import { Ngw } from '../../services/ngw';
import { FilterData } from '../../../scripts/FilterData';

import type {
  OralFeature,
  OralFilter,
  LegendItem,
  LayerMetaItem,
  OralPhotoProperties,
  OralProperties,
} from '../../interfaces';
import { sortFeatures } from '../utils/sortFeatures';

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
  photos: OralPhotoProperties[] = [];
  meta: LayerMetaItem[] = [];
  detailItem: OralFeature | false = false;
  featuresLoading = false;

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

  filterData: FilterData = {
    cities: {},
    rayonDict: {},
    narrativeTypeItems: {},
  };

  filters: FilterProperties = {
    fullText: undefined,
    city: undefined,
    rayon: undefined,
    // in legend
    type: undefined,
    // meta field type is 'Special'
    specialFilter: undefined,
  };

  searchReady = false;

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
    return this.filtered;
  }

  @Action({ commit: '_setItems' })
  async getAllItems(): Promise<OralFeature[]> {
    this.setFeaturesLoading(true);
    await this.setMeta();
    const features = await Ngw.getLayerFeatures();
    this.setFeaturesLoading(false);
    return features;
  }

  @Action({ commit: '_setItems' })
  async setItems(features: OralFeature[]): Promise<OralFeature[]> {
    await this.setMeta();
    return features;
  }

  @Action({ commit: '_setItems' })
  async loadStories(): Promise<OralFeature[]> {
    this.context.dispatch('setSearchReady', false);
    const features: OralFeature[] = [];
    const items = await Ngw.getLayerStoryItems();
    this.items.forEach((x) => {
      const storyItemIndex = items.findIndex((y) => y.id === x.id);
      const newOralFeature = { ...x };
      if (storyItemIndex) {
        const story = items.splice(storyItemIndex, 1)[0];
        newOralFeature.properties = { ...x.properties, ...story.fields };
      }
      features.push(newOralFeature);
    });
    this.context.dispatch('setSearchReady', true);
    return features;
  }

  @Action({ commit: '_setMeta' })
  async setMeta(): Promise<LayerMetaItem[]> {
    const meta = await Ngw.getLayerMeta();
    return meta;
  }

  @Action
  async setDetailById(id: number): Promise<OralFeature | undefined> {
    const features = await Ngw.fetchNgwLayerFeatures<OralProperties>([
      ['id1', 'eq', id],
    ]);
    const feature = features && features[0];
    if (feature) {
      const existActiveTypes = [...(this.activeTypes || [])];
      if (
        existActiveTypes.length &&
        !existActiveTypes.includes(feature.properties.type)
      ) {
        existActiveTypes.push(feature.properties.type);
        await this.setActiveTypes([...existActiveTypes]);
        await this.setTypesFilter([...existActiveTypes]);
      }
      await this.setActiveCity(feature.properties.city);
      const items = [...this.items];
      const exist = items.find((x) => x.id === feature.id);
      if (!exist) {
        await this.setItems([...items, feature]);
      }
      this.setDetail(Number(feature.id));
      return feature;
    }
  }

  @Action({ commit: '_setPhotos' })
  async getPhotos(): Promise<OralPhotoProperties[]> {
    const photos = await Ngw.getPhotos();
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
      [],
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
    const meta = await Ngw.getLayerMeta();
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
    const item = this.filtered.find((x: OralFeature) => x.id === id);
    if (id) {
      const feature = await Ngw.fetchNgwLayerFeature(id);
      if (feature) {
        return feature;
      }
    }
    return item;
  }

  @MutationAction({ mutate: ['searchReady'] })
  async setSearchReady(searchReady: boolean): Promise<{
    searchReady: boolean;
  }> {
    return { searchReady };
  }

  @MutationAction({ mutate: ['featuresLoading'] })
  async setFeaturesLoading(featuresLoading: boolean): Promise<{
    featuresLoading: boolean;
  }> {
    return { featuresLoading };
  }

  @MutationAction({ mutate: ['filterData'] })
  async setFilterData(filterData: FilterData): Promise<{
    filterData: FilterData;
  }> {
    return { filterData };
  }

  @MutationAction({ mutate: ['listSearchText'] })
  async setListSearchText(listSearchText: string): Promise<{
    listSearchText: string;
  }> {
    return { listSearchText };
  }

  @MutationAction({ mutate: ['activeTypes'] })
  async setActiveTypes(activeTypes: string[]): Promise<{
    activeTypes: string[];
  }> {
    return { activeTypes };
  }

  @MutationAction({ mutate: ['activeRayon'] })
  async setActiveRayon(activeRayon: string): Promise<{
    activeRayon: string;
  }> {
    return { activeRayon };
  }

  @MutationAction({ mutate: ['specialFilterSelected'] })
  async setSpecialFilterSelected(specialFilterSelected: string[]): Promise<{
    specialFilterSelected: string[];
  }> {
    return { specialFilterSelected };
  }

  @MutationAction({ mutate: ['narrativeTypeSelected'] })
  async setNarrativeTypeSelected(narrativeTypeSelected: string[]): Promise<{
    narrativeTypeSelected: string[];
  }> {
    return { narrativeTypeSelected };
  }

  @MutationAction({ mutate: ['activeCity'] })
  async setActiveCity(activeCity: string): Promise<{
    activeCity: string;
  }> {
    return { activeCity };
  }

  @Mutation
  protected _setItems(items: OralFeature[]): void {
    this.items = items;
    this.filtered = sortFeatures(items);
  }

  @Mutation
  protected _updateFilter(filters: FilterProperties): void {
    const items: OralFeature[] = this.items.filter((x) =>
      featureFilter(
        x,
        Object.values(filters).filter((x) => x),
      ),
    );
    this.filtered = items;

    const detail = this.detailItem;
    if (detail) {
      const item = items.find((x: OralFeature) => {
        const id = x.id;
        return id === detail.id;
      });
      if (!item) {
        this.detailItem = false;
      }
    }
    this.filters = filters;
  }

  @Mutation
  protected _setDetail(item: OralFeature): void {
    this.detailItem = item;
  }

  @Mutation
  protected _setMeta(meta: LayerMetaItem[]): void {
    this.meta = meta;
  }

  @Mutation
  protected _setPhotos(photos: OralPhotoProperties[]): void {
    this.photos = photos;
  }

  @Mutation
  protected _setLegend(legendItem: { name: string; item: CirclePaint }): void {
    const exist = this.legendItems.find((x) => x.name === legendItem.name);
    if (!exist) {
      this.legendItems.push(legendItem);
      this.activeTypes = this.legendItems.map((x) => x.name);
    }
  }
}

export const oralModule = getModule(OralState);
