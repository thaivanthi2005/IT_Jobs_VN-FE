export const CardSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="surface p-5">
        <div className="flex items-start gap-4">
          <div className="skeleton h-14 w-14 rounded-2xl" />
          <div className="flex-1 space-y-2">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-3 w-1/2" />
          </div>
        </div>
        <div className="mt-5 space-y-2">
          <div className="skeleton h-3 w-full" />
          <div className="skeleton h-3 w-5/6" />
        </div>
        <div className="mt-5 flex gap-2">
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
          <div className="skeleton h-6 w-16 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

export const EmptyState = ({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
}) => (
  <div className="surface flex flex-col items-center justify-center px-6 py-16 text-center">
    <span className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-50 text-2xl text-brand-600 ring-1 ring-inset ring-brand-100">
      {icon ?? <span aria-hidden="true">⌕</span>}
    </span>
    <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">{title}</h3>
    {description && (
      <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-500 dark:text-ink-400">
        {description}
      </p>
    )}
    {action && <div className="mt-6">{action}</div>}
  </div>
);
