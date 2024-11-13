'use client';

import PlaceSearchForm from './PlaceSearchForm';
import Loading from '@/app/loading';
import { getGroupPostsCoverImagesQuery } from '@/hooks/queries/post/useGroupPostsQuery';
import MapPin from '@/lib/icon/Map_Pin';
import { getAddress, keywordSearch } from '@/services/server-action/mapAction';
import useBottomSheetStore from '@/stores/story/useBottomSheetStore';
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
import { toast } from 'garlic-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { type FieldValues } from 'react-hook-form';
import { useKakaoLoader, Map, MapMarker, MarkerClusterer, Polyline } from 'react-kakao-maps-sdk';

type Props = {
  groupId: string;
  point: { lat: number; lng: number } | null;
};

const GroupMap = ({ groupId, point }: Props) => {
  const route = useRouter();
  const { isCustomHeightOpen, handleCustomOpen, handleCustomClose } = useBottomSheetStore((state) => state);
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
  const [isInputFocus, setIsInputFocus] = useState<boolean>(false);

  //TODO - Set으로 관리
  let polyline: Latlng[] = [];

  const { data: postsCoverImages, isPending, isError, error } = getGroupPostsCoverImagesQuery(groupId);

  const [mapLoading, mapError] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_KEY!,
    libraries: ['services', 'clusterer'],
  });

  useEffect(() => {
    if (mapLoading) return;
  }, [mapLoading]);

  useEffect(() => {
    if (!point && map && postsCoverImages?.length) {
      const bounds = new kakao.maps.LatLngBounds();
      postsCoverImages.forEach(
        ({ post_lat, post_lng }) => post_lat && post_lng && bounds.extend(new kakao.maps.LatLng(post_lat, post_lng)),
      );
      postsCoverImages[0].post_lat && postsCoverImages[0].post_lng && map.panTo(bounds);
    }
  }, [map, postsCoverImages]);

  useEffect(() => {
    if (!!point && map) {
      moveToMarker(point);
      map.setLevel(4, { animate: true });
    }
  }, [map]);

  if (isPending) return <Loading />;

  if (isError) throw new Error(error.message);

  /** 키워드 검색 */
  const searchLocation = async ({ searchInput }: FieldValues) => {
    if (!map) {
      toast.error('지도를 불러오지 못 했습니다.');
      return;
    }

    if (searchInput === searchKeyword.current.keyword) return;

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

    isInputFocus && setIsInputFocus(false);
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
      clusterStyle.some((style) => style.background === `url("${customCluster._markers[0].T.ok}") no-repeat`) ||
        setClusterStyle((prev) => [
          ...prev,
          {
            centerLatLng: { lat: Ma, lng: La },
            fontSize: '0px',
            width: '56px',
            height: '56px',
            background: `url("${customCluster._markers[0].T.ok}") no-repeat`,
            backgroundSize: 'cover',
            borderRadius: '100%',
            border: 'solid 4px #EB84DA',
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

  return (
    <>
      {isInputFocus && <div className='fixed inset-0 z-40 bg-black bg-opacity-40'></div>}
      <PlaceSearchForm
        searchLocation={searchLocation}
        setSearchResult={setSearchResult}
        setIsInputFocus={setIsInputFocus}
        hasSearchResult={!!searchResult.markers[0]}
      />
      <button
        className='fixed right-4 top-[136px] z-30 h-[44px] w-[44px] rounded-full bg-white'
        onClick={() => {
          setIsPostsView((prev) => !prev);
          isPostsView && setPostsPreview([]);
          isPostsView ? getSpotInfo() : setSpotInfo(undefined);
        }}
      >
        {isPostsView ? (
          <img
            className='mx-auto my-auto'
            src='/svgs/Switch_btn_to_mappin_marker.svg'
          />
        ) : (
          <img
            className='mx-auto my-auto'
            src='/svgs/Switch_btn_to_image_marker.svg'
          />
        )}
      </button>
      {isPostsView || (
        <MapPin className='fixed left-1/2 top-1/2 z-30 h-[48px] w-[28px] -translate-x-[46%] -translate-y-[66%]' />
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
            minLevel={1} // 클러스터 할 최소 지도 레벨
            styles={clusterStyle}
            disableClickZoom={true}
            onClustered={(marker) => onClusteredEvent(marker)}
            calculator={clusterCalculator as any}
            onClusterclick={(marker, cluster) => {
              clusterClickEvent(cluster);
              handleCustomOpen();
            }}
          >
            {postsCoverImages.map(({ post_id, post_image_url, post_lat, post_lng }) => {
              // post_lat && post_lng && polyline.push({ lat: post_lat, lng: post_lng });
              return (
                <MapMarker
                  key={post_image_url}
                  position={{ lat: post_lat, lng: post_lng }}
                  onClick={() => {
                    moveToMarker({ lat: post_lat, lng: post_lng });
                    setPostsPreview([{ postId: post_id, postImageUrl: post_image_url }]);
                    handleCustomOpen();
                  }}
                  image={{
                    // 기본 마커 이미지
                    src: post_image_url,
                    size: {
                      width: 60,
                      height: 60,
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
        {/* <Polyline
          path={[polyline]}
          strokeWeight={5} // 선 두께
          strokeColor={'#FFABF1'} // 선 색깔
          strokeOpacity={1} // 선 불투명도 1에서 0 사이의 값 0에 가까울수록 투명
          strokeStyle={'solid'} // 선 스타일
        /> */}

        {!!spotInfo ? (
          <BottomSheet
            height='custom'
            customHeight=''
            rounded={true}
            isOpen={true}
            showHeader={false}
            hasButton={false}
            className='mb-0 pb-2 pt-7'
            backdrop={false}
          >
            <button
              className='absolute -top-4 left-4 z-50 h-[44px] w-[44px] -translate-y-[90%] rounded-full bg-white'
              onClick={handleFindUserLocation}
            >
              <img
                className='mx-auto my-auto'
                src='/svgs/Geolocation_btn.svg'
              />
            </button>
            {
              // searchResult.hasMore &&
              <button
                className='absolute -top-4 left-1/2 flex h-11 -translate-x-1/2 -translate-y-full flex-row items-center gap-3 rounded-[22px] bg-white px-7 py-2 shadow-BG_S'
                type='button'
                onClick={searchLocation}
              >
                <p className='text-body_md'>검색결과 더보기</p>
                <img src='/svgs/Reload.svg' />
              </button>
            }
            <div className={`flex flex-col ${!!spotInfo.placeName && 'gap-1'}`}>
              <h5 className='text-label_md'>
                {(spotInfo.placeName || spotInfo.address) ?? '위치정보를 불러올 수 없습니다.'}
              </h5>
              {!!spotInfo.placeName && <p className='text-body_md'>{spotInfo.address}</p>}
            </div>
          </BottomSheet>
        ) : (
          <button
            // className='fixed bottom-[100px] left-4 z-30'
            className='fixed bottom-[16px] left-4 z-30 h-[44px] w-[44px] rounded-full bg-white'
            onClick={handleFindUserLocation}
          >
            <img
              className='mx-auto my-auto'
              src='/svgs/Geolocation_btn.svg'
            />
          </button>
        )}
        {!!postsPreView.length ? (
          <BottomSheet
            height='custom'
            customHeight='250px'
            rounded={true}
            isOpen={isCustomHeightOpen}
            showHeader={true}
            showBackButton={false}
            hasButton={false}
            backdrop={false}
            title={`총 ${postsPreView.length}개의 게시물이 있어요!`}
            titleClassName='text-title_lg'
            onClose={handleCustomClose}
            headerClassName='pt-[40px] pb-[12px]'
          >
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
          !isPostsView && (
            <div
              className={`shadow-[0px -4px 10px 0px rgba(0, 0, 0, 0.10)] fixed bottom-0 z-50 w-full ${!!spotInfo || 'bg-white'} px-4 pb-4 pt-3`}
            >
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
          )
        )}
      </Map>
    </>
  );
};

export default GroupMap;
