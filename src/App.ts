import Vue from 'vue';
import Component from 'vue-class-component';
import { NgwMap } from './components/NgwMap/NgwMap';
import { mapState } from 'vuex';
import { GeoJSON, Projection, Point, geoJSON, circleMarker } from 'leaflet';

@Component({
  computed: mapState({
    items: (state: any) => state.bdMain.items.map((x) => x.properties)
  })

})
export class App extends Vue {

  ngwMap = new NgwMap();

  mounted() {
    const target = this.$el.querySelector('#map') as HTMLElement;
    this.ngwMap.createWebMap({ target, center: [55.75, 37.63], zoom: 10 });
    this.$store.watch((state) => state.bdMain.items, (items) => {
      const map = this.ngwMap.webMap.map.map;
      items = JSON.parse(JSON.stringify(items));
      items.forEach((item) => {
        const [x, y] = item.geometry.coordinates;
        const { lat, lng } = Projection.SphericalMercator.unproject(new Point(x, y));
        item.geometry.coordinates = [lng, lat];
        const layer = geoJSON(item);
        layer.addTo(map);
      });
    });
  }

  created() {
    this.$store.dispatch('bdMain/getAllItems');
  }


}
