// @ts-ignore
// import './images/drawing.svg';

import { Vue, Component, Watch } from 'vue-property-decorator';
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

import { qmsId, feedbackUrl } from '../config.json';
import { connector } from './api/Ngw';
import { VueNgwControl } from '@nextgis/vue-ngw-map';

import List from './components/List/List.vue';
import { OralMap } from './components/OralMap/OralMap';
import ItemsFilter from './components/ItemsFilter/ItemsFilter.vue';
import Detail from './components/Detail/Detail.vue';
import Legend from './components/Legend/Legend.vue';
import DrawerContainer from './components/DrawerContainer/DrawerContainer.vue';
import FilterPanel from './components/FilterPanel/FilterPanel.vue';
import { BdMainItemProperties } from './api/interfaces';
import { appModule, AppPages } from './store/modules/app';
import { oralModule, OralState } from './store/modules/oral';
import throttle from './store/utils/throttle';
import { OralFeature } from './interfaces';

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
export class Main extends Vue {
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

  get drawer(): boolean {
    return appModule.drawer;
  }

  set drawer(value: boolean) {
    appModule.toggleDrawer(value);
  }

  get items(): BdMainItemProperties[] {
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

  get searchReady(): boolean {
    return this.module.searchReady;
  }

  @Watch('listSearchText')
  updateFilter(val: string): void {
    oralModule.setFullTextFilter(val);
  }

  @Watch('detail')
  resetScroll(val: string): void {
    if (!val) {
      this.detailIsScrolled = false;
    }
  }

  resetFilter(): void {
    oralModule.resetFilter();
  }

  mounted(): void {
    this.throttleSave = throttle(this.setListSearchText, 1000, this);
  }

  created(): void {
    oralModule.getAllItems().then(() => {
      oralModule.loadStories();
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
