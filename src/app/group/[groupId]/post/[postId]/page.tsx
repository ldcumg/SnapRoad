/** SSR */
import Comments from '@/components/post/postDetail/Comments';
import PostDetail from '@/components/post/postDetail/PostDetail';
import { fetchPostData } from '@/services/postService';
import { getSession } from '@/services/server-action/authActions';
import { getSignedImgUrl } from '@/services/server-action/getSignedImgUrl';
import { getGroupDetails } from '@/services/server-action/groupServerActions';
import { getProfile } from '@/services/server-action/profilesAction';
import { formatDateToPostDetail } from '@/utils/dateUtils';

export async function generateMetadata({ params }: { params: { postId: string } }) {
  const postData = await fetchPostData(params.postId);
  const groupDetail = await getGroupDetails(postData.group_id!);
  return {
    title: groupDetail?.group_title,
    description: groupDetail?.group_desc,
  };
}

export const revalidate = 0;

const TourDetail = async ({
  params,
}: {
  params: {
    postId: string;
  };
}) => {
  const user = await getSession();

  // const getSignedImgUrls = async (bucketName: string, expiration: number, folderName: string, imageNames: string[]) => {
  //   const signedUrls = await Promise.all(
  //     imageNames.map(async (imageName) => {
  //       const imagePath = `${folderName}/${imageName}`;

  //       return await getSignedImgUrl(bucketName, expiration, imagePath);
  //     }),
  //   );

  //   return signedUrls;
  // };

  const getSignedImgUrls = async (
    bucketName: string,
    expiration: number,
    folderName: string,
    images: { post_image_name: string; is_cover: boolean }[],
  ) => {
    const signedUrls = await Promise.all(
      images.map(async (image) => {
        const imagePath = `${folderName}/${image.post_image_name}`;

        const signedUrl = await getSignedImgUrl(bucketName, expiration, imagePath);

        return {
          signedImageUrl: signedUrl,
          is_cover: image.is_cover,
        };
      }),
    );

    return signedUrls;
  };

  const postData = await fetchPostData(params.postId);
  const groupDetail = await getGroupDetails(postData.group_id!);

  const userDetail = await getProfile(user?.id!); // 이 글을 조회하는 사람
  const postAuthorDetail = await getProfile(postData?.user_id!); // 이 글을 쓴 사람

  // const imageNames = postData.images.map((img: { post_image_name: string }) => img.post_image_name);
  const imageData = postData.images.map((img: { post_image_name: string; is_cover: boolean }) => ({
    post_image_name: img.post_image_name,
    is_cover: img.is_cover,
  }));

  const signedImageUrls = await getSignedImgUrls('tour_images', 86400, postData.group_id!, imageData); // 게시글 이미지들

  const coverImage = postData.images.find((image: { is_cover: boolean }) => image.is_cover);
  const coverImageDate = coverImage ? formatDateToPostDetail(coverImage.created_at) : '날짜 없음';

  return (
    <div>
      <div className='flex items-center py-4 relative mx-4'>
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
        userDetail={userDetail} // 이 글을 조회하는 사람
        postAuthorDetail={postAuthorDetail}
      />
      <Comments
        postId={params.postId}
        userDetail={userDetail} // 이 글을 조회하는 사람
        postAuthorDetail={postAuthorDetail} // 이 글을 쓴 사람
      />
    </div>
  );
};

export default TourDetail;
