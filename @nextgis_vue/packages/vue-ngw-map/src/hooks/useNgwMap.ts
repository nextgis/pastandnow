import { getCurrentInstance, ref } from 'vue';

import type { NgwMap } from '@nextgis/ngw-map';
import type { ComponentInternalInstance, Ref } from 'vue';

interface ExposedNgwMap {
  ngwMap: Ref<NgwMap>;
}

export function useNgwMap(): Ref<NgwMap | undefined> {
  const instance = getCurrentInstance();
  const ngwMapRef = ref<NgwMap>();

  if (!instance) {
    console.warn('useNgwMap must be used within a setup function.');
    return ngwMapRef;
  }

  let parent: ComponentInternalInstance | null | undefined = instance.parent;

  while (parent) {
    const exposed = parent.exposed as ExposedNgwMap | undefined;
    if (exposed && exposed.ngwMap) {
      ngwMapRef.value = exposed.ngwMap.value;
      return ngwMapRef;
    }
    parent = parent.parent;
  }

  console.warn('Cannot find `ngwMap` property in any parent component.');
  return ngwMapRef;
}
