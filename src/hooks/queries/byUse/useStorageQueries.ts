import { getDefaultImageUrl, getSignedImageUrl } from '@/services/client-action/storageAction';
import { getSignedImgUrl } from '@/services/server-action/getSignedImgUrl';
import { useQuery } from '@tanstack/react-query';

// imageUrl 이 null 이면 public 스토리지에 있는 default image url 가져옴
// imageUrl 이 null 이 아니면 private 스토리지에 있는 이미지로 signed url 만들기
export const useGetProfileImageUrl = (profileData: any) => {
  console.log('profileData?.[0]?.user_image_url :>> ', profileData?.[0]?.user_image_url);

  return useQuery({
    queryKey: ['userImageUrl'],
    queryFn: async () => {
      if (profileData?.[0]?.user_image_url === null) {
        const publicImageUrl = await getDefaultImageUrl();
        console.log('기본 이미지를 가져옴', publicImageUrl);
        return publicImageUrl.publicUrl;
      } else {
        const test = await getSignedImgUrl('avatars', 60, profileData?.[0]?.user_image_url);
        console.log('프라이빗 이미지 URL을 가져옴 :>> ', test);
        return test;
      }
    },
    enabled: !!profileData, // profileData 존재할 때만 쿼리 실행(이거 안하면 안됨 오류남)
  });
};
