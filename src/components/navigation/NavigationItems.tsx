import { MessageSquare, Trophy, TrendingUp, Settings } from 'lucide-react';

export const getNavItems = (isAdmin: boolean = false) => {
  const baseItems = [
    {
      path: '/debates',
      label: 'Debatten',
      icon: MessageSquare
    },
    {
      path: '/leaderboard',
      label: 'Rangliste',
      icon: Trophy
    },
    {
      path: '/analytics',
      label: 'Analytik',
      icon: TrendingUp
    }
  ];

  // Only add admin item for actual admins
  if (isAdmin) {
    baseItems.push({
      path: '/admin',
      label: 'Admin',
      icon: Settings
    });
  }

  return baseItems;
};

// Keep the original export for backward compatibility
export const navItems = [
  {
    path: '/debates',
    label: 'Debatten',
    icon: MessageSquare
  },
  {
    path: '/leaderboard',
    label: 'Rangliste',
    icon: Trophy
  },
  {
    path: '/analytics',
    label: 'Analytik',
    icon: TrendingUp
  }
];
