import { watch } from 'vue';

export const capitalizeFirstLetter = (s: string) => {
  if (!s || typeof s.charAt !== 'function') {
    return s;
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function propsBinder(
  methods: Record<string, any>,
  props: Record<string, any>,
): void {
  for (const key in props) {
    const setMethodName = 'set' + capitalizeFirstLetter(key);
    if (key in props && methods[setMethodName]) {
      const prop = props[key];
      const deepValue =
        (prop && prop.type === Object) ||
        prop.type === Array ||
        Array.isArray(prop.type);
      watch(
        () => methods.key,
        (newVal, oldVal) => {
          methods[setMethodName](newVal, oldVal);
        },
        {
          deep: deepValue,
        },
      );
    }
  }
}
