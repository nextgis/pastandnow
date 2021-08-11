import { Component, Prop, Vue } from 'vue-property-decorator';
import { PathPaint, Expression } from '@nextgis/paint';

@Component
export default class Legend extends Vue {
  @Prop({ type: Object }) paint!: PathPaint;

  get style(): Record<string, string | number> {
    return {
      width: 15 + 'px',
      height: 15 + 'px',
      // width: paint.radius + 'px',
      // height: paint.radius + 'px'
    };
  }

  get fillStyle(): Record<string, string | number | Expression | undefined> {
    const paint = this.paint;
    return {
      ...this.style,
      backgroundColor: paint.fillColor || paint.color,
      opacity: paint.fillOpacity || paint.opacity,
    };
  }

  get strokeStyle(): Record<string, string | number | Expression | undefined> {
    const paint = this.paint;
    return {
      ...this.style,
      borderColor: paint.strokeColor || paint.color,
    };
  }
}
