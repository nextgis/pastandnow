import {
  VuexModule,
  Mutation,
  Action,
  Module,
  getModule,
} from 'vuex-module-decorators';
import store from '../../store';

export type AppPages = 'main' | 'table' | 'about';

@Module({ dynamic: true, store, name: 'app' })
export class AppState extends VuexModule {
  drawer = true;
  page: AppPages = 'main';
  centerId: number | null = null;

  @Action({ commit: '_toggleDrawer' })
  showDrawer() {
    return true;
  }

  @Action({ commit: '_toggleDrawer' })
  hideDrawer() {
    return false;
  }

  @Action({ commit: '_toggleDrawer' })
  toggleDrawer(value: boolean) {
    return value;
  }

  @Action({ commit: '_setPage' })
  setPage(page: AppPages) {
    return page;
  }

  @Action({ commit: '_setCenter' })
  zoomTo(id: number | null) {
    return id;
  }

  @Mutation
  _toggleDrawer(status: boolean) {
    this.drawer = status;
  }

  @Mutation
  _setCenter(center: number) {
    this.centerId = center;
  }

  @Mutation
  _setPage(page: AppPages) {
    this.page = page;
  }
}

export const appModule = getModule(AppState);
