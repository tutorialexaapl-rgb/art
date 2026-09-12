import { Outlet } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { LayoutDashboard, User, Image, FileText, Inbox, Briefcase, MessageSquare, Settings, Wallet, Palette } from 'lucide-react';

export function ArtistDashboardLayout() {
  return (
    <DashboardLayout
      role="artist"
      homePath="/dashboard/artist"
      navItems={[
        { to: '/dashboard/artist', label: 'Pulpit', icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
        { to: '/dashboard/artist/profil', label: 'Mój profil', icon: <User className="h-4.5 w-4.5" /> },
        { to: '/dashboard/artist/portfolio', label: 'Portfolio', icon: <Image className="h-4.5 w-4.5" /> },
        { to: '/dashboard/artist/artysci', label: 'Artyści', icon: <Palette className="h-4.5 w-4.5" /> },
        { to: '/dashboard/artist/zlecenia', label: 'Zlecenia', icon: <FileText className="h-4.5 w-4.5" />, badge: 4 },
        { to: '/dashboard/artist/oferty', label: 'Moje oferty', icon: <Inbox className="h-4.5 w-4.5" />, badge: 3 },
        { to: '/dashboard/artist/projekty', label: 'Projekty', icon: <Briefcase className="h-4.5 w-4.5" />, badge: 1 },
        { to: '/dashboard/artist/wiadomosci', label: 'Wiadomości', icon: <MessageSquare className="h-4.5 w-4.5" /> },
        { to: '/dashboard/artist/billing', label: 'Rozliczenia', icon: <Wallet className="h-4.5 w-4.5" /> },
        { to: '/dashboard/artist/ustawienia', label: 'Ustawienia', icon: <Settings className="h-4.5 w-4.5" /> },
      ]}
    >
      <Outlet />
    </DashboardLayout>
  );
}
