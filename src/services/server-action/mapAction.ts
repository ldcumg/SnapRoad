'use server';

const MAPS_URL = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=127.1086228&y=37.4012191`;

export const fetchMaps = async () => {
  return await fetch(MAPS_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'KakaoAK ' + process.env.NEXT_PUBLIC_KAKAO_REST_KEY!,
    },
  });
};
