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
      name: 'E-news',
      url: '/e-news',
      icon: 'icon-feed',
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
      icon: 'icon-target',
      children: [
        {
          name: 'Object image',
          url: '/manual/object-detection/image-detection',
          icon: 'icon-picture',
        },
        {
          name: 'Video highlight',
          url: '/manual/object-detection/video-highlight',
          icon: 'icon-pie-chart',
        },
      ],
    },
    {
      name: 'Face recognition',
      icon: 'icon-emotsmile',
      children: [
        {
          name: 'Face image',
          url: '/manual/face-recognition/image-detection',
          icon: 'icon-picture',
        },
        {
          name: 'Video highlight',
          url: '/manual/face-recognition/video-highlight',
          icon: 'icon-pie-chart',
        },
      ],
    },
    
    // {
    //   title: true,
    //   name: 'User',
    //   wrapper: {
    //     element: '',
    //     attributes: {},
    //   },
    // },
    // {
    //   name: 'Configuration',
    //   url: '/user/configuration',
    //   icon: 'icon-equalizer'
    // },
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
      url: '/admin/manager/models',
      icon: 'icon-layers',
    },
    {
      name: 'API manager',
      url: '/admin/manager/api',
      icon: 'icon-rocket',
    },
    {
      name: 'User manager',
      icon: 'icon-people',
      children: [
        {
          name: 'Role Management',
          url:  '/admin/manager/role-management',
          icon: 'icon-people',
        },
        {
          name: 'Nav Management',
          url:  '/admin/manager/nav-management',
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