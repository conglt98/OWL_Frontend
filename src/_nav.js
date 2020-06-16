export default {
  items: [
    {
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      // badge: {
      //   variant: 'info',
      //   text: 'NEW',
      // },
    },
    {
      title: true,
      name: 'Project',
      wrapper: {            // optional wrapper object
        element: '',        // required valid HTML5 element tag
        attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
      },
      class: ''             // optional class names space delimited list for title item ex: "text-center"
    },
    {
      name: 'Facebook',
      url: '/project/facebook',
      icon: 'icon-social-facebook',
    },
    {
      name: 'Youtube',
      url: '/project/youtube',
      icon: 'icon-social-youtube',
    },
    {
      name: 'Keywords',
      url: '/project/keywords',
      icon: 'icon-book-open',
    },
    {
      title: true,
      name: 'Manual',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    {
      name: 'Object detection',
      url: '/manual/object-detection',
      icon: 'icon-picture',
      
    },
    {
      name: 'Video highlight',
      url: '/charts',
      icon: 'icon-pie-chart',
    },
    {
      title: true,
      name: 'User',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    {
      name: 'Configuration',
      url: '/user/configuration',
      icon: 'icon-equalizer'
    },
    {
      title: true,
      name: 'Admin',
      wrapper: {
        element: '',
        attributes: {},
      },
    },
    {
      name: 'Model manager',
      url: 'admin/manager/model',
      icon: 'icon-layers',
    },
    {
      name: 'API manager',
      url: 'admin/manager/api',
      icon: 'icon-rocket',
    },
    {
      name: 'User manager',
      icon: 'icon-people',
      children: [
        {
          name: 'Role Management',
          url:  'admin/manager/role-management',
          icon: 'icon-people',
        },
        {
          name: 'Nav Management',
          url:  'admin/manager/nav-management',
          icon: 'icon-compass',
        },
      ],
    },
    {
      name: 'Configuration',
      url: '/admin/configuration',
      icon: 'icon-settings',
    }
  ],
};