import { Component, Vue } from 'vue-property-decorator';

import MainComponent from './Main.vue';
import AboutComponent from './components/NextGIS/About.vue';
import TableComponent from './components/Table/Table.vue';
import { appModule } from './store/modules/app';

import type { AppPages } from './store/modules/app';

@Component({
  components: { MainComponent, TableComponent, AboutComponent },
})
export class App extends Vue {
  tableSearch = '';
  pagination: any = null;

  get pagesCount(): number {
    if (
      this.pagination &&
      (this.pagination.rowsPerPage === null ||
        this.pagination.totalItems === null)
    ) {
      return 0;
    }

    return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage);
  }

  get page(): AppPages {
    return appModule.page;
  }

  set page(value: AppPages) {
    appModule.setPage(value);
  }

  paginationSync(value: unknown): void {
    this.pagination = value;
  }
}
