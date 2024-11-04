/** SSR */
import Comments from '@/components/post/postDetail/Comments';
import PostDetail from '@/components/post/postDetail/PostDetail';
import { fetchPostData } from '@/services/postService';
import { getSession } from '@/services/server-action/authActions';
import { getSignedImgUrl } from '@/services/server-action/getSignedImgUrl';
import { getGroupDetails } from '@/services/server-action/groupServerActions';
import { getProfile } from '@/services/server-action/profilesAction';
import { formatDateToPostDetail } from '@/utils/dateUtils';

export const revalidate = 0; // 매 요청마다 최신 데이터를 가져오도록 설정

const TourDetail = async ({
  params,
}: {
  params: {
    postId: string;
  };
}) => {
  // console.log('searchParams :>> ', params);
  // TODO 테스트용
  const postId = 'ad2f3b36-93a2-49ff-b22d-196072de7aa4';
  // const userId = 'cee8906c-ac2c-496c-a108-1dba7081f345';

  const user = await getSession();
  console.log('user :>> ', user);

  const getSignedImgUrls = async (bucketName: string, expiration: number, folderName: string, imageNames: string[]) => {
    const signedUrls = await Promise.all(
      imageNames.map(async (imageName) => {
        const imagePath = `${folderName}/${imageName}`;

        return await getSignedImgUrl(bucketName, expiration, imagePath);
      }),
    );

    return signedUrls;
  };

  const postData = await fetchPostData(postId);
  const userDetail = await getProfile(user?.id!);

  const groupDetail = await getGroupDetails(postData.group_id!);
  const imageNames = postData.images.map((img: { post_image_name: string }) => img.post_image_name);
  const signedImageUrls = await getSignedImgUrls('tour_images', 86400, postData.group_id!, imageNames);
  const coverImage = postData.images.find((image: { is_cover: boolean }) => image.is_cover);
  const coverImageDate = coverImage ? formatDateToPostDetail(coverImage.created_at) : '날짜 없음';

  return (
    <div className='px-4 '>
      <div className='flex items-center py-4 relative'>
        <img
          src='/svgs/Logo.svg'
          alt='Image'
          className='absolute left-0'
        />
        <span className='text-gray-900 text-label_md mx-auto'>{groupDetail?.group_title}</span>
      </div>
      <PostDetail
        postData={postData}
        signedImageUrls={signedImageUrls}
        coverImageDate={coverImageDate}
        userDetail={userDetail}
      />
      <Comments
        postId={postId}
        userId={user?.id!}
      />
    </div>
  );
};

export default TourDetail;
