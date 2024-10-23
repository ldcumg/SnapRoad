'use client';

// SSR : 서버에서 받아와서 라우트 처리
// SEO에 유리
// 서버 부하 증가
// 민감한 데이터
import { fetchGroupsFromApi } from '@/services/client-action/infoAction';
import { useQuery } from '@tanstack/react-query';

const ServerPage = () => {
  const {
    data: groups,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroupsFromApi,
  });

  if (isLoading) return <p>로딩 중...</p>;
  if (error instanceof Error) return <p>에러 발생: {error.message}</p>;

  return (
    <div>
      <hr />
      {groups && groups.length > 0 ? (
        groups.map((group: any) => (
          <div key={group.group_id}>
            <p>Title: {group.group_title}</p>
            <p>Description: {group.group_desc}</p>
            <p>Invite Code: {group.group_invite_code}</p>
            <p>Status: {group.group_status}</p>
            <p>Created At: {group.created_at}</p>
            <hr />
          </div>
        ))
      ) : (
        <p>그룹 정보를 찾을 수 없습니다.</p>
      )}
    </div>
  );
};
export default ServerPage;
