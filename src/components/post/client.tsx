'use client';

// CSR : 클라이언트에서 받아와서 처리
// 서버 부담 감소
// 초기 로딩 지연
// SEO에 불리
// SEO가 중요하지 않은 경우 : 채팅, 실시간 업데이트가 필요한 페이지
import browserClient from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

const fetchGroups = async () => {
  const supabase = browserClient;
  const { data, error } = await supabase.from('group').select('*');
  if (error) throw new Error(error.message);
  return data;
};
const ClientPage = () => {
  const {
    data: groups,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['groups'],
    queryFn: fetchGroups,
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

export default ClientPage;
