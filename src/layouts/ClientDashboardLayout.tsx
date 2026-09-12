import { Outlet } from 'react-router-dom';
import { DashboardLayout } from './DashboardLayout';
import { LayoutDashboard, FileText, Inbox, Briefcase, MessageSquare, Settings, Store, Palette } from 'lucide-react';

export function ClientDashboardLayout() {
  return (
    <DashboardLayout
      role="client"
      homePath="/dashboard/client"
      navItems={[
        { to: '/dashboard/client', label: 'Pulpit', icon: <LayoutDashboard className="h-4.5 w-4.5" /> },
        { to: '/dashboard/client/zlecenia', label: 'Moje zlecenia', icon: <FileText className="h-4.5 w-4.5" />, badge: 2 },
        { to: '/dashboard/client/marketplace', label: 'Marketplace zleceń', icon: <Store className="h-4.5 w-4.5" /> },
        { to: '/dashboard/client/artysci', label: 'Artyści', icon: <Palette className="h-4.5 w-4.5" /> },
        { to: '/dashboard/client/oferty', label: 'Oferty', icon: <Inbox className="h-4.5 w-4.5" />, badge: 5 },
        { to: '/dashboard/client/projekty', label: 'Moje projekty', icon: <Briefcase className="h-4.5 w-4.5" />, badge: 1 },
        { to: '/dashboard/client/wiadomosci', label: 'Wiadomości', icon: <MessageSquare className="h-4.5 w-4.5" /> },
        { to: '/dashboard/client/ustawienia', label: 'Ustawienia', icon: <Settings className="h-4.5 w-4.5" /> },
      ]}
    >
      <Outlet />
    </DashboardLayout>
  );
}
