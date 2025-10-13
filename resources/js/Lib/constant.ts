
import { Home, Package, BarChart3, Users, Settings, Image } from 'lucide-react';
import type { NavigationItem } from '@/Types/nav.type';

export const navigationItems: NavigationItem[] = [
    {
      name: 'Dashboard',
      icon: Home,
      href: '/dashboard',
      roles: ['business', 'admin']
    },
    {
      name: 'Products',
      icon: Package,
      href: '/products',
      roles: ['business', 'admin']
    },
    {
      name: 'Media Library',
      icon: Image,
      href: '/media-library',
      roles: ['business', 'admin']
    },
    {
      name: 'Analytics',
      icon: BarChart3,
      href: '/analytics',
      roles: ['business', 'admin']
    },
    {
      name: 'Users',
      icon: Users,
      href: '/users',
      roles: ['admin']
    },
    {
      name: 'Settings',
      icon: Settings,
      href: '/settings',
      roles: ['business', 'admin']
    }
  ];