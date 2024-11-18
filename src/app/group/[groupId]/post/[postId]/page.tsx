import MyPageHeader from '@/components/myPage/MyPageHeader';
import PostComment from '@/components/post/postDetail/PostComment';
import PostDetail from '@/components/post/postDetail/PostDetail';
import URLS from '@/constants/urls';
import { fetchPostDetail } from '@/services/postDetailService';
import { getSession } from '@/services/server-action/authActions';
import { getProfile } from '@/services/server-action/profilesAction';
import React from 'react';

export async function generateMetadata({ params }: { params: { postId: string } }) {
  const postData = await fetchPostDetail(params.postId);
  return {
    title: postData.post_address,
    description: postData.post_desc,
  };
}

const PostDetailPage = async ({ params }: { params: { postId: string } }) => {
  const user = await getSession();

  const userDetail = await getProfile(user?.id!);
  const postDetail = await fetchPostDetail(params.postId);

  return (
    <div className='w-full'>
      <div className='relative mx-4 flex items-center py-4'>
        <MyPageHeader url={URLS.groupList} />
        <span className='mx-auto text-label_md text-gray-900'>{postDetail?.group?.group_title}</span>
      </div>
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
