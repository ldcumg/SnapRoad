'use client';

import { getAddress, keywordSearch } from '@/services/server-action/mapAction';
import type {
  CustomMarker,
  CustomMarkerClusterer,
  CustomCluster,
  CustomLatLng,
  CustomLatLngBounds,
  LocationInfo,
  ClusterStyle,
  UseKakaoMapReturnType,
  CreateSearchFunctionParams,
  HandleFindUserLocationParams,
  MoveToMarkerParams,
  ClusterClickEventParams,
  HandleAddPostRouteParams,
  OnClusteredEventParams,
} from '@/types/mapTypes';
import { toast } from 'garlic-toast';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import type { FieldValues } from 'react-hook-form';

/** 지도에서 사용하는 함수 모음 */
const useKakaoMap = (map: kakao.maps.Map): UseKakaoMapReturnType => {
  const route = useRouter();
  const searchKeyword = useRef<{ keyword: string; page: number }>({ keyword: '', page: 1 });

  /** 키워드 검색 함수 생성 */
  const createSearchFunction = ({
    setSpotInfo,
    isPostsView,
    setIsPostsView,
    searchResult,
    setSearchResult,
    isInputFocus,
    setIsInputFocus,
  }: CreateSearchFunctionParams) => {
    return async ({ searchInput }: FieldValues) => {
      if (searchInput === searchKeyword.current.keyword) return;

      isPostsView && setIsPostsView(false);

      const keyword = searchInput ?? searchKeyword.current.keyword;
      const { results, is_end } = await keywordSearch({ keyword, page: searchKeyword.current.page });

      if (!results[0]) {
        toast.error('검색 결과가 존재하지 않습니다.');
        return;
      }

      setSearchResult(({ markers, hasMore }) =>
        searchInput ? { markers: results, hasMore } : { markers: [...markers, ...results], hasMore },
      );

      searchInput && moveToMarker({ ...results[0], setSpotInfo });

      if (is_end) {
        setSearchResult((prev) => {
          return { ...prev, hasMore: false };
        });
        searchKeyword.current = { keyword: '', page: 1 };
        return;
      }

      searchResult.hasMore ||
        setSearchResult((prev) => {
          return { ...prev, hasMore: true };
        });
      searchInput
        ? (searchKeyword.current = { keyword: searchInput, page: (searchKeyword.current.page += 1) })
        : (searchKeyword.current.page = searchKeyword.current.page += 1);

      isInputFocus && setIsInputFocus(false);
    };
  };

  /** 중심 좌표의 장소 정보 요청 */
  const getSpotInfo = async (setSpotInfo: React.Dispatch<React.SetStateAction<Omit<LocationInfo, 'id'> | null>>) => {
    const latlng = map.getCenter();

    const lat = latlng.getLat();
    const lng = latlng.getLng();
    const address = await getAddress({ lat, lng });
    setSpotInfo({ placeName: '', address, lat, lng });
  };

  /** 사용자 위치 찾기 */
  const handleFindUserLocation = ({ isPostsView, setIsPostsView, setSpotInfo }: HandleFindUserLocationParams) => {
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
  const moveToMarker = ({ placeName, address, lat, lng, setSpotInfo }: MoveToMarkerParams) => {
    map.setLevel(4, { animate: true });
    map.panTo(new kakao.maps.LatLng(lat, lng));
    placeName && address && setSpotInfo({ placeName, address, lat, lng });
  };

  /** 클러스터 마커 미리보기 및 지도 범위 재설정 */
  const clusterClickEvent = ({ cluster, setPostsPreview }: ClusterClickEventParams) => {
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
  const handleAddPostRoute = ({ groupId, isPostsView, spotInfo }: HandleAddPostRouteParams) => {
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
  const onClusteredEvent = ({ marker, clusterStyle, setClusterStyle }: OnClusteredEventParams) => {
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
    createSearchFunction: createSearchFunction,
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
