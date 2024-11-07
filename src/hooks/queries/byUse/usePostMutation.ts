import { fetchDeletePost } from '@/services/server-action/postAction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/** post 삭제  */
export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchDeletePost,
    onSuccess: (data) => {
      // TODO 삭제 후 게시글 리스트로 이동
      queryClient.invalidateQueries({ queryKey: ['post'] });
    },
    onError: () => {},
  });
};
