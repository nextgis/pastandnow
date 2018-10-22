export const collectionCleaner = (options) => {
  const result = {};
  for (const key in options) {
    if (options.hasOwnProperty(key)) {
      const value = options[key];
      if (value !== null && value !== undefined) {
        result[key] = value;
      }
    }
  }
  return result;
};

export const optionsMerger = (props, instance) => {
  const options = instance.options && instance.options.constructor === Object ? instance.options : {};
  props = props && props.constructor === Object ? props : {};
  const result = { ...collectionCleaner(options) };
  props = collectionCleaner(props);
  const defaultProps = instance.$options.props;
  for (const key in props) {
    if (props.hasOwnProperty(key)) {
      const def = defaultProps[key] ? defaultProps[key].default : Symbol('unique');
      if (result[key] && def !== props[key]) {
        console.warn(`${key} props is overriding the value passed in the options props`);
        result[key] = props[key];
      } else if (!result[key]) {
        result[key] = props[key];
      }
    }
  }
  return result;
};
