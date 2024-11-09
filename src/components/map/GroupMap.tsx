'use client';

import { getGroupPostsCoverImagesQuery } from '@/hooks/queries/post/useGroupPostsQuery';
import { searchPlaceSchema } from '@/schemas/searchPlaceSchema';
import { getAddress, keywordSearch } from '@/services/server-action/mapAction';
import { BottomSheet } from '@/stories/BottomSheet';
import { Button } from '@/stories/Button';
import type {
  ClusterStyle,
  CustomCluster,
  CustomLatLng,
  CustomLatLngBounds,
  CustomMarker,
  CustomMarkerClusterer,
  Latlng,
  Location,
  LocationInfo,
} from '@/types/mapTypes';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'garlic-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useForm, type FieldValues } from 'react-hook-form';
import { useKakaoLoader, Map, MapMarker, MarkerClusterer, Polyline } from 'react-kakao-maps-sdk';

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
  // let polyline: Latlng[] = [];
  const polyline: Set<Latlng> = new Set([]);

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

  const [mapLoading, mapError] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_KEY!,
    libraries: ['services', 'clusterer'],
  });

  useEffect(() => {
    if (mapLoading) return;
  }, [mapLoading]);

  // useEffect(() => {
  //   //TODO - 데스크탑에서만 동작하게
  //   setFocus(SEARCH_INPUT);
  // }, []);

  useEffect(() => {
    if (map && postsCoverImages?.length) {
      const bounds = new kakao.maps.LatLngBounds();
      postsCoverImages.forEach(
        ({ post_lat, post_lng }) => post_lat && post_lng && bounds.extend(new kakao.maps.LatLng(post_lat, post_lng)),
      );
      map.panTo(bounds);
    }
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
    //TODO - 해외 인밸리데이트
    if (isPostsView) {
      route.push(`/group/${groupId}/post`);
      return;
    }

    if (!spotInfo) return;
    const { lat, lng, placeName, address } = spotInfo;
    const place = placeName || address;

    route.push(`/group/${groupId}/post?lat=${lat}&lng=${lng}&place=${place}`);
  };

  /** 클러스터 시 게시물의 이미지를 마커 스타일 저장 */
  const onClusteredEvent = (marker: kakao.maps.MarkerClusterer) => {
    const customMarker = marker as CustomMarkerClusterer;
    customMarker._clusters.forEach((cluster) => {
      const customCluster = cluster as CustomCluster;
      const { Ma, La } = cluster.getCenter() as CustomLatLng;
      setClusterStyle((prev) => [
        ...prev,
        {
          centerLatLng: { lat: Ma, lng: La },
          textAlign: 'end',
          lineHeight: '54px',
          fontSize: '20px',
          color: 'black',
          width: '56px',
          height: '56px',
          background: `url("${customCluster._markers[0].T.ok}") no-repeat`,
          backgroundSize: 'cover',
          positon: 'getCenter',
          borderRadius: '100%',
          border: '4px solid #EB84DA',
        },
      ]);
    });
  };

  /** 뷰포트에 클러스터의 좌표가 들어올 시 해당하는 스타일의 인덱스 반환 */
  const clusterCalculator = () => {
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

  const reconstitutePolyline = () => {
    polyline.clear()

  }

  return (
    <>
      <form
        className='fixed left-1/2 top-[72px] z-50 -translate-x-1/2'
        onSubmit={handleSubmit(searchLocation)}
      >
        <div className='relative'>
          <input
            className='h-[48px] w-[343px] rounded-3xl px-4 py-3 text-body_md shadow-BG_S placeholder:text-gray-400'
            placeholder='장소를 검색해보세요!'
            {...register(SEARCH_INPUT)}
          />
          {!!getValues(SEARCH_INPUT) && (
            <button
              className='absolute right-12 top-1/2 z-50 -translate-y-1/2'
              type='button'
              onClick={() => resetField(SEARCH_INPUT)}
            >
              <img src='/svgs/Reset_input.svg' />
            </button>
          )}
          <button
            className='absolute right-4 top-1/2 -translate-y-1/2'
            type='submit'
          >
            <img src='/svgs/Map_Search.svg' />
          </button>
        </div>
      </form>
      {/* {searchResult.hasMore && (
        <button
          type='button'
          onClick={searchLocation}
        >
          더보기
        </button>
      )} */}
      <button
        className='fixed right-4 top-[136px] z-50'
        onClick={() => {
          setIsPostsView((prev) => !prev);
          isPostsView && setPostsPreview([]);
          isPostsView ? getSpotInfo() : setSpotInfo(undefined);
        }}
      >
        {isPostsView ? (
          <img src='/svgs/Switch_btn_to_mappin_marker.svg' />
        ) : (
          <img src='/svgs/Switch_btn_to_image_marker.svg' />
        )}
      </button>
      {isPostsView || (
        <img
          className='w-[28px]transform fixed left-1/2 top-1/2 z-50 h-[48px] -translate-x-[46.5%] -translate-y-[68%]'
          src='/svgs/Mappin.svg'
          alt='맵핀'
        />
      )}
      <Map
        className='h-screen w-full'
        center={{ lat: 35.85, lng: 127.65 }}
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
            calculator={clusterCalculator as any}
            onClusterclick={(marker, cluster) => {
              console.log("marker =>", marker);
              clusterClickEvent(cluster);
            }}
          >
            {postsCoverImages.map(({ post_id, post_image_url, post_lat, post_lng }) => {
              post_lat && post_lng && polyline.add({ lat: post_lat, lng: post_lng });
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
          path={[[...polyline]]}
          strokeWeight={5} // 선 두께
          strokeColor={'#FFABF1'} // 선 색깔
          strokeOpacity={0.7} // 선 불투명도 1에서 0 사이의 값 0에 가까울수록 투명
          strokeStyle={'solid'} // 선 스타일
        />
        <button
          className='fixed bottom-[88px] left-4 z-50'
          onClick={handleFindUserLocation}
        >
          <img src='/svgs/Geolocation_btn.svg' />
        </button>
        <div>
          {!!spotInfo && (
            <div className='relative'>
              <button
                className='fixed bottom-48 left-4 z-50'
                onClick={handleFindUserLocation}
              >
                <img src='/svgs/Geolocation_btn.svg' />
              </button>
              <BottomSheet
                height='custom'
                customHeight=''
                rounded={true}
                isOpen={true}
                showHeader={false}
                hasButton={false}
                customClassName='pt-9'
                backdrop={false}
              >
                <h5 className='text-label_md'>
                  {(spotInfo.placeName || spotInfo.address) ?? '위치정보를 불러올 수 없습니다.'}
                </h5>
                <p className='text-body_md'>{spotInfo.placeName && spotInfo.address}</p>
              </BottomSheet>
            </div>
          )}
          {!!postsPreView.length ? (
            <BottomSheet
              height='custom'
              customHeight='250px'
              rounded={true}
              isOpen={true}
              showHeader={false}
              hasButton={false}
              backdrop={false}
            >
              <p className='mb-7 mt-[14px] text-title_lg'>총 {postsPreView.length}개의 게시물이 있어요!</p>
              <ol className='flex flex-row gap-3 overflow-x-auto'>
                {postsPreView.map((post) => (
                  <li
                    className='h-[132px] w-[132px]'
                    key={post.postId}
                  >
                    <Link
                      className='block h-full w-full'
                      href={`/group/${groupId}/post/${post.postId}`}
                    >
                      <img
                        className='h-full w-full rounded-[8px] object-cover'
                        src={post.postImageUrl}
                        alt={`Post ${post.postId}`}
                      />
                    </Link>
                  </li>
                ))}
              </ol>
            </BottomSheet>
          ) : (
            <div className='shadow-[0px -4px 10px 0px rgba(0, 0, 0, 0.10)] fixed bottom-0 z-50 w-full bg-white px-[16px] pb-[16px] pt-[12px]'>
              <Button
                type='button'
                onClick={handleAddPostRoute}
                variant='primary'
                size='full'
                className='bottom-4 z-50 h-[56px] px-6'
                disabled={!isPostsView && !spotInfo?.address}
              >
                <span className='flex gap-2'>
                  <img src='/svgs/Plus_LG.svg' />
                  <p className='text-title_lg'>게시물 추가하기</p>
                </span>
              </Button>
            </div>
          )}
        </div>
      </Map>
    </>
  );
};

export default GroupMap;
