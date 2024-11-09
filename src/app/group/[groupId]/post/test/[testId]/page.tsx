import MyPageHeader from '@/components/myPage/MyPageHeader';
import PostComment from '@/components/post/postDetail/refac/PostComment';
import PostDetailRefac from '@/components/post/postDetail/refac/PostDetailRefac';
import { fetchPostDetail } from '@/services/postDetailService';
import { getSession } from '@/services/server-action/authActions';
import { getProfile } from '@/services/server-action/profilesAction';
import React from 'react';

export async function generateMetadata({ params }: { params: { postId: string } }) {
  const postId = 'f5d1f528-10e9-40f6-a7c2-ba89bd256ee6';
  const postData = await fetchPostDetail(postId);
  return {
    title: postData.post_address,
    description: postData.post_desc,
  };
}

// TODO testId -> postId 로 변경
const PostDetail = async ({ params }: { params: { testId: string } }) => {
  const user = await getSession();

  const postId = 'f5d1f528-10e9-40f6-a7c2-ba89bd256ee6';

  // 이 포스트를 조회하는 사람
  const userDetail = await getProfile(user?.id!);
  const postDetail = await fetchPostDetail(postId);

  return (
    <div className='w-full'>
      {/* 헤더 (TODO 공통 만들어지면 변경하기)) */}
      <div className='relative mx-4 flex items-center py-4'>
        <MyPageHeader url={`/group/${postDetail.group_id}`} />
        <span className='mx-auto text-label_md text-gray-900'>{postDetail?.group?.group_title}</span>
      </div>
      <PostDetailRefac
        userDetail={userDetail}
        postDetail={postDetail}
      />
      <PostComment
        userDetail={userDetail}
        postDetail={postDetail}
      />
    </div>
  );
};

export default PostDetail;
