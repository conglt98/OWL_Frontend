import React, { Component } from 'react';
import {Redirect} from 'react-router-dom';
import { Button, Card, CardBody, CardGroup, Col, 
  Container, Form, Input, InputGroup, InputGroupAddon, 
  InputGroupText ,Nav, NavItem, NavLink,
  TabPane, Row, TabContent,Badge} from 'reactstrap';
import {message} from 'antd'
import {loginDataToken} from '../../../api/auth'
import {signIn, signUp} from '../../../api/fetch'
import fakeAuth from '../../../api/fakeAuth'
import {getOneRole} from '../../../api/role'
import {getAllNavRole} from '../../../api/nav_role'
import swal from 'sweetalert';
import logo from '../../../assets/img/brand/logo.svg'
message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
});
class Login extends Component {
  constructor(props){
    super(props)
    this.toggle = this.toggle.bind(this);

    this.state = { redirectToReferrer: false,
    activeTab: new Array(4).fill('1') };
  }
  login() {
    return (
    <div>
      <InputGroup className="mb-3 magintop20">
    <InputGroupAddon addonType="prepend">
      <InputGroupText>
        <i className="icon-user"></i>
      </InputGroupText>
    </InputGroupAddon>
    <Input type="text" name="username" placeholder="Username" autoComplete="username" />
  </InputGroup>
  <InputGroup className="mb-4">
    <InputGroupAddon addonType="prepend">
      <InputGroupText>
        <i className="icon-lock"></i>
      </InputGroupText>
    </InputGroupAddon>
    <Input type="password" name="password" placeholder="Password" autoComplete="current-password" />
  </InputGroup>
  </div>)
  }
  signup() {
    return (
    <div>
      <InputGroup className="mb-3 magintop20">
    <InputGroupAddon addonType="prepend">
      <InputGroupText>
        <i className="icon-user"></i>
      </InputGroupText>
    </InputGroupAddon>
    <Input type="text" name="username2" placeholder="Username" autoComplete="username" />
  </InputGroup>
  <InputGroup className="mb-4">
    <InputGroupAddon addonType="prepend">
      <InputGroupText>
        <i className="icon-lock"></i>
      </InputGroupText>
    </InputGroupAddon>
    <Input type="password" name="password2" placeholder="Password" autoComplete="current-password" />
  </InputGroup>
  </div>)
  }
  toggle(tabPane, tab) {
    const newArray = this.state.activeTab.slice()
    newArray[tabPane] = tab
    this.setState({
      activeTab: newArray,
    });
  }

  tabPane() {
    return (
      <>
        <TabPane tabId="1">
          {this.login()}
        </TabPane>
        <TabPane tabId="2">
          {this.signup()}
        </TabPane>
      </>
    );
  }
  handleSubmit=(event)=>{   
    event.preventDefault();
    const elements = event.target.elements
    const username = elements.username.value
    const password = elements.password.value
    const tab=this.state.activeTab[0];
    if(tab==='1'){
      if (username){
        signIn(username, password).then(data=>{
          if(data.status == 200){
          data = data.data
          if (data.msg == 'login successfull!'){
            message.success(data.msg)
            fakeAuth.authenticate(username,data.data.access_token);
            // this.setState({ redirectToReferrer: true });
            window.location.reload(false)
          }else{
            message.error(data.msg)
          }
        }else{
          swal("Thông báo!", "Đăng nhập không thành công!", "error");
        }
      })
      }
    }else{
      let signup={
        username:elements.username2.value,
        password:elements.password2.value
      };
      if (signup.username && signup.password){
        console.log(signup)

        signUp(signup.username, signup.password).then(data=>{
        console.log(data)
        if (data.status == 200){
          data = data.data
          if (data.msg == 'username is exist!'){
            message.error(data.msg)
          }else{
            message.success(data.msg)
          }
        }else{
          swal("Thông báo!", "Đăng ký không thành công!", "error");
        }
      })
      }
  }
}
  componentWillMount(){
    if(fakeAuth.isAuthenticated()) this.setState({ redirectToReferrer: true });
  }
  render() {
   
    let { redirectToReferrer } = this.state;

    if (redirectToReferrer) return <Redirect to={"/"} />;
    return (
      <div className="app flex-row align-items-center">
        <Container >
          <Row className="justify-content-center">
            <Col md="5">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.handleSubmit}>
                      <img src={logo}></img>
                      {/* <p className="text-muted">Sign In to your account</p> */}
                      <Nav tabs>
                      <NavItem>
                        <NavLink
                          active={this.state.activeTab[0] === '1'}
                          onClick={() => { this.toggle(0, '1'); }}
                        > 
                           LOG IN
                        </NavLink>
                        
                      </NavItem>
                      <NavItem>
                      <NavLink
                          active={this.state.activeTab[0] === '2'}
                          onClick={() => { this.toggle(0, '2'); }}
                        > 
                           SIGN UP
                        </NavLink>
                      </NavItem>
                      
                    </Nav>
                    <TabContent activeTab={this.state.activeTab[0]}>
                    {this.tabPane()}
                    </TabContent>
                      
                      <Row className="marginTop20">
                      <Col xs="6" className="text-left">
                        {/* <Button type="reset" color="primary" className="px-4">Reset</Button> */}
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button type="submit" color="primary" className="px-4">{this.state.activeTab[0]==='1'?'Login':'Sign up'}</Button>
                        </Col>
                        
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
export default Login;
