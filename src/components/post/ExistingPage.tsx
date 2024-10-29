'use client';

import { useImageMutations } from '@/hooks/queries/byUse/useImageMutations';
import { useSessionQuery } from '@/hooks/queries/byUse/useSessionQuery';
import { useImageStore } from '@/stores/existingStore';

const ExistingPage = () => {
  const { loading, error, setLoading, setError } = useImageStore();
  const { data: session, isLoading: sessionLoading, error: sessionError } = useSessionQuery();
  const currentDate = new Date().toISOString();

  if (sessionLoading) return <p>세션 로딩 중...</p>;
  if (sessionError) {
    console.error('세션 가져오기 실패:', sessionError);
    return <p>세션 로드에 실패했습니다.</p>;
  }

  const userId = session?.user?.id;
  const { uploadImageMutation } = useImageMutations(userId, currentDate);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) {
      setError('업로드할 파일을 선택하세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('photos', file));

      // EXIF 데이터를 추출하기 위한 API 요청
      const exifResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!exifResponse.ok) throw new Error('EXIF 데이터를 가져오는 데 실패했습니다.');
      const exifDataArray = await exifResponse.json();

      // uploadImageMutation에 인자로 객체를 보내어 이미지를 서버로 업로드
      await uploadImageMutation.mutateAsync({
        files,
        exifDataArray,
      });

      console.log('이미지 업로드에 성공했습니다.', exifDataArray);
    } catch (err) {
      console.error('이미지 업로드 에러:', err);
      setError('이미지 업로드 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type='file'
        accept='image/*'
        multiple
        onChange={handleImageUpload}
      />
      {loading && <p>이미지 업로드 중...</p>}
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
};

export default ExistingPage;
