export const fetchGroupsFromApi = async () => {
  const res = await fetch('/api/info');
  if (!res.ok) throw new Error('그룹 정보를 가져오는 데 실패했습니다.');
  return res.json();
};
