import { InvestorSidebar } from './_components/sidebar'

export default function InvestorDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <InvestorSidebar />
      <main className="flex-1 p-8">
        {children}
      </main>
    </div>
  )
}