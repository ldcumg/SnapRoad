'use client';

import Comment from './Comment';
import CommentForm from './CommentForm';
import { useCommentsQuery } from '@/hooks/queries/byUse/useCommentQueries';
import { useProfilesQuery } from '@/hooks/queries/byUse/useProfilesQueries';
import React, { useState } from 'react';

interface CommentsProps {
  postId: string;
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
}

const Comments = ({ postId, userDetail, postAuthorDetail }: CommentsProps) => {
  const [isWriteMode, setIsWriteMode] = useState<boolean>(false);
  const [isWriteReplyMode, setIsWriteReplyMode] = useState<boolean>(false);

  /** 댓글 조회 */
  const { data: comments, isLoading, isError } = useCommentsQuery(postId);

  if (isError) return <>임시 오류 ...</>;
  if (isLoading) return <>임시 로딩중...</>;

  // TODO 구조 변경하기.. (재귀적으로)
  return (
    <ul className='flex flex-col'>
      {comments &&
        comments
          .filter((comment) => comment.parent_id === null)
          .map((parentComment) => {
            return (
              <li key={parentComment.comment_id}>
                {/* 부모 댓글 */}
                <Comment
                  commentId={parentComment.comment_id}
                  postAuthorDetail={postAuthorDetail} // 글 쓴 사람
                  userDetail={userDetail} // 이 페이지를 조회하는 사람
                  commentAuthor={parentComment.profiles} // 댓글 쓴 사람
                  commentDesc={parentComment.comment_desc}
                  parentId={null}
                  setIsWriteReplyMode={setIsWriteReplyMode}
                />

                <ul className='pl-10 bg-gray-50'>
                  {/* 대댓글 */}
                  {comments
                    .filter((childComment) => childComment.parent_id === parentComment.comment_id)
                    .map((childComment) => {
                      return (
                        <li key={childComment.comment_id}>
                          <Comment
                            commentId={childComment.comment_id}
                            postAuthorDetail={postAuthorDetail} // 글 쓴 사람
                            userDetail={userDetail} // 이 페이지를 조회하는 사람
                            commentAuthor={childComment.profiles} // 댓글 쓴 사람
                            commentDesc={childComment.comment_desc}
                            parentId={parentComment.comment_id}
                          />
                        </li>
                      );
                    })}
                  {isWriteReplyMode ? (
                    <CommentForm
                      postId={postId}
                      user={userDetail}
                      parentId={parentComment.comment_id}
                      setIsWriteMode={setIsWriteMode}
                      setIsWriteReplyMode={setIsWriteReplyMode}
                    />
                  ) : null}
                </ul>
              </li>
            );
          })}

      {isWriteMode ? (
        <>
          {/* 댓글 작성 */}
          <CommentForm
            postId={postId}
            user={userDetail}
            parentId={null}
            setIsWriteMode={setIsWriteMode}
          />
        </>
      ) : (
        <>
          {/* 댓글 작성 버튼*/}
          <div
            className='py-2 px-3 border rounded-[24px] my-2'
            onClick={(e) => setIsWriteMode(true)}
          >
            <p className='text-gray-300 text-body_sm'>댓글을 입력해주세요.</p>
          </div>
        </>
      )}
    </ul>
  );
};

export default Comments;
