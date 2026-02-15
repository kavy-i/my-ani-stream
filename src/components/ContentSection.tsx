import { ReactNode } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface Props {
  title: string;
  children: ReactNode;
  isLoading?: boolean;
  itemCount?: number;
}

export function ContentSection({ title, children, isLoading, itemCount = 6 }: Props) {
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-foreground">{title}</h2>
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: itemCount }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-[2/3] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {children}
        </div>
      )}
    </section>
  );
}
