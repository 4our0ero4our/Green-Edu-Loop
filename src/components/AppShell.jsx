import { BookOpen, Camera, Home, LogOut, Wallet } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuth } from '../contexts/AuthContext'

const navItems = [
  { to: '/', icon: Home, label: 'Home' },
  { to: '/scan', icon: Camera, label: 'Scan' },
  { to: '/wallet', icon: Wallet, label: 'Wallet' },
  { to: '/learn', icon: BookOpen, label: 'Learn' },
]

export default function AppShell() {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
    toast.success('Signed out successfully')
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-white">
      <header className="z-20 border-b border-eco-100 bg-white/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <p className="text-lg font-semibold text-eco-900">GreenEdu Loop</p>
          <nav className="hidden items-center gap-1 rounded-xl bg-eco-50 p-1 md:flex">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? 'bg-white text-eco-800 shadow-sm'
                      : 'text-slate-600 hover:bg-white/80 hover:text-slate-800'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
          <button
            onClick={handleLogout}
            className="inline-flex items-center gap-2 rounded-xl bg-eco-100 px-3 py-2 text-xs font-semibold text-eco-800 transition hover:bg-eco-200"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-gradient-to-b from-eco-50/50 to-earth-100/30 pb-24 pt-4 md:px-6">
        <div className="mx-auto w-full max-w-7xl px-4 md:px-0">
          <Outlet />
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-eco-100 bg-white/95 backdrop-blur md:hidden">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-4 gap-1 px-3 py-2">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium transition ${
                  isActive
                    ? 'bg-eco-100 text-eco-800'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
