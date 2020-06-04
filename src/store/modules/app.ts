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
  showDrawer(): boolean {
    return true;
  }

  @Action({ commit: '_toggleDrawer' })
  hideDrawer(): boolean {
    return false;
  }

  @Action({ commit: '_toggleDrawer' })
  toggleDrawer(value: boolean): boolean {
    return value;
  }

  @Action({ commit: '_setPage' })
  setPage(page: AppPages): AppPages {
    return page;
  }

  @Action({ commit: '_setCenter' })
  zoomTo(id: number | null): number | null {
    return id;
  }

  @Mutation
  _toggleDrawer(status: boolean): void {
    this.drawer = status;
  }

  @Mutation
  _setCenter(center: number): void {
    this.centerId = center;
  }

  @Mutation
  _setPage(page: AppPages): void {
    this.page = page;
  }
}

export const appModule = getModule(AppState);
