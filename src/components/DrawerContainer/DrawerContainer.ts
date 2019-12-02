import { Vue, Component, Prop } from 'vue-property-decorator';

@Component
export class DrawerContainer extends Vue {
  @Prop() header!: string;

  get hasFooterSlot() {
    return this.hasSlot('footer');
  }

  get hasHeaderSlot() {
    return this.hasSlot('header');
  }

  hasSlot(name = 'default') {
    return !!this.$slots[name] || !!this.$scopedSlots[name];
  }
}
