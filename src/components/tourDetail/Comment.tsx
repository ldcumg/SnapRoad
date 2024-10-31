import OptionsMenu from './OptionsMenu';
import { useDeleteComment } from '@/hooks/queries/byUse/useCommentMutation';
import React from 'react';

// TODO 타입
const Comment = ({
  commentId,
  userId,
  author,
  commentDesc,
}: {
  commentId: string;
  userId: string;
  author: any;
  commentDesc: string | null;
}) => {
  console.log('author :>> ', author);
  console.log('commentId :>> ', commentId);

  const { mutate: deleteComment } = useDeleteComment();

  return (
    <div className='flex items-center gap-1 w-full'>
      <div>이미지</div>
      <div className='w-full'>
        <span className='font-bold'>{author?.user_nickname}</span>
        <div className='flex justify-between'>
          <p>{commentDesc}</p>
          <OptionsMenu
            handleDelete={deleteComment}
            id={commentId}
          />
        </div>
      </div>
    </div>
  );
};

export default Comment;
