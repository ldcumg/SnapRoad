import { useEffect, useState } from 'react';

const useMediaQuery = (query: string, initialValue: boolean = false): boolean => {
  // 서버 사이드 렌더링(SSR) 환경에서는 `initialValue`를 기본값으로 사용
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return initialValue; // SSR 시 초기값 제공
    }
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return; // SSR 방지

    const matchMedia = window.matchMedia(query);

    // 상태 변경 핸들러
    const handleChange = () => setMatches(matchMedia.matches);

    // 초기 상태 설정
    handleChange();

    // 이벤트 리스너 추가
    matchMedia.addEventListener('change', handleChange);

    return () => {
      // 이벤트 리스너 제거
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
};

export default useMediaQuery;
