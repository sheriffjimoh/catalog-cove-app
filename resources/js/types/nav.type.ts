// Types
import type { LucideIcon } from 'lucide-react';

interface NavigationItem {
    name: string;
    icon: LucideIcon;
    href: string;
    roles: ('business' | 'admin')[];
  }
  
  interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  interface TopbarProps {
    onMenuClick: () => void;
    onLogout?: () => void;
  }
  
  interface DashboardLayoutProps {
    children: React.ReactNode;
    onLogout?: () => void;
  } 



  export type { SidebarProps, TopbarProps, DashboardLayoutProps, NavigationItem };