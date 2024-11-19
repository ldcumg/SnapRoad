import { usePostComment } from '@/hooks/queries/byUse/useCommentMutation';
import { useCommentForm } from '@/hooks/useCustomForm/useCommentForm';
import { Button } from '@/stories/Button';
import { UserDetail } from '@/types/postDetailTypes';
import React, { useEffect } from 'react';
import { FieldValues } from 'react-hook-form';

type CommentFormProps = {
  setIsWriteMode?: React.Dispatch<React.SetStateAction<boolean>>;
  setIsWriteReplyMode?: React.Dispatch<React.SetStateAction<boolean>>;
  parentId: string | null;
  postId: string;
  userDetail: UserDetail;
};

const CommentForm = ({ setIsWriteMode, setIsWriteReplyMode, parentId, postId, userDetail }: CommentFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setFocus,
  } = useCommentForm();

  const { mutate: fetchPostComment } = usePostComment();

  useEffect(() => {
    setFocus('comment');
  }, [setFocus]);

  const comment = watch('comment');

  const onSubmitComment = async (value: FieldValues) => {
    fetchPostComment({
      postId: postId,
      userId: userDetail?.profiles.user_id!,
      parentId: parentId,
      commentDesc: value.comment,
    });

    if (setIsWriteMode) setIsWriteMode(false); // 글 등록을 했으면 등록 폼 닫기
    if (setIsWriteReplyMode) setIsWriteReplyMode(false); // 대댓글 등록 했으면 닫기
  };

  return (
    <div className='p-4'>
      <form
        className='flex flex-col gap-2'
        onSubmit={handleSubmit(onSubmitComment)}
      >
        <div className='flex flex-col gap-1 rounded-[12px] border bg-white px-3 py-2'>
          <span className='text-label_sm text-gray-900'>{userDetail?.profiles.user_nickname}</span>
          <textarea
            {...register('comment')}
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
            disabled={!comment}
          />
        </div>
      </form>
    </div>
  );
};

export default CommentForm;
