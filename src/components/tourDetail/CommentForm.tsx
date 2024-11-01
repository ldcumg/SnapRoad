import { usePostComment } from '@/hooks/queries/byUse/useCommentMutation';
import React, { useState } from 'react';

const CommentForm = ({
  newComment,
}: {
  newComment: {
    postId: string;
    userId: string;
    parentId: string | null;
  };
}) => {
  const [comment, setComment] = useState<string>('');

  const { mutate: fetchPostComment } = usePostComment();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetchPostComment({
      postId: newComment.postId,
      userId: newComment.userId,
      parentId: newComment.parentId,
      commentDesc: comment,
    });
    setComment('');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
          }}
          className='border'
        />
        <button type='submit'>전송</button>
      </form>
    </div>
  );
};

export default CommentForm;
