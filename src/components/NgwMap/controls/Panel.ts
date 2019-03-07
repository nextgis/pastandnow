import propsBinder from './utils/propsBinder';
import findRealParent from './utils/findRealParent';
import { optionsMerger } from './utils/optionsUtils';
import Control from './mixins/Control';
import { PanelControl, PanelOptions } from './PanelControl';
import NgwMap from '@nextgis/ngw-map';

export const panel = {
  name: 'LControl',
  mixins: [Control],
  mounted() {
    this.parentContainer = findRealParent(this.$parent);
    const ngwMap = this.parentContainer.ngwMap as NgwMap;
    const options = optionsMerger(this.controlOptions, this) as PanelOptions;
    this.control = new PanelControl(options);
    this.mapObject = ngwMap.createControl(this.control);
    propsBinder(this, this.mapObject, this.$options.props);
    this.control.setElement(this.$el);
    ngwMap.addControl(this.mapObject, options.position);
  }
};
