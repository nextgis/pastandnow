import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
import { BdMainItemProperties } from '../../api/interfaces';
import { oralModule } from '../../store/modules/oral';
import ShowMoreField from '../ShowMoreField/ShowMoreField.vue';

@Component({
  components: { ShowMoreField },
})
export class Table extends Vue {
  @Prop() search!: string;
  @Prop() paginationSync!: any;

  itemsPerPage = 20;

  headers = [
    { text: 'Адрес', value: 'addr' },
    { text: 'долгота', value: 'lat' },
    { text: 'широта', value: 'lon' },
    { text: 'Название объекта', value: 'name' },
    { text: 'Тип объекта', value: 'type' },
    { text: 'Статус объекта', value: 'status' },
    { text: 'Район', value: 'rayon' },
    { text: 'Неофициальное название', value: 'unoff' },
    { text: 'ОПИСАНИЕ', value: 'description' },
    { text: 'Локальный нарратив', value: 'narrativ_l' },
    { text: 'Биографический нарратив', value: 'narrativ_b' },
    { text: 'Нарратив о практиках', value: 'narrativ_p' },
    { text: 'Описание места', value: 'descript2' },
    { text: 'Рассказчик', value: 'narrator' },
    { text: 'Визуальные материалы', value: 'visual' },
    { text: 'Москва дворовая', value: 'mos1' },
    { text: 'Москва церковная', value: 'mos2' },
    { text: 'Москва бездомная', value: 'mos3' },
    { text: 'Москва подземная', value: 'mos4' },
    { text: 'Москва субкультурная', value: 'mos5' },
    { text: 'Москва легендарная', value: 'mos6' },
  ];

  get items(): BdMainItemProperties[] {
    return oralModule.sortFeatures.map((x) => x.properties);
  }

  @Watch('pagination')
  setPagination(value: unknown): void {
    this.paginationSync(value);
  }
}
