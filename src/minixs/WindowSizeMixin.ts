import { Vue, Component } from 'vue-property-decorator';

@Component
export class WindowSizeMixin extends Vue {
  windowSize = {
    x: 0,
    y: 0,
  };

  removeEventListener: (() => void) | null = null;

  mounted(): void {
    this.onResize();
    // from vuetify navigation drawer
    // window.addEventListener('resize', this.onResize);
    // this.removeEventListener = () =>
    //   window.removeEventListener('resize', this.onResize);
  }

  destroyed(): void {
    if (this.removeEventListener) {
      this.removeEventListener();
      this.removeEventListener = null;
    }
  }

  onResize(): void {
    this.windowSize = { x: window.innerWidth, y: window.innerHeight };
  }

  get isMobile(): boolean {
    return this.windowSize.x < 800;
  }
}
