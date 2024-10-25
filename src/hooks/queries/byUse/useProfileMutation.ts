import { updateProfile } from '@/services/server-action/profilesAction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/** 프로필 업데이트 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, imageName, newNickname }: { userId: string; imageName: string; newNickname: string }) =>
      updateProfile(userId, imageName, newNickname),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
      // alert(data.message);
    },
    onError: (error) => {
      // alert(error.message);
    },
  });
};
