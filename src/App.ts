import { Vue, Component } from 'vue-property-decorator';

@Component
export class App extends Vue {

  created() {
    this.$store.dispatch('bdMain/getAllItems');
  }

}
