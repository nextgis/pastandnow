// tslint:disable:max-line-length
import { GeoJsonAdapterLayerPaint } from '@nextgis/webmap';
import './icons.css';

export interface NgwIconOptions {
  shape?: 'circle' | 'brill' | 'rect' | 'marker';
  color?: string;
  size: number;
  strokeColor?: string;
}

const STROKE = 0.8;

const insertSvg = (width, height, content) => {
  return `
    <svg
      width="${width}"
      height="${height}"
      version="1.1"
      viewBox="0 0 ${width} ${height}"
      xmlns="http://www.w3.org/2000/svg"
    >
    ${content}
    </svg>
  `;
};

const OPTIONS: NgwIconOptions = {
  shape: 'circle',
  color: 'blue',
  strokeColor: 'white',
  size: 12
};

function getBrill(opt: NgwIconOptions) {
  const s = opt.size;
  const t = [s / 2, 0];
  const r = [s, s / 2];
  const b = [s / 2, s];
  const l = [0, s / 2];

  const generateD = () => {
    return [t, r, b, l].map((x) => {
      return x[0] + ' ' + x[1];
    }).join(' L');
  };

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', `M ${generateD()} Z`);

  return path;
}

function getRect(opt: NgwIconOptions) {
  const s = String(opt.size);

  const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

  rect.setAttribute('x', '0');
  rect.setAttribute('y', '0');
  rect.setAttribute('width', s);
  rect.setAttribute('height', s);

  return rect;
}

function getCircle(opt: NgwIconOptions) {
  const r = String(opt.size / 2);

  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  circle.setAttribute('cx', r);
  circle.setAttribute('cy', r);
  circle.setAttribute('r', r);

  circle.setAttribute('transform', `scale(1)`);
  return circle;
}

function getMarker(opt: NgwIconOptions) {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  const defSize = OPTIONS.size;
  const scale = opt.size / defSize;
  const stroke = defSize * (1 - STROKE);
  path.setAttribute('transform', `scale(${scale})`);
  path.setAttribute('stroke-width', String(stroke * 0.5));
  path.setAttribute('d', 'm6 0c-1.85 0-4 1.19-4 4.22 0 2.05 3.08 6.59 4 7.78 0.821-1.19 4-5.62 4-7.78 0-3.03-2.15-4.22-4-4.22z');
  return path;
}


export function getNgwIcon(opt?: NgwIconOptions): GeoJsonAdapterLayerPaint {
  opt = { ...OPTIONS, ...opt };
  const size = opt.size;
  const anchor = size / 2;
  const defSize = OPTIONS.size;
  const stroke = defSize * (1 - STROKE);

  const svgPath = {
    brill: getBrill,
    circle: getCircle,
    rect: getRect,
    marker: getMarker,
  };

  const path = svgPath[opt.shape](opt);

  path.setAttribute('fill', opt.color);
  path.setAttribute('stroke', opt.strokeColor);
  if (path.getAttribute('stroke-width') === null) {
    path.setAttribute('stroke-width', String(stroke));
  }

  return {
    icon: {
      iconSize: [size, size],
      iconAnchor: [anchor, anchor],
      html: insertSvg(size, size, path.outerHTML)
    }
  };
}
