import { postForm } from './formActions';
import URLS from '@/constants/urls';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useForm = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: postForm,
    onSuccess: () => {
      // router.push(URLS.groupList);
      console.log(postForm);
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
