import ScrollReactHeader from '@/components/_common/ScrollReactHeader';
import ScrollSections from '@/components/landing/ScrollSections';
import LogoUserHeader from '@/components/layout/LogoUserHeader';

const Page = () => {
  return (
    <>
      <ScrollReactHeader>
        <LogoUserHeader />
      </ScrollReactHeader>
      <ScrollSections />
    </>
  );
};

export default Page;
