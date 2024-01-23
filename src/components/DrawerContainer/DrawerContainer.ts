import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export class DrawerContainer extends Vue {
  @Prop() header!: string;

  get hasFooterSlot(): boolean {
    return this.hasSlot('footer');
  }

  get hasHeaderSlot(): boolean {
    return this.hasSlot('header');
  }

  hasSlot(name = 'default'): boolean {
    return !!this.$slots[name] || !!this.$scopedSlots[name];
  }
}
