import { Vue, Component } from 'vue-property-decorator';
import List from './components/List/List.vue';
import NgwMap from './components/NgwMap/NgwMap.vue';
import ItemsFilter from './components/ItemsFilter/ItemsFilter.vue';
import Detail from './components/Detail/Detail.vue';
import DrawerContainer from './components/DrawerContainer/DrawerContainer.vue';
import { BdMainItemProperties } from './api/ngw';
import MapControl from './components/NgwMap/controls/Panel.vue';
import { AppPages } from './store/modules/app';

@Component({
  components: {List, NgwMap, ItemsFilter, Detail, DrawerContainer, MapControl},
})
export class Main extends Vue {

  get page(): AppPages {
    return this.$store.state.app.page;
  }

  set page(value: AppPages) {
    this.$store.dispatch('app/setPage', value);
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

  created() {
    this.$store.dispatch('bdMain/getAllItems');
  }

}
