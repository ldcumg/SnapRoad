'use client';

import Comment from './Comment';
import CommentForm from './CommentForm';
import { useCommentsQuery } from '@/hooks/queries/byUse/useCommentQueries';
import React from 'react';

interface CommentsProps {
  postId: string;
  userId: string;
}

const Comments = ({ postId, userId }: CommentsProps) => {
  /** 댓글 조회 */
  const { data: comments, isLoading, isError } = useCommentsQuery(postId);

  if (isError) return <>임시 오류 ...</>;
  if (isLoading) return <>임시 로딩중...</>;

  return (
    <ul className='flex flex-col gap-5'>
      {comments &&
        comments
          .filter((comment) => comment.parent_id === null)
          .map((parentComment) => {
            return (
              <li
                key={parentComment.comment_id}
                className='border-b'
              >
                <Comment
                  commentId={parentComment.comment_id}
                  userId={userId} // 이 페이지를 조회하는 사람
                  author={parentComment.profiles} // 글 쓴 사람
                  commentDesc={parentComment.comment_desc}
                />
                <CommentForm
                  newComment={{
                    postId: postId,
                    userId: userId,
                    parentId: parentComment.comment_id,
                  }}
                />
                <ul>
                  {comments
                    .filter((childComment) => childComment.parent_id === parentComment.comment_id)
                    .map((childComment) => {
                      return (
                        <li
                          className='pl-12'
                          key={childComment.comment_id}
                        >
                          <Comment
                            commentId={childComment.comment_id}
                            userId={userId} // 이 페이지를 조회하는 사람
                            author={childComment.profiles} // 글 쓴 사람
                            commentDesc={childComment.comment_desc}
                          />
                        </li>
                      );
                    })}
                </ul>
              </li>
            );
          })}
      <CommentForm
        newComment={{
          postId: postId,
          userId: userId,
          parentId: null,
        }}
      />
    </ul>
  );
};

export default Comments;
