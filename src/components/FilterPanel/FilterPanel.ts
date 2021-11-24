/* eslint-disable @typescript-eslint/member-ordering */
import { Vue, Component, Emit, Watch } from 'vue-property-decorator';
import { oralModule } from '../../store/modules/oral';

import type { NarrativeTypeItem } from '../../interfaces';
import type { LayerMetaItem } from '../../interfaces';

@Component
export default class FilterPanel extends Vue {
  get meta(): LayerMetaItem[] {
    return oralModule.meta;
  }

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

  get allSpecialFilters(): boolean {
    return this.specialFilters.length === this.specialFilterItems.length;
  }

  set allSpecialFilters(val: boolean) {
    if (val) {
      oralModule.resetSpecialFilter();
    } else {
      oralModule.setSpecialFilterSelected([]);
    }
  }

  get specialFilterItems(): LayerMetaItem[] {
    return this.meta
      .filter((x) => x.type === 'Special')
      .sort((a, b) => (a.text > b.text ? 1 : -1));
  }

  get narrativeTypeItems(): NarrativeTypeItem[] {
    const types =
      oralModule.filterData.narrativeTypeItems[oralModule.activeCity];
    return (types || []).map((name) => ({ name }));
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
