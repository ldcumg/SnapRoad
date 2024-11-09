import { useUpdateComment } from '@/hooks/queries/byUse/useCommentMutation';
import { Button } from '@/stories/Button';
import { Comment, UserDetail } from '@/types/postDetailTypes';
import React, { useEffect, useRef, useState } from 'react';

type CommentFormProps = {
  comment: Comment;
  userDetail: UserDetail;
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
};

// TODO 등록폼 이랑 합치기
const CommentUpdateForm = ({ comment, userDetail, setIsEditMode }: CommentFormProps) => {
  const [newCommentDesc, setNewCommentDesc] = useState<string>(comment.comment_desc!);

  const { mutate: updateComment } = useUpdateComment();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleUpdateComment = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    updateComment({ commentId: comment.comment_id, newCommentDesc: newCommentDesc });
    setIsEditMode(false); // 수정 폼 닫기
  };

  return (
    <div className='p-4'>
      <form
        className='flex flex-col gap-2'
        onSubmit={handleUpdateComment}
      >
        <div className='flex flex-col gap-1 rounded-[12px] border bg-white px-3 py-2'>
          <span className='text-label_sm text-gray-900'>{userDetail?.profiles.user_nickname}</span>
          <textarea
            ref={textareaRef}
            value={newCommentDesc}
            onChange={(e) => {
              setNewCommentDesc(e.target.value);
            }}
            placeholder='댓글을 입력해주세요.'
            className='pb-6'
          />
        </div>
        <div className='flex justify-end'>
          <Button
            type='submit'
            variant='primary'
            label='수정 '
            size='small'
          />
        </div>
      </form>
    </div>
  );
};

export default CommentUpdateForm;
