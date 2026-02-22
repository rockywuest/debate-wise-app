import { MessageSquare, Trophy, TrendingUp, Settings } from 'lucide-react';

export const getNavItems = (isAdmin: boolean = false, language: 'de' | 'en' = 'en') => {
  const labels = {
    debates: language === 'de' ? 'Debatten' : 'Debates',
    leaderboard: language === 'de' ? 'Rangliste' : 'Leaderboard',
    analytics: language === 'de' ? 'Analytik' : 'Analytics',
    admin: 'Admin'
  };

  const baseItems = [
    {
      path: '/debates',
      label: labels.debates,
      icon: MessageSquare
    },
    {
      path: '/leaderboard',
      label: labels.leaderboard,
      icon: Trophy
    },
    {
      path: '/analytics',
      label: labels.analytics,
      icon: TrendingUp
    }
  ];

  // Only add admin item for actual admins
  if (isAdmin) {
    baseItems.push({
      path: '/admin',
      label: labels.admin,
      icon: Settings
    });
  }

  return baseItems;
};

// Keep the original export for backward compatibility
export const navItems = [
  {
    path: '/debates',
    label: 'Debates',
    icon: MessageSquare
  },
  {
    path: '/leaderboard',
    label: 'Leaderboard',
    icon: Trophy
  },
  {
    path: '/analytics',
    label: 'Analytics',
    icon: TrendingUp
  }
];
