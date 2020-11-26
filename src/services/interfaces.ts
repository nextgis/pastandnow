export interface OralProperties {
  id: number;

  id1: number;
  city: string;
  status: string;
  narrator: string;
  nar_codes: string;
  description?: string;
  mos2?: string;
  mos5?: string;
  mos4?: string;
  visual?: string;
  mos6?: string;
  mos1?: string;
  unoff: string;
  mos3?: string;
  descript2?: string;
  lat: number;
  rayon: string;
  geo?: string;
  name?: string;
  narrativ_b?: string;
  addr?: string;
  narrativ_l: string;
  narrativ_t: string;
  lon: number;
  narrativ_p?: string;
  type: string;
}

export interface OralPhotoProperties {
  id: number;
  link_big: string;
  link_small: string;
  id_obj: number;
  descript: string;
  link: string;
  details: string;
}

export interface LayerMetaItem {
  text: string;
  value: string;
  list?: boolean;
  type?: 'NarratorLink' | 'Special' | 'Story';
  detail?: boolean;
  search?: boolean;
}
