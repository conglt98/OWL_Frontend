import React from 'react'
import {Input, Button, Badge, Card, CardBody, CardHeader, Col, Row, Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,FormGroup,
  Label } from 'reactstrap';
import fakeAuth from '../api/fakeAuth'
import {getSources,createSource,editSource,deleteSource} from '../api/source'
import moment from 'moment'
import {Link} from 'react-router-dom';
import swal from 'sweetalert'
import Slide from 'react-reveal/Slide';

import {Pagination,Select, Input as AntInput} from 'antd'
import {typeSearchSuggest} from './suggest'

const getSourceType={
  0:'[0] INTERNAL',
  1:'[1] REQUEST',
  2:'[2] HTTP',
  3:'[3] GRPC',
  4:'[4] REDIS',
  5:'[5] MYSQL',
  6:'[6] MONGODB'
}

const getSourceDataTemplate={
  0:{},
  1:{},
  2:{},
  3:{
    name: "template",
    type: " internal",
    serverAddress:"localhost:9090",
    useSSL: false,
    method:"api",
    hashKey:"abc@123",
    timeoutMs:"1000"
  },
  4:{
    accumulationKeyId: 8
  },
  5:{},
  6:{}
}

const { Option } = Select;
class UserRow extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        modalEditNav:false,
        modalEditSource:false,
        newSource:{
          sourceType:this.props.user.type,
          dataSource:JSON.stringify(this.props.user.dataSource,null,2)
        },
        modalDelete:false,
        expandDescription: false,

      }
    }

    toggleDelete=()=>{
      this.setState({
        modalDelete:!this.state.modalDelete
      })
    }

    toggleEdit=()=>{
      this.setState({modalEditSource:!this.state.modalEditSource})
    }

    handleChangeSourceType=(e)=>{
      this.setState({
        newSource:{
          ...this.state.newSource,
          sourceType:e.target.value,
          dataSource: JSON.stringify(getSourceDataTemplate[e.target.value],null,2)
        }
      })
    }
  
    handleChangeDataSource=(e)=>{
      this.setState({
        newSource:{
          ...this.state.newSource,
          dataSource:e.target.value
        }
      })
    }

    handleDeleteSource=async()=>{
      try{
        await deleteSource(this.props.user.id,{},fakeAuth.getAccessToken())
        swal("Thông báo!", "Delete source thành công!", "success").then(res=>{
          if (res){
            window.location.reload(false)
          }
        })

      }catch(e){
        swal("Thông báo!", "Delete source lỗi! "+e, "error")
      }
    }

    handleEditSource=async()=>{
      console.log(this.state.newSource)
      try{
        let newSource = {
          createAt:new Date().getTime(),
          type: parseInt(this.state.newSource.sourceType),
          dataSource: JSON.stringify(JSON.parse(this.state.newSource.dataSource))
        }
        await editSource(this.props.user.id,newSource,fakeAuth.getAccessToken())
        swal("Thông báo!", "Edit source thành công!", "success").then(res=>{
          if (res){
            window.location.reload(false)
          }
        })

      }catch(e){
        swal("Thông báo!", "Edit source lỗi! "+e, "error")
      }
    }

    toggleEventRow=()=>{
      let toggle = this.state.expandDescription?false:true;
      this.setState({expandDescription:toggle})
    }


  render(){
    const user = this.props.user
    const sourceLink = `/sources/${user.id}`

    return (
        <React.Fragment>
          <tr key={user.id}>
          <th scope="row">
          <Button color="light" size="sm" onClick={this.toggleEventRow}><i className={this.state.expandDescription?"fa fa-caret-up":"fa fa-caret-down"} ></i></Button>
        </th>
          <td><Link to={sourceLink}>{user.id}</Link></td>
          <td>{moment(user.createAt).format('DD-MM-YYYY HH:mm:ss')}</td>
          <td><span style={{color:"red"}}>{getSourceType[user.type]}</span></td>
          <td><Link to="#" onClick={this.toggleEventRow}>JSON Object</Link></td>
         
          <td width="10%">
          <Badge color={'primary'} onClick={this.toggleEdit}>
            <i className="fa fa-edit fa-2x myBtn"></i>
            <Modal size="lg" isOpen={this.state.modalEditSource} toggle={this.toggleEdit}>
                    <ModalHeader toggle={this.toggleEdit}>
                    Edit source id: {this.props.user.id}
                    </ModalHeader>
                    <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                    <Row className="justify-content-md-center">
                    <Col md={12}>
                          <Form>
                          <FormGroup>
                            <Col md={4}>
                            <Label ><b>Source type<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={4}>
                            <Input type="select" value={this.state.newSource.sourceType} onChange={this.handleChangeSourceType}>
                                {Object.keys(getSourceType).map(key=>{
                                  return(<option value={key}>{getSourceType[key]}</option>)
                                })}
                            </Input>
                            </Col>
                          </FormGroup>

                          <FormGroup>
                            <Col md={4}>
                            <Label ><b>Data source<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={12}>
                            <Input rows="15" spellcheck="false" type="textarea" value={this.state.newSource.dataSource} onChange={this.handleChangeDataSource}>
  
                            </Input>
                            </Col>
                          </FormGroup>

                          </Form>
                    </Col>
                    </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleEdit}>Cancel</Button>

                        <Button color="primary" onClick={this.handleEditSource}>Add</Button>
                    </ModalFooter>
                    </Modal>
          </Badge>&nbsp;
          <Badge color={'danger'} onClick={this.toggleDelete}>
            <i className="fa fa-trash-o fa-2x myBtn"></i>
            <Modal isOpen={this.state.modalDelete} toggle={this.toggleDelete}>
              <ModalHeader>
                Delete source: {this.props.user.id}
              </ModalHeader>
              <ModalBody>
                Do you want to delete?
              </ModalBody>
              <ModalFooter>
              <Button color="secondary" onClick={this.toggleDelete}>Cancel</Button>

              <Button color="primary" onClick={this.handleDeleteSource}>Delete</Button>
              </ModalFooter>
            </Modal>
          </Badge></td>
        </tr>
        {this.state.expandDescription?
          <Slide left duration="500">
            <tr><td colSpan={9}>
            <Card>
              <CardHeader>
                <b>Data source</b>
              </CardHeader>
              <CardBody>
        <div><pre>{JSON.stringify(user.dataSource,null,2)}</pre></div>
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
        total:0,
        modalNewSource:false,
        newSource:{
          sourceType:0,
          dataSource:"{}",
        }
      }
  }

  handleNewSource=async()=>{
    try{
      let newSource = {
        createdAt:new Date().getTime(),
        type: parseInt(this.state.newSource.sourceType),
        dataSource: JSON.stringify(JSON.parse(this.state.newSource.dataSource))
      }
      await createSource(newSource,fakeAuth.getAccessToken())
      swal("Thông báo!", "Tạo source thành công!", "success").then(res=>{
        if (res){
          window.location.reload(false)
        }
      })

    }catch(e){
      swal("Thông báo!", "Tạo source lỗi! "+e, "error")
    }
  }

  handleChangeSourceType=(e)=>{
    this.setState({
      newSource:{
        ...this.state.newSource,
        sourceType:e.target.value,
        dataSource: JSON.stringify(getSourceDataTemplate[e.target.value],null,2)
      }
    })
  }

  handleChangeDataSource=(e)=>{
    this.setState({
      newSource:{
        ...this.state.newSource,
        dataSource:e.target.value
      }
    })
  }

  toggleNewSource=()=>{
    this.setState({
      modalNewSource:!this.state.modalNewSource
    })
  }

  componentWillMount = () => {
    getSources(fakeAuth.getAccessToken(), 0, 10).then(res => {
      if (res.data && res.data.list){
        console.log(res.data.list)
        this.setState({
            data: res.data.list,
            masterData: res.data.list,
            total:res.data.total,
          });
      }
    })
  }

  onChangePage=(page,pageSize)=>{
      console.log(page)
      console.log(pageSize)
      getSources(fakeAuth.getAccessToken(), page-1, pageSize).then(res => {
        console.log(res.data.list)
        this.setState({
            data: res.data.list,
            masterData: res.data.list,
            total:res.data.total,
        });
      })
  }

  onShowSizeChange=(page,pageSize)=>{
    getSources(fakeAuth.getAccessToken(), 0, pageSize).then(res => {
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
        if (this.state.data[i].dataSource.name.toLowerCase().indexOf(input.target.value.toLowerCase()) > -1) {
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
        if (this.state.masterData[i].type===input) {
          dataFilters.push(this.state.masterData[i]);
        }
      }
      if(dataFilters) {
        this.setState({
          data: dataFilters
        });
      }
    }
    if (input===-1){
        this.setState({
            data: this.state.masterData
          });
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
                Sources management
                <Button
                  color="success"
                  size="md"
                  className="float-right"
                  onClick={this.toggleNewSource}>
                  <i className="fa fa-plus"></i>
                  <b>
                    Add new</b>
                    <Modal size="lg" isOpen={this.state.modalNewSource} toggle={this.toggleNewSource}>
                    <ModalHeader toggle={this.toggleNewSource}>
                    Add new source
                    </ModalHeader>
                    <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                    <Row className="justify-content-md-center">
                    <Col md={12}>
                          <Form>
                          <FormGroup>
                            <Col md={4}>
                            <Label ><b>Source type<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={4}>
                            <Input type="select" value={this.state.newSource.sourceType} onChange={this.handleChangeSourceType}>
                                {Object.keys(getSourceType).map(key=>{
                                  return(<option value={key}>{getSourceType[key]}</option>)
                                })}
                            </Input>
                            </Col>
                          </FormGroup>

                          <FormGroup>
                            <Col md={4}>
                            <Label ><b>Data source<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={12}>
                            <Input rows="15" spellcheck="false" type="textarea" value={this.state.newSource.dataSource} onChange={this.handleChangeDataSource}>
  
                            </Input>
                            </Col>
                          </FormGroup>

                          </Form>
                    </Col>
                    </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleNewSource}>Cancel</Button>

                        <Button color="primary" onClick={this.handleNewSource}>Add</Button>
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
                    <Select defaultValue={'Search type'} style={{ width: '100%' }} onChange={value=>this.searchType(value)}>
                        {typeSearchSuggest.map((ele,index)=>(
                                <Option value={index-1}>{ele}</Option>
                            ))}
                    </Select>
                    </Col>
                    <Col md={6} style={{textAlign:"right"}}>
                    <Pagination defaultCurrent={1} total={this.state.total} 
                     showTotal={total => `Total ${total} items`}
                      onShowSizeChange={this.onShowSizeChange}
                      showSizeChanger={true}
                     onChange={this.onChangePage}
                     responsive />
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
                      <th scope="col">TYPE</th>                      
                      <th scope="col">DATA SOURCE</th>
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