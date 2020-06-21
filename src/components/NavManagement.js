import React, { Component } from 'react';
import {Input, Button, Badge, Card, CardBody, CardHeader, Col, Row, Table,
Modal,
ModalHeader,
ModalBody,
Form,
FormGroup,
Label,
ModalFooter } from 'reactstrap';
import {getAllNavRole,updateNavRole,createNavRole,deleteNavRole} from '../api/nav_role'
import {rolesListSearchSuggest,rolesListSuggest} from './suggest'
import { Select, Tag,Input as AntInput } from 'antd';
import AllNav from '../_nav'
import AllRouter from '../routes'
import fakeAuth from '../api/fakeAuth'
import swal from 'sweetalert'

const { Option } = Select;



class UserRow extends Component {
    constructor(props){
      super(props);
      this.state = {
        modalEditNav:false,
        rolePermission:this.props.user.roles,
        nav:this.props.user,
      }
    }
    toggleEditNav=()=>{
      this.setState({
        modalEditNav:!this.state.modalEditNav
      })
    }

    handleChangeRolePermission=(e)=>{
      this.setState({
        rolePermission:e
      })
    }

    handleEditNav=()=>{
      let data = {...this.props.user,roles:this.state.rolePermission};
      console.log(data);
      updateNavRole(data, fakeAuth.getAccessToken()).then(data=>{
        console.log(data.roles)
        this.setState({
          nav:{
            ...this.state.nav,
            roles: data.roles.split(","),
          },
          modalEditNav:false,
        })
      });

    }
  render(){
    const user = this.state.nav
    return (
        <tr key={user.name}>
          <td width="5%"><strong>{user.name}</strong></td>
          <td width="40%"><strong>{user.path}</strong></td>
          <td width="30%">
          
          {user.roles?
          user.roles.map(tag=>{
            let color = tag.length > 13 ?  'green':'geekblue';
            if (tag === 'Administrator') {
              color = 'volcano';
            }
          return <Tag color={color} key={tag}>{tag.toUpperCase()}</Tag>;
        }):<span></span>}
          </td>
          
          <td width="10%"><Badge color={'primary'} onClick={this.toggleEditNav}> 
                      <i className="fa fa-edit fa-2x myBtn"></i>
                    </Badge>
         </td>
         <Modal size="md" isOpen={this.state.modalEditNav} toggle={this.toggleEditNav}>
            <ModalHeader toggle={this.toggleEditNav}>
            Edit navigation
            </ModalHeader>
            <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
            <Row className="justify-content-md-center">
            <Col md={12}>
                  <Form>
                  <FormGroup row>
                    <Col md={4}>
                    <Label ><b>Navigation name<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                    <Col md={8}>
                    <AntInput  type="text" disabled value={user.name} required/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md={4}>
                    <Label ><b>Navigation path<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                    <Col md={8}>
                    <AntInput  type="text" disabled value={user.path} required/>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md={4}>
                    <Label ><b>Role permission</b></Label></Col>
                    <Col md={8}>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        defaultValue={user.roles}
                        onChange={this.handleChangeRolePermission}
                      >
                      {rolesListSuggest.map(ele=>(
                        <Option value={ele}>{ele}</Option>
                      ))}
                    </Select>
                    </Col>
                  </FormGroup>
                  </Form>
            </Col>       
            
            
            </Row>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={this.toggleEditNav}>Cancel</Button>

                <Button color="primary" onClick={this.handleEditNav}>Save</Button>
            </ModalFooter>
            </Modal>
        </tr>
      )
  }
}

class Users extends Component {
    constructor(props){
        super(props)
        this.state={
            data:[],
            masterData:[],
            modalEditNav:false,
            nav:{
              name:"",
              roles:"Administrator"
            }
        }
    }
    toggleEditNav=()=>{
      this.setState({
        modalEditNav:!this.state.modalEditNav
      })
    }
    componentWillMount =()=>{
      getAllNavRole(fakeAuth.getAccessToken()).then((res) => { 
        let allNav = AllRouter;
        let result = res.data;
        let data = [];
        const roles = result;
          for (let i = 0; i < roles.length; i++) {
          data.push({
            key: i.toString(),
            roles: roles[i].roles,
            name: roles[i].name,
          });
        }
        allNav.map(nav=>{
          data.map(ele=>{
            if (ele.name===nav.name){
              nav.roles = ele.roles

            }
          })
          if (nav.roles===undefined){
            nav.roles=[]
          }
        })

        this.setState({
          data: allNav,
          masterData: allNav,
        })
      })
    }

      searchInResult = (input) => {
        let dataFilters = [];
        if (this.state.data && input && input.target.value) {
          for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].name.toLowerCase().indexOf(input.target.value.toLowerCase()) > -1) {
              dataFilters.push(this.state.data[i]);
            }
          }
          if(dataFilters) {
            this.setState({
              data: dataFilters
            });
          }
        }
    
        if (!input || !input.target.value) {
          this.setState({
            data: this.state.masterData
          });
        }
      }

      searchRole = (input) => {
        let dataFilters = [];
        if (this.state.masterData&&input) {
          for (let i = 0; i < this.state.masterData.length; i++) {
            if (this.state.masterData[i].roles.includes(input)) {
              dataFilters.push(this.state.masterData[i]);
            }
          }
          if(dataFilters) {
            this.setState({
              data: dataFilters
            });
          }
        }
        if (input==='All'){
            this.setState({
                data: this.state.masterData
              });
        }
      }

      handleChangeRolePermission=(e)=>{
        this.setState({
          nav:{
            ...this.state.nav,
            roles:e
          }
        })
      }
      handleChangeName=(e)=>{
        this.setState({
          nav:{
            ...this.state.nav,
            name:e.target.value,
          }
        })
      }

      handleNewNav=async()=>{
        console.log(this.state.nav)
        try{
          
          await createNavRole(this.state.nav,fakeAuth.getAccessToken())
          swal("Thông báo!", "Tạo navigation thành công!", "success")
    
        }catch(e){
          swal("Thông báo!", "Tạo navigation lỗi! "+e, "error")
        }
      }

  render() {

    const userList = this.state.data.filter(ele=>(ele.name!=='Home'))
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Navigation management
                <Button
                  color="success"
                  size="md"
                  className="float-right"
                  onClick={this.toggleEditNav}
                  >
                  <i className="fa fa-plus"></i><b> Add new</b>
                  <Modal size="md" isOpen={this.state.modalEditNav} toggle={this.toggleEditNav}>
            <ModalHeader toggle={this.toggleEditNav}>
            Add navigation
            </ModalHeader>
            <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
            <Row className="justify-content-md-center">
            <Col md={12}>
                  <Form>
                  <FormGroup row>
                    <Col md={4}>
                    <Label ><b>Navigation name</b></Label></Col>
                    <Col md={8}>
                    <AntInput  type="text" value={this.state.nav.name} onChange={this.handleChangeName} required/>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md={4}>
                    <Label ><b>Role permission</b></Label></Col>
                    <Col md={8}>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        value={this.state.nav.roles}
                        onChange={this.handleChangeRolePermission}
                      >
                      {rolesListSuggest.map(ele=>(
                        <Option value={ele}>{ele}</Option>
                      ))}
                    </Select>
                    </Col>
                  </FormGroup>
                  </Form>
            </Col>       
            
            
            </Row>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={this.toggleEditNav}>Cancel</Button>

                <Button color="primary" onClick={this.handleNewNav}>Add</Button>
            </ModalFooter>
            </Modal>
                </Button>
              </CardHeader>
              <CardBody>
                <Row>
                    <Col md={3}>
                    <AntInput placeholder="Search name"  onChange={(value) => this.searchInResult(value)}>
                    </AntInput>
                    </Col>
                    <Col md={3}>
                    <Select defaultValue={'Search role'} style={{ width: '100%' }} onChange={value=>this.searchRole(value)}>
                        {rolesListSearchSuggest.map(ele=>(
                                <Option value={ele}>{ele}</Option>
                            ))}
                    </Select>
                    </Col>
                </Row>
                <br></br>
                <div 
                // style={{
                //   maxHeight: 'calc(100vh - 310px)',
                //   overflowY: 'auto'
                // }}
                >
                  <Table responsive hover>
                  <thead>
                    <tr>
                      
                      <th scope="col">NAME</th>
                      <th scope="col">PATH</th>
                      <th scope="col">ROLE</th>
                      <th scope="col">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {userList.map((user) =>
                      <UserRow key={user.name} user={user}/>
                    )}
                  </tbody>
                </Table>

                </div>
                
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Users;
