import React, { Component } from 'react';
import {Input, Button, Badge, Card, CardBody, CardHeader, Col, Row, Table,
Modal,
ModalHeader,
ModalBody,
ModalFooter,
Form,FormGroup,
Label } from 'reactstrap';
import {getAllRole,createUserRole} from '../api/role'
import {rolesListSearchSuggest,rolesListSuggest} from './suggest'
import fakeAuth from '../api/fakeAuth'
import UserRow from './UserRow'
import {connect} from 'react-redux'
import {setDelRole} from '../reducers/EventOptions'
import { Select,Input as AntInput,Switch } from 'antd';
const { Option } = Select;


class Users extends Component {
    constructor(props){
        super(props)
        this.state={
            data:[],
            masterData:[],
            modalNewRole:false,
            newRole:{},
        }
    }
    toggleNewRole=()=>{
      this.setState({
        newRole:{},
        modalNewRole:!this.state.modalNewRole
      })
    }
    componentWillMount =()=>{
        this.initData()
    }
    initData = () => {
        getAllRole(fakeAuth.getAccessToken()).then((res) => {

            let result = res.data;
            // result.map(re=>{
            //   var array = re.role.split(",");
            //   return re.role=array
            // })
            let data = [];
            const roles = result?result:[];
            for (let i = 0; i < roles.length; i++) {
              data.push({
                key: i.toString(),
                role: roles[i].role,
                username: roles[i].username,
                id:roles[i].id,
                name:roles[i].name,
                status:roles[i].status,
              });
            }
            this.setState({
              data:data,
              masterData:data,
            })
        })
      }
      componentWillReceiveProps= (nextProps)=>{
        if (Object.keys(nextProps.delRole).length>0){
          console.log(nextProps.delRole)

          let data= this.state.data;
          let masterData = this.state.masterData;
          data = data.filter(ele=>(ele.username!==nextProps.delRole.username))
          masterData = masterData.filter(ele=>(ele.username!==nextProps.delRole.username))
          this.setState({
            data:data,
            masterData:masterData
          })
          this.props.setDelRole({});
        }
      }

      searchInResult = (input) => {
        let dataFilters = [];
        if (this.state.data && input && input.target.value) {
          for (let i = 0; i < this.state.data.length; i++) {
            if (this.state.data[i].username.toLowerCase().indexOf(input.target.value.toLowerCase()) > -1) {
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
            if (this.state.masterData[i].role === input) {
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

      handleChangeRole=(input)=>{
        this.setState({
          newRole:{
            ...this.state.newRole,
            role:input,
          }
        })
      }
      handleChangeNewRoleName=(e)=>{
        this.setState({
          newRole:{
            ...this.state.newRole,
            name:e.target.value,
          }
        })
      }

      handleChangeNewRoleDomain=(e)=>{
        this.setState({
          newRole:{
            ...this.state.newRole,
            username:e.target.value,
          }
        })
      }
      handleChangeNewRoleStatus=(e)=>{
        this.setState({
          newRole:{
            ...this.state.newRole,
            status:e===true?'ON':'OFF',
          }
        })
      }

      handleNewRole=()=>{
        let data = this.state.newRole;
        data.status = data.status?data.status:'ON';
        let newMasterDataArray =this.state.masterData;
        newMasterDataArray.push(data)
        if (data.name&&data.username&&data.role){
          createUserRole(data,fakeAuth.getAccessToken())
          this.setState({
            modalNewRole:false,
            data:newMasterDataArray,
            masterData:newMasterDataArray,
          })
        }
      }

  render() {

    const userList = this.state.data
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Role management
                <Button
                  color="success"
                  size="md"
                  className="float-right"
                  onClick={this.toggleNewRole}
                  >
                  <i className="fa fa-plus"></i><b> Add new</b>
                  <Modal size="md" isOpen={this.state.modalNewRole} toggle={this.toggleNewRole}>
                    <ModalHeader toggle={this.toggleNewRole}>
                    Add new role
                    </ModalHeader>
                    <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                    <Row className="justify-content-md-center">
                    <Col md={12}>
                          <Form>
                          <FormGroup row>
                            <Col md={4}>
                            <Label ><b>Full name<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={8}>
                            <AntInput  type="text" placeholder="Input full name" onChange={this.handleChangeNewRoleName} required/>
                            </Col>
                          </FormGroup>

                          <FormGroup row>
                            <Col md={4}>
                            <Label ><b>Domain<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={8}>
                            <AntInput  type="text" placeholder="Input domain" onChange={this.handleChangeNewRoleDomain} required/>
                            </Col>
                          </FormGroup>

                          <FormGroup row>
                            <Col md={4}>
                            <Label ><b>Role<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={8}>
                            <Select
                                style={{ width: '100%' }}
                                defaultValue={'Select role'}
                                onChange={this.handleChangeRole}
                              >
                              {rolesListSuggest.map(ele=>(
                                <Option value={ele}>{ele}</Option>
                              ))}
                            </Select>
                            </Col>
                          </FormGroup>
                          <FormGroup row>
                            <Col md={4}>
                              <Label><b>Status<span style ={{color:"#F86C6B"}}></span></b></Label>
                            </Col>
                            <Col md={8}>
                            <Switch defaultChecked onChange={this.handleChangeNewRoleStatus}/>
                            </Col>
                          </FormGroup>
                          </Form>
                    </Col>       
                    
                    
                    </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleNewRole}>Cancel</Button>

                        <Button color="primary" onClick={this.handleNewRole}>Add</Button>
                    </ModalFooter>
                    </Modal>
                </Button>
              </CardHeader>
              <CardBody>
                <Row>
                    <Col md={3}>
                    <AntInput placeholder="Search domain"  onChange={(value) => this.searchInResult(value)}>
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
                style={{
                  maxHeight: 'calc(100vh - 310px)',
                  overflowY: 'auto'
                }}>
                <Table responsive hover >
                  <tbody>
                    {userList.map((user, index) =>
                      <UserRow key={index} user={user}/>
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

const mapStateToProps = state => ({
  delRole:state.EventOptions.delRole
});
const mapDispatchToProps = dispatch => ({
  setDelRole:data=> dispatch(setDelRole(data))
});


export default connect(mapStateToProps, mapDispatchToProps)(Users);