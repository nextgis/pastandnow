import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class About extends Vue {
  private info =
    'This is the skeleton to create an application using the Vue, Typescript and Webpack';

  private title = ['Hello', 'webpack'].join(' ');
}
