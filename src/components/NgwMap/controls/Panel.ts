import propsBinder from './utils/propsBinder';
import findRealParent from './utils/findRealParent';
import { optionsMerger } from './utils/optionsUtils';
import Control from './mixins/Control';
import { PanelControl, PanelOptions } from './PanelControl';

export const panel = {
  name: 'LControl',
  mixins: [Control],
  mounted() {
    const options = optionsMerger(this.controlOptions, this) as PanelOptions;
    this.mapObject = new PanelControl(options);
    propsBinder(this, this.mapObject, this.$options.props);
    this.parentContainer = findRealParent(this.$parent);
    this.mapObject.setElement(this.$el);
    this.mapObject.addTo(this.parentContainer.webMap.mapAdapter.map);
  }
};
