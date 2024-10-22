import fetchGroups from '@/services/server-action/groupActions';

const GroupDetailPage = async () => {
  const groups = await fetchGroups();

  return (
    <div>
      <h1>Group Details</h1>
      {groups && groups.length > 0 ? (
        groups.map((group) => (
          <div key={group.group_id}>
            <p>Title: {group.group_title}</p>
            <p>Description: {group.group_desc}</p>
            <p>{group.group_invite_code}</p>
            <p>{group.group_status}</p>
            <p>{group.created_at}</p>
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
