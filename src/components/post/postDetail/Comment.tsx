import { useDeleteComment, useUpdateComment } from '@/hooks/queries/byUse/useCommentMutation';
import { useGetProfileImageUrl } from '@/hooks/queries/byUse/useStorageQueries';
import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';

const Comment = ({
  commentId,
  userId,
  author, // 댓글 작성자
  commentDesc,
}: {
  commentId: string;
  userId: string;
  author: any;
  commentDesc: string | null;
}) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [newCommentDesc, setNewCommentDesc] = useState<string>(commentDesc!);
  const [isVisible, setIsVisible] = useState(false);

  const { mutate: deleteComment } = useDeleteComment();
  const { mutate: updateComment } = useUpdateComment();

  // TODO 아래 것 사용하기
  const { data: profileImageUrl } = useGetProfileImageUrl(author?.user_image_url);
  // const { data: profileData, isLoading: isProfileLoading, isError: isProfileError } = useProfilesQuery(userId);

  const commentMenuRef = useRef<HTMLDivElement>(null);

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

  const toggleMenu = () => {
    setIsVisible((prev) => !prev);
  };

  const handleUpdateComment = () => {
    updateComment({ commentId, newCommentDesc });
    setIsEditMode(false);
  };

  return (
    <div className='flex items-center gap-1 w-full'>
      <div>
        <Image
          alt='프로필 이미지'
          src={profileImageUrl!}
          height={20}
          width={20}
        />
        {/* 
        <img
          alt='프로필 이미지'
          src={profileData?.profileImageUrl || '/svgs/Profile.svg'}
          className='object-cover w-full h-full'
        /> */}
      </div>
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
            <>
              <p>{commentDesc}</p>
              <div
                className='relative flex'
                ref={commentMenuRef}
              >
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
                      onClick={() => {
                        setIsEditMode(true);
                        setIsVisible(false);
                      }}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
