import React, { useState } from 'react';
import { Menu, User, ChevronDown, LogOut } from 'lucide-react';
import type { TopbarProps } from '@/Types/nav.type';
import { usePage } from '@inertiajs/react';
import { ThemeToggle } from './ThemeToggle';
import { Link } from '@inertiajs/react';

const Topbar: React.FC<TopbarProps> = ({ 
    onMenuClick, 
    onLogout 
  }) => {
    const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);

    const user = usePage().props.auth.user;
    const business = usePage().props.business as { logo?: string };

    const userName: string = user ? user.name : 'Guest';
    const userRole: string = user ? user.role : 'N/A';
    const userAvatar: string | null = business && business.logo ? business.logo : null;
    
  
    const handleLogout = (): void => {
      if (onLogout) {
        onLogout();
      } else {
        console.log('Logout clicked');
      }
    };
  
    return (
      <header className=" bg-white dark:bg-gray-900  shadow-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <Menu className="h-6 w-6" />
          </button>
  
          <div className="flex-1  flex items-center justify-between">
            <div className="hidden lg:block">
              <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
            </div>
            
            {/* User menu */}
            <div className="relative ml-auto">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center p-2 rounded-lg  transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  {userAvatar ? (
                    <img 
                      src={userAvatar} 
                      alt={user.name}
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  )}
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-50">{userName}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-200">{userRole}</p>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                </div>
              </button>
  
              {/* Dropdown menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                  <Link
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <User className="h-4 w-4 mr-3" />
                    Profile
                  </Link>

                  <ThemeToggle inDropdown={true} closeDropdown={() =>console.log("Let'g GOOOOOoo")} />
      
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <LogOut className="h-4 w-4 mr-3" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    );
  };
  

export default Topbar;