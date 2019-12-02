import { Vue, Component } from 'vue-property-decorator';
import { NgwMapOptions } from '@nextgis/ngw-map';

import { qmsId } from '../config.json';
import { connector } from './api/ngw';
import VueNgwControl from '../nextgisweb_frontend/packages/vue-ngw-map/src/components/VueNgwControl';

import List from './components/List/List.vue';
import { OralMap } from './components/OralMap/OralMap';
import ItemsFilter from './components/ItemsFilter/ItemsFilter.vue';
import Detail from './components/Detail/Detail.vue';
import DrawerContainer from './components/DrawerContainer/DrawerContainer.vue';
import { BdMainItemProperties } from './api/ngw';
import { appModule, AppPages } from './store/modules/app';
import { oralModule } from './store/modules/oral';
import throttle from './store/utils/throttle';

@Component({
  components: {
    List,
    OralMap,
    ItemsFilter,
    Detail,
    DrawerContainer,
    VueNgwControl
  }
})
export class Main extends Vue {
  throttleSave!: (value: string) => void;

  mapOptions: NgwMapOptions = {
    connector,
    target: 'map',
    center: [37.63, 55.75],
    zoom: 10,
    qmsId,
    controlsOptions: {
      ZOOM: { position: 'top-right' },
      ATTRIBUTION: { position: 'bottom-right' }
    }
  };

  get listSearchText(): string {
    return appModule.listSearchText;
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
    return oralModule.items.map(x => x.properties);
  }

  get detail(): BdMainItemProperties {
    return oralModule.detailItem;
  }

  set detail(value: BdMainItemProperties) {
    oralModule.setDetail(value.id);
  }

  mounted() {
    this.throttleSave = throttle(this.setListSearchText, 1000, this);
  }

  created() {
    oralModule.getAllItems();
    oralModule.getPhotos();
  }

  setListSearchText(value: string) {
    appModule.setListSearchText(value);
  }
}
