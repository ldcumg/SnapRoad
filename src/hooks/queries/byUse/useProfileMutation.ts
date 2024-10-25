import { HOME, LOGIN_PAGE } from '@/constants/urls';
import { signUp, login, getSession, updateUser } from '@/services/server-action/authActions';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

/** 프로필 업데이트 */
export const useSignUp = () => {
  return useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      alert(data.message);
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
