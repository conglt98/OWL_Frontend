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
import { Button as ButtonAntd } from 'antd';



import fakeAuth from '../api/fakeAuth'
import {getAll} from '../api/memberconfig'
import moment from 'moment'
import uuid from 'react-uuid'
import { Select,Input as AntInput,Switch,Pagination } from 'antd';
import {AppSwitch} from '@coreui/react'
import swal from 'sweetalert'
import {getOrApplyConfigAPI} from '../api/reloadconfig'


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
        // await deleteClient(this.props.user.id,{},fakeAuth.getAccessToken())
        swal("Thông báo!", "Delete client thành công!", "success")

      }catch(e){
        swal("Thông báo!", "Delete client lỗi! "+e, "error")
      }
    }

    handleEditClient=async()=>{
      console.log(this.state.newClient)
      try{
        let newClient = this.state.newClient
        newClient.createdAt = new Date().getTime()
        // await editClient(this.props.user.id,newClient,fakeAuth.getAccessToken())
        swal("Thông báo!", "Edit client thành công!", "success")

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
    //   await editClient(this.props.user.id, user,fakeAuth.getAccessToken())
    }

  render(){
    const user = this.props.user
    const clientLink = `/clients/${user.id}`
    const tierLink = `/tiers/${user.id}`
    const profileLink = `/profiles/${user.id}`

    return (
        <React.Fragment>

          <tr key={user.id}>
          {user?Object.keys(user).map((keys) =>
            {
              if (keys==='update_time'){
                return(<td>{moment(user[keys]).format("DD-MM-YYYY HH:mm:ss")}</td>)
              }else if (keys==='hash_current'||keys==='hash_temporary'){
                return(<td style={{color:this.props.color}}><b>{user[keys]}</b></td>)

              }
              return(<td>{user[keys]}</td>)
            }
                    ):<span></span>}
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
        },
        color:'green'
      }
  }


  handleRefresh=()=>{
    getAll(fakeAuth.getAccessToken()).then(res => {
      if (res.data){
        console.log(res.data)
        let color = 'green'
        for(let i =0;i<res.data.length-1;i++){
          if (res.data[i].hash_current!==res.data[i+1].hash_current){
            color = 'red'
          }
        }
        this.setState({
            data: res.data,
            masterData: res.data,
            total:res.data.length,
            color: color
          });
      }
    })
  }

  componentWillMount = () => {
    this.handleRefresh()
  }

  enterLoading =async index => {
    let mode = 'Apply config'
    if (index===0){
      mode = 'Get config'
    }else if (index===1){
      mode = 'Apply config'
    }else if (index===2){
      mode = 'Apply accumulation config'
    }
    try{
      const newLoadings = {...this.state.loadings};
      newLoadings[index] = true;

      if (index===0){
        await getOrApplyConfigAPI({"type":"GET_CONFIG"},fakeAuth.getAccessToken())
      }else if (index===1){
        await getOrApplyConfigAPI({"type":"APPLY_CONFIG"},fakeAuth.getAccessToken())
      }else if (index===2){
        await getOrApplyConfigAPI({"type":"APPLY_ACCUMULATION_CONFIG"},fakeAuth.getAccessToken())
      }
      this.setState({
        loadings: newLoadings,
      });
      setTimeout(() => {
        newLoadings[index] = false;
        this.setState({ loadings: newLoadings });
        this.handleRefresh()
        swal("Thông báo!", mode+" thành công!", "success")
      }, 3000);
    }catch(e){
      swal("Thông báo!", mode+" lỗi! "+e, "error")
    }
  };

  getConfig=async()=>{
    try{
      await getOrApplyConfigAPI({"type":"GET_CONFIG"},fakeAuth.getAccessToken())
      swal("Thông báo!", "Get config thành công!", "success")
    }catch(e){
      swal("Thông báo!", "Get config lỗi! "+e, "error")
    }
  }

  applyConfig=async()=>{
    try{
      await getOrApplyConfigAPI({"type":"APPLY_CONFIG"},fakeAuth.getAccessToken())
      swal("Thông báo!", "Apply config thành công!", "success")

    }catch(e){
      swal("Thông báo!", "Apply config lỗi! "+e, "error")
    }
  }

  render() {
    const data = this.state.data;
    const loadings = this.state.loadings;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i>
                Titan member config

                <ButtonAntd
                  size="md"
                  type="primary"
                  className="float-right"
                  disabled={(loadings&&loadings[0])||(loadings&&loadings[2])?true:false}
                  loading={loadings?loadings[1]:false} onClick={() => this.enterLoading(1)}>
                  
                    &nbsp;
                  <i className="fa fa-play"></i>
                  <b>
                    &nbsp;Apply config</b>
                </ButtonAntd>
                
                <ButtonAntd
                  size="md"
                  className="float-right mr-2"
                  disabled={(loadings&&loadings[1])||(loadings&&loadings[2])?true:false}
                  loading={loadings?loadings[0]:false} onClick={() => this.enterLoading(0)}>
                  &nbsp;
                  <i className="fa fa-download"></i>
                  <b>
                    &nbsp;Get config</b>
                </ButtonAntd>

                <ButtonAntd
                  size="md"
                  className="float-right mr-2"
                  disabled={(loadings&&loadings[0])||(loadings&&loadings[1])?true:false}
                  loading={loadings?loadings[2]:false} onClick={() => this.enterLoading(2)}>
                  &nbsp;
                  <i className="fa fa-flash"></i>
                  <b>
                    &nbsp;Apply accumulation</b>
                </ButtonAntd>
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
                    {/* <AntInput placeholder="Search name"  onChange={(value) => this.searchInResult(value)}>
                    </AntInput> */}
                    {/* <ButtonAntd
                          type="primary"
                          size="md"
                          className="float-left"
                          onClick={this.handleRefresh}>
                          
                          <i className="fa fa-refresh"></i> <b>&nbsp;Refresh</b>
                    </ButtonAntd> */}
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
                    <Pagination defaultCurrent={1} total={this.state.total}
                     pageSize={1000}
                    //  showSizeChanger={true}
                    //  onChange={this.onChangePage}
                     responsive showTotal={total => `Total ${total} items`}
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
                      {data[0]?Object.keys(data[0]).map((keys) =>
                      {
                        let key = keys;
                        key = key.replaceAll("_"," ")
                        key = key.toUpperCase();
                        return (<th scope="col">{key}</th>)
                      }
                    ):<span></span>}

                    </tr>
                  </thead>
                  <tbody>
                    {data.map((user) =>
                      <UserRow color={this.state.color} key={user.id} user={user}/>
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