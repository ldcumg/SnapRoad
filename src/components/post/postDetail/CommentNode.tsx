import CommentFormRefac from './refac/CommentFormRefac';
import CommentOptionsRefac from './refac/CommentOptionsRefac';
import CommentUpdateFormRefac from './refac/CommentUpdateFormRefac';
import ProfileImage from './refac/ProfileImage';
import { useUpdateComment } from '@/hooks/queries/byUse/useCommentMutation';
import React, { useState } from 'react';

const CommentNode = ({ comment, userDetail, postDetail, setIsWriteMode }) => {
  console.log('---------------- comment :>> ', comment);

  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isWriteReplyMode, setIsWriteReplyMode] = useState<boolean>(false);

  return (
    <li>
      {isEditMode ? (
        <CommentUpdateFormRefac
          comment={comment}
          userDetail={userDetail}
          setIsEditMode={setIsEditMode}
        />
      ) : (
        <div className='flex w-full gap-3 p-4'>
          <ProfileImage
            profileImageUrl={comment.comment_author_user.signed_image_url}
            width={'32px'}
            height={'32px'}
          />

          <div className='w-full'>
            <div className='flex justify-between pb-1'>
              <p className='text-label_sm text-gray-900'>{comment.comment_author_user.user_nickname}</p>
              <CommentOptionsRefac
                setIsEditMode={setIsEditMode}
                comment={comment}
                userId={userDetail.profiles.user_id}
                postAuthorId={postDetail.user_id}
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

      {/* {comment.children.length > 0 && ( */}
      <ul className='bg-gray-50 pl-10'>
        {comment.children.map((childComment) => (
          <CommentNode
            key={childComment.comment_id}
            comment={childComment}
            userDetail={userDetail}
            postDetail={postDetail}
          />
        ))}

        {isWriteReplyMode ? (
          <CommentFormRefac
            postId={postDetail.post_id}
            userDetail={userDetail}
            parentId={comment.comment_id}
            setIsWriteMode={setIsWriteMode}
            setIsWriteReplyMode={setIsWriteReplyMode}
          />
        ) : null}
      </ul>
      {/* )} */}
    </li>
  );
};

export default CommentNode;
