import { getDefaultImageUrl } from '@/services/client-action/storageAction';
import { getSignedImgUrl } from '@/services/server-action/getSignedImgUrl';
import { useQuery } from '@tanstack/react-query';

/**
 * imageUrl 이 null 이면 public 스토리지에 있는 default image url 가져옴
 * imageUrl 이 null 이 아니면 private 스토리지에 있는 이미지로 signed url 만들기
 */
// export const useGetProfileImageUrl = (profileData: any) => {
//   return useQuery({
//     queryKey: ['userImageUrl'],
//     queryFn: async () => {
//       if (profileData?.[0]?.user_image_url === null) {
//         const publicImageUrl = await getDefaultImageUrl();
//         return publicImageUrl.publicUrl;
//       } else {
//         return await getSignedImgUrl('avatars', 86400, profileData?.[0]?.user_image_url);
//       }
//     },
//     enabled: !!profileData, // profileData 존재할 때만 쿼리 실행(이거 안하면 안됨 오류남)
//   });
// };

export const useGetProfileImageUrl = (userImageUrl: string | null) => {
  return useQuery({
    queryKey: ['userImageUrl', userImageUrl], // userImageUrl을 키에 추가하여 캐시 관리
    queryFn: async () => {
      if (!userImageUrl) {
        // null 또는 빈 문자열일 때
        const publicImageUrl = await getDefaultImageUrl();
        return publicImageUrl.publicUrl;
      } else {
        return await getSignedImgUrl('avatars', 86400, userImageUrl);
      }
    },
    enabled: true, // 항상 실행 가능하도록 설정
  });
};
