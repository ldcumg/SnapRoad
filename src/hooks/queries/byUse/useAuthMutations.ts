import { HOME, LOGIN_PAGE } from '@/constants/urls';
import { signUp, login } from '@/services/server-action/authActions';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

const useSignUp = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: signUp,
    onSuccess: (data) => {
      alert(data.message);
      router.push(LOGIN_PAGE);
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};

/** 로그인 */
const useLogin = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      alert(data.message);
      router.push(HOME);
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};

export { useSignUp, useLogin };
