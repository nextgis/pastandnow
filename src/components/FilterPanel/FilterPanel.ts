import { Vue, Component, Emit, Watch } from 'vue-property-decorator';
import { oralModule } from '../../store/modules/oral';
import { LayerMetaItem } from 'src/api/interfaces';

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

  get meta(): LayerMetaItem[] {
    return oralModule.meta;
  }

  get specialFilterItems(): LayerMetaItem[] {
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
  close(): boolean {
    return true;
  }

  @Watch('specialFilters')
  onSpecialFilterChange(val: string[]): void {
    oralModule.setSpecialFilter(val.length ? val : undefined);
  }

  @Watch('narrativeTypesSelected')
  onNarrativeChange(val: string[]): void {
    oralModule.setNarrativeType(val.length ? val : undefined);
  }

  removeNarrativeType(item: NarrativeTypeItem): void {
    const narrativeTypesSelected = [...this.narrativeTypesSelected];
    const index = narrativeTypesSelected.indexOf(item.name);
    if (index >= 0) {
      narrativeTypesSelected.splice(index, 1);
      this.narrativeTypesSelected = narrativeTypesSelected;
    }
  }
}
