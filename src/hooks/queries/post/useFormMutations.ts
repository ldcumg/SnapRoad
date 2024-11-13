import { postForm } from '../../../services/server-action/formActions';
import queryKeys from '../queryKeys';
import URLS from '@/constants/urls';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useForm = (groupId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.group.posts(groupId) });
      // router.push(URLS.groupList);
      console.log(postForm);
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
