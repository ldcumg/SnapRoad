import { useDeleteComment } from '@/hooks/queries/byUse/useCommentMutation';
import React, { useEffect, useMemo, useRef, useState } from 'react';

interface CommentOptionsProps {
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  commentId: string;
  postAuthorId: string;
  userId: string;
  commentAuthorId: string;
}

const CommentOptions = ({ setIsEditMode, commentId, postAuthorId, userId, commentAuthorId }: CommentOptionsProps) => {
  const [isVisible, setIsVisible] = useState(false);

  const { mutate: deleteComment } = useDeleteComment();

  const commentMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsVisible((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commentMenuRef.current && !commentMenuRef.current.contains(event.target as Node)) {
        setIsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 버튼 표시 여부를 useMemo로 계산
  const { showEditButton, showDeleteButton, showMenuButton } = useMemo(() => {
    const canEdit = userId === commentAuthorId;
    const canDelete = userId === commentAuthorId || userId === postAuthorId;
    const canShowMenu = canEdit || canDelete;

    return {
      showEditButton: canEdit,
      showDeleteButton: canDelete,
      showMenuButton: canShowMenu,
    };
  }, [userId, commentAuthorId, postAuthorId]);

  return (
    <div
      className='relative flex'
      ref={commentMenuRef}
    >
      {/* 메뉴 버튼 표시 여부 */}
      {showMenuButton && (
        <button onClick={toggleMenu}>
          <img
            src={'/svgs/Dots.svg'}
            alt='더보기'
            width={24}
            height={24}
          />
        </button>
      )}

      {isVisible && (
        <div className='flex flex-col absolute bg-white z-10 top-5 right-1 rounded-md'>
          {showEditButton && (
            <button
              onClick={() => {
                setIsEditMode(true);
                setIsVisible(false);
              }}
              className='text-gray-900 text-body_md p-2.5 whitespace-nowrap'
            >
              댓글 수정
            </button>
          )}

          {/* 삭제 버튼 표시 여부 */}
          {showDeleteButton && (
            <button
              onClick={() => {
                // 삭제 확인 alert
                const isConfirmed = confirm('정말로 댓글을 삭제하시겠습니까?');

                if (isConfirmed) {
                  deleteComment(commentId);
                }
              }}
              className='text-danger text-body_md p-2.5 whitespace-nowrap'
            >
              댓글 삭제
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentOptions;
