/** SSR */
import Comments from '@/components/tourDetail/Comments';
import OptionsMenu from '@/components/tourDetail/OptionsMenu';
import TourImages from '@/components/tourDetail/TourImages';
import { getSignedImgUrl } from '@/services/server-action/getSignedImgUrl';
import { createClient } from '@/utils/supabase/server';
import Image from 'next/image';

export const revalidate = 0; // 매 요청마다 최신 데이터를 가져오도록 설정

const TourDetail = async ({
  searchParams,
}: {
  searchParams: {
    tourId: string;
  };
}) => {
  // TODO 테스트용
  const tourId = 'af1ce7b5-fbe8-4e3a-835b-5ad5e07a69dc';

  console.log('TourDetail rendering . . . 이것은 SSR');
  const supabase = createClient();

  // TODO 파일 분리
  /** posts 정보 조회 */
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
    *,
    tags (*),
     comment (
      *,
      profiles:user_id (*)
    ),
    images (*)
  `,
    )
    .eq('post_id', tourId)
    .single();

  if (error) console.error('error :>> ', error);

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

  const signedImageUrls = await getSignedImgUrls('tour_images', 86400, data.group_id, imageNames);

  // TODO utils 로
  const formatDate = (dateString: string | number | Date) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };

  const coverImage = data.images.find((image: { is_cover: boolean }) => image.is_cover);
  const coverImageDate = coverImage ? formatDate(coverImage.created_at) : '날짜 없음';

  return (
    <div className='flex flex-col gap-5 p-5'>
      <div className='flex flex-col gap-1'>
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
          <OptionsMenu />
        </div>
        <TourImages images={signedImageUrls} />
        <p>{data.post_desc}</p>
        <div className='flex gap-3'>
          {data.tags.map((tag: { tag_title: string }, id: string) => {
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
      </div>
      <Comments comments={data.comment} />
    </div>
  );
};

export default TourDetail;
