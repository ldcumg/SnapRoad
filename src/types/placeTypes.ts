export type LocationInfo = Partial<Location> & Latlng;

export type Location = {
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

export type Meta = {
  same_name: {
    region: [];
    keyword: string;
    selected_region: string;
  };
  pageable_count: number;
  total_count: number;
  is_end: boolean;
};

export type Address = {
  roadAddress: string | null;
  address: string;
};
