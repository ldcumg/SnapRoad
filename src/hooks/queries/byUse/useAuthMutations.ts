import { LOGIN_PAGE } from '@/constants/urls';
import { signUp } from '@/services/server-action/authActions';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useSignUp = () => {
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
