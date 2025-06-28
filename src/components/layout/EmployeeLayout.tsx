import { ReactNode, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Clock, User, Calendar, LogOut, Menu, X } from 'lucide-react';

interface EmployeeLayoutProps {
  children: ReactNode;
}

export default function EmployeeLayout({ children }: EmployeeLayoutProps) {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top navigation */}
      <div className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-white text-xl font-bold">TimeTrack</span>
              </div>
            </div>
            
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <div className="relative ml-3">
                  <div className="flex items-center gap-3">
                    <div className="text-sm text-white">
                      <span className="hidden md:inline-block">{user?.firstName} {user?.lastName}</span>
                    </div>
                    <div className="flex-shrink-0">
                      <img
                        className="h-8 w-8 rounded-full"
                        src={user?.profileImage || "https://i.pravatar.cc/150?img=1"}
                        alt="User profile"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={logout}
                      className="flex items-center text-primary-foreground/80 hover:text-white text-sm"
                    >
                      <LogOut className="h-4 w-4 mr-1" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="-mr-2 flex md:hidden">
              <button
                type="button"
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center rounded-md p-2 text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-white focus:outline-none"
              >
                <span className="sr-only">Open main menu</span>
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
              <div className="flex items-center px-3 py-2">
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.profileImage || "https://i.pravatar.cc/150?img=1"}
                  alt="User profile"
                />
                <div className="ml-3">
                  <div className="text-sm font-medium text-white">{user?.firstName} {user?.lastName}</div>
                  <div className="text-xs text-primary-foreground/70">{user?.department}</div>
                </div>
              </div>
              <button
                onClick={logout}
                className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-white"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}