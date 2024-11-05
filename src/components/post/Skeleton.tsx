import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

const Skeleton = ({ className, children }: SkeletonProps) => (
  <div className={cn('mt-16 bg-gray-100 animate-pulse', className)}>{children}</div>
);

export default Skeleton;
