/** SSR */
import TourImages from '@/components/tourDetail/TourImages';
import { getSignedImgUrl } from '@/services/server-action/getSignedImgUrl';
import { createClient } from '@/utils/supabase/server';

// TODO 삭제
const images = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLdL9BjquUAhHZwOEn2BaPDqcv2YrLY_1uwQ&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD57IEPoLbNywKKkBmiAkRajBy0yGLsubdgQ&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzyxhyXDOP7IZ5Dodc-KQSsKZvD6sIet_V_A&s',
  'data:image/jpeg;base64,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',
];

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

  return (
    <div>
      <span>{data.post_address}</span>
      <TourImages images={signedImageUrls} />
      <p>{data.post_desc}</p>
      <div>
        {data.tags.map((tag, id) => {
          return <span key={id}>#{tag.tag_title}</span>;
        })}
      </div>
      <span>날짜</span>
      <div>댓글 영역</div>
    </div>
  );
};

export default TourDetail;
