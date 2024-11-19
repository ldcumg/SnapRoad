import CommentForm from './CommentForm';
import CommentOptions from './CommentOptions';
import CommentUpdateForm from './CommentUpdateForm';
import ProfileImage from './ProfileImage';
import { Comment, PostDetail, UserDetail } from '@/types/postDetailTypes';
import React, { useState } from 'react';

type CommentNodeProps = {
  comment: Comment;
  userDetail: UserDetail;
  postDetail: PostDetail;
};

const CommentNode = ({ comment, userDetail, postDetail }: CommentNodeProps) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isWriteReplyMode, setIsWriteReplyMode] = useState<boolean>(false);

  return (
    <li>
      {isEditMode ? (
        // 수정
        <CommentUpdateForm
          comment={comment}
          userDetail={userDetail}
          setIsEditMode={setIsEditMode}
        />
      ) : (
        <div className='flex w-full gap-3 p-4'>
          <ProfileImage
            profileImageUrl={comment.comment_author_user.signed_image_url}
            size='small'
          />

          <div className='w-full'>
            <div className='flex justify-between pb-1'>
              <p className='text-label_sm text-gray-900'>{comment.comment_author_user.user_nickname}</p>
              <CommentOptions
                setIsEditMode={setIsEditMode}
                comment={comment}
                userId={userDetail.profiles.user_id}
                postAuthorId={postDetail.user_id!}
              />
            </div>
            <p className='break-all pb-2 text-body_sm text-gray-900'>{comment.comment_desc}</p>
            <div>
              {comment.parent_id === null ? (
                <span
                  className='cursor-pointer text-caption_bold_md text-gray-500'
                  onClick={() => setIsWriteReplyMode && setIsWriteReplyMode(true)}
                >
                  답글 쓰기
                </span>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* 자식 렌더링 */}
      <ul className='bg-gray-50 pl-10'>
        {comment.children?.map((childComment: Comment) => (
          <CommentNode
            key={childComment.comment_id}
            comment={childComment}
            userDetail={userDetail}
            postDetail={postDetail}
          />
        ))}

        {isWriteReplyMode ? (
          <CommentForm
            parentId={comment.comment_id}
            postId={postDetail.post_id}
            userDetail={userDetail}
            // setIsWriteMode={setIsWriteMode}
            setIsWriteReplyMode={setIsWriteReplyMode}
          />
        ) : null}
      </ul>
    </li>
  );
};

export default CommentNode;
