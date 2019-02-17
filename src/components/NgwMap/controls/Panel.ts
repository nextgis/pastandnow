import propsBinder from './utils/propsBinder';
import findRealParent from './utils/findRealParent';
import { optionsMerger } from './utils/optionsUtils';
import Control from './mixins/Control';
import { PanelControl, PanelOptions } from './PanelControl';
import WebMap from '@nextgis/webmap';

export const panel = {
  name: 'LControl',
  mixins: [Control],
  mounted() {
    this.parentContainer = findRealParent(this.$parent);
    const webMap = this.parentContainer.webMap as WebMap;
    const options = optionsMerger(this.controlOptions, this) as PanelOptions;
    this.control = new PanelControl(options);
    this.mapObject = webMap.createControl(this.control);
    propsBinder(this, this.mapObject, this.$options.props);
    this.control.setElement(this.$el);
    webMap.addControl(this.mapObject, options.position);
  }
};
