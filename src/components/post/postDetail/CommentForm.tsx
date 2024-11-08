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
    <div className='px-4 py-4'>
      <form
        className='flex flex-col gap-2'
        onSubmit={handleSubmit}
      >
        <div className='flex flex-col gap-1 rounded-[12px] border bg-white px-3 py-2'>
          <span className='text-label_sm text-gray-900'>{user?.profiles.user_nickname}</span>
          <textarea
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
