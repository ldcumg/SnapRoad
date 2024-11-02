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
