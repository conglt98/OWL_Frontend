import React from 'react'
import {Input, Button, Badge, Card, CardBody, CardHeader, Col, Row, Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,FormGroup,
  Label } from 'reactstrap';
import fakeAuth from '../api/fakeAuth'
import {getDataDefinitions,createDataDefinitions,editDataDefinitions,deleteDataDefinitions} from '../api/datadefinitions'
import {getAccKey,createAccKey,editAccKey,deleteAccKey} from '../api/accumulationkeys'
import {getDomains} from '../api/domain'

import moment from 'moment'
import {Link} from 'react-router-dom';
import swal from 'sweetalert'

import {Pagination,Select, Input as AntInput} from 'antd'
import Slide from 'react-reveal/Slide';

const getSourceType={
  0:'[0] INTERNAL',
  1:'[1] REQUEST',
  2:'[2] HTTP',
  3:'[3] GRPC',
  4:'[4] REDIS',
  5:'[5] MYSQL',
  6:'[6] MONGODB'
}

const template = {
    name:"___",
    source:"___",
    dataType:"___",
    defs:[{
      name: "___",
      type: "___",
      defaultValue: "___"
    }],
    accumulationKeys:[]
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
      let userMaster = this.props.user
      userMaster.dataType = "JSON"
      userMaster.defs.map(ele=>{
        delete ele.id
        delete ele.createAt
      })
      let user = {
        name:userMaster.name,
        source:userMaster.source,
        defs:userMaster.defs
      }
      this.state = {
        modalEditNav:false,
        modalEditSource:false,
        expandDescription: false,
        newSource:{
          sourceType:0,
          dataSource:{}
        },
        modalDelete:false,
        dataDefinition:JSON.stringify(user,null,2),
        dataDefinitionMaster:JSON.stringify(userMaster,null,2)
      }
    }

    toggleDelete=()=>{
      this.setState({
        modalDelete:!this.state.modalDelete
      })
    }

    toggleEventRow=()=>{
        let toggle = this.state.expandDescription?false:true;
        this.setState({expandDescription:toggle})
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
        dataDefinition:e.target.value
      })
    }

    handleDeleteSource=async()=>{
      try{
        await deleteDataDefinitions(this.props.user.id,{},fakeAuth.getAccessToken())
        swal("Thông báo!", "Delete data definition thành công!", "success").then(res=>{
          if (res){
            window.location.reload(false)
          }
        })
  

      }catch(e){
        swal("Thông báo!", "Delete data definition lỗi! "+e, "error")
      }
    }

    handleEditSource=async()=>{
      console.log(this.state.dataDefinition)
      try{
        let editDataDef = JSON.parse(this.state.dataDefinition)
        console.log(editDataDef.defs)
        editDataDef.defs.map(ele=>{
          if (ele.defaultValue===null){
            delete ele.defaultValue
          }
        })
        editDataDef.defs = JSON.stringify(editDataDef.defs)
        console.log(editDataDef.defs)
        // editDataDef.children = this.props.user.children
        // editDataDef.parent = this.props.user.parent
        // editDataDef.keys = this.props.user.keys
        await editDataDefinitions(this.props.user.id,editDataDef,fakeAuth.getAccessToken())
        swal("Thông báo!", "Edit data definition thành công!", "success").then(res=>{
          if (res){
            window.location.reload(false)
          }
        })
  

      }catch(e){
        swal("Thông báo!", "Edit data definition lỗi! "+e, "error")
      }
    }


  render(){
    const user = this.props.user
    const sourceLink = `/data-definitions/${user.id}`

    return (
        <React.Fragment>
            <tr key={user.id}>
            <th scope="row">
          <Button color="light" size="sm" onClick={this.toggleEventRow}><i className={this.state.expandDescription?"fa fa-caret-up":"fa fa-caret-down"} ></i></Button>
        </th>
          <td>{user.id}</td>
          <td>{moment(user.createAt).format('DD-MM-YYYY HH:mm:ss')}</td>
          <td><b>{user.name}</b></td>
          <td>{user.source}</td>
          <td width="10%">
          <Badge color={'primary'} onClick={this.toggleEdit}>
            <i className="fa fa-edit fa-2x myBtn"></i>
            <Modal size="lg" isOpen={this.state.modalEditSource} toggle={this.toggleEdit}>
                    <ModalHeader toggle={this.toggleEdit}>
                    Edit data definition id: {this.props.user.id}
                    </ModalHeader>
                    <ModalBody 
                    // style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}
                    >
                    <Row className="justify-content-md-center">
                    <Col md={12}>
                          <Form>
                          

                          <FormGroup>
                            <Col md={4}>
                            <Label ><b>JSON data definition<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={12}>
                            <Input rows="18" spellcheck="false" type="textarea" value={this.state.dataDefinition} onChange={this.handleChangeDataSource}>
  
                            </Input>
                            </Col>
                          </FormGroup>

                          </Form>
                    </Col>
                    </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleEdit}>Cancel</Button>

                        <Button color="primary" onClick={this.handleEditSource}>Save</Button>
                    </ModalFooter>
                    </Modal>
          </Badge>&nbsp;
          <Badge color={'danger'} onClick={this.toggleDelete}>
            <i className="fa fa-trash-o fa-2x myBtn"></i>
            <Modal isOpen={this.state.modalDelete} toggle={this.toggleDelete}>
              <ModalHeader>
                Delete data definition: {this.props.user.id}
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
        </tr>{this.state.expandDescription?
            <Slide left duration="500">
              <tr><td colSpan={6}>
              <Card>
                <CardHeader>
                  <b>dataDef</b>
                </CardHeader>
                <CardBody>
                    <div><pre>{JSON.stringify(user.defs,null,2)}</pre></div>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <b>accumulationKeys</b>
                </CardHeader>
                <CardBody>
                    <div><pre>{JSON.stringify(user.keys,null,2)}</pre></div>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <b>parent</b>
                </CardHeader>
                <CardBody>
                    <div><pre>{JSON.stringify(user.parent,null,2)}</pre></div>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <b>children</b>
                </CardHeader>
                <CardBody>
                    <div><pre>{JSON.stringify(user.children,null,2)}</pre></div>
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
        },
        DomainSuggest:[],
        newDataDefinition:{
            domain:{
                id:1
            }
        },
        chooseAccKey:[],
        AccKeySuggest:[],
        DataDefSuggest:[],
        template:JSON.stringify(template,null,2)
      }
  }


  handleNewSource=async()=>{
    try{
      let newDataDefinition = JSON.parse(this.state.template)
      newDataDefinition.createAt=new Date().getTime()
      newDataDefinition.defs = JSON.stringify(newDataDefinition.defs)
      newDataDefinition.domain={
          id:this.state.newDataDefinition.domain.id
      }
      if (newDataDefinition.children){
        newDataDefinition.children.map(ele=>{
            ele.defs = JSON.stringify(ele.defs)
        })
      }
      if (newDataDefinition.parent&&newDataDefinition.parent.defs){
        newDataDefinition.parent.defs = JSON.stringify(newDataDefinition.parent.defs)
      }
      await createDataDefinitions(newDataDefinition,fakeAuth.getAccessToken())
      swal("Thông báo!", "Tạo data definition thành công!", "success").then(res=>{
        if (res){
          window.location.reload(false)
        }
      })


    }catch(e){
      swal("Thông báo!", "Tạo data definition lỗi! "+e, "error")
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
      modalNewSource:!this.state.modalNewSource,
      template:JSON.stringify(template,null,2)

    })
  }
  handleChangeTemplate=(e)=>{
      this.setState({
          template:e.target.value
      })
  }

  componentWillMount = () => {
    getDataDefinitions(fakeAuth.getAccessToken(), 0, 10).then(res => {
      if (res.data && res.data.list){
        console.log(res.data.list)
        this.setState({
            data: res.data.list,
            masterData: res.data.list,
            total:res.data.total,
          });
      }
    })
    getDomains(fakeAuth.getAccessToken(),0,1000).then(res=>{
        if (res.data && res.data.list){
            this.setState({
                DomainSuggest:res.data.list
            })
        }
    })

    getAccKey(fakeAuth.getAccessToken(),0,1000).then(res=>{
        if (res.data && res.data.list){
            this.setState({
                AccKeySuggest:res.data.list
            })
        }
    })

    getDataDefinitions(fakeAuth.getAccessToken(), 0, 1000).then(res => {
        if (res.data && res.data.list){
          console.log(res.data.list)
          this.setState({
              DataDefSuggest:res.data.list
            });
        }
      })
  }

  handleChangeChooseAccKey=(e)=>{
      let newAcc = JSON.parse(this.state.template)
      console.log(e)
      console.log(newAcc)
      let keys = []
      for (let i=0;i<e.length;i++){
          let key = this.state.AccKeySuggest.find(ele=>ele.id.toString()===e[i].toString())
          keys.push(key)
      }
      newAcc.accumulationKeys = keys
      this.setState({
          chooseAccKey:e,
          template:JSON.stringify(newAcc,null,2)
      })
  }

  handleChangeChildren=(e)=>{
    let newAcc = JSON.parse(this.state.template)
    console.log(e)
    console.log(newAcc)
    let keys = []
    for (let i=0;i<e.length;i++){
        let key = this.state.DataDefSuggest.find(ele=>ele.id.toString()===e[i].toString())
        keys.push(key)
    }
    newAcc.children = keys
    this.setState({
        children:e,
        template:JSON.stringify(newAcc,null,2)
    })
}

handleChangeParent=(e)=>{
    let newAcc = JSON.parse(this.state.template)
    newAcc.parent = this.state.DataDefSuggest.find(ele=>ele.id.toString()===e.toString())
    this.setState({
        parent:e,
        template:JSON.stringify(newAcc,null,2)
    })
}

  onChangePage=(page,pageSize)=>{
      console.log(page)
      console.log(pageSize)
      getDataDefinitions(fakeAuth.getAccessToken(), page-1, pageSize).then(res => {
        console.log(res.data.list)
        this.setState({
            data: res.data.list,
            masterData: res.data.list,
            total:res.data.total,
        });
      })
  }

  onShowSizeChange=(page,pageSize)=>{
    getDataDefinitions(fakeAuth.getAccessToken(), 0, pageSize).then(res => {
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
  
  handleChangeDomain=(e)=>{
      this.setState({
          newDataDefinition:{
              ...this.state.newDataDefinition,
              domain:{
                  id:e
              }
          }
      })
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
                Data definitions management
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
                    Add new data definition
                    </ModalHeader>
                    <ModalBody 
                    // style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}
                    >
                    <Row className="justify-content-md-center">
                    <Col md={12}>
                          <Form>
                          <FormGroup>
                            <Col md={4}>
                            <Label ><b>Choose domain of data definition<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={12}>
                            <Select
                                style={{ width: '100%' }}
                                value={this.state.newDataDefinition.domain.id}
                                // showSearch
                                onChange={this.handleChangeDomain}
                                placeholder="Select domain"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                            {this.state.DomainSuggest.map(ele=>(
                                <Option value={ele.id}><span style={{color:"red"}}>[{ele.id}]</span> DOMAIN: <b>{ele.name}</b></Option>
                            ))}
                            </Select>
                            </Col>
                          </FormGroup>

                          <FormGroup>
                            <Col md={4}>
                            <Label ><b>Choose accumulation keys<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={12}>
                            <Select
                                style={{ width: '100%' }}
                                value={this.state.chooseAccKey}
                                mode="multiple"
                                onChange={this.handleChangeChooseAccKey}
                                placeholder="Select accumulation keys"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                            {this.state.AccKeySuggest.map(ele=>(
                                <Option value={ele.id}><span style={{color:"red"}}>[{ele.id}]</span> NAME: <b>{ele.name}</b> - KeyFormat: <b>{ele.keyFormat}</b></Option>
                            ))}
                            </Select>
                            </Col>
                          </FormGroup>

                          {/* <FormGroup>
                            <Col md={4}>
                            <Label ><b>Choose parent<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={12}>
                            <Select
                                style={{ width: '100%' }}
                                value={this.state.parentId}
                                // showSearch
                                onChange={this.handleChangeParent}
                                placeholder="Select parent"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                            {this.state.DataDefSuggest.map(ele=>(
                                <Option value={ele.id}><span style={{color:"red"}}>[{ele.id}]</span> DATA DEFINITIONS: <b>{ele.name}</b></Option>
                            ))}
                            </Select>
                            </Col>
                          </FormGroup> */}

                          {/* <FormGroup>
                            <Col md={4}>
                            <Label ><b>Choose children<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={12}>
                            <Select
                                style={{ width: '100%' }}
                                value={this.state.childrenId}
                                mode="multiple"
                                onChange={this.handleChangeChildren}
                                placeholder="Select children"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                            {this.state.DataDefSuggest.map(ele=>(
                                <Option value={ele.id}><span style={{color:"red"}}>[{ele.id}]</span> DATA DEFINITIONS: <b>{ele.name}</b></Option>
                            ))}
                            </Select>
                            </Col>
                          </FormGroup> */}

                          <FormGroup>
                            <Col md={4}>
                            <Label ><b>JSON template<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={12}>
                            <Input rows="25" spellcheck="false" type="textarea" value={this.state.template} onChange={this.handleChangeTemplate}>
  
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
                    {/* <Select defaultValue={'Search type'} style={{ width: '100%' }} onChange={value=>this.searchType(value)}>
                        {typeSearchSuggest.map((ele,index)=>(
                                <Option value={index-1}>{ele}</Option>
                            ))}
                    </Select> */}
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
                      <th scope="col">NAME</th>
                      <th scope="col">SOURCE</th>
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