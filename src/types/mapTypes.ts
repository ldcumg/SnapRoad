export type Location = {
  id: string;
  placeName: string;
  address: string;
};

export type Latlng = {
  lat: number;
  lng: number;
};

export type LocationInfo = Location & Latlng;

export type SearchResult = {
  id: string;
  place_name: string;
  road_address_name: string;
  address_name: string;
  y: string;
  x: string;
};

export type ClusterStyle = {
  centerLatLng: { lat: number; lng: number };
  textAlign: string;
  lineHeight: string;
  fontSize: string;
  color: string;
  width: string;
  height: string;
  background: string;
  positon: string;
};

export interface CustomMarker extends kakao.maps.Marker {
  getImage: () => { Wh: string; ok: string };
}

export interface CustomMarkerClusterer extends kakao.maps.MarkerClusterer {
  _clusters: kakao.maps.Cluster[];
  T: { ok: string };
}

export interface CustomLatLng extends kakao.maps.LatLng {
  Ma: number;
  La: number;
}

export interface CustomLatLngBounds extends kakao.maps.LatLngBounds {
  ha: number;
  qa: number;
  oa: number;
  pa: number;
}

export interface CustomCluster extends kakao.maps.Cluster {
  _markers: CustomMarkerClusterer[];
}
