'use client';

import { useInsertUserGroupMutation } from '@/hooks/queries/byUse/useGroupMutations';
import { checkMemberexist } from '@/services/client-action/groupActions';
import { makeUserGroupDataToObj } from '@/services/groupServices';
import browserClient from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

type Props = {
  searchParams: { group_id: string };
};

const AcceptInvitePage = ({ searchParams: { group_id } }: Props) => {
  const router = useRouter();
  if (!group_id) {
    alert('존재하지 않는 초대링크입니다!');
    router.push('/');
  }
  const { isError: insertUserGroupError, mutate: insertUserGroupMutate } = useInsertUserGroupMutation();
  const onClick = async () => {
    const { data } = await browserClient.auth.getUser();
    if (data.user?.id) {
      const userId = data.user.id;
      //NOTE - 유저가 이미 해당 그룹에 속해있는지 검사 / 체크도 tanstack query로 관리해야하나? 의미가 있을지 의문
      const { data: existingMember, error: existingMemberError } = await checkMemberexist(group_id, userId);
      if (existingMemberError) throw new Error('');
      const isExisting = !!existingMember?.length;
      if (isExisting) {
        alert('이미 속해있는 그룹입니다.');
        return;
      }
      const userGroupObj = makeUserGroupDataToObj(userId, false, group_id);
      insertUserGroupMutate(userGroupObj);
    }
  };

  if (insertUserGroupError) throw new Error('에러 발생!');
  return (
    <div>
      <p></p>
      <button onClick={onClick}>수락</button>
      <button onClick={() => router.push('/')}>거절</button>
    </div>
  );
};

export default AcceptInvitePage;
