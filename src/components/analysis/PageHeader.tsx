interface PageHeaderProps {
  title: string;
}

export function PageHeader({ title }: PageHeaderProps) {
  return (
    <div className="pb-6 xl:pt-12 pt-4 md:pt-6">
      <h1 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
        {title}
      </h1>
    </div>
  );
}
