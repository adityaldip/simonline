import { ReactNode, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  FileText,
  Building2,
  Calendar,
  Settings,
  LogOut,
  Shield,
  ChevronLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';

interface AdminLayoutProps {
  children: ReactNode;
  role: 'ADMIN' | 'SUPERADMIN';
}

const adminMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: Users, label: 'Profil', href: '/admin/profile' },
  { icon: FileText, label: 'Pendaftaran', href: '/admin/registrations' },
  { icon: Calendar, label: 'Jadwal', href: '/admin/schedule' },
  { icon: Settings, label: 'Pengaturan', href: '/admin/settings' },
];

const superadminMenuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/superadmin' },
  { icon: Users, label: 'Profil', href: '/superadmin/profile' },
  { icon: Building2, label: 'Organisasi', href: '/superadmin/organizations' },
  { icon: Users, label: 'Admin', href: '/superadmin/admins' },
  { icon: FileText, label: 'Semua Pendaftaran', href: '/superadmin/registrations' },
  { icon: Settings, label: 'Pengaturan', href: '/superadmin/settings' },
];

export function AdminLayout({ children, role }: AdminLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, claims, clearContext } = useAuth();
  const menuItems = role === 'SUPERADMIN' ? superadminMenuItems : adminMenuItems;
  const roleLabel = role === 'SUPERADMIN' ? 'Super Admin' : 'Admin Polres';

  const sessionBanner = useMemo(() => {
    if (!claims) return null;
    if (claims.actingMode === 'IMPERSONATION') {
      return {
        title: 'Sedang impersonasi admin organisasi',
        subtitle: 'Anda melihat aplikasi sebagai admin organisasi ini.',
      };
    }
    if (claims.actingMode === 'CONTEXT_SWITCH') {
      return {
        title: 'Anda masuk sebagai Admin organisasi',
        subtitle: 'Sedang mengelola satu organisasi sebagai superadmin.',
      };
    }
    return null;
  }, [claims]);

  const returnToSuperadmin = async () => {
    try {
      await clearContext();
    } catch {
      // Ignore — navigate back to the superadmin area regardless.
    }
    navigate('/superadmin');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar text-sidebar-foreground flex flex-col">
        {/* Logo */}
        <div className="p-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 rounded-lg bg-sidebar-accent shrink-0">
              <Shield className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h1 className="font-bold text-sm leading-tight tracking-tight text-sidebar-foreground">DITLANTAS POLDA JATENG</h1>
              <p className="text-xs text-sidebar-foreground/70 mt-0.5">{roleLabel}</p>
            </div>
          </div>
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <Separator className="bg-sidebar-border" />

        {/* Bottom Actions */}
        <div className="p-3 space-y-1">
          <Link to="/">
            <Button variant="ghost" className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50">
              <ChevronLeft className="h-5 w-5" />
              Kembali ke Form
            </Button>
          </Link>
          <Button variant="ghost" onClick={handleLogout} className="w-full justify-start gap-3 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent/50">
            <LogOut className="h-5 w-5" />
            Keluar
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {sessionBanner && (
          <div className="border-b bg-warning/10 border-warning/20 px-6 py-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">{sessionBanner.title}</p>
              <p className="text-xs text-muted-foreground">{sessionBanner.subtitle}</p>
            </div>
            <Button variant="outline" size="sm" onClick={returnToSuperadmin}>
              Kembali ke Superadmin
            </Button>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
