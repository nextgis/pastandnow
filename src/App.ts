import Vue from 'vue';
import Component from 'vue-class-component';
import { NgwMap } from './components/NgwMap/NgwMap';

@Component
export class App extends Vue {

  mounted() {
    const target = this.$el.querySelector('#map') as HTMLElement;
    const ngwMap = new NgwMap({
      mapOptions: { target, center: [55.75, 37.63], zoom: 10 }
    });
    ngwMap.createWebMap();
  }
}
