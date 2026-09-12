import { type ReactNode, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Palette, LogOut, Bell, ChevronDown, Eye, ArrowRight, Sparkles, Store } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useNoIndex } from '@/hooks/useNoIndex';
import { Avatar } from '@/components/ui/Avatar';
import { Dropdown } from '@/components/ui/Dropdown';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';

interface NavItem {
  to: string;
  label: string;
  icon: ReactNode;
  badge?: number;
}

interface DashboardLayoutProps {
  navItems: NavItem[];
  role: UserRole;
  homePath: string;
  children?: ReactNode;
}

export function DashboardLayout({ navItems, role, homePath, children }: DashboardLayoutProps) {
  useNoIndex();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const roleLabel = role === 'artist' ? 'Panel artysty' : role === 'admin' ? 'Panel admina' : 'Panel zlecającego';

  return (
    <div className="min-h-screen bg-ivory-100 lg:grid lg:grid-cols-[280px_1fr]">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[280px] flex-col border-r border-graphite-400/10 bg-ivory-50 lg:flex">
        <div className="flex h-20 items-center gap-2.5 border-b border-graphite-400/10 px-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-graphite-600 text-ivory-100 transition-transform group-hover:scale-105">
              <Palette className="h-4.5 w-4.5" />
            </div>
            <span className="font-display text-xl font-medium text-graphite-600">Artiors</span>
          </Link>
        </div>
        <div className="px-4 py-5">
          <p className="px-3 font-mono text-xs uppercase tracking-ultra-wide text-graphite-300">{roleLabel}</p>
          <nav className="mt-3 flex flex-col gap-0.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to || (item.to !== homePath && location.pathname.startsWith(item.to));
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive: navActive }) => cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                    (navActive || isActive) ? 'bg-graphite-600 text-ivory-100 shadow-sm' : 'text-graphite-400 hover:bg-ivory-200 hover:text-graphite-600'
                  )}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={cn(
                      'rounded-full px-2 py-0.5 text-xs font-medium',
                      isActive ? 'bg-gold-400 text-graphite-700' : 'bg-gold-100 text-gold-600'
                    )}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto border-t border-graphite-400/10 p-4">
          <Link to="/" className="btn-ghost w-full justify-start">
            ← Wróć na stronę
          </Link>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-graphite-400/10 bg-ivory-50/80 px-4 backdrop-blur-lg lg:hidden">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-graphite-600 text-ivory-100">
            <Palette className="h-4 w-4" />
          </div>
          <span className="font-display text-lg text-graphite-600">Artiors</span>
        </Link>
        <button onClick={() => setMobileOpen(true)} className="text-graphite-500">
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-graphite-700/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-ivory-50 shadow-2xl overflow-y-auto">
            <div className="flex h-16 items-center justify-between border-b border-graphite-400/10 px-4">
              <span className="font-display text-lg text-graphite-600">{roleLabel}</span>
              <button onClick={() => setMobileOpen(false)} className="text-graphite-300">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-0.5 p-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => cn(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all',
                    isActive ? 'bg-graphite-600 text-ivory-100' : 'text-graphite-400 hover:bg-ivory-200'
                  )}
                >
                  {item.icon}
                  <span className="flex-1">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="rounded-full bg-gold-100 px-2 py-0.5 text-xs text-gold-600">{item.badge}</span>
                  )}
                </NavLink>
              ))}
              <div className="my-2 h-px bg-graphite-400/10" />
              <Link to="/" onClick={() => setMobileOpen(false)} className="btn-ghost w-full justify-start">← Wróć na stronę</Link>
              <button onClick={() => { signOut(); setMobileOpen(false); navigate('/'); }} className="btn-ghost w-full justify-start text-error">
                <LogOut className="h-4 w-4" /> Wyloguj się
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:col-start-2">
        <div className="sticky top-0 z-20 hidden items-center justify-between border-b border-graphite-400/10 bg-ivory-50/80 px-8 py-4 backdrop-blur-lg lg:flex">
          <div className="flex-1" />
          <div className="flex items-center gap-3">
            <button className="relative flex h-10 w-10 items-center justify-center rounded-full border border-graphite-400/10 text-graphite-400 hover:bg-ivory-200 transition-colors">
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold-400" />
            </button>
            <Dropdown
              trigger={
                <div className="flex cursor-pointer items-center gap-2 rounded-full border border-graphite-400/10 py-1.5 pl-1.5 pr-3 transition-colors hover:border-graphite-400/30">
                  <Avatar name={user?.displayName ?? 'Użytkownik'} size="xs" />
                  <span className="text-sm font-medium text-graphite-600 max-w-[140px] truncate">{user?.displayName}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-graphite-300" />
                </div>
              }
              items={[
                { label: 'Ustawienia', onClick: () => navigate(`${homePath}/ustawienia`) },
                { divider: true, label: '' },
                { label: 'Wyloguj się', danger: true, icon: <LogOut className="h-4 w-4" />, onClick: () => { signOut(); navigate('/'); } },
              ]}
            />
          </div>
        </div>
        <div className="w-full py-8 lg:py-10">
          <div className="mx-auto w-full max-w-[1200px] px-6 sm:px-8 lg:px-10">
            {user?.isDemo && (
              <div className="mb-6 overflow-hidden rounded-xl border border-gold-300/50 bg-gradient-to-r from-gold-50 via-gold-50/80 to-ivory-100 shadow-sm">
                <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-200/60">
                      <Eye className="h-4.5 w-4.5 text-gold-700" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gold-800">Tryb demo - tylko do oglądania</p>
                      <p className="mt-0.5 text-sm text-gold-700/80">
                        {role === 'artist'
                          ? 'Przeglądasz konto artysty. Zarejestruj się, aby tworzyć portfolio, aplikować na zlecenia i przyjmować zamówienia.'
                          : 'Przeglądasz konto zlecającego. Zarejestruj się, aby zlecać obrazy i kontaktować się z artystami.'}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={role === 'artist' ? '/register?role=artist' : '/register?role=client'}
                    className="btn-gold group inline-flex shrink-0 items-center gap-2 px-5 py-2.5 text-sm font-semibold shadow-sm transition-all hover:shadow-md"
                  >
                    Zarejestruj się już teraz
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
                <div className="grid gap-px bg-gold-200/30 sm:grid-cols-2">
                  {role === 'artist' ? (
                    <>
                      <Link to="/register?role=artist" className="flex w-full items-center gap-2.5 bg-gold-50/60 px-5 py-3 text-sm text-gold-800 transition-colors hover:bg-gold-100/70">
                        <Sparkles className="h-4 w-4 shrink-0 text-gold-600" />
                        <span><span className="font-medium">Maluj obrazy</span> - twórz portfolio i prezentuj twórczość</span>
                      </Link>
                      <Link to="/register?role=artist" className="flex w-full items-center gap-2.5 bg-gold-50/60 px-5 py-3 text-sm text-gold-800 transition-colors hover:bg-gold-100/70">
                        <Store className="h-4 w-4 shrink-0 text-gold-600" />
                        <span><span className="font-medium">Aplikuj na zlecenia</span> - odbieraj zamówienia od klientów</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/register?role=client" className="flex w-full items-center gap-2.5 bg-gold-50/60 px-5 py-3 text-sm text-gold-800 transition-colors hover:bg-gold-100/70">
                        <Store className="h-4 w-4 shrink-0 text-gold-600" />
                        <span><span className="font-medium">Zlecaj obrazy</span> - opisz projekt i otrzymuj oferty od artystów</span>
                      </Link>
                      <Link to="/register?role=client" className="flex w-full items-center gap-2.5 bg-gold-50/60 px-5 py-3 text-sm text-gold-800 transition-colors hover:bg-gold-100/70">
                        <Palette className="h-4 w-4 shrink-0 text-gold-600" />
                        <span><span className="font-medium">Znajdź artystów</span> - przeglądaj profile i kontaktuj się bezpośrednio</span>
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
            {children ?? <Outlet />}
          </div>
        </div>
      </div>
    </div>
  );
}
