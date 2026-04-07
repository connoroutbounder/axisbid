import { Sidebar } from './sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
  userRole: 'customer' | 'shop' | 'admin'
}

export function DashboardLayout({
  children,
  userRole,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar userRole={userRole} />
      <main className="flex-1 bg-brand-light">
        <div className="container py-8">{children}</div>
      </main>
    </div>
  )
}
