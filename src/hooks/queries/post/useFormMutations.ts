import { postForm, updateForm } from '../../../services/server-action/formActions';
import queryKeys from '../queryKeys';
// import URLS from '@/constants/urls';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export const useSubmitForm = (groupId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.group.postsCoverImages(groupId) });
      // router.push(URLS.groupList);
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};

export const useUpdateForm = (groupId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateForm,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.group.postsCoverImages(groupId) });
    },
    onError: (error) => {
      alert(error.message);
    },
  });
};
