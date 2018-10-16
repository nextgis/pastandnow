import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export class DrawerContainer extends Vue {
  @Prop() header: string;
}
