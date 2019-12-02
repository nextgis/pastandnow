import { Feature, Point } from 'geojson';
import {
  VuexModule,
  Mutation,
  Action,
  Module,
  getModule
} from 'vuex-module-decorators';
import store from '..';
import ngw, {
  BdMainItem,
  BdMainItemProperties,
  BdPhotoProperties
} from '../../api/ngw';
import { Alias } from '../../components/Detail/Detail';

export type OralFeature = Feature<Point, BdMainItemProperties>;

@Module({ dynamic: true, store, name: 'oral' })
export class OralState extends VuexModule {
  items: OralFeature[] = [];
  filtered: OralFeature[] = [];
  photos: BdPhotoProperties[] = [];
  meta: Alias[] = [];
  detailItem: any | false = false;

  get features() {
    return this.filtered;
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

  @Action({ commit: '_setFilter' })
  setFilter(items: OralFeature[]) {
    return items;
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
  _setFilter(items: OralFeature[]) {
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
}

export const oralModule = getModule(OralState);
