import React from 'react'
import {Input, Button, Badge, Card, CardBody, CardHeader, Col, Row, Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,FormGroup,
  Label } from 'reactstrap';
import Slide from 'react-reveal/Slide';
import {Link} from 'react-router-dom';



import fakeAuth from '../api/fakeAuth'
import {getClients,createClient,editClient,deleteClient} from '../api/client'
import moment from 'moment'
import uuid from 'react-uuid'
import { Select,Input as AntInput,Switch,Pagination } from 'antd';
import {AppSwitch} from '@coreui/react'
import swal from 'sweetalert'


const { Option } = Select;
class UserRow extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        modalEditNav:false,
        expandDescription: false,
        modalDel:false,
        redirectToReferrer:false,
        newClient:this.props.user,
        modalEditClient:false
      }
    }

    handleChangeNewClientName=(e)=>{
      this.setState({
        newClient:{
          ...this.state.newClient,
          name:e.target.value,
        }
      })
    }
  
    handleChangeHashKey=(e)=>{
      this.setState({
        newClient:{
          ...this.state.newClient,
          hashKey:e.target.value,
        }
      })
    }
  
    handleChangeNewRoleStatus=(e)=>{
      this.setState({
        newClient:{
          ...this.state.newClient,
          status:e===true?1:0,
        }
      })
    }

    toggleEdit=()=>{
      this.setState({
        modalEditClient:!this.state.modalEditClient
      })
    }
    toggleEditNav=()=>{
      this.setState({
        modalEditNav:!this.state.modalEditNav
      })
    }
    toggleEventRow=()=>{
        let toggle = this.state.expandDescription?false:true;
        this.setState({expandDescription:toggle})
      }
    toggleDelete=()=>{
      this.setState({
        modalDel:!this.state.modalDel
      })
    }
    handleDelete=async()=>{
      try{
        await deleteClient(this.props.user.id,{},fakeAuth.getAccessToken())
        swal("Thông báo!", "Delete client thành công!", "success").then(res=>{
          if (res){
            window.location.reload(false)
          }
        })

      }catch(e){
        swal("Thông báo!", "Delete client lỗi! "+e, "error")
      }
    }

    handleEditClient=async()=>{
      console.log(this.state.newClient)
      try{
        let newClient = this.state.newClient
        newClient.createAt = new Date().getTime()
        await editClient(this.props.user.id,newClient,fakeAuth.getAccessToken())
        swal("Thông báo!", "Edit client thành công!", "success").then(res=>{
          if (res){
            window.location.reload(false)
          }
        })

      }catch(e){
        swal("Thông báo!", "Edit client code lỗi! "+e, "error")
      }
    }


    handleChangeStatus=async(e)=>{
      let user = this.props.user
      user={
        ...user,
        status:e.target.checked===true?1:0
      }
      await editClient(this.props.user.id, user,fakeAuth.getAccessToken())
    }

  render(){
    const user = this.props.user
    const clientLink = `/clients/${user.id}`
    const tierLink = `/tiers/${user.id}`
    const profileLink = `/profiles/${user.id}`

    return (
        <React.Fragment>

          <tr key={user.id}>
          <th scope="row">
          <Button color="light" size="sm" onClick={this.toggleEventRow}><i className={this.state.expandDescription?"fa fa-caret-up":"fa fa-caret-down"} ></i></Button>
        </th>
          <td>{user.id}</td>
          <td>{moment(user.createAt).format('DD-MM-YYYY HH:mm:ss')}</td>
          <td><Link to={clientLink}>{user.name}</Link></td>

          <td>{user.hashKey}</td>
          <td><div style={{display:"flex"}}>
          <AppSwitch
              className={'float-right'}
              variant={'pill'}
              // disabled={true}
              label
              color={'success'}
              checked={user.status===1?true:false}
              onChange={this.handleChangeStatus}
              size={'sm'}/>

          </div></td>

          <td width="10%">
          <Badge color={'primary'} onClick={this.toggleEdit}>
            <i className="fa fa-edit fa-2x myBtn"></i>
            <Modal size="md" isOpen={this.state.modalEditClient} toggle={this.toggleEdit}>
                    <ModalHeader toggle={this.toggleEdit}>
                    Edit client {this.props.user.name}
                    </ModalHeader>
                    <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                    <Row className="justify-content-md-center">
                    <Col md={12}>
                          <Form>
                          <FormGroup row>
                            <Col md={4}>
                            <Label ><b>Name<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={8}>
                            <AntInput  type="text" value={this.state.newClient.name} placeholder="Input name client" onChange={this.handleChangeNewClientName} required/>
                            </Col>
                          </FormGroup>

                          <FormGroup row>
                            <Col md={4}>
                            <Label ><b>HashKey<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={8}>
                            <AntInput  type="text" value={this.state.newClient.hashKey} onChange={this.handleChangeHashKey} required/>
                            </Col>
                          </FormGroup>

                          <FormGroup row>
                            <Col md={4}>
                              <Label><b>Status<span style ={{color:"#F86C6B"}}></span></b></Label>
                            </Col>
                            <Col md={8}>
                            <Switch checked={this.state.newClient.status===1?true:false} onChange={this.handleChangeNewRoleStatus}/>
                            </Col>
                          </FormGroup>
                          </Form>
                    </Col>
                    </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleEdit}>Cancel</Button>

                        <Button color="primary" onClick={this.handleEditClient}>Save</Button>
                    </ModalFooter>
                    </Modal>

          </Badge>&nbsp;
          <Badge color={'danger'} onClick={this.toggleDelete}>
            <i className="fa fa-trash-o fa-2x myBtn"></i>
            <Modal isOpen={this.state.modalDel} toggle={this.toggleDelete}>
              <ModalHeader>
                Delete client: {this.props.user.name}
              </ModalHeader>
              <ModalBody>
                Do you want to delete?
              </ModalBody>
              <ModalFooter>
              <Button color="secondary" onClick={this.toggleDelete}>Cancel</Button>

              <Button color="primary" onClick={this.handleDelete}>Delete</Button>
              </ModalFooter>
            </Modal>
          </Badge></td>
        </tr>
        {this.state.expandDescription?
            <Slide left duration="500">
              <tr><td colSpan={9}>
              <Card>
                <CardHeader>
                  <b>Description</b>
                </CardHeader>
                <CardBody>
                    {user.description}
                </CardBody>
              </Card>
            </td></tr>
            </Slide>
              :<tr></tr>}
        </React.Fragment>
      )
  }
}

export default class App extends React.Component {
  constructor(props){
      super(props);
      this.state={
        data:[],
        masterData:[],
        fieldSort:{},
        total:0,
        modalNewClient:false,
        newClient:{
          name:"",
          hashKey:uuid(),
          status:0
        }
      }
  }

  toggleNewClient=()=>{
    this.setState({
      modalNewClient:!this.state.modalNewClient,
      newClient:{
        ...this.state.newClient,
        hashKey:uuid()
      }
    })
  }

  handleChangeNewClientName=(e)=>{
    this.setState({
      newClient:{
        ...this.state.newClient,
        name:e.target.value,
      }
    })
  }

  handleChangeHashKey=(e)=>{
    this.setState({
      newClient:{
        ...this.state.newClient,
        hashKey:e.target.value,
      }
    })
  }

  handleChangeNewRoleStatus=(e)=>{
    this.setState({
      newClient:{
        ...this.state.newClient,
        status:e===true?1:0,
      }
    })
  }

  handleNewClient = async()=>{
    try{
      this.state.newClient.createAt = new Date().getTime()
      await createClient(this.state.newClient,fakeAuth.getAccessToken())
      swal("Thông báo!", "Tạo client thành công!", "success").then(res=>{
        if (res){
          window.location.reload(false)
        }
      })

    }catch(e){
      swal("Thông báo!", "Tạo client lỗi! "+e, "error")
    }
  }

  componentWillMount = () => {
    getClients(fakeAuth.getAccessToken(), 0, 10).then(res => {
      if (res.data && res.data.list){
        console.log(res.data.list)
        this.setState({
            data: res.data.list,
            masterData: res.data.list,
            total:res.data.total
          });
      }
    })
  }

  onChangePage=(page,pageSize)=>{
      console.log(page)
      console.log(pageSize)
      getClients(fakeAuth.getAccessToken(), page-1, pageSize).then(res => {
        console.log(res.data.list)
        this.setState({
            data: res.data.list,
            masterData: res.data.list,
            total:res.data.total

        });
      })
  }

  onShowSizeChange=(page,pageSize)=>{
    getClients(fakeAuth.getAccessToken(), 0, pageSize).then(res => {
      console.log(res.data.list)
      this.setState({
          data: res.data.list,
          masterData: res.data.list,
          total:res.data.total
      });
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

  searchInResultProfile = (input) => {
    let dataFilters = [];
    if (this.state.data && input && input.target.value) {
      for (let i = 0; i < this.state.data.length; i++) {
        if (this.state.data[i].profileId.toString().indexOf(input.target.value.toLowerCase()) > -1) {
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

  searchType = (input) => {
    let dataFilters = [];
    if (this.state.masterData&&input) {
      for (let i = 0; i < this.state.masterData.length; i++) {
        if (this.state.masterData[i].dataSource.type===input) {
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
  
  sort = (field)=>{
    console.log("Click and sort")
    if (!this.state.fieldSort[field])
    {
        this.state.data.sort((a,b)=>a[field]-b[field])
        this.setState({
            fieldSort:{
                ...this.state.fieldSort,
                [field]:1
            },
            data:this.state.data
        })
    }else if (this.state.fieldSort[field]===1){
        this.state.data.sort((a,b)=>b[field]-a[field])
        this.setState({
            fieldSort:{
                ...this.state.fieldSort,
                [field]:0
            },
            data:this.state.data
        })
    }
  }

  render() {
    const data = this.state.data;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i>
                Clients
                <Button
                  color="success"
                  size="md"
                  className="float-right"
                  onClick={this.toggleNewClient}>
                  <i className="fa fa-plus"></i>
                  <b>
                    Add new</b>
                </Button>
                <Modal size="md" isOpen={this.state.modalNewClient} toggle={this.toggleNewClient}>
                    <ModalHeader toggle={this.toggleNewClient}>
                    Add new client
                    </ModalHeader>
                    <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                    <Row className="justify-content-md-center">
                    <Col md={12}>
                          <Form>
                          <FormGroup row>
                            <Col md={4}>
                            <Label ><b>Name<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={8}>
                            <AntInput  type="text" value={this.state.newClient.name} placeholder="Input name client" onChange={this.handleChangeNewClientName} required/>
                            </Col>
                          </FormGroup>

                          <FormGroup row>
                            <Col md={4}>
                            <Label ><b>HashKey<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={8}>
                            <AntInput  type="text" value={this.state.newClient.hashKey} onChange={this.handleChangeHashKey} required/>
                            </Col>
                          </FormGroup>

                          <FormGroup row>
                            <Col md={4}>
                              <Label><b>Status<span style ={{color:"#F86C6B"}}></span></b></Label>
                            </Col>
                            <Col md={8}>
                            <Switch checked={this.state.newClient.status===1?true:false} onChange={this.handleChangeNewRoleStatus}/>
                            </Col>
                          </FormGroup>
                          </Form>
                    </Col>
                    </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleNewClient}>Cancel</Button>

                        <Button color="primary" onClick={this.handleNewClient}>Add</Button>
                    </ModalFooter>
                    </Modal>
              </CardHeader>
              <CardBody>
              <Row>
                    <Col md={3}>
                    <AntInput placeholder="Search name"  onChange={(value) => this.searchInResult(value)}>
                    </AntInput>
                    </Col>
                    <Col md={3}>
                    {/* <AntInput placeholder="Search profileId"  onChange={(value) => this.searchInResultProfile(value)}>
                    </AntInput> */}
                    {/* <Select defaultValue={'Search type'} style={{ width: '100%' }} onChange={value=>this.searchType(value)}>
                        {typeSearchSuggest.map(ele=>(
                                <Option value={ele.split(' ')[1]}>{ele}</Option>
                            ))}
                    </Select> */}
                    </Col>

                    <Col md={6} style={{textAlign:"right"}}>
                    <Pagination defaultCurrent={1} total={this.state.total} onChange={this.onChangePage}
                     responsive 
                     showSizeChanger={true}
                     onShowSizeChange={this.onShowSizeChange}
                     showTotal={total => `Total ${total} items`}
                     />
                    </Col>
                </Row>
                <br></br>
                  <div
                //   style={{
                //   maxHeight: 'calc(100vh - 310px)',
                //   overflowY: 'auto'
                // }}
                >
                <Table responsive hover>
                <thead>
                    <tr>
                    <th scope="col"></th>
                      <th scope="col">ID</th>
                      <th scope="col">CREATED AT</th>
                      <th scope="col">NAME</th>
                      <th scope="col">HASH KEY</th>
                      <th scope="col">STATUS</th>
                      <th scope="col">ACTION</th>

                    </tr>
                  </thead>
                  <tbody>
                    {data.map((user) =>
                      <UserRow key={user.id} user={user}/>
                    )}
                  </tbody>
                </Table>
                </div>
               
                <Row className="justify-content-md-center">
                    
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        
      </div>
    );
  }
}