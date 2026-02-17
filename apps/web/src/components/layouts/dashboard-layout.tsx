'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Phone,
  BookOpen,
  Settings,
  Menu,
  X,
  Bell,
  User,
  BarChart3,
  Brain,
  FileText,
  Plug,
  Shield,
  Activity,
  LogOut,
  FileBarChart,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/lib/hooks/use-media-query';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { NotificationBell } from '@/components/notifications/notification-bell';

const navigationItems = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard',
  },
  {
    href: '/live-calls',
    icon: Activity,
    label: 'Live Calls',
  },
  {
    href: '/campaigns',
    icon: Phone,
    label: 'Campaigns',
  },
  {
    href: '/calls',
    icon: Phone,
    label: 'Calls',
  },
  {
    href: '/analytics',
    icon: BarChart3,
    label: 'Analytics',
  },
  {
    href: '/reports',
    icon: FileBarChart,
    label: 'Reports',
  },
  {
    href: '/learning',
    icon: Brain,
    label: 'Learning',
  },
  {
    href: '/sop-generator',
    icon: FileText,
    label: 'SOP Generator',
  },
  {
    href: '/integrations',
    icon: Plug,
    label: 'Integrations',
  },
  {
    href: '/knowledge',
    icon: BookOpen,
    label: 'Knowledge',
  },
  {
    href: '/admin',
    icon: Shield,
    label: 'Admin',
  },
  {
    href: '/settings',
    icon: Settings,
    label: 'Settings',
  },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [user, setUser] = React.useState<any>(null);
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  React.useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success('Logged out successfully');
      router.push('/login');
      router.refresh();
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <aside className="w-64 bg-white border-r border-gray-200">
          <div className="flex flex-col h-full">
            <div className="p-6">
              <h1 className="text-2xl font-bold text-primary">Guru-Core</h1>
            </div>

            <nav className="flex-1 px-3 space-y-1">
              {navigationItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{user?.user_metadata?.full_name || 'User'}</p>
                  <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </aside>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white z-50 shadow-lg">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-4 border-b">
                <h1 className="text-xl font-bold text-primary">Guru-Core</h1>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="flex-1 px-3 py-4 space-y-1">
                {navigationItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      )}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </Button>
            )}
            <h2 className="text-lg font-semibold">
              {navigationItems.find((item) => item.href === pathname)?.label || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <NotificationBell />
            {isMobile && (
              <Button variant="ghost" size="icon">
                <User className="w-5 h-5" />
              </Button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
          <div className="flex items-center justify-around py-2">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center py-2 px-3 min-w-[70px]',
                    isActive ? 'text-primary' : 'text-gray-600'
                  )}
                >
                  <item.icon className="w-6 h-6 mb-1" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      )}
    </div>
  );
}
