import { HOME, LOGIN_PAGE } from '@/constants/urls';
import { signUp, login, getSession, updateUser } from '@/services/server-action/authActions';
import { updateProfile } from '@/services/server-action/profilesAction';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

/** 프로필 업데이트 */
export const useUpdateProfile = () => {
  console.log('프로필 업데이트');
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn: updateProfile,
    mutationFn: ({ userId, imageName, newNickname }: { userId: string; imageName: string; newNickname: string }) =>
      updateProfile(userId, imageName, newNickname),
    onSuccess: (data) => {
      queryClient.invalidateQueries(['profiles']); // [???????]
      // alert(data.message);
    },
    onError: (error) => {
      // alert(error.message);
    },
  });
};
