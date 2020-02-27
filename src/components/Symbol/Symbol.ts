import { Component, Prop, Vue } from 'vue-property-decorator';
import { CirclePaint } from '@nextgis/webmap';

@Component
export default class Legend extends Vue {
  @Prop({ type: Object }) paint!: CirclePaint;

  get style() {
    return {
      width: 15 + 'px',
      height: 15 + 'px'
      // width: paint.radius + 'px',
      // height: paint.radius + 'px'
    };
  }

  get fillStyle() {
    const paint = this.paint;
    return {
      ...this.style,
      backgroundColor: paint.fillColor || paint.color,
      opacity: paint.fillOpacity || paint.opacity
    };
  }

  get strokeStyle() {
    const paint = this.paint;
    return {
      ...this.style,
      borderColor: paint.strokeColor || paint.color
    };
  }
}
