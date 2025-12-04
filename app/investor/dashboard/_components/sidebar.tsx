// app/investor/dashboard/_components/sidebar.tsx (or wherever this lives)

'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Users, BookOpen, Calculator, Settings, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function InvestorSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const links = [
    { href: '/investor/dashboard', label: 'Dashboard', icon: Home },
    { href: '/investor/discovery', label: 'Discovery Session', icon: Users },
    { href: '/learn/impact-valuation', label: 'Impact Framework', icon: BookOpen },
    { href: '/learn/impact-calculator', label: 'Impact Calculator', icon: Calculator },
    { href: '/investor/settings', label: 'Settings', icon: Settings },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="w-64 bg-white border-r min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <Link href="/" className="text-xl font-bold text-purple-600">
          RaiseReady Impact
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Investor Portal</p>
      </div>

      <ul className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-purple-50 text-purple-700 font-medium'
                    : 'text-muted-foreground hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            </li>
          )
        })}
      </ul>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-2">
          <Calculator className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-blue-900 mb-1">
              Impact Calculator
            </h4>
            <p className="text-xs text-blue-700 mb-2">
              Test scenarios with our SDG valuation framework
            </p>
            <Link href="/learn/impact-valuation#calculator">
              <span className="text-xs text-blue-600 hover:underline">
                Try it now
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* Logout Button - Pushed to Bottom */}
      <div className="mt-auto pt-4 border-t">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  )
}