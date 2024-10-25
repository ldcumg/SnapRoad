import { getDefaultImageUrl } from '@/services/client-action/storageAction';
import { getSignedImgUrl } from '@/services/server-action/getSignedImgUrl';
import { useQuery } from '@tanstack/react-query';

/**
 * imageUrl 이 null 이면 public 스토리지에 있는 default image url 가져옴
 * imageUrl 이 null 이 아니면 private 스토리지에 있는 이미지로 signed url 만들기
 */
export const useGetProfileImageUrl = (profileData: any) => {
  return useQuery({
    queryKey: ['userImageUrl'],
    queryFn: async () => {
      if (profileData?.[0]?.user_image_url === null) {
        const publicImageUrl = await getDefaultImageUrl();
        return publicImageUrl.publicUrl;
      } else {
        return await getSignedImgUrl('avatars', 60, profileData?.[0]?.user_image_url);
      }
    },
    enabled: !!profileData, // profileData 존재할 때만 쿼리 실행(이거 안하면 안됨 오류남)
  });
};
