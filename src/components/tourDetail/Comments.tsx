'use client';

import Comment from './Comment';
import CommentForm from './CommentForm';
import { useCommentsQuery } from '@/hooks/queries/byUse/useCommentQueries';
import React from 'react';

// interface Comment {
//   comment_id: string;
//   post_id: string;
//   parent_id: string | null;
//   user_id: string;
//   comment_desc: string;
//   created_at: string;
//   updated_at: string;
//   deleted_at: string | null;
//   profiles: {
//     user_id: string;
//     user_nickname: string;
//   };
// }

interface CommentsProps {
  // comments: Comment[];
  postId: string;
  userId: string;
}

const Comments = ({ postId, userId }: CommentsProps) => {
  /** 댓글 조회 */
  const { data: comments, isLoading, isError } = useCommentsQuery(postId);

  console.log('CommentsCommentsComments data :>> ', comments);

  if (isLoading) return <>로딩중...</>;

  return (
    <ul className='flex flex-col gap-5 border-t'>
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
                  nickname={parentComment.profiles?.user_nickname!}
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
                            nickname={parentComment.profiles?.user_nickname!}
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
