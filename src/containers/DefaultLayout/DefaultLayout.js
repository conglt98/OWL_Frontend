import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../_nav';
// routes config
import routes from '../../routes';

import {getAllNavRole} from '../../api/nav_role'
import {getOneRole} from '../../api/role'
import fakeAuth from '../../api/fakeAuth'
import Sidebar from '../Sidebar/Sidebar'

const DefaultAside = React.lazy(() => import('./DefaultAside'));
const DefaultFooter = React.lazy(() => import('./DefaultFooter'));
const DefaultHeader = React.lazy(() => import('./DefaultHeader'));

class DefaultLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: [],
      nav_roles:[],
      navigation:navigation,
    }
  }
  componentWillMount(){
    var result=[];
    if (localStorage.getItem('nav_roles')&&localStorage.getItem('roles')){
      let nav = localStorage.getItem('nav_roles')
      let role = localStorage.getItem('roles')
      this.setState({
        nav_roles:JSON.parse(nav),
        roles:JSON.parse(role)
      })
    }
    getAllNavRole(fakeAuth.getAccessToken()).then((res) => { 
      result = res.data;
      result.map(re=>{
        let array = re.roles;
        return re.roles=array
      })
      getOneRole(fakeAuth.getUsername(),fakeAuth.getAccessToken()).then(res=>{
        let roleUSer = res.data?res.data.role:["Guest"];
        this.setState({
          nav_roles:result,
          roles:roleUSer,
          })
        localStorage.setItem('nav_roles',JSON.stringify(result))
        localStorage.setItem('roles',JSON.stringify(roleUSer))
        })
      })
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e) {
    e.preventDefault()
    this.props.history.push('/login')
  }

  appendRoleToRouter=(items, items_roles) =>{
    var result=[...items];
    return result.map((item, index)=>{
      items_roles.map((itemR, index2)=>{
          if(item.name===itemR.name){
            item.roles=itemR.roles;
          }
          return itemR;
        })
        return item;
    })
  }

  appendRoleToNav=(items, items_roles) =>{
    var result=[...items];
    return result.map((item, index)=>{
      items_roles.map((itemR, index2)=>{
          if(item.name===itemR.name){
            item.roles=itemR.roles;
          }
          if (item.children){
            item.children.map(child =>{
              if (child.name === itemR.name){
                child.roles=itemR.roles
              }
          })
            
          }
          return itemR;
        })
        return item;
    })
  }
  isValidRole = (userRole, rolesValid) => {
    if (userRole.includes('ADMIN'))
      return true;
    if(!rolesValid) {
      return false;
    }
    if(!userRole) {
      return false;
    }
    for (let i=0; i< rolesValid.length; i++) {
      if (userRole.indexOf(rolesValid[i]) > -1) {
        return true;
      }
    }
    return false;
  }

  render() {
    var {roles}=this.state;
    let routesAppendRole=this.appendRoleToRouter(routes,this.state.nav_roles);
    let retRouter= routesAppendRole.filter(route => (this.isValidRole(roles, route.roles)))

    let routesAppendNav=this.appendRoleToNav(navigation.items,this.state.nav_roles);
    // console.log(routesAppendNav)
    let retNavItems = routesAppendNav.filter(nav => (this.isValidRole(roles, nav.roles)))
    // console.log(retNavItems)
    retNavItems.map(ele=>{
      if (ele.children){
        ele.children = ele.children.filter(child =>(this.isValidRole(roles, child.roles)))
      }
    })
    // console.log(retNavItems)
    let retNav = {items:retNavItems}
    // console.log(retRouter)
    return (
      <div className="app">
        <AppHeader fixed>
          <Suspense  fallback={this.loading()}>
            <DefaultHeader onLogout={e=>this.signOut(e)}/>
          </Suspense>
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
            {/* <Sidebar roles={roles} {...this.props}/> */}
            <AppSidebarNav navConfig={retNav} {...this.props} router={router}/>
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes} router={router}/>
            <Container fluid>
              <Suspense fallback={this.loading()}>
              <Switch>
                  {retRouter
                  // .  (route=> (this.isValidRole(roles, route.roles)))
                  .map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component {...props} />
                        )} />
                    ) : (null);
                  })}
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          {/* <AppAside fixed>
            <Suspense fallback={this.loading()}>
              <DefaultAside />
            </Suspense>
          </AppAside> */}
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default DefaultLayout;
