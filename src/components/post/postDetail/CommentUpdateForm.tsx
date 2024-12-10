import { useUpdateComment } from '@/hooks/queries/comments/useCommentMutation';
import { useCommentForm } from '@/hooks/useCustomForm/useCommentForm';
import { Button } from '@/stories/Button';
import { Comment, UserDetail } from '@/types/postDetailTypes';
import React, { useEffect, useRef, useState } from 'react';
import { FieldValues } from 'react-hook-form';

type CommentFormProps = {
  comment: Comment;
  userDetail: UserDetail;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
};

// TODO 등록폼 이랑 합치기
const CommentUpdateForm = ({ comment, userDetail, setIsEditMode }: CommentFormProps) => {
  const { register, handleSubmit, watch, setFocus, setValue } = useCommentForm();

  const { mutate: updateComment } = useUpdateComment();

  useEffect(() => {
    if (comment) {
      setValue('comment', comment.comment_desc);
    }
  }, [comment]);

  useEffect(() => {
    setFocus('comment');
  }, [setFocus]);

  const newComment = watch('comment');

  const handleUpdateComment = (value: FieldValues) => {
    updateComment({ commentId: comment.comment_id, newCommentDesc: value.comment });
    setIsEditMode(false); // 수정 폼 닫기
  };

  const handleCancelUpdate = () => {
    setIsEditMode(false);
  };

  return (
    <div className='p-4'>
      <form
        className='flex flex-col gap-2'
        onSubmit={handleSubmit(handleUpdateComment)}
      >
        <div className='flex flex-col gap-1 rounded-[12px] border bg-white px-3 py-2'>
          <span className='text-label_sm text-gray-900'>{userDetail?.profiles.user_nickname}</span>
          <textarea
            {...register('comment')}
            placeholder='댓글을 입력해주세요.'
            className='pb-6'
          />
        </div>
        <div className='flex justify-end gap-1'>
          {/* <Button
            type='submit'
            variant='primary'
            label='취소 '
            size='small'
            onClick={handleCancelUpdate}
          /> */}
          <Button
            type='submit'
            variant='primary'
            label='수정 '
            size='small'
            disabled={!newComment}
          />
        </div>
      </form>
    </div>
  );
};

export default CommentUpdateForm;
