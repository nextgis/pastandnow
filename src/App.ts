import { Vue, Component } from 'vue-property-decorator';
import { AppPages } from './store/modules/app';
import AboutComponent from './components/NextGIS/About.vue';
import TableComponent from './components/Table/Table.vue';
import MainComponent from './Main.vue';

@Component({
  components: { MainComponent, TableComponent, AboutComponent }
})
export class App extends Vue {

  get page(): AppPages {
    return this.$store.state.app.page;
  }

  set page(value: AppPages) {
    this.$store.dispatch('app/setPage', value);
  }

  created() {
    this.$store.dispatch('bdMain/getAllItems');
  }

}
