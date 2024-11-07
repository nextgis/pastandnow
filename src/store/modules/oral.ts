import { featureFilter } from '@nextgis/properties-filter';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

import { DEFAULT_PLACE, PLACE_KEYS } from '../../constants';
import {
  fetchOralFeature,
  getLayerFeatures,
  getLayerMeta,
  getLayerStoryItems,
  getNgwPhotos,
} from '../../services/ngw';
import { sortFeatures } from '../utils/sortFeatures';

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
import type {
  PropertiesFilter,
  PropertyFilter,
} from '@nextgis/properties-filter';

export const useOralStore = defineStore('oral', () => {
  const items = ref<OralPointFeature[]>([]);
  const filtered = ref<OralPointFeature[]>([]);
  const photos = ref<OralPhotoProperties[]>([]);
  const meta = ref<LayerMetaItem[]>([]);
  const detailItem = ref<OralFeature | null>(null);
  const featuresLoading = ref(false);
  const narrativeTypeSelected = ref<string[]>([]);
  const specialFilterSelected = ref<string[]>([]);
  const listSearchText = ref('');
  const activeTypes = ref<string[] | false>([]);
  const activePlace = ref<Partial<PlaceProperties>>({
    cntry: 'Россия',
    city: 'Москва',
    region: 'Московская обл.',
  });
  const legendItems = ref<LegendItem[]>([]);
  const filterData = ref<FilterData>({ narrativeTypeItems: {} });
  const filters = ref<FilterProperties>({
    fullText: undefined,
    city: undefined,
    rayon: undefined,
    region: undefined,
    cntry: undefined,
    type: undefined,
    specialFilter: undefined,
  });
  const searchReady = ref(false);

  const features = computed(() => filtered.value);

  const activePlaceItems = computed(() => {
    const placeFilters: PropertiesFilter[] = [];
    PLACE_KEYS.forEach((key) => {
      const filter = filters.value[key];
      if (filter) {
        placeFilters.push(filter);
      }
    });
    return items.value.filter((item) => featureFilter(item, placeFilters));
  });

  const propertiesFilter = computed(() => {
    // @ts-expect-error Type instantiation is excessively deep and possibly infinite.
    const values = Object.values(filters.value);
    return values.filter(Boolean);
  });

  const sortedFeatures = computed(() => {
    return sortFeatures([...filtered.value] as OralFeature[]);
  });

  // Actions
  const getAllItems = async () => {
    setFeaturesLoading(true);
    await setMeta();
    const features = await getLayerFeatures();
    setFeaturesLoading(false);
    _setItems(features);
  };

  const setItems = async (features: OralPointFeature[]) => {
    await setMeta();
    _setItems(features);
  };

  const loadStories = async () => {
    setSearchReady(false);
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
    setSearchReady(true);
    _setItems(updatedFeatures);
  };

  const setMeta = async () => {
    const metadata = await getLayerMeta();
    _setMeta(metadata);
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
    _setPhotos(photosFromLayer);
  };

  const updateFilter = (newFilters: Partial<FilterProperties>) => {
    _updateFilter({ ...filters.value, ...newFilters });
  };

  const resetNonPlaceFilter = () => {
    const resetFilters = { ...filters.value };
    Object.keys(resetFilters).forEach((key) => {
      if (!PLACE_KEYS.includes(key as keyof PlaceProperties)) {
        resetFilters[key as keyof FilterProperties] = undefined;
      }
    });
    setListSearchText('');
    resetSpecialFilter();
    setActiveTypes(legendItems.value.map((item) => item.name));
    _updateFilter(resetFilters);
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
      _updateFilter({ ...filters.value, fullText: undefined });
      return;
    }
    const meta = await getLayerMeta();
    const searchFields = meta
      .filter((item) => item.search)
      .map((item) => item.value);
    const propertiesFilter: PropertiesFilter = ['any'];
    searchFields.forEach((field) => {
      propertiesFilter.push([`%${field}%`, 'ilike', query]);
    });
    _updateFilter({ ...filters.value, fullText: propertiesFilter });
  };

  const setTypesFilter = (types: string[] | undefined) => {
    _updateFilter({
      ...filters.value,
      type: types ? [['type', 'in', types]] : undefined,
    });
  };

  const setSpecialFilter = (selected: string[] = []) => {
    const properties: PropertyFilter[] = selected.map((value) => [
      value,
      'eq',
      '1',
    ]);
    _updateFilter({
      ...filters.value,
      specialFilter: selected.length ? ['any', ...properties] : undefined,
    });
  };

  const setNarrativeType = (selected: string[] | undefined) => {
    const properties: PropertyFilter[] =
      selected?.map((value) => ['%narrativ_t%', 'ilike', value]) || [];
    _updateFilter({
      ...filters.value,
      narrativeType: selected ? ['any', ...properties] : undefined,
    });
  };

  const setLegend = (legendItem: LegendItem) => {
    const newLegendItems = [...legendItems.value];
    if (!legendItems.value.find((item) => item.name === legendItem.name)) {
      // @ts-expect-error Type instantiation is excessively deep and possibly infinite.
      newLegendItems.push(legendItem);
      activeTypes.value = legendItems.value.map((item) => item.name);
    }
    legendItems.value = newLegendItems;
  };

  const setDetail = async (id1: number | string | null) => {
    const item = filtered.value.find(
      (item) => String(item.properties.id1) === String(id1),
    );
    if (id1 && !item) {
      const feature = await fetchOralFeature(id1);
      _setDetail(feature ?? null);
      return feature;
    }
    _setDetail(item ?? null);
    return item;
  };

  const setActivePlace = (place: Partial<PlaceProperties> | null) => {
    let activePlace: Partial<PlaceProperties> = {};
    const parts = PLACE_KEYS;
    if (place === null) {
      activePlace = DEFAULT_PLACE;
    } else {
      for (const k of parts) {
        if (k in place) {
          activePlace[k] = place[k];
        }
      }
    }

    // if place part field is a list X1,X2,Xn
    const ilikeFilterParts: (keyof PlaceProperties)[] = ['rayon'];
    const placeFilters: Partial<FilterProperties> = {};
    for (const p of parts) {
      const placePart = activePlace[p];
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
    _setActivePlace(place || DEFAULT_PLACE);
    updateFilter(placeFilters);
  };

  const setSearchReady = (ready: boolean) => {
    searchReady.value = ready;
  };

  const setFeaturesLoading = (loading: boolean) => {
    featuresLoading.value = loading;
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

  const _updateFilter = (newFilters: FilterProperties) => {
    const filteredItems = items.value.filter((item) =>
      featureFilter(item, Object.values(newFilters).filter(Boolean)),
    );
    filtered.value = filteredItems;
    const currentDetail = detailItem.value;
    if (
      currentDetail &&
      !filteredItems.find(
        (item) => item.properties.id1 === currentDetail.properties.id1,
      )
    ) {
      _setDetail(null);
    }
    filters.value = newFilters;
  };

  const _setItems = (newItems: OralPointFeature[]) => {
    items.value = newItems;
  };

  const _setDetail = (item: OralFeature | null) => {
    console.log(item);
    detailItem.value = item;
  };

  const _setActivePlace = (place: Partial<PlaceProperties>) => {
    activePlace.value = place;
  };

  const _setMeta = (newMeta: LayerMetaItem[]) => {
    meta.value = newMeta;
  };

  const _setPhotos = (newPhotos: OralPhotoProperties[]) => {
    photos.value = newPhotos;
  };

  return {
    meta,
    items,
    photos,
    filters,
    filtered,
    features,
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
    propertiesFilter,
    specialFilterSelected,
    narrativeTypeSelected,
    setNarrativeTypeSelected,
    setSpecialFilterSelected,
    resetNonPlaceFilter,
    setFeaturesLoading,
    setListSearchText,
    resetSpecialFilter,
    setFullTextFilter,
    setSpecialFilter,
    setNarrativeType,
    setActivePlace,
    setSearchReady,
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
