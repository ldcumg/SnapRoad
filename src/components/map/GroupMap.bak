'use client';

import PlaceSearchForm from './PlaceSearchForm';
import PostsPreviewLayout from './PostsPreviewLayout';
import SearchResultLayout from './SearchResultLayout';
import Loading from '@/app/loading';
import { getGroupPostsCoverImagesQuery } from '@/hooks/queries/post/useGroupPostsQuery';
import MapPin from '@/lib/icon/Map_Pin';
import SearchResultMarker from '@/lib/icon/Search_Result_Marker';
import { keywordSearch } from '@/services/server-action/mapAction';
import useBottomSheetStore from '@/stores/story/useBottomSheetStore';
import { Button } from '@/stories/Button';
import type { ClusterStyle, LatLng, LocationInfo } from '@/types/mapTypes';
import { toast } from 'garlic-toast';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { FieldValues } from 'react-hook-form';
import { useKakaoLoader, Map, MapMarker, MarkerClusterer, Polyline, CustomOverlayMap } from 'react-kakao-maps-sdk';

type Props = {
  groupId: string;
  desktop: boolean;
  point: { lat: number; lng: number } | undefined;
};

const GroupMap = ({ groupId, desktop, point }: Props) => {
  const { handleCustomOpen } = useBottomSheetStore((state) => state);
  const [map, setMap] = useState<kakao.maps.Map>();
  const [isPostsView, setIsPostsView] = useState<boolean>(true);
  const [postsPreView, setPostsPreview] = useState<{ postId: string; postImageUrl: string }[]>([]);
  const [searchResult, setSearchResult] = useState<{ markers: LocationInfo[]; hasMore: boolean }>({
    markers: [],
    hasMore: false,
  });
  const searchKeyword = useRef<{ keyword: string; page: number }>({ keyword: '', page: 1 });
  const [spotInfo, setSpotInfo] = useState<Omit<LocationInfo, 'id'>>();
  const [clusterStyle, setClusterStyle] = useState<ClusterStyle[]>([]);

  const polyline: LatLng[] = [];

  const [isInputFocus, setIsInputFocus] = useState<boolean>(false);

  const { data: postsCoverImages, isPending, isError, error } = getGroupPostsCoverImagesQuery(groupId);

  const [mapLoading, mapError] = useKakaoLoader({
    appkey: process.env.NEXT_PUBLIC_KAKAO_KEY!,
    libraries: ['services', 'clusterer'],
  });

  // 게시물 좌표 기준으로 지도 위치 재설정
  useEffect(() => {
    if (!point && map && postsCoverImages?.length) {
      const bounds = new kakao.maps.LatLngBounds();
      postsCoverImages.forEach(
        ({ post_lat, post_lng }) => post_lat && post_lng && bounds.extend(new kakao.maps.LatLng(post_lat, post_lng)),
      );
      postsCoverImages[0].post_lat && postsCoverImages[0].post_lng && map.panTo(bounds);
    }
  }, [map, postsCoverImages]);

  // 게시물 상세 페이지에서 올 경우 해당 게시물 위치
  useEffect(() => {
    if (!!point && map) {
      moveToMarker(point);
      map.setLevel(4, { animate: true });
    }
  }, [map]);

  if (mapLoading || isPending) return <Loading />;

  if (mapError) return new Error('지도를 불러오지 못 했습니다.');

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
      setSearchResult((prev) => ({ ...prev, hasMore: false }));
      searchKeyword.current = { keyword: '', page: 1 };
      return;
    }

    searchResult.hasMore || setSearchResult((prev) => ({ ...prev, hasMore: true }));
    searchInput
      ? (searchKeyword.current = { keyword: searchInput, page: (searchKeyword.current.page += 1) })
      : (searchKeyword.current.page = searchKeyword.current.page += 1);

    isInputFocus && setIsInputFocus(false);
  };

  return (
    <>
      {isInputFocus && <div className='fixed inset-0 z-40 bg-black bg-opacity-40'></div>}
      <PlaceSearchForm
        desktop={desktop}
        searchLocation={searchLocation}
        setSearchResult={setSearchResult}
        setIsInputFocus={setIsInputFocus}
        hasSearchResult={!!searchResult.markers[0]}
      />
      <button
        className='fixed right-[16px] top-[136px] z-30 h-[44px] w-[44px] rounded-full bg-white pc:top-[72.5px]'
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
        <MapPin className='fixed left-1/2 top-1/2 z-30 h-[48px] w-[28px] -translate-x-1/2 -translate-y-[29%]' />
      )}
      <Map
        className='h-screen w-full'
        center={{ lat: 35.85, lng: 127.65 }}
        onCreate={setMap}
        level={13}
        isPanto={true}
        onDragEnd={() => isPostsView || getSpotInfo()}
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
              post_lat && post_lng && polyline.push({ lat: post_lat, lng: post_lng });
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
              <CustomOverlayMap
                key={marker.id}
                position={{ lat: marker.lat, lng: marker.lng }}
              >
                <SearchResultMarker onClick={() => moveToMarker(marker)} />
              </CustomOverlayMap>
            ))}
          </>
        )}
        <Polyline
          path={[polyline]}
          strokeWeight={5} // 선 두께
          strokeColor={'#FFABF1'} // 선 색깔
          strokeOpacity={1} // 선 불투명도 1에서 0 사이의 값 0에 가까울수록 투명
          strokeStyle={'solid'} // 선 스타일
        />

        {!!spotInfo && (
          <SearchResultLayout
            desktop={desktop}
            handleFindUserLocation={handleFindUserLocation}
          >
            {searchResult.hasMore && (
              <button
                className='absolute -top-[16px] left-1/2 flex h-[44px] -translate-x-1/2 -translate-y-full flex-row items-center gap-[12px] rounded-[22px] bg-white px-[24px] py-[8px] shadow-BG_S'
                type='button'
                onClick={searchLocation}
              >
                <span className='whitespace-nowrap text-body_md'>검색결과 더보기</span>
                <img src='/svgs/Reload.svg' />
              </button>
            )}
            <div className={`flex flex-col ${!!spotInfo.placeName && 'gap-[4px]'} pc:mx-auto`}>
              <h5 className='text-label_md pc:mx-auto'>
                {(spotInfo.placeName || spotInfo.address) ?? '위치정보를 불러올 수 없습니다.'}
              </h5>
              {!!spotInfo.placeName && <span className='text-body_md pc:mx-auto'>{spotInfo.address}</span>}
            </div>
          </SearchResultLayout>
        )}
        {(!spotInfo || desktop) && (
          <button
            className='fixed bottom-[100px] left-[16px] z-30 h-[44px] w-[44px] rounded-full bg-white pc:left-auto pc:right-[16px] pc:top-[132px]'
            onClick={handleFindUserLocation}
          >
            <img
              className='mx-auto my-auto'
              src='/svgs/Geolocation_btn.svg'
            />
          </button>
        )}
        {!!postsPreView.length ? (
          <PostsPreviewLayout
            desktop={desktop}
            postsPreView={postsPreView}
            setPostsPreview={setPostsPreview}
          >
            <ol className='flex flex-row gap-[12px] overflow-x-auto pc:min-w-[456px] pc:max-w-[856px]'>
              {postsPreView.map((post) => (
                <li
                  className='h-[132px] w-[132px] pc:h-[152px] pc:w-[152px]'
                  key={post.postId}
                >
                  <Link
                    className='block h-full w-full'
                    href={`/group/${groupId}/post/${post.postId}`}
                  >
                    <img
                      className='h-full min-h-[132px] w-full min-w-[132px] rounded-[8px] object-cover pc:min-h-[152px] pc:min-w-[152px] pc:rounded-[12px]'
                      src={post.postImageUrl}
                      alt={`Post ${post.postId}`}
                    />
                  </Link>
                </li>
              ))}
            </ol>
          </PostsPreviewLayout>
        ) : (
          <div
            className={`shadow-[0px -4px 10px 0px rgba(0, 0, 0, 0.10)] fixed bottom-0 z-30 w-full ${!!spotInfo || 'bg-white'} px-[16px] pb-[16px] pt-[12px] pc:bottom-[28px] pc:left-1/2 pc:flex pc:w-[628px] pc:-translate-x-1/2 pc:items-center pc:rounded-[28px] pc:p-[40px]`}
          >
            <Button
              type='button'
              onClick={handleAddPostRoute}
              variant='primary'
              size={desktop ? 'large' : 'full'}
              className='bottom-[16px] z-30 h-[56px] px-[24px] pc:mx-auto pc:h-[56px] pc:w-[343px] pc:py-[16px]'
              disabled={!isPostsView && !spotInfo?.address}
            >
              <span className='flex gap-[8px]'>
                <img src='/svgs/Plus_LG.svg' />
                <span className='text-title_lg'>게시물 추가하기</span>
              </span>
            </Button>
          </div>
        )}
      </Map>
    </>
  );
};

export default GroupMap;
