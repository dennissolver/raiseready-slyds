// app/founder/dashboard/_components/sidebar.tsx

'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Upload, BookOpen, Calculator, Settings, Mic, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function FounderSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  const links = [
    { href: '/founder/dashboard', label: 'My Decks', icon: Home },
    { href: '/founder/upload', label: 'Upload Deck', icon: Upload },
    { href: '/founder/practice', label: 'Practice Pitch', icon: Mic },
    { href: '/learn/impact-valuation', label: 'Impact Framework', icon: BookOpen },
    { href: '/founder/profile', label: 'Profile', icon: Settings },
  ]

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav className="w-64 bg-white border-r min-h-screen p-6 flex flex-col">
      <div className="mb-8">
        <Link href="/" className="text-xl font-bold text-blue-600">
          RaiseReady Impact
        </Link>
        <p className="text-xs text-muted-foreground mt-1">Founder Portal</p>
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
                    ? 'bg-blue-50 text-blue-700 font-medium'
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

      <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-start gap-2">
          <Calculator className="w-5 h-5 text-green-600 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-green-900 mb-1">
              Calculate Your Impact
            </h4>
            <p className="text-xs text-green-700 mb-2">
              See how your SDG impact translates to returns
            </p>
            <Link href="/learn/impact-valuation#calculator">
              <span className="text-xs text-green-600 hover:underline">
                Use calculator
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