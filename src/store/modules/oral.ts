import {
  Action,
  Module,
  Mutation,
  getModule,
  VuexModule,
  MutationAction,
} from 'vuex-module-decorators';
import { featureFilter } from '@nextgis/properties-filter';

import { DEFAULT_PLACE, PLACE_KEYS } from '../../constants';
import {
  getLayerStoryItems,
  fetchOralFeature,
  getLayerFeatures,
  getLayerMeta,
  getPhotos,
} from '../../services/ngw';
import { sortFeatures } from '../utils/sortFeatures';
import store from '../index';

import type { PathPaint } from '@nextgis/paint';
import type {
  PropertyFilter,
  PropertiesFilter,
} from '@nextgis/properties-filter';
import type { FilterData } from '../../../scripts/FilterData';
import type {
  OralPhotoProperties,
  OralPointFeature,
  PlaceProperties,
  LayerMetaItem,
  OralGeomType,
  OralFeature,
  LegendItem,
  OralFilter,
  FilterProperties,
} from '../../interfaces';

@Module({ dynamic: true, store, name: 'oral' })
export class OralState extends VuexModule {
  items: OralPointFeature[] = [];
  filtered: OralPointFeature[] = [];
  photos: OralPhotoProperties[] = [];
  meta: LayerMetaItem[] = [];
  detailItem: OralFeature | false = false;
  featuresLoading = false;

  narrativeTypeSelected: string[] = [];
  specialFilterSelected: string[] = [];
  listSearchText = '';
  activeTypes: string[] | false = false;

  activePlace: Partial<PlaceProperties> = {
    cntry: 'Россия',
    city: 'Москва',
    region: undefined,
    rayon: undefined,
  };

  legendItems: Array<{
    name: string;
    geo: OralGeomType;
    item: PathPaint;
  }> = [];

  filterData: FilterData = {
    // cities: {},
    // rayonDict: {},
    narrativeTypeItems: {},
  };

  filters: FilterProperties = {
    fullText: undefined,

    city: undefined,
    rayon: undefined,
    region: undefined,
    cntry: undefined,

    // in legend
    type: undefined,
    // meta field type is 'Special'
    specialFilter: undefined,
  };

  searchReady = false;

  get features(): OralFeature[] {
    return this.filtered;
  }

  get activePlaceItems(): OralFeature[] {
    const placeFilters: PropertiesFilter[] = [];
    for (const k of PLACE_KEYS) {
      const filter = this.filters[k];
      if (filter) {
        placeFilters.push(filter);
      }
    }

    const items: OralPointFeature[] = this.items.filter((x) =>
      featureFilter(x, placeFilters),
    );
    return items;
  }
  // get activePlaceItems(): OralFeature[] {
  //   return this.items.filter((x) => {
  //     return x.properties.city === this.activePlace.city;
  //   });
  // }

  get propertiesFilter(): PropertiesFilter {
    return Object.values(this.filters).filter((x) => x);
  }

  get sortFeatures(): OralFeature[] {
    const filtered = [...this.filtered] as OralFeature[];
    // return filtered;
    return sortFeatures(filtered);
  }

  @Action({ commit: '_setItems' })
  async getAllItems(): Promise<OralFeature[]> {
    this.setFeaturesLoading(true);
    await this.setMeta();
    const features = await getLayerFeatures();
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
    const items = await getLayerStoryItems();
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
    const meta = await getLayerMeta();
    return meta;
  }

  @Action
  async setDetailById(id: number): Promise<OralFeature | undefined> {
    const feature = await fetchOralFeature(id);
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
      await this.setActivePlace(feature.properties);
      const items = [...this.items];
      const exist = items.find(
        (x) => x.properties.id1 === feature.properties.id1,
      );
      if (!exist) {
        await this.setItems([...items, feature]);
      }
      this.setDetail(Number(feature.properties.id1));
      return feature;
    }
  }

  @Action({ commit: '_setPhotos' })
  async getPhotos(): Promise<OralPhotoProperties[]> {
    const photos = await getPhotos();
    return photos;
  }

  @Action({ commit: '_updateFilter' })
  async updateFilter(filters: Partial<FilterProperties>): Promise<OralFilter> {
    const filters_ = { ...this.filters, ...filters };
    return filters_;
  }

  @Action({ commit: '_updateFilter' })
  async resetNonPlaceFilter(): Promise<OralFilter> {
    const filters = { ...this.filters };
    for (const f in filters) {
      const key = f as keyof FilterProperties;
      if (!PLACE_KEYS.includes(key as keyof PlaceProperties)) {
        filters[key] = undefined;
      }
    }
    this.setListSearchText('');
    this.resetSpecialFilter();
    this.setActiveTypes(this.legendItems.map((x) => x.name));
    return filters;
  }

  @Action
  resetSpecialFilter(): void {
    this.setSpecialFilterSelected(
      this.meta.filter((x) => x.type === 'Special').map((x) => x.value),
    );
  }

  @Action({ commit: '_updateFilter' })
  async setFullTextFilter(query: string): Promise<OralFilter> {
    if (!query) {
      return { ...this.filters, fullText: undefined };
    }
    const filters_ = { ...this.filters };
    const meta = await getLayerMeta();
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
  async setSpecialFilter(selected: string[] = []): Promise<OralFilter> {
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
  setLegend(legendItem: {
    name: string;
    item: PathPaint;
    geo: OralGeomType;
  }): LegendItem {
    return legendItem;
  }

  @Action({ commit: '_setDetail' })
  async setDetail(
    id1: number | null,
  ): Promise<false | OralFeature | undefined> {
    const item = this.filtered.find(
      (x: OralFeature) => x.properties.id1 === id1,
    );
    if (id1) {
      const feature = await fetchOralFeature(id1);
      if (feature) {
        return feature;
      }
    }
    return item;
  }

  @Action
  async setActivePlace(place: Partial<PlaceProperties> | null): Promise<void> {
    let activePlace: Partial<PlaceProperties> = {};
    const parts = PLACE_KEYS;
    if (place === null) {
      activePlace = DEFAULT_PLACE;
    } else {
      for (const k of parts) {
        if (k in place) {
          activePlace[k] = place[k];
        }
      }
    }

    // if place part field is a list X1,X2,Xn
    const ilikeFilterParts: (keyof PlaceProperties)[] = ['rayon'];
    const filters: Partial<FilterProperties> = {};
    for (const p of parts) {
      const placePart = activePlace[p];
      if (placePart) {
        if (ilikeFilterParts.includes(p)) {
          filters[p] = [[p, 'ilike', `%${placePart}%`]];
        } else {
          filters[p] = [[p, 'eq', placePart]];
        }
      } else {
        filters[p] = undefined;
      }
    }

    await this._setActivePlace(activePlace);
    this.updateFilter(filters);
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

  @Mutation
  protected _setItems(items: OralPointFeature[]): void {
    this.items = items;
  }

  @Mutation
  protected _updateFilter(filters: FilterProperties): void {
    const items: OralPointFeature[] = this.items.filter((x) =>
      featureFilter(x, Object.values(filters).filter(Boolean)),
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
  protected _setActivePlace(place: Partial<PlaceProperties>): void {
    this.activePlace = place;
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
  protected _setLegend(legendItem: {
    name: string;
    item: PathPaint;
    geo: OralGeomType;
  }): void {
    const exist = this.legendItems.find((x) => x.name === legendItem.name);
    if (!exist) {
      this.legendItems.push(legendItem);
      this.activeTypes = this.legendItems.map((x) => x.name);
    }
  }
}

export const oralModule = getModule(OralState);
