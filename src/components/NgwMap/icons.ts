import { GeoJsonAdapterLayerPaint } from '@nextgis/webmap';
import './icons.css';

export interface NgwIconOptions {
  shape?: 'circle';
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

function getBril(opt: NgwIconOptions) {
  const s = opt.size;
  const d = s * (1 - STROKE);
  const t = [[s / 2, 0], [s / 2, d]];
  const r = [[s, s / 2], [s - d, s / 2]];
  const b = [[s / 2, s], [s / 2, s - d]];
  const l = [[0, s / 2], [d, s / 2]];

  const generateD = (inside?: boolean) => {
    const i = inside ? 1 : 0;
    return [t, r, b, l].map((x) => {
      return x[i][0] + ' ' + x[i][1];
    }).join(' L');
  };

  return `
    <path d="M ${generateD()} Z"
      fill="${opt.strokeColor}"
      stroke-width="0"
    />
    <path d="M ${generateD(true)} Z"
    fill="${opt.color}"
    stroke-width="0"
  />
  `;
}

function getRect(opt: NgwIconOptions) {
  const s = opt.size;
  const anchor = s / 2;
  const d = (s / 2) * (1 - STROKE);
  const r = s * STROKE;

  return `
    <rect x="0" y="0" width="${s}" height="${s}" fill="${opt.strokeColor}" stroke-width="0"/>
    <rect x="${d}" y="${d}" width="${r}" height="${r}" fill="${opt.color}" stroke-width="0"/>
  `;
}

function getCircle(opt: NgwIconOptions) {
  const size = opt.size;
  const anchor = size / 2;
  const r = anchor;
  const icoR = r * STROKE;

  return `
    <circle cx="${r}" cy="${r}" r="${r}" fill="${opt.strokeColor}" stroke-width="0"/>
    <circle cx="${r}" cy="${r}" r="${icoR}" fill="${opt.color}" stroke-width="0"/>
  `;
}


export function getNgwIcon(opt?: NgwIconOptions): GeoJsonAdapterLayerPaint {
  opt = { ...OPTIONS, ...opt };
  const size = opt.size;
  const anchor = size / 2;

  const svgPath = {
    brill: getBril,
    circle: getCircle,
    rect: getRect
  };

  return {
    icon: {
      iconSize: [size, size],
      iconAnchor: [anchor, anchor],
      html: insertSvg(size, size, svgPath[opt.shape](opt))
    }
  };
}
