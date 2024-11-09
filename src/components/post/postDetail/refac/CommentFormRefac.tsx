import { usePostComment } from '@/hooks/queries/byUse/useCommentMutation';
import { Button } from '@/stories/Button';
import React, { useEffect, useRef, useState } from 'react';

const CommentFormRefac = ({ setIsWriteMode, parentId, setIsWriteReplyMode, postId, userDetail }) => {
  const [comment, setComment] = useState<string>('');

  const { mutate: fetchPostComment } = usePostComment();

  const textareaRef = useRef();

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    fetchPostComment({
      postId: postId,
      userId: userDetail?.profiles.user_id!,
      parentId: parentId,
      commentDesc: comment,
    });
    setComment('');
    setIsWriteMode(false);
    if (setIsWriteReplyMode) setIsWriteReplyMode(false);
  };

  return (
    <div className='p-4'>
      <form
        className='flex flex-col gap-2'
        onSubmit={handleSubmit}
      >
        <div className='flex flex-col gap-1 rounded-[12px] border bg-white px-3 py-2'>
          <span className='text-label_sm text-gray-900'>{userDetail?.profiles.user_nickname}</span>
          <textarea
            ref={textareaRef}
            value={comment}
            onChange={(e) => {
              setComment(e.target.value);
            }}
            placeholder='댓글을 입력해주세요.'
            className='resize-none pb-6'
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

export default CommentFormRefac;
