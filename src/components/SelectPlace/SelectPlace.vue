<template>
  <VForm ref="form" v-model="formModel" class="filter-form">
    <div class="text-subtitle-1 font-weight-medium text-white mb-4">
      Выберите место
    </div>
    <VRow density="compact">
      <VCol>
        <VAutocomplete
          v-model="activePlace"
          class="filter-form__control"
          :items="items"
          :disabled="places.length < 2"
          :search="search"
          :loading="!places.length"
          item-title="text"
          item-value="value"
          variant="solo-inverted"
          density="compact"
          theme="dark"
          hide-details
          hide-no-data
          return-object
          :custom-filter="() => true"
          no-data-text="Не найдено"
          :menu-props="{ maxHeight: '400px' }"
          :bg-color="'grey-darken-3'"
        >
          <template #selection="{ item }">
            <span v-html="getItemHtml(item.raw.text)"></span>
          </template>

          <template #item="{ item, props }">
            <VListItem v-bind="props">
              <template #title>
                <span v-html="getItemHtml(item.raw.text)"></span>
              </template>
            </VListItem>
          </template>

          <template #prepend-inner>
            <VIcon color="grey-lighten-1" icon="mdi-map-marker" />
          </template>

          <template v-if="activePlace" #append-inner>
            <VIcon
              color="grey-lighten-1"
              icon="mdi-close"
              @click.stop="clearSelection"
            />
          </template>

          <template #no-data>
            <VListItem>
              <template #title>
                <span class="text-grey">Не найдено</span>
              </template>
            </VListItem>
          </template>
        </VAutocomplete>
      </VCol>
    </VRow>
  </VForm>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import {
  VAutocomplete,
  VCol,
  VForm,
  VIcon,
  VListItem,
  VRow,
} from 'vuetify/components';

import { useOralStore } from '../../store/modules/oral';
import {
  decodePlaceValue,
  encodePlaceValue,
  getPlaceLevel,
  getPlaceText,
  joinPlaceParts,
  placesFromProperties,
} from '../../utils/place';

import type { OralFeature, PlaceProperties } from '../../interfaces';

interface CountItem {
  text: string;
  value: string;
  count: number;
  level: number;
  place: Partial<PlaceProperties>;
}

const oralStore = useOralStore();
const form = ref(null);
const formModel = ref(false);
const places = ref<CountItem[]>([]);
const search = ref<string>();
const items = ref<CountItem[]>([]);
const activePlace = ref<CountItem | null>(null);

const features = computed<OralFeature[]>(() => oralStore.items);

watch(search, (val) => {
  const itemsArray: CountItem[] = [];
  const parts: string[] = searchParts(val);
  const maxItems = 100;
  for (const item of places.value) {
    if (item.level > 2) {
      const re = new RegExp(parts.map((x) => `(${x})`).join('|'), 'gi');
      const m = item.value.match(re);

      if (m && m.length >= parts.length) {
        itemsArray.push(item);
        if (itemsArray.length > maxItems) {
          break;
        }
      }
    }
  }
  itemsArray.sort((a, b) => b.count - a.count);
  items.value = itemsArray;
});

watch(activePlace, () => {
  if (activePlace.value) {
    oralStore.setActivePlace(activePlace.value.place);
  }
});

watch(features, () => {
  setPlaces();
  updateFilterValues();
});

watch(places, () => {
  const a = getActivePlace();
  if (a) {
    items.value = [a];
  }
  activePlace.value = a;
});

onMounted(() => {
  setPlaces();
  updateFilterValues();
});

const clearSelection = () => {
  activePlace.value = null;
  search.value = '';
  oralStore.setActivePlace({});
};

const updateFilterValues = () => {
  setTimeout(() => {
    if (activePlace.value) {
      oralStore.setActivePlace(activePlace.value.place);
    }
  });
};

const setPlaces = () => {
  const placesObj: Record<string, CountItem> = {};
  const plusOne = (val: string) => {
    const allParts = val.split('__');
    const collector: string[] = [];
    for (const p of allParts) {
      collector.push(p);
      const placeVal = joinPlaceParts(collector);
      const place = placesObj[placeVal];
      if (place) {
        place.count += 1;
      } else {
        const placeItem = decodePlaceValue(placeVal);
        const newPlace: CountItem = {
          count: 1,
          place: placeItem,
          value: placeVal,
          level: getPlaceLevel(placeVal),
          text: getPlaceText(placeItem),
        };
        placesObj[placeVal] = newPlace;
      }
    }
  };

  for (const i of features.value) {
    const places_ = placesFromProperties(i.properties);
    for (const place of places_) {
      const value = encodePlaceValue(place);
      const exist = placesObj[value];
      if (!exist) {
        const newPlace: CountItem = {
          count: 0,
          place,
          text: getPlaceText(place),
          level: getPlaceLevel(value),
          value,
        };
        placesObj[value] = newPlace;
      }
      plusOne(value);
    }
  }
  places.value = Object.values(placesObj);
};

const getItemHtml = (text: string): string => {
  if (search.value) {
    const searchPart = searchParts(search.value);
    for (const p of searchPart) {
      const re = new RegExp(p, 'gi');
      text = text.replace(re, (a) => `<b>${a}</b>`);
    }
  }
  return `<span>${text}</span>`;
};

const searchParts = (val?: string): string[] => {
  const str = val ? val.replace(/,/g, ' ') : '';
  return str
    .split(' ')
    .map((x) => x.trim())
    .filter(Boolean);
};

const getActivePlace = (): CountItem | null => {
  const encode = encodePlaceValue(oralStore.activePlace);
  const parts = encode.split('__');
  for (let fry = 0; fry < parts.length; fry++) {
    const v = parts.slice(0, parts.length - fry);
    const place = places.value.find((p) => {
      return p.value === joinPlaceParts(v);
    });
    if (place) {
      return place;
    }
  }
  return null;
};
</script>

<style lang="scss" scoped>
.filter-form {
  padding: 20px;
  font-size: 14px;

  &__control + &__control {
    margin-top: 10px;
  }

  :deep(.v-field__input) {
    min-height: 36px;
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
