// tslint:disable:max-line-length
import { GeoJsonAdapterLayerPaint } from '@nextgis/webmap';

const svgPath: {[name: string]: string | GetPathCb} = {
  brill: '<path d="m6 0-5 6 5 6 5-6z"/>',
  circle: '<circle cx="6" cy="6" r="6"/>',
  rect: '<rect width="12" height="12"/>',
  marker: '<path d="m6 0c-1.85 0-4 1.19-4 4.22 0 2.05 3.08 6.59 4 7.78 0.821-1.19 4-5.62 4-7.78 0-3.03-2.15-4.22-4-4.22z"/>',
  cross: '<path d="M 2.4,12 6,8.4 9.6,12 12,9.6 8.4,6 12,2.4 9.6,0 6,3.6 2.4,0 0,2.4 3.6,6 0,9.6 Z"/>',
  star: '<path d="m6 0.25 1.71 4.18 4.29-1.04e-4 -3.43 3.14 0.857 4.18-3.43-3.14-3.43 3.14 0.857-4.18-3.43-3.14 4.29-0.209z"/>',
  triangle: '<path d="m12 11.7h-12l6-11.2z"/>',
  pluse: '<path d="m7.5 12v-4.5h4.5v-3h-4.5v-4.5h-3v4.5h-4.5v3h4.5v4.5z"/>',
  minuse: '<path d="m12 7.5v-3h-12v3z"/>',
  asterisk: '<path d="m7.59 12v-3.27l2.83 1.64 1.58-2.74-2.85-1.64 2.83-1.64-1.56-2.74-2.83 1.64v-3.24h-3.17v3.24l-2.85-1.64-1.57 2.74 2.84 1.64-2.84 1.64 1.57 2.74 2.85-1.64v3.27z"/>',
};

export interface NgwIconOptions {
  shape?: 'circle' | 'brill' | 'rect' | 'marker' | 'star' | 'asterisk' | 'triangle' | 'pluse' | 'minuse';
  color?: string;
  size: number;
  strokeColor?: string;
}

const STROKE = 0.8;

function insertSvg(width, height, content?): SVGSVGElement {

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('width', String(width));
  svg.setAttribute('height', String(height));
  svg.setAttribute('version', '1.1');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  if (content) {
    svg.innerHTML = content;
  }
  return svg;
}

const OPTIONS: NgwIconOptions = {
  shape: 'circle',
  color: 'blue',
  strokeColor: 'white',
  size: 12
};

type GetPathCb = (opt?: NgwIconOptions) => string;

export function getNgwIcon(opt?: NgwIconOptions): GeoJsonAdapterLayerPaint {
  opt = { ...OPTIONS, ...opt };
  const size = opt.size;
  const anchor = size / 2;
  const defSize = 12;
  const stroke = STROKE; // size * (1 - STROKE);

  const pathAlias = svgPath[opt.shape] || 'circle';

  const path = typeof pathAlias === 'string' ? pathAlias : pathAlias(opt);
  const svg = insertSvg(size, size, path);
  const fistChild = svg.firstChild as SVGElement;
  const scale = opt.size / defSize;

  fistChild.setAttribute('fill', opt.color);
  fistChild.setAttribute('stroke', opt.strokeColor);
  fistChild.setAttribute('stroke-width', String(stroke));
  fistChild.setAttribute('transform', `scale(${scale})`);

  return {
    icon: {
      iconSize: [size, size],
      iconAnchor: [anchor, anchor],
      html: svg.outerHTML
    }
  };
}
