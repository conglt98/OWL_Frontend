import React from 'react';

// const Breadcrumbs = React.lazy(() => import('./views/Base/Breadcrumbs'));
// const Cards = React.lazy(() => import('./views/Base/Cards'));
// const Carousels = React.lazy(() => import('./views/Base/Carousels'));
// const Collapses = React.lazy(() => import('./views/Base/Collapses'));
// const Dropdowns = React.lazy(() => import('./views/Base/Dropdowns'));
// const Forms = React.lazy(() => import('./views/Base/Forms'));
// const Jumbotrons = React.lazy(() => import('./views/Base/Jumbotrons'));
// const ListGroups = React.lazy(() => import('./views/Base/ListGroups'));
// const Navbars = React.lazy(() => import('./views/Base/Navbars'));
// const Navs = React.lazy(() => import('./views/Base/Navs'));
// const Paginations = React.lazy(() => import('./views/Base/Paginations'));
// const Popovers = React.lazy(() => import('./views/Base/Popovers'));
// const ProgressBar = React.lazy(() => import('./views/Base/ProgressBar'));
// const Switches = React.lazy(() => import('./views/Base/Switches'));
// const Tables = React.lazy(() => import('./views/Base/Tables'));
// const Tabs = React.lazy(() => import('./views/Base/Tabs'));
// const Tooltips = React.lazy(() => import('./views/Base/Tooltips'));
// const BrandButtons = React.lazy(() => import('./views/Buttons/BrandButtons'));
// const ButtonDropdowns = React.lazy(() => import('./views/Buttons/ButtonDropdowns'));
// const ButtonGroups = React.lazy(() => import('./views/Buttons/ButtonGroups'));
// const Buttons = React.lazy(() => import('./views/Buttons/Buttons'));
// const Charts = React.lazy(() => import('./views/Charts'));
// const CoreUIIcons = React.lazy(() => import('./views/Icons/CoreUIIcons'));
// const Flags = React.lazy(() => import('./views/Icons/Flags'));
// const FontAwesome = React.lazy(() => import('./views/Icons/FontAwesome'));
// const SimpleLineIcons = React.lazy(() => import('./views/Icons/SimpleLineIcons'));
// const Alerts = React.lazy(() => import('./views/Notifications/Alerts'));
// const Badges = React.lazy(() => import('./views/Notifications/Badges'));
// const Modals = React.lazy(() => import('./views/Notifications/Modals'));
// const Colors = React.lazy(() => import('./views/Theme/Colors'));
// const Typography = React.lazy(() => import('./views/Theme/Typography'));
// const Widgets = React.lazy(() => import('./views/Widgets/Widgets'));
// const Users = React.lazy(() => import('./views/Users/Users'));
// const User = React.lazy(() => import('./views/Users/User'));

const Dashboard = React.lazy(() => import('./views/Dashboard'));

// const Events = React.lazy(() => import('./views/Events/Events'));
// const Event = React.lazy(() => import('./views/Events/Event'));
// const EditEvent = React.lazy(() => import('./views/Events/EditEvent'));
// const NewEvent = React.lazy(() => import('./views/Events/NewEvent'));

const Keyword = React.lazy(() => import('./components/keyword'));
const Facebook = React.lazy(() => import('./components/facebook'));
const FacebookPage = React.lazy(() => import('./components/facebook/page'));
const FacebookPost = React.lazy(() => import('./components/facebook/post'));

const Youtube = React.lazy(() => import('./components/youtube'));
const YoutubeChannel = React.lazy(() => import('./components/youtube/channel'));
const YoutubeTopic = React.lazy(() => import('./components/youtube/topic'));
const YoutubeVideo = React.lazy(() => import('./components/youtube/video'));


const KeywordKeyword = React.lazy(() => import('./components/keyword/keyword/index'));
const KeywordVideo = React.lazy(() => import('./components/keyword/video'));


const VideoHighlight = React.lazy(() => import('./components/videohighlight'));
const ObjectDetection = React.lazy(() => import('./components/objectdetection'));


const RoleManagement = React.lazy(() => import('./components/RoleManagement'));
const NavManagement = React.lazy(() => import('./components/NavManagement'));

const ModelManager = React.lazy(() => import('./components/models'));
const APIManager = React.lazy(() => import('./components/models/apiModel'));


const Configuration = React.lazy(() => import('./components/dnd/configuration'));


// const SourcesManagement = React.lazy(() => import('./components/SourcesManagement'));
// const RulesManagement = React.lazy(() => import('./components/RulesManagement'));
// const RuleInfo = React.lazy(() => import('./components/RuleInfo'));
// const SourceInfo = React.lazy(() => import('./components/SourceInfo'));
// const DomainManagement = React.lazy(()=> import('./components/DomainManagement'));
// const DomainInfo = React.lazy(()=> import('./components/DomainInfo'));
// const ProfileManagement = React.lazy(()=> import('./components/ProfileManagement'));
// const ProfileInfo = React.lazy(()=> import('./components/ProfileInfo'));
// const TierManagement = React.lazy(()=> import('./components/TierManagement'));
// const TierInfo = React.lazy(()=> import('./components/TierInfo'));
// const RuleVersionInfo = React.lazy(()=> import('./components/RuleVersionInfo'));

// const DataDefinitions = React.lazy(() => import('./components/DataDefinitions'));
// const DataDefinitionsInfo = React.lazy(() => import('./components/DataDefinitionsInfo'));
// const AccumulationKeys = React.lazy(() => import('./components/AccumulationKeys'));

// const ReloadConfig = React.lazy(() => import('./components/ReloadConfig'));


// const ClientManagement = React.lazy(()=> import('./components/ClientManagement'));
// const ClientInfo = React.lazy(()=> import('./components/ClientInfo'));
// const ConditionManagement = React.lazy(()=> import('./components/ConditionManagement'));
// const ConditionInfo = React.lazy(()=> import('./components/ConditionInfo'));
// const InfoCodeManagement = React.lazy(()=> import('./components/InfoCodeManagement'));
// const InfoCodeInfo = React.lazy(()=> import('./components/InfoCodeInfo'));

// const ActionCodeManagement = React.lazy(()=> import('./components/ActionCodeManagement'));

// const CheckAccumulation = React.lazy(()=> import('./components/CheckAccumulation'));
// const ManualData = React.lazy(()=> import('./components/ManualData'));

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/project/keywords',exact:true, name: 'Keywords', component: Keyword },
  { path: '/project/facebook',exact:true, name: 'Facebook', component: Facebook },
  { path: '/project/facebook/page/:id',exact:true, name: 'Facebook page', component: FacebookPage },
  { path: '/project/facebook/:id/:postid',exact:true, name: 'Facebook post', component: FacebookPost },

  { path: '/project/youtube', exact:true, name: 'Youtube', component: Youtube },
  { path: '/project/youtube/channel/:id',exact:true, name: 'Youtube channel', component: YoutubeChannel },
  { path: '/project/youtube/topic/:id',exact:true, name: 'Youtube topic', component: YoutubeTopic },
  { path: '/project/youtube/:id/:videoid',exact:true, name: 'Youtube video', component: YoutubeVideo },


  { path: '/project/keywords/:id',exact:true, name: 'Keyword', component: KeywordKeyword },
  { path: '/project/keywords/:id/:videoid',exact:true, name: 'Keyword video', component: KeywordVideo },


  { path: '/manual/video-highlight', name: 'Video highlight', component: VideoHighlight },
  { path: '/manual/object-detection', name: 'Object detection', component: ObjectDetection },

  // { path: '/events', exact: true,name: 'Events', component: Events },
  // { path: '/events/event/add', exact: true, name: 'Add new event', component: NewEvent },
  // { path: '/events/:id/edit', exact: true, name: 'Edit', component: EditEvent },
  // { path: '/events/:id', exact: true, name: 'Info', component: Event },

  // { path: '/domains', exact: true, name: 'Domains', component: DomainManagement },
  // { path: '/domains/:id', exact: true, name: 'DomainInfo', component: DomainInfo },
  // { path: '/profiles', exact: true, name: 'Profiles', component: ProfileManagement },
  // { path: '/profiles/:id', exact: true, name: 'ProfileInfo', component: ProfileInfo },
  // { path: '/tiers', exact: true, name: 'Tiers', component: TierManagement },
  // { path: '/tiers/:id', exact: true, name: 'TierInfo', component: TierInfo },
  // { path: '/conditions', exact: true, name: 'Conditions', component: ConditionManagement },
  // { path: '/conditions/:id', exact: true, name: 'ConditionInfo', component: ConditionInfo },

  // { path: '/info-code', exact: true, name: 'InfoCode', component: InfoCodeManagement },
  // { path: '/info-code/:id', exact: true, name: 'InfoCodeInfo', component: InfoCodeInfo },

  // { path: '/action-code', exact: true, name: 'ActionCode', component: ActionCodeManagement },

  // { path: '/clients', exact: true, name: 'Clients', component: ClientManagement },
  // { path: '/clients/:id', exact: true, name: 'ClientInfo', component: ClientInfo },

  // { path: '/rules', exact: true, name: 'Rules', component: RulesManagement },
  // { path: '/rules/:id', exact: true, name: 'RuleInfo', component: RuleInfo },
  // { path: '/ruleVersions/:id', exact: true, name: 'RuleVersionInfo', component: RuleVersionInfo },

  // { path: '/sources', exact: true, name: 'Sources', component: SourcesManagement },
  // { path: '/sources/:id', exact: true, name: 'SourceInfo', component: SourceInfo },
  // { path: '/data-definitions', exact: true, name: 'DataDefinitions', component: DataDefinitions },
  // { path: '/accumulation-keys', exact: true, name: 'AccumulationKeys', component: AccumulationKeys },
  // { path: '/check-accumulation', exact: true, name: 'CheckAccumulation', component: CheckAccumulation },
  // { path: '/manual-data', exact: true, name: 'ManualData', component: ManualData },

  // { path: '/reload-config', exact: true, name: 'ReloadConfig', component: ReloadConfig },


  // { path: '/data-definitions/:id', exact: true, name: 'DataDefinitionsInfo', component: DataDefinitionsInfo },
  { path: '/admin/manager/role-management',exact: true, name: 'Role Management', component: RoleManagement},
  { path: '/admin/manager/nav-management',exact: true, name: 'Nav Management', component: NavManagement},
  { path: '/admin/manager/models',exact: true, name: 'Model manager', component: ModelManager},
  { path: '/admin/manager/api',exact: true, name: 'API manager', component: APIManager},
  { path: '/admin/configuration',exact: true, name: 'Configuration', component: Configuration},

  // { path: '/theme', exact: true, name: 'Theme', component: Colors },
  // { path: '/theme/colors', name: 'Colors', component: Colors },
  // { path: '/theme/typography', name: 'Typography', component: Typography },
  // { path: '/base', exact: true, name: 'Base', component: Cards },
  // { path: '/base/cards', name: 'Cards', component: Cards },
  // { path: '/base/forms', name: 'Forms', component: Forms },
  // { path: '/base/switches', name: 'Switches', component: Switches },
  // { path: '/base/tables', name: 'Tables', component: Tables },
  // { path: '/base/tabs', name: 'Tabs', component: Tabs },
  // { path: '/base/breadcrumbs', name: 'Breadcrumbs', component: Breadcrumbs },
  // { path: '/base/carousels', name: 'Carousel', component: Carousels },
  // { path: '/base/collapses', name: 'Collapse', component: Collapses },
  // { path: '/base/dropdowns', name: 'Dropdowns', component: Dropdowns },
  // { path: '/base/jumbotrons', name: 'Jumbotrons', component: Jumbotrons },
  // { path: '/base/list-groups', name: 'List Groups', component: ListGroups },
  // { path: '/base/navbars', name: 'Navbars', component: Navbars },
  // { path: '/base/navs', name: 'Navs', component: Navs },
  // { path: '/base/paginations', name: 'Paginations', component: Paginations },
  // { path: '/base/popovers', name: 'Popovers', component: Popovers },
  // { path: '/base/progress-bar', name: 'Progress Bar', component: ProgressBar },
  // { path: '/base/tooltips', name: 'Tooltips', component: Tooltips },
  // { path: '/buttons', exact: true, name: 'Buttons', component: Buttons },
  // { path: '/buttons/buttons', name: 'Buttons', component: Buttons },
  // { path: '/buttons/button-dropdowns', name: 'Button Dropdowns', component: ButtonDropdowns },
  // { path: '/buttons/button-groups', name: 'Button Groups', component: ButtonGroups },
  // { path: '/buttons/brand-buttons', name: 'Brand Buttons', component: BrandButtons },
  // { path: '/icons', exact: true, name: 'Icons', component: CoreUIIcons },
  // { path: '/icons/coreui-icons', name: 'CoreUI Icons', component: CoreUIIcons },
  // { path: '/icons/flags', name: 'Flags', component: Flags },
  // { path: '/icons/font-awesome', name: 'Font Awesome', component: FontAwesome },
  // { path: '/icons/simple-line-icons', name: 'Simple Line Icons', component: SimpleLineIcons },
  // { path: '/notifications', exact: true, name: 'Notifications', component: Alerts },
  // { path: '/notifications/alerts', name: 'Alerts', component: Alerts },
  // { path: '/notifications/badges', name: 'Badges', component: Badges },
  // { path: '/notifications/modals', name: 'Modals', component: Modals },
  // { path: '/widgets', name: 'Widgets', component: Widgets },
  // { path: '/charts', name: 'Charts', component: Charts },
  // { path: '/users', exact: true,  name: 'Users', component: Users },
  // { path: '/users/:id', exact: true, name: 'User Details', component: User },
];

export default routes;
