const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_KEY;

// 주어진 위도(lat)와 경도(lng)를 사용하여 역지오코딩을 수행하는 함수
export const reverseGeocode = async (lat: number, lng: number): Promise<string | null> => {
  try {
    // Kakao API를 통해 좌표를 주소로 변환하기 위한 요청
    const response = await fetch(`https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lng}&y=${lat}`, {
      headers: {
        Authorization: `KakaoAK ${KAKAO_API_KEY}`, // Kakao API 키 설정
      },
    });

    // 응답이 성공적이지 않을 경우 오류 메시지를 출력하고 null 반환
    if (!response.ok) {
      console.error('역지오코딩 데이터 가져오기 실패:', response.statusText);
      return null;
    }

    // 응답 데이터를 JSON 형태로 파싱
    const data = await response.json();

    // 데이터가 존재하고 documents 배열이 비어있지 않을 경우 주소 반환
    if (data && data.documents && data.documents.length > 0) {
      return data.documents[0].address.address_name;
    }

    // 조건에 맞는 주소가 없을 경우 null 반환
    return null;
  } catch (error) {
    // 예외 발생 시 오류 메시지를 출력하고 null 반환
    console.error('역지오코딩 실패:', error);
    return null;
  }
};
