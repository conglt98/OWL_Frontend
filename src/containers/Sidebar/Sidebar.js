import React, {Component} from 'react';
import {NavLink} from 'react-router-dom';
import {Badge, Nav, NavItem, NavLink as RsNavLink,
} from 'reactstrap';
import classNames from 'classnames';
import nav from '../../_nav';
//import nav_roles from './_nav_roles'
import {getAllNavRole} from '../../api/nav_role'
import fakeAuth from '../../api/fakeAuth'
class Sidebar extends Component {

  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.activeRoute = this.activeRoute.bind(this);
    this.hideMobile = this.hideMobile.bind(this);
    this.state={
      nav_roles:[]
    }
  }


  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName, props) {
    // return this.props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
    return props.location.pathname.indexOf(routeName) > -1 ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';

  }

  hideMobile() {
    if (document.body.classList.contains('sidebar-mobile-show')) {
      document.body.classList.toggle('sidebar-mobile-show')
    }
  }

  // todo Sidebar nav secondLevel
  // secondLevelActive(routeName) {
  //   return this.props.location.pathname.indexOf(routeName) > -1 ? "nav nav-second-level collapse in" : "nav nav-second-level collapse";
  // }

  isValidRole = (userRole, rolesValid) => {
    if (userRole.includes('ADMIN'))
      return true;
    if(!rolesValid) {
      return false;
    }
    if(!userRole) {
      //console.log("Role InValid");
      return false;
    }

    for (let i=0; i< rolesValid.length; i++) {
      if (userRole.indexOf(rolesValid[i]) > -1) {
        return true;
      }
    }
    return false;
  }
  appendRoleToNav=(items, items_roles) =>{
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
  componentWillMount(){
    getAllNavRole(fakeAuth.getAccessToken()).then((res) => { 
      if (res){
        let result = res.data;
      result.map(re=>{
        var array = re.roles;
        return re.roles=array
      })
      this.setState({nav_roles:result})
      }
      })
  }
  render() {

    const props = this.props;

    // badge addon to NavItem
    const badge = (badge) => {
      if (badge) {
        const classes = classNames( badge.class );
        return (<Badge className={ classes } color={ badge.variant }>{ badge.text }</Badge>)
      }
    };

    // simple wrapper for nav-title item
    const wrapper = item => { return (item.wrapper && item.wrapper.element ? (React.createElement(item.wrapper.element, item.wrapper.attributes, item.name)): item.name ) };

    // nav list section title
    const title =  (title, key) => {
      const classes = classNames( 'nav-title', title.class);
      return (<li key={key} className={ classes }>{wrapper(title)} </li>);
    };

    // nav list divider
    const divider = (divider, key) => {
      const classes = classNames( 'divider', divider.class);
      return (<li key={key} className={ classes }></li>);
    };

    // nav item with nav link
    const navItem = (item, key) => {
      const classes = {
        item: classNames( item.class) ,
        link: classNames( 'nav-link', item.variant ? `nav-link-${item.variant}` : ''),
        icon: classNames( item.icon )
      };
      return (
        navLink(item, key, classes)
      )
    };

    // nav link
    const navLink = (item, key, classes) => {
      const url = item.url ? item.url : '';
      return (
        <NavItem key={key} className={classes.item}>
          { isExternal(url) ?
            <RsNavLink href={url} className={classes.link} active>
              <i className={classes.icon}></i>&nbsp;&nbsp;{item.name}{badge(item.badge)}
            </RsNavLink>
            :
            <NavLink to={url} className={classes.link} activeClassName="active" onClick={this.hideMobile}>
              <i className={classes.icon}></i>&nbsp;&nbsp;{item.name}{badge(item.badge)}
            </NavLink>
          }
        </NavItem>
      )
    };

    // nav dropdown
    const navDropdown = (item, key,items_roles) => {
      return (
        <li key={key} className={this.activeRoute(item.url, props)}>
          <a className="nav-link nav-dropdown-toggle" href="/#/" onClick={this.handleClick}><i className={item.icon}>&nbsp;</i>{item.name}</a>
          <ul className="nav-dropdown-items">
            {navList(item.children,items_roles)}
          </ul>
        </li>)
    };

    // nav type
    const navType = (item, idx,items_roles) =>
      item.title ? title(item, idx) :
      item.divider ? divider(item, idx) :
      item.children ? navDropdown(item, idx,items_roles)
                    : navItem(item, idx) ;
    
    // nav list
    const navList = (items,items_roles) => {
      items=this.appendRoleToNav(items,items_roles);
      return items.filter(item=> (this.isValidRole(this.props.roles, item.roles))).map( (item, index) => navType(item, index,items_roles) );
    };

    const isExternal = (url) => {
      const link = url ? url.substring(0, 4) : '';
      return link === 'http';
    };
  
    // sidebar-nav root
    return (

        <div style={{
          overflowY: 'auto'
        }}>
          <nav className="sidebar-nav" >
          <Nav>
            {navList(nav.items, this.state.nav_roles)}
          </Nav>
        </nav>
        </div>

    )
  }
}

export default Sidebar;
