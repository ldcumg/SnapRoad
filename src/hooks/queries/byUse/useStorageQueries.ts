import { getDefaultImageUrl } from '@/services/client-action/storageAction';
import { getSignedImgUrl } from '@/services/server-action/getSignedImgUrl';
import { useQuery } from '@tanstack/react-query';

// TODO 삭제 예정
export const useGetProfileImageUrl = (userImageUrl: string | null) => {
  return useQuery({
    queryKey: ['userImageUrl', userImageUrl],
    queryFn: async () => {
      if (!userImageUrl) {
        // null 또는 빈 문자열일 때
        const publicImageUrl = await getDefaultImageUrl();
        return publicImageUrl.publicUrl;
      } else {
        return await getSignedImgUrl('avatars', 86400, userImageUrl);
      }
    },
    enabled: true,
  });
};
