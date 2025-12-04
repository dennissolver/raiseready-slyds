import { SlydsSidebar } from './_components/sidebar'

export default function SlydsDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <SlydsSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}