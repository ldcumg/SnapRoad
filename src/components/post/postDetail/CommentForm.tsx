import { usePostComment } from '@/hooks/queries/byUse/useCommentMutation';
import { Button } from '@/stories/Button';
import React, { useState } from 'react';

interface CommentFormProps {
  postId: string;
  user: {
    profiles: {
      user_id: string;
      user_image_url: string | null;
      user_nickname: string | null;
    };
    profileImageUrl: string | undefined;
  };
  parentId: string | null;
  setIsWriteMode: React.Dispatch<React.SetStateAction<boolean>>;
  setIsWriteReplyMode?: React.Dispatch<React.SetStateAction<boolean>>;
}

const CommentForm = ({ postId, user, parentId, setIsWriteMode, setIsWriteReplyMode }: CommentFormProps) => {
  const [comment, setComment] = useState<string>('');

  const { mutate: fetchPostComment } = usePostComment();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetchPostComment({
      postId: postId,
      userId: user?.profiles.user_id!,
      parentId: parentId,
      commentDesc: comment,
    });
    setComment('');
    setIsWriteMode(false);
    if (setIsWriteReplyMode) setIsWriteReplyMode(false);
  };

  return (
    <div className='py-4 '>
      <form
        className='flex flex-col gap-2'
        onSubmit={handleSubmit}
      >
        <div className='flex flex-col border rounded-[12px] py-2 px-3 gap-1 bg-white'>
          <span className='text-gray-900 text-label_sm'>{user?.profiles.user_nickname}</span>
          <input
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            placeholder='댓글을 입력해주세요.'
            className='pb-6'
          />
        </div>
        <div className='flex justify-end'>
          <Button
            type='submit'
            variant='primary'
            label='등록 '
            size='small'
          />
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
