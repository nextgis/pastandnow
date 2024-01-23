import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export class ShowMoreField extends Vue {
  @Prop({ default: '' }) text!: string;
  @Prop({ default: 40 }) charCount!: number;
  @Prop({ type: Boolean, default: true }) disableExpand!: boolean;

  expand = true;

  get toShow(): string {
    if (this.expand) {
      return this.text;
    } else {
      return this.text.slice(0, this.charCount) + '...';
    }
  }

  onClick(): void {
    this.expand = !this.expand;
  }
}
