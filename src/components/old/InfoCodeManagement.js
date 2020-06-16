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
import {getInfoCodes,editInfoCode,createInfoCode,deleteInfoCode} from '../api/info-code'
import moment from 'moment'
import {Pagination,Select,Tag, Switch, Input as AntInput} from 'antd'
import swal from 'sweetalert'

const { Option } = Select;
class UserRow extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        modalEditNav:false,
        expandDescription: false,
        newInfoCode:this.props.user,
        modalEditInfoCode:false,
        modalDelete:false
      }
    }

    toggleDelete=()=>{
      this.setState({
        modalDelete:!this.state.modalDelete
      })
    }

    handleChangeAction=(e)=>{
      this.setState({
        newInfoCode:{
          ...this.state.newInfoCode,
          action:e.target.value
        }
      })
    }
  
  
    handleChangeMessage=(e)=>{
      this.setState({
        newInfoCode:{
          ...this.state.newInfoCode,
          message:e.target.value
        }
      })
    }
  
  
    handleChangeDescription=(e)=>{
      this.setState({
        newInfoCode:{
          ...this.state.newInfoCode,
          description:e.target.value
        }
      })
    }

    handleDeleteInfoCode=async()=>{
      try{
        await deleteInfoCode(this.props.user.id,{},fakeAuth.getAccessToken())
        swal("Thông báo!", "Delete info code thành công!", "success").then(res=>{
          if (res){
            window.location.reload(false)
          }
        })

      }catch(e){
        swal("Thông báo!", "Delete info code lỗi! "+e, "error")
      }
    }

    handleEditInfoCode=async()=>{
      console.log(this.state.newInfoCode)
      try{
        let newInfoCode = this.state.newInfoCode
        newInfoCode.createAt = new Date().getTime()
        await editInfoCode(this.props.user.id,newInfoCode,fakeAuth.getAccessToken())
        swal("Thông báo!", "Edit info code thành công!", "success").then(res=>{
          if (res){
            window.location.reload(false)
          }
        })

      }catch(e){
        swal("Thông báo!", "Edit info code lỗi! "+e, "error")
      }
    }

    toggleEditInfoCode=()=>{
      this.setState({
        modalEditInfoCode:!this.state.modalEditInfoCode
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
  render(){
    const user = this.props.user
    const infoCodeLink = `/info-code/${user.id}`
    const tierLink = `/tiers/${user.id}`
    const profileLink = `/profiles/${user.id}`

    return (
        <React.Fragment>
          <tr key={user.id}>
          <th scope="row">
          <Button color="light" size="sm" onClick={this.toggleEventRow}><i className={this.state.expandDescription?"fa fa-caret-up":"fa fa-caret-down"} ></i></Button>
        </th>
        <td><Link to={infoCodeLink}><strong>{user.id}</strong></Link></td>
          <td>{moment(user.createAt).format('DD-MM-YYYY HH:mm:ss')}</td>
          <td><b>{user.message}</b></td>

          <td>{user.description}</td>
          {/* <td>{user.action?user.action:'None'}</td> */}
          <td width="10%">
          <Badge color={'primary'} onClick={this.toggleEditInfoCode}>
            <i className="fa fa-edit fa-2x myBtn"></i>
            <Modal size="md" isOpen={this.state.modalEditInfoCode} toggle={this.toggleEditInfoCode}>
                    <ModalHeader toggle={this.toggleEditInfoCode}>
                    Edit infoCode {this.props.user.id}
                    </ModalHeader>
                    <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                    <Row className="justify-content-md-center">
                    <Col md={12}>
                          <Form>
                          <FormGroup row>
                            <Col md={4}>
                            <Label ><b>Message<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={8}>
                            <Input type="text" value={this.state.newInfoCode.message} onChange={this.handleChangeMessage}>
                              {/* <option value="Approve">Approve</option> 
                              <option value="Reject">Reject</option> 
                              <option value="Challenge">Challenge</option>  */}
                            </Input>
                            </Col>
                          </FormGroup>

                          <FormGroup row>
                            <Col md={4}>
                            <Label ><b>Description<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={8}>
                            <AntInput  type="text" value={this.state.newInfoCode.description} onChange={this.handleChangeDescription} required/>
                            </Col>
                          </FormGroup>

                          <FormGroup row>
                            <Col md={4}>
                            <Label ><b>Action<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={8}>
                            <AntInput  type="text" value={this.state.newInfoCode.action} onChange={this.handleChangeAction} required/>
                            </Col>
                          </FormGroup>

                          </Form>
                    </Col>
                    </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleEditInfoCode}>Cancel</Button>

                        <Button color="primary" onClick={this.handleEditInfoCode}>Save</Button>
                    </ModalFooter>
                    </Modal>
          </Badge>&nbsp;
          <Badge color={'danger'} onClick={this.toggleDelete}>
            <i className="fa fa-trash-o fa-2x myBtn"></i>
            <Modal isOpen={this.state.modalDelete} toggle={this.toggleDelete}>
              <ModalHeader>
                Delete infoCode: {this.props.user.id}
              </ModalHeader>
              <ModalBody>
                Do you want to delete?
              </ModalBody>
              <ModalFooter>
              <Button color="secondary" onClick={this.toggleDelete}>Cancel</Button>

              <Button color="primary" onClick={this.handleDeleteInfoCode}>Delete</Button>
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
        modalNewInfoCode:false,
        newInfoCode:{
          message:"",
          description:"",
          action:""
        }
      }
  }

  toggleNewInfoCode=()=>{
    this.setState({
      modalNewInfoCode:!this.state.modalNewInfoCode
    })
  }

  handleChangeAction=(e)=>{
    this.setState({
      newInfoCode:{
        ...this.state.newInfoCode,
        action:e.target.value
      }
    })
  }


  handleChangeMessage=(e)=>{
    this.setState({
      newInfoCode:{
        ...this.state.newInfoCode,
        message:e.target.value
      }
    })
  }


  handleChangeDescription=(e)=>{
    this.setState({
      newInfoCode:{
        ...this.state.newInfoCode,
        description:e.target.value
      }
    })
  }

  handleNewInfoCode=async()=>{
    console.log(this.state.newInfoCode)
    try{
      let newInfoCode = this.state.newInfoCode
      newInfoCode.createAt = new Date().getTime()
      await createInfoCode(newInfoCode,fakeAuth.getAccessToken())
      swal("Thông báo!", "Tạo info code thành công!", "success").then(res=>{
        if (res){
          window.location.reload(false)
        }
      })

    }catch(e){
      swal("Thông báo!", "Tạo info code lỗi! "+e, "error")
    }
  }

  componentWillMount = () => {
    getInfoCodes(fakeAuth.getAccessToken(), 0, 10).then(res => {
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
      getInfoCodes(fakeAuth.getAccessToken(), page-1, pageSize).then(res => {
        console.log(res.data.list)
        this.setState({
            data: res.data.list,
            masterData: res.data.list,
            total:res.data.total,
        });
      })
  }

  onShowSizeChange=(page,pageSize)=>{
    getInfoCodes(fakeAuth.getAccessToken(), 0, pageSize).then(res => {
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
        if (this.state.data[i].message.toLowerCase().indexOf(input.target.value.toLowerCase()) > -1) {
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
                InfoCodes
                <Button
                  color="success"
                  size="md"
                  className="float-right"
                  onClick={this.toggleNewInfoCode}>
                  <i className="fa fa-plus"></i>
                  <b>
                    Add new</b>
                    <Modal size="md" isOpen={this.state.modalNewInfoCode} toggle={this.toggleNewInfoCode}>
                    <ModalHeader toggle={this.toggleNewInfoCode}>
                    Add new infoCode
                    </ModalHeader>
                    <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                    <Row className="justify-content-md-center">
                    <Col md={12}>
                          <Form>
                          <FormGroup row>
                            <Col md={4}>
                            <Label ><b>Message<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={8}>
                            <Input type="text" value={this.state.newInfoCode.message} onChange={this.handleChangeMessage}>
                              {/* <option value="Approve">Approve</option> 
                              <option value="Reject">Reject</option> 
                              <option value="Challenge">Challenge</option>  */}
                            </Input>
                            </Col>
                          </FormGroup>

                          <FormGroup row>
                            <Col md={4}>
                            <Label ><b>Description<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={8}>
                            <AntInput  type="text" value={this.state.newInfoCode.description} onChange={this.handleChangeDescription} required/>
                            </Col>
                          </FormGroup>

                          <FormGroup row>
                            <Col md={4}>
                            <Label ><b>Action<span style ={{color:"#F86C6B"}}>*</span></b></Label></Col>
                            <Col md={8}>
                            <AntInput  type="text" value={this.state.newInfoCode.action} onChange={this.handleChangeAction} required/>
                            </Col>
                          </FormGroup>

                          </Form>
                    </Col>
                    </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleNewInfoCode}>Cancel</Button>

                        <Button color="primary" onClick={this.handleNewInfoCode}>Add</Button>
                    </ModalFooter>
                    </Modal>
                </Button>
              </CardHeader>
              <CardBody>
              <Row>
                    <Col md={3}>
                    <AntInput placeholder="Search message"  onChange={(value) => this.searchInResult(value)}>
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
                     onShowSizeChange={this.onShowSizeChange}
                     showSizeChanger={true}
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
                      <th scope="col">CODE</th>
                      <th scope="col">CREATED AT</th>
          
                      <th scope="col">MESSAGE</th>
                      <th scope="col">DESCRIPTION</th>
                      {/* <th scope="col">ACTION INFO</th> */}

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