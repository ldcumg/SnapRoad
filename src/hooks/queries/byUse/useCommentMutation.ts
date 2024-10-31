import { fetchInsertComment } from '@/services/server-action/commentAction';
import { QueryClient, useMutation, useQueryClient } from '@tanstack/react-query';

/** 댓글 등록 */
export const usePostComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchInsertComment,
    onSuccess: (data) => {
      alert(data.message);
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: () => {},
  });
};
