import { Vue, Component } from 'vue-property-decorator';
import { appModule, AppPages } from './store/modules/app';
import AboutComponent from './components/NextGIS/About.vue';
import TableComponent from './components/Table/Table.vue';
import MainComponent from './Main.vue';

@Component({
  components: { MainComponent, TableComponent, AboutComponent },
})
export class App extends Vue {
  tableSearch = '';
  pagination: any = null;

  get page() {
    return appModule.page;
  }

  set page(value: AppPages) {
    appModule.setPage(value);
  }

  get pages() {
    if (
      this.pagination &&
      (this.pagination.rowsPerPage === null ||
        this.pagination.totalItems === null)
    ) {
      return 0;
    }

    return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage);
  }

  paginationSync(value: any) {
    this.pagination = value;
  }
}
