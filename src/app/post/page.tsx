'use client';

import ImageManager from '@/components/post/ImageManager';
import { useUserQuery } from '@/hooks/queries/byUse/useUserQuery';

const FormPage = () => {
  const { data: user, isLoading: userLoading, error: userError } = useUserQuery();

  if (userError) return <p>사용자 정보를 로드하는 데 실패했습니다.</p>;
  if (userLoading) return <div>로딩 중...</div>;
  if (!user?.id) return <p>로그인이 필요합니다.</p>;

  const userId = user.id;
  const uploadSessionId = new Date().toISOString();

  return (
    <section>
      <ImageManager
        userId={userId}
        uploadSessionId={uploadSessionId}
      />
    </section>
  );
};

export default FormPage;
