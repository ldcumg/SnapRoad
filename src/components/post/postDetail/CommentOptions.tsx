import { useDeleteComment } from '@/hooks/queries/byUse/useCommentMutation';
import { Comment } from '@/types/postDetailTypes';
import React, { useEffect, useMemo, useRef, useState } from 'react';

interface CommentOptionsProps {
  setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
  comment: Comment;
  postAuthorId: string;
  userId: string;
}

const CommentOptions = ({ setIsEditMode, comment, postAuthorId, userId }: CommentOptionsProps) => {
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
    const canEdit = userId === comment.user_id;
    const canDelete = userId === comment.user_id || userId === postAuthorId;
    const canShowMenu = canEdit || canDelete;

    return {
      showEditButton: canEdit,
      showDeleteButton: canDelete,
      showMenuButton: canShowMenu,
    };
  }, [userId, comment.user_id, postAuthorId]);

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
        <div className='absolute right-1 top-5 z-10 flex flex-col rounded-md bg-white'>
          {showEditButton && (
            <button
              onClick={() => {
                setIsEditMode(true);
                setIsVisible(false);
              }}
              className='whitespace-nowrap p-2.5 text-body_md text-gray-900'
            >
              댓글 수정
            </button>
          )}

          {/* 삭제 버튼 표시 여부 */}
          {showDeleteButton && (
            <button
              onClick={() => {
                // 삭제 확인 alert
                const isConfirmed = confirm('댓글을 삭제하시겠습니까?');

                if (isConfirmed) {
                  deleteComment(comment.comment_id);
                }
              }}
              className='whitespace-nowrap p-2.5 text-body_md text-danger'
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
