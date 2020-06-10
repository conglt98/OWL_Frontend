import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, Button } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppAsideToggler, AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from '../../assets/img/brand/logo.svg'
import sygnet from '../../assets/img/brand/sygnet.svg'
import fakeAuth from '../../api/fakeAuth'
import {Tag} from 'antd'
import { withRouter
} from 'react-router-dom';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

const iconStyle = {
  "margin-right":"5px"
}
// const logoStyle = {
//   "color": "#4CAF50 !important"
// }

const AuthButton = withRouter(
  ({ history }) =>
    fakeAuth.isAuthenticated() ? (
      <div>
        <Button color="danger" size="sm" outline
        onClick={() => {
          fakeAuth.signout(() => history.push("/"));
        }}
        > <i className="icon-logout fa-lg"
        ></i> &nbsp; Sign out</Button>

      </div>
    ) : (
      <Button color="danger" size="sm" outline
      onClick={() => {
        fakeAuth.signout(() => history.push("/"));
      }}
        > <i className="icon-logout fa-lg"
        ></i>&nbsp; You are not logged in</Button>
    )
);

class DefaultHeader extends Component {
  componentWillMount=()=>{
    if (localStorage.getItem("font")){
      document.getElementById('root').className=localStorage.getItem("font")
    }
  }
  changeFont=(className)=>{
    document.getElementById('root').className=className
    localStorage.setItem("font",className);
  }

  getTag = (tag)=>{
    let color = tag.length > 13 ?  'green':'geekblue';
    if (tag === 'Administrator') {
      color = 'volcano';
    }
  return <Tag color={color} key={tag}>{tag.toUpperCase()}</Tag>;
}
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
           full={{ src: logo, width: 89*2, height: 25*2, alt: 'OWL' }}
           minimized={{ src: sygnet, width: 45, height: 45, alt: 'OWL' }}
        >
        {/* <b style={iconStyle}>TITAN </b> <Badge color="danger" size="sm">ADMIN</Badge> */}
        </AppNavbarBrand>
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        <Nav className="d-md-down-none" navbar>
          {/* <NavItem className="px-3">
            <NavLink to="/dashboard" className="nav-link" >Dashboard</NavLink>
          </NavItem> */}
          <NavItem className="px-3">
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              {/* <img src={'../../assets/img/avatars/8.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" /> */}
              Fonts
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header tag="div" className="text-center"><strong>Change font</strong></DropdownItem>
              <DropdownItem onClick={()=>{this.changeFont('fontNunito')}}><i className="fa fa-font"></i> Nunito</DropdownItem>
              {/* <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
              <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
              <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
              <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>
              <DropdownItem divider />
              <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem> */}
              <DropdownItem onClick={()=>{this.changeFont('fontCabinCondensed')}}><i className="fa fa-font"></i> Cabin Condensed</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>

          </NavItem>

        </Nav>
        <Nav className="ml-auto" navbar>
        <NavItem className="d-md-down-none px-3">
            <NavLink to="#" className="nav-link">
              {localStorage.getItem("roles")?this.getTag(JSON.parse(localStorage.getItem('roles'))[0]):<span></span>}
            </NavLink>
          </NavItem>

          {/* <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-bell"></i><Badge pill color="danger">5</Badge></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-list"></i></NavLink>
          </NavItem>
          <NavItem className="d-md-down-none">
            <NavLink to="#" className="nav-link"><i className="icon-location-pin"></i></NavLink>
          </NavItem> */}
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              {/* <img src={'../../assets/img/avatars/8.jpg'} className="img-avatar" alt="admin@bootstrapmaster.com" /> */}
            <Button color="danger" size="sm" outline> <i className="fa fa-user fa-lg"></i> &nbsp; {fakeAuth.getUsername()}</Button>
            </DropdownToggle>
            {/* <DropdownMenu right>
              <DropdownItem header tag="div" className="text-center"><strong>Account</strong></DropdownItem>
              <DropdownItem><i className="fa fa-bell-o"></i> Updates<Badge color="info">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-envelope-o"></i> Messages<Badge color="success">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-tasks"></i> Tasks<Badge color="danger">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-comments"></i> Comments<Badge color="warning">42</Badge></DropdownItem>
              <DropdownItem header tag="div" className="text-center"><strong>Settings</strong></DropdownItem>
              <DropdownItem><i className="fa fa-user"></i> Profile</DropdownItem>
              <DropdownItem><i className="fa fa-wrench"></i> Settings</DropdownItem>
              <DropdownItem><i className="fa fa-usd"></i> Payments<Badge color="secondary">42</Badge></DropdownItem>
              <DropdownItem><i className="fa fa-file"></i> Projects<Badge color="primary">42</Badge></DropdownItem>
              <DropdownItem divider />
              <DropdownItem><i className="fa fa-shield"></i> Lock Account</DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-lock"></i> Logout</DropdownItem>
            </DropdownMenu> */}
          </UncontrolledDropdown>
          <NavItem className="px-3">
            <AuthButton/>
          </NavItem>
        </Nav>
        {/* <AppAsideToggler className="d-md-down-none" />
        <AppAsideToggler className="d-lg-none" mobile /> */}
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
