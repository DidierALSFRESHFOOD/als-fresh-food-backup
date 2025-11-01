import React, { useContext, useState } from 'react';
import { AuthContext } from '@/App';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  TrendingUp, 
  Star, 
  AlertTriangle, 
  MessageSquare, 
  Settings, 
  LogOut,
  Menu,
  X,
  Truck
} from 'lucide-react';

const Layout = ({ children }) => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Tableau de bord', href: '/', icon: LayoutDashboard, roles: ['all'] },
    { name: 'Clients / Prospects', href: '/comptes', icon: Users, roles: ['all'] },
    { name: 'Opportunités', href: '/opportunites', icon: TrendingUp, roles: ['all'] },
    { name: 'Qualité Service', href: '/qualite', icon: Star, roles: ['all'] },
    { name: 'Incidents', href: '/incidents', icon: AlertTriangle, roles: ['all'] },
    { name: 'Satisfaction', href: '/satisfaction', icon: MessageSquare, roles: ['all'] },
    { 
      name: 'Administration', 
      href: '/admin', 
      icon: Settings, 
      roles: ['Admin_Directeur'] 
    },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes('all') || item.roles.includes(user?.role)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-50">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Title */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-blue-600 transition-colors"
                data-testid="mobile-menu-button"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <img 
                src="https://customer-assets.emergentagent.com/job_logistikpi/artifacts/kpnkwozt_ALS_logo_dessin_coul.png" 
                alt="ALS Logo" 
                className="h-10 w-10 object-contain"
              />
              <div>
                <h1 className="text-xl font-bold">Suivi Activité Commerciale</h1>
                <p className="text-xs text-blue-100 hidden sm:block">GROUPE ALS</p>
              </div>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-blue-100">
                  {user?.division || 'ALS'} {user?.region && `• ${user.region}`}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="text-white hover:bg-blue-600"
                data-testid="logout-button"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            mt-16 lg:mt-0
          `}
          data-testid="sidebar"
        >
          <nav className="h-full overflow-y-auto py-6 px-3">
            <div className="space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      sidebar-link flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                      ${isActive 
                        ? 'active text-blue-700 font-semibold' 
                        : 'text-gray-700 hover:text-blue-700'
                      }
                    `}
                    data-testid={`nav-${item.href}`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {/* Division Badge */}
            <div className="mt-8 px-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="h-5 w-5 text-blue-600" />
                  <p className="text-sm font-semibold text-blue-900">Votre Périmètre</p>
                </div>
                <p className="text-xs text-blue-700">
                  {user?.division || 'ALS FRESH FOOD / ALS PHARMA'}
                </p>
                {user?.region && (
                  <p className="text-xs text-blue-600 mt-1">
                    Région: {user.region}
                  </p>
                )}
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden mt-16"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Layout;