import { DashboardSidebar } from '@/components/layout/DashboardSidebar'

// Mock user — replace with session from NextAuth
const MOCK_USER = {
  firstName:      'James',
  lastName:       'Mwangi',
  email:          'j.mwangi@email.com',
  avatarInitials: 'JM',
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar — hidden on mobile, visible lg+ */}
      <DashboardSidebar
        user={MOCK_USER}
        className="hidden lg:flex w-56 flex-shrink-0 sticky top-14 self-start h-[calc(100vh-56px)]"
      />

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  )
}
