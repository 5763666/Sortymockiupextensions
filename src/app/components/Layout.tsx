import { Outlet, Link, useLocation } from 'react-router';
import { Network, PenTool, Search, Sparkles, Menu } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';

export function Layout() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: '지식 마인드맵', icon: Network },
    { path: '/canvas', label: '캔버스', icon: PenTool },
    { path: '/search', label: '자료검색', icon: Search },
    { path: '/recommendations', label: '맞춤 추천', icon: Sparkles },
  ];

  const NavLinks = () => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path}>
            <Button
              variant={isActive ? 'default' : 'ghost'}
              className="w-full justify-start gap-3 h-11"
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-60 border-r flex-col bg-card shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Network className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold text-primary">Sorty</h1>
              <p className="text-xs text-muted-foreground">
                AI 기반 지식 정리 플랫폼
              </p>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          <NavLinks />
        </nav>
        <div className="p-4 border-t text-xs text-muted-foreground">
          <p>© 2026 Sorty</p>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 border-b bg-card shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Network className="w-4 h-4 text-primary-foreground" />
            </div>
            <h1 className="font-bold text-primary">Sorty</h1>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-5 h-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-64">
              <div className="py-4">
                <h2 className="font-bold text-lg mb-4">메뉴</h2>
                <nav className="space-y-1">
                  <NavLinks />
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden lg:mt-0 mt-16 bg-background">
        <Outlet />
      </main>
    </div>
  );
}