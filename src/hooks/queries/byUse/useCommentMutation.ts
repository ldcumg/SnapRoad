import { fetchDeleteComment, fetchInsertComment, fetchUpdateComment } from '@/services/server-action/commentAction';
import { useMutation, useQueryClient } from '@tanstack/react-query';

/** 댓글 등록 */
export const usePostComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchInsertComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: () => {},
  });
};

/** 댓글 삭제  */
export const useDeleteComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchDeleteComment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: () => {},
  });
};

/** 댓글 수정 */
export const useUpdateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, newCommentDesc }: { commentId: string; newCommentDesc: string }) =>
      fetchUpdateComment(commentId, newCommentDesc),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
    onError: () => {},
  });
};
