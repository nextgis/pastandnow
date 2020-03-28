import { Vue, Component, Emit, Watch } from 'vue-property-decorator';
import { Alias } from '../Detail/Detail';
import { oralModule } from '../../store/modules/oral';

interface NarrativeTypeItem {
  name: string;
}

@Component
export default class FilterPanel extends Vue {
  get specialFilters(): string[] {
    return oralModule.specialFilterSelected;
  }

  set specialFilters(val: string[]) {
    oralModule.setSpecialFilterSelected(val);
  }

  get narrativeTypesSelected(): string[] {
    return oralModule.narrativeTypeSelected;
  }

  set narrativeTypesSelected(val: string[]) {
    oralModule.setNarrativeTypeSelected(val);
  }

  get meta(): Alias[] {
    return oralModule.meta;
  }

  get specialFilterItems() {
    return this.meta
      .filter((x) => x.type === 'Special')
      .sort((a, b) => (a.text > b.text ? 1 : -1));
  }

  get narrativeTypeItems(): NarrativeTypeItem[] {
    const narrativeTypesItems: string[] = [];
    oralModule.items.forEach((x) => {
      const narrativeType = x.properties && x.properties['narrativ_t'];
      if (narrativeType) {
        const split = narrativeType.split('.').map((x) => x.trim());
        split.forEach((y) => {
          if (y && narrativeTypesItems.indexOf(y) === -1) {
            narrativeTypesItems.push(y);
          }
        });
      }
    });
    return narrativeTypesItems.sort().map((name) => ({ name }));
  }

  @Emit('close')
  close() {
    return true;
  }

  @Watch('specialFilters')
  onSpecialFilterChange(val: string[]) {
    oralModule.setSpecialFilter(val.length ? val : undefined);
  }

  @Watch('narrativeTypesSelected')
  onNarrativeChange(val: string[]) {
    oralModule.setNarrativeType(val.length ? val : undefined);
  }

  removeNarrativeType(item: NarrativeTypeItem) {
    const narrativeTypesSelected = [...this.narrativeTypesSelected];
    const index = narrativeTypesSelected.indexOf(item.name);
    if (index >= 0) {
      narrativeTypesSelected.splice(index, 1);
      this.narrativeTypesSelected = narrativeTypesSelected;
    }
  }
}
