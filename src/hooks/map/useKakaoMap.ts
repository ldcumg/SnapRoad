'use client';

import { getAddress } from '@/services/server-action/mapAction';
import type {
  Location,
  LatLng,
  CustomMarker,
  CustomMarkerClusterer,
  CustomCluster,
  CustomLatLng,
  CustomLatLngBounds,
  LocationInfo,
  ClusterStyle,
} from '@/types/mapTypes';
import { useRouter } from 'next/router';

type UseKakaoMapReturnType = {
  getSpotInfo: (setSpotInfo: React.Dispatch<React.SetStateAction<Omit<LocationInfo, 'id'>>>) => Promise<void>;
  handleFindUserLocation: (params: {
    isPostsView: boolean;
    setIsPostsView: React.Dispatch<React.SetStateAction<boolean>>;
    setSpotInfo: React.Dispatch<React.SetStateAction<Omit<LocationInfo, 'id'>>>;
  }) => void;
  moveToMarker: (
    params: Partial<Location> &
      LatLng & {
        setSpotInfo: React.Dispatch<React.SetStateAction<Omit<LocationInfo, 'id'>>>;
      },
  ) => void;
  clusterClickEvent: (params: {
    cluster: kakao.maps.Cluster;
    setPostsPreview: React.Dispatch<React.SetStateAction<{ postId: string; postImageUrl: string }[]>>;
  }) => void;
  handleAddPostRoute: (params: { groupId: string; isPostsView: boolean; spotInfo: Omit<LocationInfo, 'id'> }) => void;
  onClusteredEvent: (params: {
    marker: kakao.maps.MarkerClusterer;
    clusterStyle: ClusterStyle[];
    setClusterStyle: React.Dispatch<React.SetStateAction<ClusterStyle[]>>;
  }) => void;
  clusterCalculator: (clusterStyle: ClusterStyle[]) => number | undefined;
};

const useKakaoMap = (map: kakao.maps.Map): UseKakaoMapReturnType => {
  const route = useRouter();

  /** 중심 좌표의 장소 정보 요청 */
  const getSpotInfo = async (setSpotInfo: React.Dispatch<React.SetStateAction<Omit<LocationInfo, 'id'>>>) => {
    const latlng = map.getCenter();

    const lat = latlng.getLat();
    const lng = latlng.getLng();
    const address = await getAddress({ lat, lng });
    setSpotInfo({ placeName: '', address, lat, lng });
  };

  /** 사용자 위치 찾기 */
  const handleFindUserLocation = ({
    isPostsView,
    setIsPostsView,
    setSpotInfo,
  }: {
    isPostsView: boolean;
    setIsPostsView: React.Dispatch<React.SetStateAction<boolean>>;
    setSpotInfo: React.Dispatch<React.SetStateAction<Omit<LocationInfo, 'id'>>>;
  }) => {
    if (!navigator.geolocation) {
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude: lat, longitude: lng } = position.coords;
      map.setLevel(5, { animate: true });
      map.panTo(new kakao.maps.LatLng(lat, lng));
      isPostsView && setIsPostsView(false);
      getSpotInfo(setSpotInfo);
    });
  };

  /** 마커로 화면 이동 */
  const moveToMarker = ({
    placeName,
    address,
    lat,
    lng,
    setSpotInfo,
  }: Partial<Location> &
    LatLng & { setSpotInfo: React.Dispatch<React.SetStateAction<Omit<LocationInfo, 'id'> | null>> }) => {
    map.setLevel(4, { animate: true });
    map.panTo(new kakao.maps.LatLng(lat, lng));
    placeName && address && setSpotInfo({ placeName, address, lat, lng });
  };

  /** 클러스터 마커 미리보기 및 지도 범위 재설정 */
  const clusterClickEvent = ({
    cluster,
    setPostsPreview,
  }: {
    cluster: kakao.maps.Cluster;
    setPostsPreview: React.Dispatch<
      React.SetStateAction<
        {
          postId: string;
          postImageUrl: string;
        }[]
      >
    >;
  }) => {
    const bounds = new kakao.maps.LatLngBounds();

    const clusterMarkersInfo = cluster.getMarkers().map((marker) => {
      const customMarker = marker as CustomMarker;

      bounds.extend(new kakao.maps.LatLng(customMarker.getPosition().getLat(), customMarker.getPosition().getLng()));
      return {
        postId: customMarker.getImage().Wh,
        postImageUrl: customMarker.getImage().ok,
      };
    });
    map.panTo(bounds);
    setPostsPreview(clusterMarkersInfo);
  };

  /** 게시물 추가 라우팅 */
  const handleAddPostRoute = ({
    groupId,
    isPostsView,
    spotInfo,
  }: {
    groupId: string;
    isPostsView: boolean;
    spotInfo: Omit<LocationInfo, 'id'>;
  }) => {
    if (isPostsView) {
      route.replace(`/group/${groupId}/post`);
      return;
    }

    if (!spotInfo) return;
    const { lat, lng, placeName, address } = spotInfo;
    const place = placeName || address;

    route.replace(`/group/${groupId}/post?lat=${lat}&lng=${lng}&place=${place}`);
  };

  /** 클러스터 시 게시물의 이미지를 마커 스타일 저장 */
  const onClusteredEvent = ({
    marker,
    clusterStyle,
    setClusterStyle,
  }: {
    marker: kakao.maps.MarkerClusterer;
    clusterStyle: ClusterStyle[];
    setClusterStyle: React.Dispatch<React.SetStateAction<ClusterStyle[]>>;
  }) => {
    const customMarker = marker as CustomMarkerClusterer;

    // polyline.current = [];
    customMarker._clusters.forEach((cluster) => {
      const customCluster = cluster as CustomCluster;
      const { Ma: lat, La: lng } = cluster.getCenter() as CustomLatLng;
      // polyline.current.push({ lat, lng });
      clusterStyle.some((style) => style.background === `url("${customCluster._markers[0].T.ok}") no-repeat`) ||
        setClusterStyle((prev) => [
          ...prev,
          {
            centerLatLng: { lat, lng },
            fontSize: '0px',
            width: '60px',
            height: '60px',
            background: `url("${customCluster._markers[0].T.ok}") no-repeat`,
            backgroundSize: 'cover',
            borderRadius: '100%',
            border: 'solid 4px #EB84DA',
          },
        ]);
    });
  };

  /** 뷰포트에 클러스터의 좌표가 들어올 시 해당하는 스타일의 인덱스 반환 */
  const clusterCalculator = (clusterStyle: ClusterStyle[]) => {
    if (!map) return;
    const { ha, qa, oa, pa } = map.getBounds() as CustomLatLngBounds;
    const viewport = new kakao.maps.LatLngBounds(new kakao.maps.LatLng(qa, ha), new kakao.maps.LatLng(pa, oa));

    let index;
    for (let i = 0; i < clusterStyle.length; i++) {
      const { lat, lng } = clusterStyle[i].centerLatLng;
      if (viewport.contain(new kakao.maps.LatLng(lat, lng))) index = i;
    }
    return index;
  };

  // reconstitutePolyline

  return {
    getSpotInfo,
    handleFindUserLocation,
    moveToMarker,
    clusterClickEvent,
    handleAddPostRoute,
    onClusteredEvent,
    clusterCalculator,
  };
};

export default useKakaoMap;
