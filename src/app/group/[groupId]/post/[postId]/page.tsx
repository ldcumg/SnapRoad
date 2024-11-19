import PostComment from '@/components/post/postDetail/PostComment';
import PostDetail from '@/components/post/postDetail/PostDetail';
import PostDetailHeader from '@/components/post/postDetail/PostDetailHeader';
import { fetchPostDetail } from '@/services/postDetailService';
import { getSession } from '@/services/server-action/authActions';
import { getProfile } from '@/services/server-action/profilesAction';
import * as Sentry from '@sentry/nextjs';
import React from 'react';

export async function generateMetadata({ params }: { params: { postId: string } }) {
  const postData = await fetchPostDetail(params.postId);
  return {
    title: postData.post_address,
    description: postData.post_desc,
  };
}

const PostDetailPage = async ({ params }: { params: { postId: string } }) => {
  let user = null;

  try {
    user = await getSession();
  } catch (error) {
    throw new Error('세션 정보를 가져오는데 실패했습니다.');
  }

  if (!user) {
    const error = new Error(`${params.postId} 게시글에 대한 사용자 정보가 조회되지 않았습니다.`);
    Sentry.captureException(error);
    throw error;
  }

  let userDetail = null;
  let postDetail = null;

  // 사용자 프로필 정보 가져오기
  try {
    userDetail = await getProfile(user.id);
  } catch (error) {
    Sentry.captureException(error, {
      extra: { userId: user.id },
    });
    throw new Error(`사용자 프로필 정보를 가져오는데 실패했습니다. userId: ${user.id}`);
  }

  // 게시글 정보 가져오기
  try {
    postDetail = await fetchPostDetail(params.postId);
  } catch (error) {
    Sentry.captureException(error, {
      extra: {
        postId: params.postId,
        userId: user.id,
      },
    });
    throw new Error(`게시글 정보를 가져오는데 실패했습니다. postId: ${params.postId}`);
  }

  return (
    <div className='w-full'>
      <PostDetailHeader postDetail={postDetail} />
      <div className='m-auto w-full md:max-w-[40%]'>
        <PostDetail
          userDetail={userDetail}
          postDetail={postDetail}
        />
        <PostComment
          userDetail={userDetail}
          postDetail={postDetail}
        />
      </div>
    </div>
  );
};

export default PostDetailPage;
