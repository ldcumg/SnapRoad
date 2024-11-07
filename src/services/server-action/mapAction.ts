'use server';

import type { LocationInfo, Latlng, SearchResult } from '@/types/mapTypes';
import type { FieldValues } from 'react-hook-form';

const MAP_BASE_URL = 'https://dapi.kakao.com/v2/local';
const headers = {
  'Content-Type': 'application/json',
  Authorization: 'KakaoAK ' + process.env.NEXT_PUBLIC_KAKAO_REST_KEY!,
};

/** 키워드로 장소 검색 */
export const keywordSearch = async ({
  keyword,
  page,
}: {
  keyword: FieldValues;
  page: number;
}): Promise<{ results: LocationInfo[]; is_end: boolean }> => {
  const response = await fetch(`${MAP_BASE_URL}/search/keyword?query=${keyword}&page=${page}`, {
    method: 'GET',
    cache: 'no-store',
    headers,
  });

  if (!response.ok) throw new Error('키워드 검색에 실패했습니다.');

  const {
    documents,
    meta: { is_end },
  } = await response.json();
  const results = documents.map(({ id, place_name, road_address_name, address_name, y, x }: SearchResult) => {
    const address = road_address_name || address_name;
    return { id, placeName: place_name, address, lat: Number(y), lng: Number(x) };
  });

  return { results, is_end };
};

/** 위도, 경도로 주소 요청 */
export const getAddress = async ({ lat, lng }: Latlng): Promise<string> => {
  const res = await fetch(`${MAP_BASE_URL}/geo/coord2address?y=${lat}&x=${lng}`, {
    method: 'GET',
    cache: 'no-store',
    headers,
  });

  if (!res.ok) throw new Error('주소를 불러오지 못 했습니다.');

  const {
    documents: [document],
  } = await res.json();

  return document?.road_address?.address_name ?? document?.address.address_name;
};
