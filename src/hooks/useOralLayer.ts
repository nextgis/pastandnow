import { type GeoJSONSource, Marker } from 'maplibre-gl';

import { useAppStore } from '../store/modules/app';
import { useOralStore } from '../store/modules/oral';
import { donutSegment } from '../utils/donutSegment';
import { getPathPaint } from '../utils/getHistoryPaint';

import type { Expression } from '@nextgis/expression';
import type {
  FeatureLayerAdapter,
  GeoJsonAdapterOptions,
  VectorAdapterLayerType,
} from '@nextgis/webmap';
import type { Feature, FeatureCollection, Point } from 'geojson';

import type { OralFeature, OralGeomType, OralProperties } from '../interfaces';

interface ClusterFeatureProps {
  cluster: true;
  cluster_id: number;
  point_count: number;
  point_count_abbreviated: string;
}

type ClusterFeature = Feature<Point, ClusterFeatureProps>;

// based on https://maplibre.org/maplibre-gl-js/docs/examples/cluster-html/
export function useOralLayer() {
  const app = useAppStore();
  const maxZoom = 12;
  const defColor = 'gray';
  const markers: Record<string, any> = {};
  let markersOnScreen: Record<string, any> = {};

  let onRender: null | (() => void) = null;

  const prepareLayerData = (
    features: OralFeature[],
    geom: OralGeomType = 'point',
  ): FeatureCollection => {
    const forMap: Feature[] = [];
    for (const x of features) {
      forMap.push({
        type: x.type,
        id: x.id,
        geometry: x.geometry,
        properties: {
          id1: x.properties.id1,
          type: x.properties.type,
          name: x.properties.name,
          geo: x.properties.geo || geom,
        },
      });
    }
    return { type: 'FeatureCollection', features: forMap };
  };

  const drawOralLayer = async (geo: OralGeomType, features: OralFeature[]) => {
    const layerId = app.layers[geo];
    const sourceId = 'ngw:' + geo;
    const layer = app.ngwMap?.getLayer(
      layerId,
    ) as FeatureLayerAdapter<OralProperties>;
    if (!layer) {
      const typeAlias: Record<OralGeomType, VectorAdapterLayerType> = {
        point: 'point',
        poly: 'polygon',
        line: 'line',
      };
      const data = prepareLayerData(features, geo);

      const attrColors: Record<string, string> = {};
      const attrStrokeColors: Record<string, string> = {};
      features.forEach((feature) => {
        const type = feature.properties.type;
        if (attrColors[type]) {
          return;
        }
        const pathPaint = getPathPaint(
          feature,
          { weight: 2, fillOpacity: 0.4 },
          true,
        );
        if (pathPaint.color) {
          attrColors[type] = String(pathPaint.color);
          attrStrokeColors[type] = String(
            pathPaint.strokeColor || pathPaint.color,
          );
        }
      });

      const types = Object.keys(attrColors);
      if (!types.length) {
        return;
      }
      const clusterProperties: Record<string, any> = {};
      types.forEach((t) => {
        clusterProperties[t] = [
          '+',
          ['case', ['==', ['get', 'type'], t], 1, 0],
        ];
      });

      const colorMatch: Expression = [
        'match',
        ['get', 'type'],
        ...Object.entries(attrColors).flat(),
        defColor, // default value
      ];
      const strokeColorMatch: Expression = [
        'match',
        ['get', 'type'],
        ...Object.entries(attrStrokeColors).flat(),
        defColor, // default value
      ];

      const adapterOptions: GeoJsonAdapterOptions<OralFeature> = {
        id: geo,
        name: layerId,
        source: sourceId,
        order: 10000,
        type: typeAlias[geo] || 'point',
        paint: {
          stroke: true,
          strokeColor: strokeColorMatch,
          color: colorMatch,
          weight: 2,
          opacity: 0.8,
        },
        selectedPaint: {
          stroke: true,
          strokeColor: strokeColorMatch,
          color: colorMatch,
          weight: 4,
          opacity: 1,
        },
        waitFullLoad: true,
        selectable: true,
        unselectOnSecondClick: true,
        visibility: true,
        labelField: 'name',
        labelOnHover: true,
        // nativeFilter: ['!=', 'cluster', true],
        onSelect: (e) => {
          if (e.type !== 'api') {
            const feature = e.features && e.features[0];
            const id = feature
              ? feature.properties
                ? Number(feature.properties.id1)
                : null
              : null;
            useOralStore().setDetail(id);
          }
        },
      };

      const map = app.ngwMap?.mapAdapter.map;
      if (map && data) {
        const source = map.getSource(sourceId) as GeoJSONSource;
        if (source) {
          source.setData(data);
        } else {
          map.addSource(sourceId, {
            type: 'geojson',
            data,
            cluster: true,
            clusterMaxZoom: maxZoom - 1,
            clusterRadius: 80,
            clusterProperties,
          });
        }

        if (map.getLayer(`cluster-${geo}`)) {
          map.removeLayer(`cluster-${geo}`);
        }
        function createDonutChart(props: ClusterFeatureProps) {
          const types = Object.keys(attrColors);
          let computedSum = 0;
          const offsets: number[] = [];
          const counts: number[] = [];

          for (const type of types) {
            const count = Number(props[type as keyof ClusterFeatureProps]) || 0;
            offsets.push(computedSum);
            counts.push(count);
            computedSum += count;
          }
          const actualTotal = props.point_count;
          const remainder = actualTotal - computedSum;
          const total = actualTotal;

          if (remainder > 0) {
            offsets.push(computedSum);
            counts.push(remainder);
          }

          const fontSize =
            total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
          const r =
            total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;
          const r0 = Math.round(r * 0.6);
          const w = r * 2;
          let html = `<div><svg width="${w}" height="${w}" viewBox="0 0 ${w} ${w}" text-anchor="middle" style="font: ${fontSize}px sans-serif; display: block">`;

          let index = 0;
          for (const type of types) {
            const color = attrColors[type];
            html += donutSegment(
              offsets[index] / total,
              (offsets[index] + counts[index]) / total,
              r,
              r0,
              color,
            );
            index++;
          }
          if (remainder > 0) {
            html += donutSegment(
              offsets[index] / total,
              (offsets[index] + counts[index]) / total,
              r,
              r0,
              defColor,
            );
          }

          html += `<circle cx="${r}" cy="${r}" r="${r0}" fill="white" />
            <text dominant-baseline="central" transform="translate(${r}, ${r})">
              ${total}
            </text>
            </svg>
            </div>`;

          const el = document.createElement('div');
          el.innerHTML = html;
          return el.firstChild as HTMLElement;
        }
        function updateClusterMarkers() {
          if (!map) return;
          const source = map.getSource(sourceId) as GeoJSONSource;
          if (!source) return;

          const features = map.querySourceFeatures(sourceId, {
            filter: ['has', 'point_count'],
          }) as unknown as ClusterFeature[];
          const newMarkers: Record<string, any> = {};
          features.forEach((feature) => {
            const coords = feature.geometry.coordinates;
            const props = feature.properties;

            const clusterId = props.cluster_id;
            let marker: Marker = markers[clusterId];
            if (!marker) {
              const el = createDonutChart(props);

              el.addEventListener('click', () => {
                const map = app.ngwMap?.mapAdapter.map;
                if (!map) return;
                const source = map.getSource(sourceId) as GeoJSONSource;
                source.getClusterExpansionZoom(props.cluster_id).then((e) => {
                  map.easeTo({
                    center: coords as [number, number],
                    zoom: e,
                  });
                });
              });
              marker = markers[clusterId] = new Marker({
                element: el,
              }).setLngLat(coords as [number, number]);
            }
            newMarkers[clusterId] = marker;
            if (!markersOnScreen[clusterId]) {
              marker.addTo(map);
            }
          });

          for (const id in markersOnScreen) {
            if (!newMarkers[id]) markersOnScreen[id].remove();
          }
          markersOnScreen = newMarkers;
        }

        if (onRender) {
          map.off('render', onRender);
        }
        onRender = () => {
          if (!map.isSourceLoaded(sourceId)) return;
          const zoom = map.getZoom();
          if (zoom >= maxZoom) {
            for (const id in markersOnScreen) {
              markersOnScreen[id].remove();
            }
            markersOnScreen = {};
            return;
          }
          updateClusterMarkers();
        };

        map.on('render', onRender);

        await app.ngwMap?.addGeoJsonLayer(adapterOptions);
        app.setLayer(geo, geo);
      }
    } else if (layer.propertiesFilter) {
      const map = app.ngwMap?.mapAdapter.map;
      const source = map?.getSource(sourceId) as GeoJSONSource;
      if (source) {
        const data = prepareLayerData(features, geo);

        source.setData(data);
      }
    }
  };

  return { drawOralLayer, prepareLayerData };
}
