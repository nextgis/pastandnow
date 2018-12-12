import { Vue, Component } from 'vue-property-decorator';
import List from './components/List/List.vue';
import NgwMap from './components/NgwMap/NgwMap.vue';
import ItemsFilter from './components/ItemsFilter/ItemsFilter.vue';
import Detail from './components/Detail/Detail.vue';
import DrawerContainer from './components/DrawerContainer/DrawerContainer.vue';
import { BdMainItemProperties } from './api/ngw';
import MapControl from './components/NgwMap/controls/Panel.vue';
import { AppPages } from './store/modules/app';
import throttle from './store/utils/throttle';

@Component({
  components: {List, NgwMap, ItemsFilter, Detail, DrawerContainer, MapControl},
})
export class Main extends Vue {

  throtleSave;

  get listSearchText(): string {
    return this.$store.state.app.listSearchText;
  }

  set listSearchText(value: string) {
    this.throtleSave(value);
  }

  get page(): AppPages {
    return this.$store.state.app.page;
  }

  set page(value: AppPages) {
    this.$store.dispatch('app/setPage', value);
  }

  get zoomTo(): number {
    return this.$store.state.app.zoomTo;
  }

  set zoomTo(value: number) {
    this.$store.dispatch('app/zoomTo', value);
  }

  get drawer(): boolean {
    return this.$store.state.app.drawer;
  }

  set drawer(value: boolean) {
    this.$store.dispatch('app/toggleDrawer', value);
  }

  get items(): BdMainItemProperties[] {
    return this.$store.state.bdMain.items.map((x) => x.properties);
  }

  get detail(): BdMainItemProperties {
    return this.$store.state.bdMain.detailItem;
  }

  set detail(value: BdMainItemProperties) {
    this.$store.dispatch('bdMain/setDetail', value);
  }

  mounted() {
    this.throtleSave = throttle(this.setListSearchText, 1000, this);
  }

  created() {
    this.$store.dispatch('bdMain/getAllItems');
  }

  setListSearchText(value) {
    this.$store.dispatch('app/setListSearchText', value);
  }

}
