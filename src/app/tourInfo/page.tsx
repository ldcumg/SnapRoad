// 'use client';

// import { fetchGroupsFromApi } from '@/services/client-action/groupAction';
// import { useQuery } from '@tanstack/react-query';


// const GroupDetailPage = () => {
//   const {
//     data: groups,
//     error,
//     isLoading,
//   } = useQuery({
//     queryKey: ['groups'],
//     queryFn: fetchGroupsFromApi,
//   });

//   if (isLoading) {
//     return <p>로딩 중...</p>;
//   }

//   if (error instanceof Error) {
//     return <p>에러 발생: {error.message}</p>;
//   }



//   return (
//     <div>
//       <h1 className='text-xl'>Group Details</h1>
//       <hr />
//       {groups && groups.length > 0 ? (
//         groups.map((group: any) => (
//           <div key={group.group_id}>
//             <p>Title: {group.group_title}</p>
//             <p>Description: {group.group_desc}</p>
//             <p>Invite Code: {group.group_invite_code}</p>
//             <p>Status: {group.group_status}</p>
//             <p>Created At: {group.created_at}</p>
//             <hr />
//           </div>
//         ))
//       ) : (
//         <p>그룹 정보를 찾을 수 없습니다.</p>
//       )}
//     </div>
//   );
// };
// export default GroupDetailPage;


'use client';

import browserClient from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';


const GroupDetailPage = () => {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroups = async () => {
    const supabase = browserClient;

    try {
      const { data, error } = await supabase.from('group').select('*');
      if (error) throw new Error(error.message);
      setGroups(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>에러 발생: {error}</p>;

  return (
    <div>
      <h1 className='text-xl'>Group Details</h1>
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

export default GroupDetailPage;