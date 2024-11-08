import CommentOptions from './CommentOptions';
import { useUpdateComment } from '@/hooks/queries/byUse/useCommentMutation';
import { useProfilesQuery } from '@/hooks/queries/byUse/useProfilesQueries';
import { Button } from '@/stories/Button';
import React, { useState } from 'react';

const Comment = ({
  commentId,
  postAuthorDetail, // 글 작성자
  userDetail, // 이 글을 조회하는 사람
  commentAuthor, // 댓글 작성자
  commentDesc,
  parentId,
  setIsWriteReplyMode,
}: {
  commentId: string;
  userDetail: {
    profileImageUrl: string | undefined;
    profiles: {
      user_id: string;
      user_nickname: string | null;
      // created_at: string;
      // deleted_at: string | null;
      // updated_at: string | null;
      // user_email: string | null;
      user_image_url: string | null;
    };
  };
  postAuthorDetail: {
    profiles: {
      user_id: string;
    };
  };
  commentAuthor: {
    created_at: string;
    // deleted_at: string | null;
    // updated_at: string | null;
    // user_email: string | null;
    user_id: string;
    user_image_url: string | null;
    user_nickname: string | null;
  } | null; // 왜 null 일 수 있지
  commentDesc: string | null;
  parentId: string | null;
  setIsWriteReplyMode?: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [newCommentDesc, setNewCommentDesc] = useState<string>(commentDesc!);

  const { mutate: updateComment } = useUpdateComment();

  const {
    data: authorProfileData,
    isLoading: isProfileLoading,
    isError: isProfileError,
  } = useProfilesQuery(commentAuthor?.user_id!);

  const handleUpdateComment = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    updateComment({ commentId, newCommentDesc });
    setIsEditMode(false);
  };

  return (
    <>
      {isEditMode ? (
        <div className='flex flex-col gap-3 px-4 py-4'>
          <form
            className='flex flex-col gap-2'
            onSubmit={handleUpdateComment}
          >
            <div className='flex flex-col gap-1 rounded-[12px] border bg-white px-3 py-2'>
              <span className='text-label_sm text-gray-900'>{userDetail?.profiles.user_nickname}</span>
              <textarea
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
      ) : (
        <div className='flex gap-3 px-4 py-4'>
          <>
            <div className='h-[32px] w-[32px] overflow-hidden rounded-full'>
              <img
                alt='프로필 이미지'
                src={authorProfileData?.profileImageUrl || '/svgs/Profile.svg'} // 이 글을 쓴 사람
                className='h-full w-full object-cover'
              />
            </div>

            {/* 댓글 부분 */}
            <div className='w-full pb-1'>
              {/* 닉네임 */}
              <div className='flex justify-between'>
                <span className='text-label_sm text-gray-900'>{commentAuthor?.user_nickname}</span>
                <CommentOptions
                  commentId={commentId}
                  setIsEditMode={setIsEditMode}
                  postAuthorId={postAuthorDetail.profiles.user_id}
                  userId={userDetail.profiles.user_id}
                  commentAuthorId={commentAuthor?.user_id!}
                />
              </div>
              {/* 댓글 내용 */}
              <div className='flex justify-between pb-2'>
                <p className='break-all text-body_sm text-gray-900'>{commentDesc}</p>
              </div>
              <div>
                {parentId === null ? (
                  <span
                    className='text-caption_bold_md text-gray-500'
                    onClick={() => setIsWriteReplyMode && setIsWriteReplyMode(true)}
                  >
                    답글 쓰기
                  </span>
                ) : null}
              </div>
            </div>
          </>
        </div>
      )}
    </>
  );
};

export default Comment;
