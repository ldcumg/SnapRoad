'use client';

import CommentNode from '../CommentNode';
import CommentWriteButton from '../CommentWriteButton';
import CommentFormRefac from './CommentFormRefac';
import { useCommentsQueryRefac } from '@/hooks/queries/byUse/useCommentQueries';
import Spinner from '@/stories/Spinner';
import { PostAndProfileProps } from '@/types/postDetailTypes';
import React, { useState } from 'react';

// TODO 함수 이동
const buildCommentTree = (comments) => {
  const commentMap = {}; // 각 댓글을 저장할 맵

  comments.forEach((comment) => {
    commentMap[comment.comment_id] = { ...comment, children: [] };
  });

  const tree = [];

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

const PostComment = ({ userDetail, postDetail }: PostAndProfileProps) => {
  const [isWriteMode, setIsWriteMode] = useState<boolean>(false);
  //   const [isWriteReplyMode, setIsWriteReplyMode] = useState<boolean>(false);

  const { data: comments, isLoading, isError } = useCommentsQueryRefac(postDetail.post_id);
  console.log('comments :>> ', comments);

  if (isError) return <>임시 오류 ...</>;
  if (isLoading)
    return (
      <div className='absolute z-[3000] flex h-full w-full items-center justify-center'>
        <Spinner />
      </div>
    );

  const commentTree = buildCommentTree(comments); // 트리 구조 생성
  console.log('commentTree :>> ', commentTree);

  return (
    <>
      <ul>
        {commentTree.map((comment) => (
          <CommentNode
            key={comment.comment_id}
            comment={comment}
            userDetail={userDetail}
            postDetail={postDetail}
            // setIsWriteReplyMode={setIsWriteReplyMode}
          />
        ))}
      </ul>
      {/* 댓글 작성 버튼 */}
      {isWriteMode ? (
        <>
          <CommentFormRefac
            setIsWriteMode={setIsWriteMode}
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
