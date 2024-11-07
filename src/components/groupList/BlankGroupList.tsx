import Link from 'next/link';

const BlankGroupList = () => {
  return (
    <div>
      <p>그룹을 만들어 추억을 남겨보세요!</p>
      <Link href={'/makegroup'}>그룹 만들기</Link>
    </div>
  );
};

export default BlankGroupList;
