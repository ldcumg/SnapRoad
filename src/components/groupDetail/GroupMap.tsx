'use client';

import { getGroupPostsCoverImagesQuery } from '@/hooks/queries/post/useGroupPostsQuery';
import { searchPlaceSchema } from '@/schemas/searchPlaceSchema';
import { getAddress, keywordSearch } from '@/services/server-action/mapAction';
import type { ClusterStyle, CustomMarker, Latlng, Location, LocationInfo } from '@/types/mapTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'garlic-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { Map, MapMarker, MarkerClusterer, Polyline } from 'react-kakao-maps-sdk';

const SEARCH_INPUT = 'searchInput';

const GroupMap = ({ groupId }: { groupId: string }) => {
  const route = useRouter();
  const [map, setMap] = useState<kakao.maps.Map>();
  const [isPostsView, setIsPostsView] = useState<boolean>(!!groupId ? true : false);
  const [postsPreView, setPostsPreview] = useState<{ postId: string; postImageUrl: string }[]>([]);
  const [searchResult, setSearchResult] = useState<{ markers: LocationInfo[]; hasMore: boolean }>({
    markers: [],
    hasMore: false,
  });
  const searchKeyword = useRef<{ keyword: string; page: number }>({ keyword: '', page: 1 });
  const [spotInfo, setSpotInfo] = useState<Omit<LocationInfo, 'id'>>();
  const [clusterStyle, setClusterStyle] = useState<ClusterStyle[]>([]);
  //TODO - Set으로 관리
  let polyline: Latlng[] = [];

  const {
    register,
    handleSubmit,
    setFocus,
    getValues,
    resetField,
    formState: {
      errors: { searchTerm: searchTermInvalidate },
    },
  } = useForm({
    mode: 'onSubmit',
    resolver: zodResolver(searchPlaceSchema),
  });

  const { data: postsCoverImages, isPending, isError, error } = getGroupPostsCoverImagesQuery(groupId);

  // useEffect(() => {
  //   //TODO - 데스크탑에서만 동작하게
  //   setFocus(SEARCH_INPUT);
  // }, []);

  //QUESTION - 왜 안되지...
  useEffect(() => {
    if (!map || !postsCoverImages) return;
    const bounds = new kakao.maps.LatLngBounds();
    postsCoverImages.forEach(({ post_lat, post_lng }) => bounds.extend(new kakao.maps.LatLng(post_lat, post_lng)));
    map.panTo(bounds);
  }, [map, postsCoverImages]);

  if (searchTermInvalidate) toast.error(searchTermInvalidate.message as string);

  if (isPending) return <>로딩</>;

  if (isError) throw new Error(error.message);

  //FIXME - 엔터 여러번 눌렀을 때 지도 이동 막기
  /** 키워드 검색 */
  const searchLocation = async ({ searchInput }: FieldValues) => {
    if (!map) {
      toast.error('지도를 불러오지 못 했습니다.');
      return;
    }
    isPostsView && setIsPostsView(false);

    const keyword = searchInput ?? searchKeyword.current.keyword;
    const { results, is_end } = await keywordSearch({ keyword, page: searchKeyword.current.page });
    setSearchResult(({ markers, hasMore }) =>
      searchInput ? { markers: results, hasMore } : { markers: [...markers, ...results], hasMore },
    );
    searchInput && moveToMarker(results[0]);

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
  };

  /** 사용자의 위치 찾기 */
  const handleFindUserLocation = () => {
    if (!map) {
      toast.error('지도를 불러오지 못 했습니다.');
      return;
    }

    if (!navigator.geolocation) {
      toast.alert('위치 정보 제공 동의가 필요합니다.');
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude: lat, longitude: lng } = position.coords;
      map.setLevel(5, { animate: true });
      map.panTo(new kakao.maps.LatLng(lat, lng));
      isPostsView && setIsPostsView(false);
    });
  };

  /** 마커로 화면 이동 */
  const moveToMarker = ({ placeName, address, lat, lng }: Partial<Location> & Latlng) => {
    if (!map) {
      toast.error('지도를 불러오지 못 했습니다.');
      return;
    }
    map.setLevel(4, { animate: true });
    map.panTo(new kakao.maps.LatLng(lat, lng));
    placeName && address && setSpotInfo({ placeName, address, lat, lng });
  };

  /** 중심 좌표의 장소 정보 요청 */
  const getSpotInfo = async () => {
    if (!map) {
      toast.error('지도를 불러오지 못 했습니다.');
      return;
    }

    const latlng = map.getCenter();

    const lat = latlng.getLat();
    const lng = latlng.getLng();
    const address = await getAddress({ lat, lng });
    setSpotInfo({ placeName: '', address, lat, lng });
  };

  /** 클러스터 마커 미리보기 및 지도 범위 재설정 */
  const clusterClickEvent = (cluster: kakao.maps.Cluster) => {
    if (!map) {
      toast.error('지도를 불러오지 못 했습니다.');
      return;
    }
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
  const handleAddPostRoute = () => {
    if (isPostsView) {
      //TODO - 라우트 주소 수정하기
      route.push(`/group/${groupId}/`);
      return;
    }

    if (!spotInfo) return;
    const { lat, lng, placeName, address } = spotInfo;
    const place = placeName || address;

    //TODO - 라우트 주소 수정하기
    route.push(`/group/${groupId}/post?lat=${lat}&lng=${lng}&place=${place}`);
  };

  /** 클러스터 시 게시물의 이미지를 마커 스타일 저장 */
  const onClusteredEvent = (marker: kakao.maps.MarkerClusterer) => {
    marker._clusters.forEach((cluster) => {
      const { Ma, La } = cluster.getCenter();
      clusterStyle.some((style) => style.background === `url("${cluster._markers[0].T.ok}") no-repeat`) ||
        setClusterStyle((prev) => [
          ...prev,
          {
            centerLatLng: { lat: Ma, lng: La },
            textAlign: 'center',
            lineHeight: '54px',
            fontSize: '20px',
            color: 'black',
            width: '100px',
            height: '100px',
            background: `url("${cluster._markers[0].T.ok}") no-repeat`,
            backgroundSize: 'contain',
            positon: 'getCenter',
          },
        ]);
    });
  };

  /** 뷰포트에 클러스터의 좌표가 들어올 시 해당하는 스타일의 인덱스 반환 */
  const clusterCalculator = () => {
    if (!map) return;
    const { ha, qa, oa, pa } = map.getBounds();
    const viewport = new kakao.maps.LatLngBounds(new kakao.maps.LatLng(qa, ha), new kakao.maps.LatLng(pa, oa));

    let index;
    for (let i = 0; i < clusterStyle.length; i++) {
      const { lat, lng } = clusterStyle[i].centerLatLng;
      if (viewport.contain(new kakao.maps.LatLng(lat, lng))) index = i;
    }

    return index;
  };

  return (
    <>
      <form onSubmit={handleSubmit(searchLocation)}>
        <input
          className='text-black'
          placeholder='장소를 검색해보세요!'
          {...register(SEARCH_INPUT)}
        />
        {!!getValues(SEARCH_INPUT) && (
          <button
            type='button'
            onClick={() => resetField(SEARCH_INPUT)}
          >
            <img src='/svgs/Reset_input.svg' />
          </button>
        )}
        <button type='submit'>
          <img src='/svgs/Map_Search.svg' />
        </button>
      </form>
      {searchResult.hasMore && (
        <button
          type='button'
          onClick={searchLocation}
        >
          더보기
        </button>
      )}
      <button
        onClick={() => {
          setIsPostsView((prev) => !prev);
          isPostsView ? getSpotInfo() : setSpotInfo(undefined);
        }}
      >
        {isPostsView ? (
          <img src='/svgs/Switch_btn_to_mappin_marker.svg' />
        ) : (
          <img src='/svgs/Switch_btn_to_image_marker.svg' />
        )}
      </button>
      {isPostsView || <img src='/svgs/Mappin.svg' />}
      <Map
        className='w-full h-[50vh]'
        center={
          // postsCoverImages ? { lat: 0, lng: 0 } :
          { lat: 35.95, lng: 128.25 }
        }
        onCreate={setMap}
        level={13}
        isPanto={true}
        onDragEnd={() => {
          isPostsView || getSpotInfo();
        }}
      >
        {isPostsView && !!postsCoverImages.length ? (
          <MarkerClusterer
            averageCenter={true}
            minLevel={5} // 클러스터 할 최소 지도 레벨
            styles={clusterStyle}
            disableClickZoom={true}
            onClustered={(marker) => onClusteredEvent(marker)}
            calculator={() => clusterCalculator()}
            onClusterclick={(marker, cluster) => {
              clusterClickEvent(cluster);
            }}
          >
            {postsCoverImages.map(({ post_id, post_image_url, post_lat, post_lng }) => {
              polyline.push({ lat: post_lat, lng: post_lng });
              return (
                <MapMarker
                  key={post_image_url}
                  position={{ lat: post_lat, lng: post_lng }}
                  onClick={() => {
                    moveToMarker({ lat: post_lat, lng: post_lng });
                    setPostsPreview([{ postId: post_id, postImageUrl: post_image_url }]);
                  }}
                  image={{
                    // 기본 마커 이미지
                    src: post_image_url,
                    size: {
                      width: 50,
                      height: 50,
                    }, // 마커이미지의 크기
                    options: { shape: 'circle', offset: { x: 30, y: 30 }, alt: post_id },
                  }}
                  // title={post_id} // 마우스 호버 시 표시
                />
              );
            })}
          </MarkerClusterer>
        ) : (
          <>
            {searchResult.markers.map((marker) => (
              <MapMarker
                key={marker.id}
                position={{ lat: marker.lat, lng: marker.lng }}
                onClick={() => moveToMarker(marker)}
                image={{
                  src: '/svgs/Search_Result_Marker.svg',
                  size: {
                    width: 24,
                    height: 35,
                  },
                }}
              />
            ))}
          </>
        )}
        <Polyline
          path={[polyline]}
          strokeWeight={5} // 선 두께
          strokeColor={'#FFABF1'} // 선 색깔
          strokeOpacity={0.7} // 선 불투명도 1에서 0 사이의 값 0에 가까울수록 투명
          strokeStyle={'solid'} // 선 스타일
        />
      </Map>
      <button onClick={handleFindUserLocation}>
        <img src='/svgs/Geolocation_btn.svg' />
      </button>
      <div>
        {!!spotInfo && (
          <>
            <h5>{spotInfo.placeName || spotInfo.address}</h5>
            <p>{spotInfo.placeName && spotInfo.address}</p>
          </>
        )}
        {!!postsPreView.length ? (
          postsPreView.map((post) => (
            // TODO 게시물 상세 페이지 라우트 주소 변경
            <Link
              href={`/${post.postId}`}
              key={post.postId}
            >
              <img src={post.postImageUrl} />
            </Link>
          ))
        ) : (
          <button onClick={handleAddPostRoute}>추가하기</button>
        )}
      </div>
    </>
  );
};

export default GroupMap;
