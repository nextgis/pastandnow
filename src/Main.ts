// @ts-ignore
// import './images/drawing.svg';

import { Component, Watch, Mixins } from 'vue-property-decorator';
import { NgwMapOptions } from '@nextgis/ngw-map';

import {
  mdiFormatListBulleted,
  mdiFilter,
  mdiClose,
  mdiMessageAlert,
  mdiMapMarker,
  mdiChevronRight,
  mdiArrowLeft,
  mdiMagnify,
  mdiCrosshairsGps,
} from '@mdi/js';

import { prepareFilterData } from '../scripts/prepareFilterData';
import { qmsId, feedbackUrl } from '../config.json';
import { connector, Ngw } from './services/Ngw';
import { url } from './services/url';
import { VueNgwControl } from '@nextgis/vue-ngw-map';

import List from './components/List/List.vue';
import { OralMap } from './components/OralMap/OralMap';
import ItemsFilter from './components/ItemsFilter/ItemsFilter.vue';
import Detail from './components/Detail/Detail.vue';
import Legend from './components/Legend/Legend.vue';
import DrawerContainer from './components/DrawerContainer/DrawerContainer.vue';
import FilterPanel from './components/FilterPanel/FilterPanel.vue';
import { OralProperties } from './services/interfaces';
import { appModule, AppPages } from './store/modules/app';
import { oralModule, OralState } from './store/modules/oral';
import throttle from './store/utils/throttle';
import { OralFeature } from './interfaces';
import { WindowSizeMixin } from './minixs/WindowSizeMixin';

@Component({
  components: {
    List,
    OralMap,
    Legend,
    ItemsFilter,
    Detail,
    DrawerContainer,
    VueNgwControl,
    FilterPanel,
  },
})
export class Main extends Mixins(WindowSizeMixin) {
  throttleSave!: (value: string) => void;
  legendOpen = true;
  svg = {
    filter: mdiFilter,
    list: mdiFormatListBulleted,
    close: mdiClose,
    feedback: mdiMessageAlert,
    place: mdiMapMarker,
    chevron_right: mdiChevronRight,
    arrow_back: mdiArrowLeft,
    search: mdiMagnify,
    target: mdiCrosshairsGps,
  };

  filterPanelOpen = false;

  mapOptions: NgwMapOptions = {
    connector,
    target: 'map',
    center: [37.63, 55.75],
    zoom: 10,
    qmsId,
    controlsOptions: {
      ZOOM: { position: 'top-right' },
      ATTRIBUTION: { position: 'bottom-right' },
    },
  };

  listIsScrolled = false;
  detailIsScrolled = false;

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

  set zoomTo(value: number | null) {
    appModule.zoomTo(value);
  }

  get detailDrawer(): boolean {
    return !!this.detail;
  }

  get drawer(): boolean {
    return appModule.drawer;
  }

  set drawer(value: boolean) {
    appModule.toggleDrawer(value);
  }

  get items(): OralProperties[] {
    return oralModule.items.map((x) => x.properties);
  }

  get filtered(): OralFeature[] {
    return oralModule.filtered;
  }

  get activeCityItems(): OralFeature[] {
    return oralModule.activeCityItems;
  }

  get isFilterSet(): boolean {
    return this.filtered.length !== this.activeCityItems.length;
  }

  get detail(): false | OralFeature {
    return oralModule.detailItem;
  }

  set detail(value: false | OralFeature) {
    const id = value && value.id;
    oralModule.setDetail(id ? Number(id) : null);
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

  @Watch('listSearchText')
  updateFilter(val: string): void {
    oralModule.setFullTextFilter(val);
  }

  @Watch('detail')
  resetScroll(val: OralFeature): void {
    const id = val && val.properties.id1;
    if (!id) {
      this.detailIsScrolled = false;
      url.remove('id');
    } else {
      url.set('id', id !== undefined ? String(id) : '');
    }
    // for work with IFRAME
    if (parent) {
      parent.postMessage(JSON.stringify({ detail: id }), '*');
    }
  }

  @Watch('windowSize')
  @Watch('detail')
  resolveDrawer(): void {
    if (this.detail && this.isMobile) {
      this.drawer = false;
    }
  }

  resetFilter(): void {
    oralModule.resetFilter();
  }

  mounted(): void {
    this.throttleSave = throttle(this.setListSearchText, 1000, this);
  }

  async created(): Promise<void> {
    const setFilterData = () => {
      const filterData = prepareFilterData(
        oralModule.items.map((x) => x.properties)
      );
      oralModule.setFilterData(filterData);
    };
    const id = url.get('id');
    if (id !== undefined) {
      try {
        const features = await Ngw.fetchNgwLayerFeatures<OralProperties>([
          ['id1', 'eq', id],
        ]);
        const feature = features && features[0];
        if (feature) {
          await oralModule.setActiveCity(feature.properties.city);
          await oralModule.setItems([feature]);
          this.detail = feature;
          appModule.zoomTo(Number(feature.id));
        }
      } catch (er) {
        url.remove('id');
      }
    }
    oralModule.getAllItems().then(() => {
      setFilterData();
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
