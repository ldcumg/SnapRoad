/** SSR */
import Comments from '@/components/tourDetail/Comments';
import OptionsMenu from '@/components/tourDetail/OptionsMenu';
import TourImages from '@/components/tourDetail/TourImages';
import { fetchPostData } from '@/services/postService';
import { getSignedImgUrl } from '@/services/server-action/getSignedImgUrl';
import { formatDateToPostDetail } from '@/utils/dateUtils';
import Image from 'next/image';

export const revalidate = 0; // 매 요청마다 최신 데이터를 가져오도록 설정

const TourDetail = async ({
  searchParams,
}: {
  searchParams: {
    postId: string;
  };
}) => {
  // TODO 테스트용
  const postId = 'af1ce7b5-fbe8-4e3a-835b-5ad5e07a69dc';
  const userId = 'cee8906c-ac2c-496c-a108-1dba7081f345';

  /** posts 정보 조회 */
  const data = await fetchPostData(postId);

  // TODO
  if (!data) return <p>데이터 없음</p>;

  const imageNames = data.images.map((img: { post_image_name: string }) => img.post_image_name);

  const getSignedImgUrls = async (bucketName: string, expiration: number, folderName: string, imageNames: string[]) => {
    const signedUrls = await Promise.all(
      imageNames.map(async (imageName) => {
        const imagePath = `${folderName}/${imageName}`;

        return await getSignedImgUrl(bucketName, expiration, imagePath);
      }),
    );

    return signedUrls;
  };

  const signedImageUrls = await getSignedImgUrls('tour_images', 86400, data.group_id!, imageNames);
  const coverImage = data.images.find((image: { is_cover: boolean }) => image.is_cover);
  const coverImageDate = coverImage ? formatDateToPostDetail(coverImage.created_at) : '날짜 없음';

  return (
    <div className='flex flex-col items-center justify-center gap-5 p-5 '>
      <div className='flex flex-col gap-1 w-[316px]'>
        {/* 상단 정보 */}
        <div className='flex justify-between'>
          <div className='flex items-center gap-3'>
            <div className='flex gap-1 items-center'>
              <Image
                src={'/svgs/state=Mappin.svg'}
                alt='지도 마커'
                width={15}
                height={15}
              />
              <span>{data.post_address}</span>
            </div>
            <span className='text-sm'>{coverImageDate}</span>
          </div>
          <OptionsMenu postId={postId} />
        </div>

        {/* 이미지 */}
        <TourImages images={signedImageUrls} />

        {/* 게시글 내용 */}
        <p>{data.post_desc}</p>

        {/* 태그 영역 */}
        <div className='flex gap-3'>
          {data.tags.map((tag, id) => {
            return (
              <span
                className='bg-gray-300'
                key={id}
              >
                #{tag.tag_title}
              </span>
            );
          })}
        </div>

        {/* 댓글 */}
        <Comments
          postId={postId}
          userId={userId}
        />
      </div>
    </div>
  );
};

export default TourDetail;
