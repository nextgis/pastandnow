import { Vue, Component, Prop } from 'vue-property-decorator';
import { initRemark42, remarkConfig } from './remark42';

interface Remark {
  destroy: () => void;
}

@Component
export class Comments extends Vue {
  @Prop() readonly id!: number;

  remark42Instance?: Remark;

  get domId(): string {
    return 'comments' + this.id;
  }

  initRemark42(): void {
    const REMARK42 = (window as any).REMARK42;
    if (REMARK42) {
      if (this.remark42Instance) {
        this.remark42Instance.destroy();
      }
      // See <https://github.com/patarapolw/remark42#setup-on-your-website>
      const opt = {
        ...remarkConfig,
        url: 'https://pastandnow.ru' + '/?id=' + this.id,
      };
      this.remark42Instance = REMARK42.createInstance({
        node: this.$refs.remark42 as HTMLElement,
        ...opt,
      });
    }
  }

  mounted(): void {
    if ((window as any).REMARK42) {
      this.initRemark42();
    } else {
      initRemark42();
      window.addEventListener('REMARK42::ready', () => {
        (window as any).REMARK42.destroy();
        this.initRemark42();
      });
    }
  }

  beforeUnmount(): void {
    if (this.remark42Instance) {
      this.remark42Instance.destroy();
    }
  }
}
