export type LocationInfo = Partial<Location> & Latlng;

type Location = {
  address_name: string;
  category_group_code: string;
  category_group_name: string;
  category_name: string;
  distance: string;
  id: string;
  phone: string;
  place_name: string;
  place_url: string;
  road_address_name: string;
};

export type Latlng = {
  lat: number;
  lng: number;
};
