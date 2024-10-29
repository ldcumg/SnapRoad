/** SSR */
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
  // TODO 테스트
  const tourId = 'af1ce7b5-fbe8-4e3a-835b-5ad5e07a69dc';

  console.log('TourDetail rendering . . . 이것은 SSR');
  const supabase = createClient();

  /** posts 정보 조회 */
  const { data, error } = await supabase
    .from('posts')
    .select(
      `
    *,
    group:group_id (group_title),
    tags (*),
    comment (*),
    images (*)
  `,
    )
    .eq('post_id', tourId)
    .single();

  console.log('data :>> ', data);

  if (error) {
    console.log('error :>> ', error);
  }

  if (!data) {
    return <p>데이터 없음</p>;
  }

  /** post 정보를 통한 이미지 조회 */
  // 이미지 이름을 배열로 추출
  const imageNames = data.images.map((img) => img.post_image_name);
  console.log('imageNames :>> ', imageNames);

  /** 함수 */
  const getSignedImgUrls = async (bucketName: string, expiration: number, folderName: string, imageNames: string[]) => {
    const signedUrls = await Promise.all(
      imageNames.map(async (imageName) => {
        const imagePath = `${folderName}/${imageName}`;

        return await getSignedImgUrl(bucketName, expiration, imagePath);
      }),
    );

    return signedUrls;
  };

  const signedImageUrls = await getSignedImgUrls('tour_images', 86400, data.group.group_title, imageNames);

  console.log('signedImageUrls :>> ', signedImageUrls);
  // 날짜 포맷 변환 함수
  const formatDate = (dateString) => {
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

  // is_cover가 true인 이미지의 created_at 가져오기
  const coverImage = data.images.find((image) => image.is_cover);
  const coverImageDate = coverImage ? formatDate(coverImage.created_at) : '날짜 없음';

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-3 items-center'>
        <Image
          src={'/svgs/state=Mappin.svg'}
          alt='지도 마커'
          width={20}
          height={20}
        />
        <span>{data.post_address}</span>
        <span className='text-sm'>{coverImageDate}</span>
        <OptionsMenu />
      </div>
      <TourImages images={signedImageUrls} />
      <p>{data.post_desc}</p>
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

      <div>댓글 영역</div>
    </div>
  );
};

export default TourDetail;
