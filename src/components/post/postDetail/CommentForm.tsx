import { usePostComment } from '@/hooks/queries/byUse/useCommentMutation';
import { Button } from '@/stories/Button';
import { UserDetail } from '@/types/postDetailTypes';
import React, { useEffect, useRef, useState } from 'react';

type CommentFormProps = {
  setIsWriteMode?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsWriteReplyMode?: React.Dispatch<React.SetStateAction<boolean>>;
  parentId: string | null;
  postId: string;
  userDetail: UserDetail;
};

const CommentForm = ({ setIsWriteMode, setIsWriteReplyMode, parentId, postId, userDetail }: CommentFormProps) => {
  const [comment, setComment] = useState<string>('');

  const { mutate: fetchPostComment } = usePostComment();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
    if (setIsWriteMode) setIsWriteMode(false); // 글 등록을 했으면 등록 폼 닫기
    if (setIsWriteReplyMode) setIsWriteReplyMode(false); // 대댓글 등록 했으면 닫기
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

export default CommentForm;
