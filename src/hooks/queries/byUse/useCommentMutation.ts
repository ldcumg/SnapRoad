import { fetchPostComment } from '@/services/server-action/commentAction';
import { useMutation } from '@tanstack/react-query';

/** 댓글 등록 */
export const usePostComment = () => {
  return useMutation({
    mutationFn: fetchPostComment,
    onSuccess: (data) => {
      alert(data.message);
    },
    onError: () => {},
  });
};
