import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export class About extends Vue {
  openNextGIS(): void {
    window.location.href = 'http://nextgis.com/';
  }
}
