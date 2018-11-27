import { GeoJsonAdapterLayerPaint } from '@nextgis/webmap';
import './icons.css';

export interface NgwIconOptions {
  shape?: 'circle';
  color?: string;
  size: number;
  strokeColor?: string;
}

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


export function getNgwIcon(opt?: NgwIconOptions): GeoJsonAdapterLayerPaint {
  opt = {...OPTIONS, ...opt};
  const size = opt.size;
  const anchor = size / 2;

  const r = anchor;
  const icoR = r * 0.8;

  const svgPath = `
    <circle cx="${r}" cy="${r}" r="${r}" fill="${opt.strokeColor}" stroke-width="0"/>
    <circle cx="${r}" cy="${r}" r="${icoR}" fill="${opt.color}" stroke-width="0"/>
  `;

  return {
    icon: {
      iconSize: [size, size],
      iconAnchor: [anchor, anchor],
      html: insertSvg(size, size, svgPath)
    }
  };
}
