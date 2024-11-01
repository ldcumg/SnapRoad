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

type Latlng = {
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
  address_name: string;
  region_1depth_name: string;
  region_2depth_name: string;
  region_3depth_name: string;
  mountain_yn: string;
  main_address_no: string;
  sub_address_no: string;
  zip_code: string;
};
