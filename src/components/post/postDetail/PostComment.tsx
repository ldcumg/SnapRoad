'use client';

import CommentForm from './CommentForm';
import CommentNode from './CommentNode';
import CommentWriteButton from './CommentWriteButton';
import { useCommentsQuery } from '@/hooks/queries/byUse/useCommentQueries';
import Spinner from '@/stories/Spinner';
import { Comment, CommentMap, CommentTree, PostDetail, UserDetail } from '@/types/postDetailTypes';
import React, { useState } from 'react';

export const buildCommentTree = (comments: Comment[]) => {
  comments.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // 각 댓글을 저장할 맵
  const commentMap: CommentMap = {};

  comments.forEach((comment) => {
    commentMap[comment.comment_id] = { ...comment, children: [] };
  });

  const tree: CommentTree[] = [];

  comments.forEach((comment) => {
    // parent_id가 null이면 최상위 댓글(부모)이므로 tree에 추가
    if (comment.parent_id === null) {
      tree.push(commentMap[comment.comment_id]);
    } else {
      // parent_id가 있으면 해당 부모의 children 배열에 추가
      commentMap[comment.parent_id]?.children.push(commentMap[comment.comment_id]);
    }
  });

  return tree;
};

type PostAndProfileProps = {
  postDetail: PostDetail;
  userDetail: UserDetail;
};

const PostComment = ({ userDetail, postDetail }: PostAndProfileProps) => {
  const [isWriteMode, setIsWriteMode] = useState<boolean>(false);
  //   const [isWriteReplyMode, setIsWriteReplyMode] = useState<boolean>(false);

  const { data: comments, isLoading, isError } = useCommentsQuery(postDetail.post_id);

  if (isError) return <>임시 오류 ...</>;
  if (isLoading)
    return (
      <div className='absolute z-[3000] flex h-full w-full items-center justify-center'>
        <Spinner />
      </div>
    );

  const commentTree = comments ? buildCommentTree(comments) : [];

  return (
    <>
      <ul>
        {commentTree.map((comment) => (
          <CommentNode
            key={comment.comment_id}
            comment={comment}
            userDetail={userDetail}
            postDetail={postDetail}
          />
        ))}
      </ul>
      {/* 댓글 작성 버튼 */}
      {isWriteMode ? (
        <>
          <CommentForm
            parentId={null}
            postId={postDetail.post_id}
            userDetail={userDetail}
            setIsWriteMode={setIsWriteMode}
          />
        </>
      ) : (
        <CommentWriteButton setIsWriteMode={setIsWriteMode} />
      )}
    </>
  );
};

export default PostComment;
