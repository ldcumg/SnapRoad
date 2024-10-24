import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js Project',
  description: 'A Next.js project with TypeScript and TailwindCSS.',
  keywords: 'Next.js, Typescript, TailwindCSS',
};

type Props = Readonly<{
  children: React.ReactNode;
  params: { groupId: string };
  // searchParams: { 위치명: string; lat: string; lng: string };
}>;

const GroupDetailLayout = ({ children, params: { groupId } }: Props) => {
  return (
    <>
      {children}
      <button>추가하기</button>
    </>
  );
};

export default GroupDetailLayout;
