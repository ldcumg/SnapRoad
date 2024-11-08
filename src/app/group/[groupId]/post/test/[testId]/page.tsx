import { fetchPostDetail } from '@/services/postDetailService';
import { getSession } from '@/services/server-action/authActions';
import { getProfile } from '@/services/server-action/profilesAction';
import React from 'react';

// TODO testId -> postId 로 변경
const PostDetail = async ({ params }: { params: { testId: string } }) => {
  console.log('testId :>> ', params.testId);
  const user = await getSession();

  const postId = 'f5d1f528-10e9-40f6-a7c2-ba89bd256ee6';

  // 이 포스트를 조회하는 사람
  const userDetail = await getProfile(user?.id!);
  const postDetail = await fetchPostDetail(postId);
  console.log('=========================== postDetail :>> ', postDetail);

  return <div></div>;
};

export default PostDetail;
