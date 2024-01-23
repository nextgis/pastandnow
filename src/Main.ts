/* eslint-disable @typescript-eslint/member-ordering */

import {
  mdiArrowLeft,
  mdiChevronRight,
  mdiClose,
  mdiCrosshairsGps,
  mdiFilter,
  mdiFormatListBulleted,
  mdiMagnify,
  mdiMapMarker,
  mdiMessageAlert,
  mdiShareVariant,
} from '@mdi/js';
import { VueNgwControl } from '@nextgis/vue-ngw-map';
import { Component, Mixins, Watch } from 'vue-property-decorator';

import { prepareFilterData } from '../scripts/prepareFilterData';

import Detail from './components/Detail/Detail.vue';
import DrawerContainer from './components/DrawerContainer/DrawerContainer.vue';
import FilterPanel from './components/FilterPanel/FilterPanel.vue';
import Legend from './components/Legend/Legend.vue';
import List from './components/List/List.vue';
import { OralMap } from './components/OralMap/OralMap';
import SelectPlace from './components/SelectPlace/SelectPlace.vue';
import Share from './components/Share/Share.vue';
import config from './config';
import { WindowSizeMixin } from './minixs/WindowSizeMixin';
import { connector } from './services/ngw';
import { url } from './services/url';
import { appModule } from './store/modules/app';
import { oralModule } from './store/modules/oral';
import throttle from './store/utils/throttle';

import type { OralFeature, OralProperties } from './interfaces';
import type { AppPages } from './store/modules/app';
import type { OralState } from './store/modules/oral';
import type { NgwMapOptions } from '@nextgis/ngw-map';

const { qmsId, feedbackUrl } = config;
@Component({
  components: {
    List,
    Share,
    Detail,
    Legend,
    OralMap,
    FilterPanel,
    SelectPlace,
    VueNgwControl,
    DrawerContainer,
  },
})
export class Main extends Mixins(WindowSizeMixin) {
  throttleSave!: (value: string) => void;
  legendOpen = true;
  shareDialog = false;
  svg = {
    close: mdiClose,
    filter: mdiFilter,
    search: mdiMagnify,
    place: mdiMapMarker,
    share: mdiShareVariant,
    target: mdiCrosshairsGps,
    arrow_back: mdiArrowLeft,
    feedback: mdiMessageAlert,
    list: mdiFormatListBulleted,
    chevron_right: mdiChevronRight,
  };

  filterPanelOpen = false;

  mapOptions: NgwMapOptions = {
    connector,
    target: 'map',
    center: [37.63, 55.75],
    zoom: 10,
    qmsId,
    controls: ['ZOOM', 'ATTRIBUTION'],
    controlsOptions: {
      ZOOM: { position: 'top-right' },
      ATTRIBUTION: { position: 'bottom-right' },
    },
  };

  listIsScrolled = false;
  detailIsScrolled = false;

  get detailDrawer(): boolean {
    return !!this.detail;
  }

  get items(): OralProperties[] {
    return oralModule.items.map((x) => x.properties);
  }

  get filtered(): OralFeature[] {
    return oralModule.filtered;
  }

  get activePlaceItems(): OralFeature[] {
    return oralModule.activePlaceItems;
  }

  get isFilterSet(): boolean {
    return this.filtered.length !== this.activePlaceItems.length;
  }

  get module(): OralState {
    return oralModule;
  }

  get featuresLoading(): boolean {
    return this.module.featuresLoading;
  }

  get searchReady(): boolean {
    return this.module.searchReady;
  }

  get listSearchText(): string {
    return oralModule.listSearchText;
  }

  set listSearchText(value: string) {
    this.throttleSave(value);
  }

  get page(): AppPages {
    return appModule.page;
  }

  set page(value: AppPages) {
    appModule.setPage(value);
  }

  get zoomTo(): number | null {
    return appModule.centerId;
  }

  set zoomTo(id1: number | null) {
    appModule.zoomTo(id1);
  }

  get drawer(): boolean {
    return appModule.drawer;
  }

  set drawer(value: boolean) {
    appModule.toggleDrawer(value);
  }

  get detail(): false | OralFeature {
    return oralModule.detailItem;
  }

  set detail(value: false | OralFeature) {
    const id1 = value && value.properties.id1;
    oralModule.setDetail(id1 ? Number(id1) : null);
  }

  @Watch('listSearchText')
  updateFilter(val: string): void {
    oralModule.setFullTextFilter(val);
  }

  @Watch('detail')
  onDetailChange(val: OralFeature): void {
    const id = val && val.properties.id1;
    if (!id) {
      this.detailIsScrolled = false;
      url.remove('id');
    } else {
      url.set('id', id !== undefined ? String(id) : '');
    }
    // for work with IFRAME
    if (window.parent) {
      window.parent.postMessage(JSON.stringify({ detail: id }), '*');
    }
  }

  @Watch('windowSize')
  @Watch('detail')
  resolveDrawer(): void {
    if (this.detail && this.isMobile) {
      this.drawer = false;
    }
  }

  resetNonPlaceFilter(): void {
    oralModule.resetNonPlaceFilter();
  }

  mounted(): void {
    this.throttleSave = throttle(this.setListSearchText, 1000, this);
  }

  async created(): Promise<void> {
    const setFilterData = () => {
      const filterData = prepareFilterData(
        oralModule.items.map((x) => x.properties),
      );
      oralModule.setFilterData(filterData);
    };
    const id = url.get('id');
    if (id !== undefined) {
      try {
        const feature = await oralModule.setDetailById(id);
        feature && appModule.zoomTo(Number(feature.properties.id1));
      } catch (er) {
        url.remove('id');
      }
    }
    oralModule.getAllItems().then(() => {
      setFilterData();
      oralModule.resetSpecialFilter();
      oralModule.loadStories().then(setFilterData);
    });
    oralModule.getPhotos();
  }

  setListSearchText(value: string): void {
    oralModule.setListSearchText(value);
  }

  openFeedbackPage(): void {
    window.open(feedbackUrl, '_blank');
  }

  onPanelScroll(e: { target: HTMLElement }): void {
    this.listIsScrolled = e.target.scrollTop > 0;
  }

  onDetailScroll(e: { target: HTMLElement }): void {
    this.detailIsScrolled = e.target.scrollTop > 0;
  }
}
