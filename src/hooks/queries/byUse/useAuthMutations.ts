import URLS from '@/constants/urls';
import { signUp, login, signOut } from '@/services/server-action/authActions';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

/** 회원 가입 */
export const useSignUp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: signUp,
    onSuccess: () => {
      router.push(URLS.signupSuccess);
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};

/** 로그인 */
export const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      router.push(URLS.home);
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};

/** 로그아웃 */
export const useSignOut = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: signOut,
    onSuccess: () => {
      router.push(URLS.home);
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
