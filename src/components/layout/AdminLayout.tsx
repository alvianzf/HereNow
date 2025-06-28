import { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ChevronDown, 
  Clock, 
  User, 
  BarChart, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Dashboard', path: '/admin', icon: <Clock className="h-5 w-5" /> },
    { name: 'Employees', path: '/admin/employees', icon: <User className="h-5 w-5" /> },
    { name: 'Reports', path: '/admin/reports', icon: <BarChart className="h-5 w-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
  ];

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-primary px-6 pb-4">
          <div className="flex h-16 shrink-0 items-center">
            <h1 className="text-2xl font-bold text-white mt-4">TimeTrack</h1>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigationItems.map((item) => (
                    <li key={item.name}>
                      <button
                        onClick={() => navigate(item.path)}
                        className={`${
                          isActive(item.path)
                            ? 'bg-primary-foreground/10 text-white'
                            : 'text-primary-foreground/70 hover:text-white hover:bg-primary-foreground/10'
                        } group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full`}
                      >
                        {item.icon}
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
              <li className="mt-auto">
                <button
                  onClick={logout}
                  className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-white w-full"
                >
                  <LogOut className="h-5 w-5" />
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-primary px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          className="-m-2.5 p-2.5 text-primary-foreground/70 lg:hidden"
          onClick={toggleMobileMenu}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
        <div className="flex-1 text-sm font-semibold leading-6 text-white">
          TimeTrack
        </div>
        <button
          type="button"
          onClick={toggleProfileMenu}
          className="relative flex items-center"
        >
          <span className="sr-only">Open user menu</span>
          <img
            className="h-8 w-8 rounded-full bg-gray-50"
            src={user?.profileImage || "https://i.pravatar.cc/150?img=1"}
            alt=""
          />
          {profileMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <button
                onClick={logout}
                className="flex w-full items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </button>
      </div>

      {/* Mobile sidebar */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-900/80" onClick={toggleMobileMenu}></div>
          <div className="fixed inset-y-0 left-0 z-50 w-full overflow-y-auto bg-primary px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white">TimeTrack</h1>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-primary-foreground/70"
                onClick={toggleMobileMenu}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigationItems.map((item) => (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.path);
                        toggleMobileMenu();
                      }}
                      className={`${
                        isActive(item.path)
                          ? 'bg-primary-foreground/10 text-white'
                          : 'text-primary-foreground/70 hover:text-white hover:bg-primary-foreground/10'
                      } group flex w-full items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6`}
                    >
                      {item.icon}
                      {item.name}
                    </button>
                  ))}
                </div>
                <div className="py-6">
                  <button
                    onClick={() => {
                      logout();
                      toggleMobileMenu();
                    }}
                    className="group flex w-full items-center gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-white"
                  >
                    <LogOut className="h-5 w-5" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-72">
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}