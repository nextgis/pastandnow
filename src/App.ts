import Vue from 'vue';
import Component from 'vue-class-component';
import { mapState } from 'vuex';
import List from './components/List/List.vue';
import NgwMap from './components/NgwMap/NgwMap.vue';
import ItemsFilter from './components/ItemsFilter/ItemsFilter.vue';
@Component({
  components: {List, NgwMap, ItemsFilter},
  data: () => ({
    drawer: null,
  }),
  computed: mapState({
    items: (state: any) => state.bdMain.items.map((x) => x.properties)
  })

})
export class App extends Vue {

  created() {
    this.$store.dispatch('bdMain/getAllItems');
  }


}
