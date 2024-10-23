import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js Project',
  description: 'A Next.js project with TypeScript and TailwindCSS.',
  keywords: 'Next.js, Typescript, TailwindCSS',
};

type Props = Readonly<{ children: React.ReactNode; params: { group_id: string } }>;

const GroupDetailLayout = ({ children, params: { group_id } }: Props) => {
  return (
    <>
      {children}
      <div>브라우저 기본 네비 바</div>
    </>
  );
};

export default GroupDetailLayout;
