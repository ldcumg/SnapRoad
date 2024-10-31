import OptionsMenu from './OptionsMenu';
import { useDeleteComment, useUpdateComment } from '@/hooks/queries/byUse/useCommentMutation';
import Image from 'next/image';
import React, { useState } from 'react';

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
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [newCommentDesc, setNewCommentDesc] = useState<string>(commentDesc!);
  // const []
  console.log('author :>> ', author);
  console.log('commentId :>> ', commentId);

  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: updateComment } = useUpdateComment();

  const [isVisible, setIsVisible] = useState(false);

  const toggleMenu = () => {
    setIsVisible((prev) => !prev);
  };

  const handleUpdateComment = () => {
    updateComment({ commentId, newCommentDesc });
    setIsEditMode(false);
  };

  return (
    <div className='flex items-center gap-1 w-full'>
      <div>이미지</div>
      <div className='w-full'>
        <span className='font-bold'>{author?.user_nickname}</span>
        <div className='flex justify-between'>
          {isEditMode ? (
            <>
              <input
                value={newCommentDesc}
                onChange={(e) => setNewCommentDesc(e.target.value)}
              />
              <button onClick={handleUpdateComment}>수정</button>
            </>
          ) : (
            <p>{commentDesc}</p>
          )}

          <div className='relative flex'>
            <button onClick={toggleMenu}>
              <Image
                src={'/svgs/Dots.svg'}
                alt='더보기'
                width={20}
                height={20}
              />
            </button>
            {isVisible && (
              <div className='flex flex-col absolute border border-black bg-white z-10 top-5 right-1 w-20'>
                <button
                  onClick={(e) => setIsEditMode(true)}
                  className='border-b border-black'
                >
                  수정하기
                </button>
                <button
                  onClick={() => deleteComment(commentId)}
                  className='text-red-600'
                >
                  삭제하기
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
