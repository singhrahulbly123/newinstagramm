import type { ReactNode } from 'react';

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-soft text-slate-900">
      <div className="mx-auto sm:max-w-7xl max-w-full sm:px-6 py-10">
        {children}
      </div>
    </div>
  );
}
