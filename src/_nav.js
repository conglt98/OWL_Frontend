export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
    },
    {
      name: 'Events',
      icon: 'icon-equalizer',
      children: [
      {
        name: 'Events',
        url: '/events',
        icon: 'icon-puzzle',
        badge: {
          variant: 'info',
          text: 'MAIN',
        },
      },
      {
        name: 'Domains',
        url: '/domains',
        icon: 'icon-puzzle',
      },
      {
        name: 'Profiles',
        url: '/profiles',
        icon: 'icon-puzzle',
      },
      {
        name: 'Tiers',
        url: '/tiers',
        icon: 'icon-puzzle',
      },
      {
        name: 'Rules',
        url: '/rules',
        icon: 'icon-puzzle',
      },
      {
        name: 'Conditions',
        url: '/conditions',
        icon: 'icon-energy',
      },
      {
        name: 'Sources',
        url: '/sources',
        icon: 'icon-layers',
      },
      {
        name: 'InfoCode',
        url: '/info-code',
        icon: 'icon-info',
      },
      {
        name: 'ActionCode',
        url: '/action-code',
        icon: 'icon-rocket',
      },
      {
        name: 'Clients',
        url: '/clients',
        icon: 'icon-people',
      },
      {
        name: 'DataDefinitions',
        url: '/data-definitions',
        icon: 'icon-grid',
      },
      {
        name: 'AccumulationKeys',
        url: '/accumulation-keys',
        icon: 'icon-diamond',
      }
    ]
    },
    {
      name: 'CheckAccumulation',
      url: '/check-accumulation',
      icon: 'icon-star',
    },
    {
      name: 'ManualData',
      url: '/manual-data',
      icon: 'icon-notebook',
    },
    {
      name: 'ReloadConfig',
      url: '/reload-config',
      icon: 'icon-refresh',
    },
    {
      name: 'RoleManagement',
      url: '/role-management',
      icon: 'icon-user',
    },
    {
      name: 'NavManagement',
      url: '/nav-management',
      icon: 'icon-compass',
    },
  ],
};
