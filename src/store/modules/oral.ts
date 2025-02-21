import { featureFilter } from '@nextgis/properties-filter';
import { debounce } from '@nextgis/utils';
import { defineStore } from 'pinia';
import { computed, ref, shallowRef, watch } from 'vue';

import { DEFAULT_PLACE, PLACE_KEYS } from '../../constants';
import {
  fetchOralFeature,
  getLayerFeatures,
  getLayerMeta,
  getLayerStoryItems,
  getNgwPhotos,
} from '../../services/ngw';
import { sortFeatures } from '../utils/sortFeatures';

import type {
  PropertiesFilter,
  PropertyFilter,
} from '@nextgis/properties-filter';

import type { FilterData } from '../../../scripts/FilterData';
import type {
  FilterProperties,
  LayerMetaItem,
  LegendItem,
  OralFeature,
  OralPhotoProperties,
  OralPointFeature,
  PlaceProperties,
} from '../../interfaces';

export const useOralStore = defineStore('oral', () => {
  const items = shallowRef<OralPointFeature[]>([]);
  const photos = shallowRef<OralPhotoProperties[]>([]);
  const meta = shallowRef<LayerMetaItem[]>([]);
  const detailItem = shallowRef<OralFeature | null>(null);
  const featuresLoading = ref(false);
  const narrativeTypeSelected = ref<string[]>([]);
  const specialFilterSelected = ref<string[]>([]);
  const listSearchText = ref('');
  const activeTypes = ref<string[] | false>([]);
  const activePlace = ref<Partial<PlaceProperties>>();
  const legendItems = shallowRef<LegendItem[]>([]);
  const filterData = ref<FilterData>({ narrativeTypeItems: {} });
  const filters = shallowRef<FilterProperties>({
    fullText: undefined,
    city: undefined,
    rayon: undefined,
    region: undefined,
    cntry: undefined,
    type: undefined,
    specialFilter: undefined,
  });
  const searchReady = ref(false);

  watch(
    filters,
    debounce((newFilters: FilterProperties) => {
      filters.value = newFilters;
    }, 50),
    { deep: true },
  );

  const filtered = computed(() => {
    const activeFilters = Object.values(filters.value).filter(Boolean);

    return items.value.filter((item) => featureFilter(item, activeFilters));
  });

  const activePlaceItems = computed(() => {
    const placeFilters: PropertiesFilter[] = [];
    PLACE_KEYS.forEach((key) => {
      const filter = filters.value[key] as PropertiesFilter;
      if (filter) {
        placeFilters.push(filter);
      }
    });
    return items.value.filter((item) => featureFilter(item, placeFilters));
  });

  const sortedFeatures = computed(() => {
    return sortFeatures([...filtered.value] as OralFeature[]);
  });

  watch(filtered, (newFiltered) => {
    if (
      detailItem.value &&
      !newFiltered.find(
        (item) =>
          String(item.properties.id1) ===
          String(detailItem.value?.properties.id1),
      )
    ) {
      detailItem.value = null;
    }
  });

  const getAllItems = async () => {
    featuresLoading.value = true;
    try {
      await setMeta();
      const features = await getLayerFeatures();
      items.value = features;
    } finally {
      featuresLoading.value = false;
    }
  };

  const setItems = async (features: OralPointFeature[]) => {
    await setMeta();
    items.value = features;
  };

  const loadStories = async () => {
    searchReady.value = false;
    const updatedFeatures: OralPointFeature[] = [];
    const itemsFromLayer = await getLayerStoryItems();
    items.value.forEach((item) => {
      const storyIndex = itemsFromLayer.findIndex(
        (storyItem) => storyItem.fields.id1 === item.properties.id1,
      );
      const updatedFeature = { ...item };
      if (storyIndex !== -1) {
        const story = itemsFromLayer.splice(storyIndex, 1)[0];
        updatedFeature.properties = { ...item.properties, ...story.fields };
      }
      updatedFeatures.push(updatedFeature);
    });
    searchReady.value = true;
    items.value = updatedFeatures;
  };

  const setMeta = async () => {
    const metadata = await getLayerMeta();
    meta.value = metadata;
  };

  const setDetailById = async (id: string | number) => {
    const feature = await fetchOralFeature(id);
    if (feature) {
      if (
        activeTypes.value &&
        !activeTypes.value.includes(feature.properties.type)
      ) {
        setActiveTypes([...(activeTypes.value || []), feature.properties.type]);
        setTypesFilter(activeTypes.value as string[]);
      }
      setActivePlace(feature.properties);
      if (
        !items.value.some(
          (item) =>
            String(item.properties.id1) === String(feature.properties.id1),
        )
      ) {
        setItems([...items.value, feature]);
      }
      setDetail(feature.properties.id1);
      return feature;
    }
  };

  const getPhotos = async () => {
    const photosFromLayer = await getNgwPhotos();
    photos.value = photosFromLayer;
  };

  const updateFilter = (newFilters: Partial<FilterProperties>) => {
    filters.value = { ...filters.value, ...newFilters };
  };

  const resetNonPlaceFilter = () => {
    const resetFilters = { ...filters.value } as FilterProperties;
    Object.keys(resetFilters).forEach((key) => {
      if (!PLACE_KEYS.includes(key as keyof PlaceProperties)) {
        resetFilters[key as keyof FilterProperties] = undefined;
      }
    });
    setListSearchText('');
    resetSpecialFilter();
    const newActiveTypes = legendItems.value.map((item) => item.name);
    setActiveTypes(newActiveTypes);
    filters.value = resetFilters;
  };

  const resetSpecialFilter = () => {
    setSpecialFilterSelected(
      meta.value
        .filter((item) => item.type === 'Special')
        .map((item) => item.value),
    );
  };

  const setFullTextFilter = async (query: string) => {
    if (!query) {
      filters.value = { ...filters.value, fullText: undefined };
      return;
    }
    const metaData = await getLayerMeta();
    const searchFields = metaData
      .filter((item) => item.search)
      .map((item) => item.value);
    const propertiesFilter: PropertiesFilter = ['any'];
    searchFields.forEach((field) => {
      propertiesFilter.push([`%${field}%`, 'ilike', query]);
    });
    filters.value = { ...filters.value, fullText: propertiesFilter };
  };

  const setTypesFilter = (types: string[] | undefined) => {
    filters.value = {
      ...filters.value,
      type: types ? [['type', 'in', types]] : undefined,
    };
  };

  const setSpecialFilter = (selected: string[] = []) => {
    const properties: PropertyFilter[] = selected.map((value) => [
      value,
      'eq',
      '1',
    ]);
    filters.value = {
      ...filters.value,
      specialFilter: selected.length ? ['any', ...properties] : undefined,
    };
  };

  const setNarrativeType = (selected: string[] | undefined) => {
    const properties: PropertyFilter[] =
      selected?.map((value) => ['%narrativ_t%', 'ilike', value]) || [];
    filters.value = {
      ...filters.value,
      narrativeType: selected ? ['any', ...properties] : undefined,
    };
  };

  const setLegend = (legendItem: LegendItem) => {
    const newLegendItems = [...legendItems.value];

    if (!legendItems.value.find((item) => item.name === legendItem.name)) {
      newLegendItems.push(legendItem);
      activeTypes.value = newLegendItems.map((item) => item.name);
      legendItems.value = newLegendItems;
    }
  };

  const setDetail = async (id1: number | string | null) => {
    const item = filtered.value.find(
      (item) => String(item.properties.id1) === String(id1),
    );
    if (id1 && !item) {
      const feature = await fetchOralFeature(id1);
      detailItem.value = feature ?? null;
      return feature;
    }
    detailItem.value = item ?? null;
    return item;
  };

  const setActivePlace = (place: Partial<PlaceProperties> | null) => {
    let newActivePlace: Partial<PlaceProperties> = {};
    const parts = PLACE_KEYS;
    if (place === null) {
      newActivePlace = DEFAULT_PLACE;
    } else {
      for (const k of parts) {
        if (k in place) {
          newActivePlace[k] = place[k];
        }
      }
    }

    // if place part field is a list X1,X2,Xn
    const ilikeFilterParts: (keyof PlaceProperties)[] = ['rayon'];
    const placeFilters: Partial<FilterProperties> = {};
    for (const p of parts) {
      const placePart = newActivePlace[p];
      if (placePart) {
        if (ilikeFilterParts.includes(p)) {
          placeFilters[p] = [[p, 'ilike', `%${placePart}%`]];
        } else {
          placeFilters[p] = [[p, 'eq', placePart]];
        }
      } else {
        placeFilters[p] = undefined;
      }
    }
    activePlace.value = place || DEFAULT_PLACE;
    updateFilter(placeFilters);
  };

  const setFilterData = (data: FilterData) => {
    filterData.value = data;
  };

  const setListSearchText = (text: string) => {
    listSearchText.value = text;
  };

  const setActiveTypes = (types: string[]) => {
    activeTypes.value = types;
  };

  const setSpecialFilterSelected = (selected: string[]) => {
    specialFilterSelected.value = selected;
  };

  const setNarrativeTypeSelected = (selected: string[]) => {
    narrativeTypeSelected.value = selected;
  };

  return {
    meta,
    items,
    photos,
    filters,
    filtered,
    detailItem,
    filterData,
    activePlace,
    searchReady,
    legendItems,
    activeTypes,
    sortedFeatures,
    listSearchText,
    featuresLoading,
    activePlaceItems,
    specialFilterSelected,
    narrativeTypeSelected,
    setNarrativeTypeSelected,
    setSpecialFilterSelected,
    resetNonPlaceFilter,
    setListSearchText,
    resetSpecialFilter,
    setFullTextFilter,
    setSpecialFilter,
    setNarrativeType,
    setActivePlace,
    setFilterData,
    setTypesFilter,
    setActiveTypes,
    setDetailById,
    updateFilter,
    loadStories,
    getAllItems,
    setLegend,
    setDetail,
    getPhotos,
    setItems,
    setMeta,
  };
});
