import { type ReactNode, useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { Menu, X, Palette, ChevronDown, LogOut, LayoutDashboard, User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Dropdown } from '@/components/ui/Dropdown';
import { Avatar } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

const navLinks = [
  { to: '/obrazy-na-zamowienie', label: 'Obrazy' },
  { to: '/zlecenia', label: 'Zlecenia' },
  { to: '/artysci', label: 'Artyści' },
  { to: '/blog', label: 'Blog' },
  { to: '/jak-to-dziala', label: 'Jak to działa' },
];

export function PublicLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = user?.role === 'artist' ? '/dashboard/artist' : user?.role === 'admin' ? '/admin' : '/dashboard/client';

  return (
    <div className="flex min-h-screen flex-col bg-ivory-100">
      <header className="sticky top-0 z-40 border-b border-graphite-400/10 bg-ivory-100/80 backdrop-blur-lg">
        <div className="container-content flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-graphite-600 text-ivory-100 transition-transform group-hover:scale-105">
              <Palette className="h-5 w-5" />
            </div>
            <span className="font-display text-2xl font-medium tracking-tight text-graphite-600">Artiors</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => cn(
                  'rounded-full px-4 py-2 text-sm font-medium transition-colors',
                  isActive ? 'text-graphite-700 bg-ivory-300' : 'text-graphite-400 hover:text-graphite-600'
                )}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            {user ? (
              <>
                <Link to={dashboardPath} className="btn-ghost">
                  <LayoutDashboard className="h-4 w-4" /> Panel
                </Link>
                <Dropdown
                  trigger={
                    <div className="flex cursor-pointer items-center gap-2 rounded-full border border-graphite-400/10 py-1.5 pl-1.5 pr-3 transition-colors hover:border-graphite-400/30">
                      <Avatar name={user.displayName} src={undefined} size="xs" />
                      <span className="text-sm font-medium text-graphite-600 max-w-[120px] truncate">{user.displayName}</span>
                      <ChevronDown className="h-3.5 w-3.5 text-graphite-300" />
                    </div>
                  }
                  items={[
                    { label: 'Mój panel', icon: <LayoutDashboard className="h-4 w-4" />, onClick: () => navigate(dashboardPath) },
                    { label: 'Ustawienia', icon: <UserIcon className="h-4 w-4" />, onClick: () => navigate(`${dashboardPath}/ustawienia`) },
                    { divider: true, label: '' },
                    { label: 'Wyloguj się', icon: <LogOut className="h-4 w-4" />, danger: true, onClick: () => signOut() },
                  ]}
                />
              </>
            ) : (
              <>
                <Link to="/login" className="btn-ghost">Zaloguj się</Link>
                <Link to="/register" className="btn-primary">Dołącz do Artiors</Link>
              </>
            )}
          </div>

          <button className="lg:hidden text-graphite-500" onClick={() => setMobileOpen(true)}>
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-graphite-700/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-ivory-50 shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-8">
              <span className="font-display text-xl text-graphite-600">Menu</span>
              <button onClick={() => setMobileOpen(false)} className="text-graphite-300 hover:text-graphite-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) => cn(
                    'rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                    isActive ? 'text-graphite-700 bg-ivory-300' : 'text-graphite-400 hover:bg-ivory-200'
                  )}
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="my-3 h-px bg-graphite-400/10" />
              {user ? (
                <>
                  <Link to={dashboardPath} onClick={() => setMobileOpen(false)} className="btn-primary w-full">Mój panel</Link>
                  <button onClick={() => { signOut(); setMobileOpen(false); }} className="btn-ghost w-full mt-2">
                    <LogOut className="h-4 w-4" /> Wyloguj się
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-secondary w-full">Zaloguj się</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary w-full mt-2">Dołącz do Artiors</Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="border-t border-graphite-400/10 bg-graphite-600">
      <div className="container-content py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-400 text-graphite-700">
                <Palette className="h-5 w-5" />
              </div>
              <span className="font-display text-2xl font-medium text-ivory-100">Artiors</span>
            </div>
            <p className="mt-4 text-sm text-graphite-200 text-pretty max-w-xs">
              Platforma łącząca zlecających z artystami malarzami. Komisje na ręcznie malowane obrazy.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-ultra-wide text-gold-300">Platforma</h4>
            <ul className="mt-4 space-y-3">
              {[
                { to: '/obrazy-na-zamowienie', label: 'Obrazy na zamówienie' },
                { to: '/zlecenia', label: 'Zlecenia' },
                { to: '/artysci', label: 'Artyści' },
                { to: '/blog', label: 'Blog' },
                { to: '/cennik', label: 'Cennik' },
              ].map((l) => (
                <li key={l.to}><Link to={l.to} className="text-sm text-graphite-200 hover:text-ivory-100 transition-colors link-underline">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-ultra-wide text-gold-300">Dla kogo</h4>
            <ul className="mt-4 space-y-3">
              {[
                { to: '/zamow-obraz', label: 'Zamów obraz' },
                { to: '/zlec-obraz', label: 'Zleć obraz' },
                { to: '/zlecenia-dla-artystow', label: 'Zlecenia dla artystów' },
                { to: '/dla-zlecajacych', label: 'Dla zlecających' },
                { to: '/dla-artystow', label: 'Dla artystów' },
                { to: '/faq', label: 'FAQ' },
                { to: '/kontakt', label: 'Kontakt' },
              ].map((l) => (
                <li key={l.to}><Link to={l.to} className="text-sm text-graphite-200 hover:text-ivory-100 transition-colors link-underline">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-ultra-wide text-gold-300">Obrazy do wnętrz</h4>
            <ul className="mt-4 space-y-3">
              {[
                { to: '/obrazy-do-salonu', label: 'Obrazy do salonu' },
                { to: '/obrazy-do-sypialni', label: 'Obrazy do sypialni' },
                { to: '/obrazy-do-biura', label: 'Obrazy do biura' },
                { to: '/obrazy-do-hotelu', label: 'Obrazy do hotelu' },
              ].map((l) => (
                <li key={l.to}><Link to={l.to} className="text-sm text-graphite-200 hover:text-ivory-100 transition-colors link-underline">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-ultra-wide text-gold-300">Prawne</h4>
            <ul className="mt-4 space-y-3">
              {[
                { to: '/regulamin', label: 'Regulamin' },
                { to: '/polityka-prywatnosci', label: 'Polityka prywatności' },
                { to: '/zasady-dla-artystow', label: 'Zasady dla artystów' },
                { to: '/zasady-dla-zlecajacych', label: 'Zasady dla zlecających' },
              ].map((l) => (
                <li key={l.to}><Link to={l.to} className="text-sm text-graphite-200 hover:text-ivory-100 transition-colors link-underline">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-graphite-500 pt-8 sm:flex-row">
          <p className="text-xs text-graphite-300">© 2025 Artiors. Wszelkie prawa zastrzeżone.</p>
          <p className="text-xs text-graphite-300">Platforma marketplace. Nie jest sklepem internetowym.</p>
        </div>
      </div>
    </footer>
  );
}
