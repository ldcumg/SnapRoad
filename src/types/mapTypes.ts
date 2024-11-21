import type { FieldValues } from 'react-hook-form';

export type Location = {
  id: string;
  placeName: string;
  address: string;
};

export type LatLng = {
  lat: number;
  lng: number;
};

export type LocationInfo = Location & LatLng;

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
  background: string;
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

export type UseKakaoMapReturnType = {
  createSearchFunction: (params: {
    setSpotInfo: React.Dispatch<React.SetStateAction<Omit<LocationInfo, 'id'> | null>>;
    isPostsView: boolean;
    setIsPostsView: React.Dispatch<React.SetStateAction<boolean>>;
    searchResult: {
      markers: LocationInfo[];
      hasMore: boolean;
    };
    setSearchResult: React.Dispatch<
      React.SetStateAction<{
        markers: LocationInfo[];
        hasMore: boolean;
      }>
    >;
    isInputFocus: boolean;
    setIsInputFocus: React.Dispatch<React.SetStateAction<boolean>>;
  }) => ({ searchInput }: FieldValues) => Promise<void>;
  getSpotInfo: (setSpotInfo: React.Dispatch<React.SetStateAction<Omit<LocationInfo, 'id'> | null>>) => Promise<void>;
  handleFindUserLocation: (params: {
    isPostsView: boolean;
    setIsPostsView: React.Dispatch<React.SetStateAction<boolean>>;
    setSpotInfo: React.Dispatch<React.SetStateAction<Omit<LocationInfo, 'id'> | null>>;
  }) => void;
  moveToMarker: (
    params: Partial<Location> &
      LatLng & {
        setSpotInfo: React.Dispatch<React.SetStateAction<Omit<LocationInfo, 'id'> | null>>;
      },
  ) => void;
  clusterClickEvent: (params: {
    cluster: kakao.maps.Cluster;
    setPostsPreview: React.Dispatch<React.SetStateAction<{ postId: string; postImageUrl: string }[]>>;
  }) => void;
  handleAddPostRoute: (params: {
    groupId: string;
    isPostsView: boolean;
    spotInfo: Omit<LocationInfo, 'id'> | null;
  }) => void;
  onClusteredEvent: (params: {
    marker: kakao.maps.MarkerClusterer;
    clusterStyle: ClusterStyle[];
    setClusterStyle: React.Dispatch<React.SetStateAction<ClusterStyle[]>>;
  }) => void;
  clusterCalculator: (clusterStyle: ClusterStyle[]) => number | undefined;
};

export type CreateSearchFunctionParams = {
  setSpotInfo: React.Dispatch<React.SetStateAction<Omit<LocationInfo, 'id'> | null>>;
  isPostsView: boolean;
  setIsPostsView: React.Dispatch<React.SetStateAction<boolean>>;
  searchResult: {
    markers: LocationInfo[];
    hasMore: boolean;
  };
  setSearchResult: React.Dispatch<
    React.SetStateAction<{
      markers: LocationInfo[];
      hasMore: boolean;
    }>
  >;
  isInputFocus: boolean;
  setIsInputFocus: React.Dispatch<React.SetStateAction<boolean>>;
};

export type HandleFindUserLocationParams = {
  isPostsView: boolean;
  setIsPostsView: React.Dispatch<React.SetStateAction<boolean>>;
  setSpotInfo: React.Dispatch<React.SetStateAction<Omit<LocationInfo, 'id'> | null>>;
};

export type MoveToMarkerParams = Partial<Location> &
  LatLng & { setSpotInfo: React.Dispatch<React.SetStateAction<Omit<LocationInfo, 'id'> | null>> };

export type ClusterClickEventParams = {
  cluster: kakao.maps.Cluster;
  setPostsPreview: React.Dispatch<
    React.SetStateAction<
      {
        postId: string;
        postImageUrl: string;
      }[]
    >
  >;
};

export type HandleAddPostRouteParams = {
  groupId: string;
  isPostsView: boolean;
  spotInfo: Omit<LocationInfo, 'id'> | null;
};

export type OnClusteredEventParams = {
  marker: kakao.maps.MarkerClusterer;
  clusterStyle: ClusterStyle[];
  setClusterStyle: React.Dispatch<React.SetStateAction<ClusterStyle[]>>;
};
