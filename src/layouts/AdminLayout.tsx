import { type ReactNode, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Palette, LogOut, Shield, Users, UserCheck, FileText, MessageCircle, Inbox, Briefcase, CreditCard, Flag, Settings, Search as SearchIcon, CheckSquare } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNoIndex } from '@/hooks/useNoIndex';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

const adminNav = [
  { to: '/admin', label: 'Pulpit', icon: <Shield className="h-4.5 w-4.5" /> },
  { to: '/admin/users', label: 'Użytkownicy', icon: <Users className="h-4.5 w-4.5" /> },
  { to: '/admin/artists', label: 'Artyści', icon: <UserCheck className="h-4.5 w-4.5" /> },
  { to: '/admin/clients', label: 'Klienci', icon: <Users className="h-4.5 w-4.5" /> },
  { to: '/admin/commissions', label: 'Zlecenia', icon: <FileText className="h-4.5 w-4.5" /> },
  { to: '/admin/comments', label: 'Komentarze', icon: <MessageCircle className="h-4.5 w-4.5" /> },
  { to: '/admin/offers', label: 'Oferty', icon: <Inbox className="h-4.5 w-4.5" /> },
  { to: '/admin/projects', label: 'Projekty', icon: <Briefcase className="h-4.5 w-4.5" /> },
  { to: '/admin/payments', label: 'Płatności', icon: <CreditCard className="h-4.5 w-4.5" /> },
  { to: '/admin/moderation', label: 'Moderacja', icon: <Flag className="h-4.5 w-4.5" />, badge: 3 },
  { to: '/admin/settings', label: 'Ustawienia', icon: <Settings className="h-4.5 w-4.5" /> },
  { to: '/admin/seo', label: 'SEO', icon: <SearchIcon className="h-4.5 w-4.5" /> },
  { to: '/admin/qa-checklist', label: 'QA Checklist', icon: <CheckSquare className="h-4.5 w-4.5" /> },
];

export function AdminLayout() {
  useNoIndex();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-graphite-700 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col bg-graphite-800 lg:flex">
        <div className="flex h-20 items-center gap-2.5 border-b border-graphite-600/50 px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-400 text-graphite-700">
              <Palette className="h-4.5 w-4.5" />
            </div>
            <span className="font-display text-xl font-medium text-ivory-100">Artiors<span className="text-gold-400"> Admin</span></span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {adminNav.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive: navActive }) => cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all mb-0.5',
                  (navActive || isActive) ? 'bg-gold-400 text-graphite-700' : 'text-graphite-200 hover:bg-graphite-600/50 hover:text-ivory-100'
                )}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="flex-1">{item.label}</span>
                {item.badge !== undefined && (
                  <span className={cn(
                    'rounded-full px-2 py-0.5 text-xs font-medium',
                    isActive ? 'bg-graphite-700 text-gold-300' : 'bg-error text-ivory-100'
                  )}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
        <div className="border-t border-graphite-600/50 p-3">
          <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-graphite-200 hover:text-ivory-100 transition-colors">
            ← Wróć na stronę
          </Link>
        </div>
      </aside>

      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-graphite-600/50 bg-graphite-800 px-4 lg:hidden">
        <span className="font-display text-lg text-ivory-100">Artiors Admin</span>
        <button onClick={() => setMobileOpen(true)} className="text-ivory-100">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-graphite-700/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-graphite-800 overflow-y-auto">
            <div className="flex h-16 items-center justify-between border-b border-graphite-600/50 px-4">
              <span className="font-display text-lg text-ivory-100">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-graphite-200">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col p-3">
              {adminNav.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.to === '/admin'} onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                    isActive ? 'bg-gold-400 text-graphite-700' : 'text-graphite-200 hover:bg-graphite-600/50'
                  )}>
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && <span className="rounded-full bg-error px-2 py-0.5 text-xs text-ivory-100">{item.badge}</span>}
                </NavLink>
              ))}
              <button onClick={() => { signOut(); navigate('/'); }} className="mt-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-error hover:bg-error/10">
                <LogOut className="h-4 w-4" /> Wyloguj się
              </button>
            </nav>
          </div>
        </div>
      )}

      <div className="lg:col-start-2">
        <div className="hidden items-center justify-between border-b border-graphite-600/50 bg-graphite-800 px-8 py-3.5 lg:flex">
          <div className="flex items-center gap-3">
            <Avatar name={user?.displayName ?? 'Admin'} size="xs" />
            <span className="text-sm text-graphite-200">{user?.displayName}</span>
          </div>
          <button onClick={() => { signOut(); navigate('/'); }} className="flex items-center gap-2 text-sm text-graphite-200 hover:text-ivory-100 transition-colors">
            <LogOut className="h-4 w-4" /> Wyloguj
          </button>
        </div>
        <div className="w-full p-6 lg:p-8">
          <div className="mx-auto w-full max-w-[1200px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
