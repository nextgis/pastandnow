import Vue from 'vue';
import Component from 'vue-class-component';
import { mapState } from 'vuex';

@Component({
  computed: mapState({
    items: (state: any) => state.bdMain.items.map((x) => x.properties)
  })
})
export class List extends Vue {


}
