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

  import moment from 'moment'
  import { Checkbox,Input as AntInput,Switch } from 'antd';
import {connect} from 'react-redux'
import {getDomains,createDomain,editDomain,deleteDomain} from '../../api/domain'
import fakeAuth from '../../api/fakeAuth'

import {setAddDomain} from '../../reducers/EventOptions'
import {AppSwitch} from '@coreui/react'
import swal from 'sweetalert'


class UserRow extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        modalEditNav:false,
        expandDescription: false,
        domain:this.props.user,
        modalNewClient:false,
        modalDelNav:false,
      }
    }

    toggleDelete=()=>{
      this.setState({
        modalDelNav:!this.state.modalDelNav
      })
    }

    toggleNewClient=()=>{
      this.setState({
        modalNewClient:!this.state.modalNewClient
      })
    }

    handleChangeNewClientName=(e)=>{
      this.setState({
        domain:{
          ...this.state.domain,
          name:e.target.value,
        }
      })
    }
  
    handleChangeDescription=(e)=>{
      this.setState({
        domain:{
          ...this.state.domain,
          description:e.target.value,
        }
      })
    }
  
    handleChangeSourceId=(e)=>{
      this.setState({
        domain:{
          ...this.state.domain,
          sourceId:e.target.value,
        }
      })
    }

    handleDeleteDomain=async ()=>{
      try{
        await deleteDomain(this.props.user.id,{},fakeAuth.getAccessToken())
        swal("Thông báo!", "Delete domain thành công!", "success").then(res=>{
          if (res){
            window.location.reload(false)
          }
        })
      }catch(e){
        swal("Thông báo!", "Lỗi delete domain! "+e, "error")
      }
    }
  
    handleNewDomain=async()=>{
      console.log(this.state.domain)
      try{
        let newDomain = this.state.domain
        await editDomain(this.props.user.id,newDomain,fakeAuth.getAccessToken())
        swal("Thông báo!", "Edit domain thành công!", "success").then(res=>{
          if (res){
            window.location.reload(false)
          }
        })
  
      }catch(e){
        swal("Thông báo!", "Edit domain lỗi! "+e, "error")
      }
    }
  
    handleChangeNewRoleStatus=(e)=>{
      this.setState({
        domain:{
          ...this.state.domain,
          status:e===true?1:0,
        }
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
    onChoose=()=>{
      let addDomain = this.props.addDomain;
      let find = addDomain.find(domain=>domain.toString()===this.props.user.id.toString())
      if (find){
        addDomain = addDomain.filter(domain=>domain.toString()!==this.props.user.id.toString())
      }else{
        addDomain.push(this.props.user.id)
      }
      this.props.setAddDomain(JSON.parse(JSON.stringify(addDomain)))
    }
  render(){
    const user = this.props.user
    const ruleLink = `/domains/${user.id}`
    const sourceIdLink = `/sources/${user.sourceId}`
    return (
        <React.Fragment>

          <tr key={user.id}>
          <th scope="row">
          <Button color="light" size="sm" onClick={this.toggleEventRow}><i className={this.state.expandDescription?"fa fa-caret-up":"fa fa-caret-down"} ></i></Button>
        </th>
          <td>{user.id}</td>
          <td>{moment(user.createAt).format('DD-MM-YYYY HH:mm:ss')}</td>
          <td><Link to={ruleLink}>{user.name}&nbsp;{user.status===-1?<Badge color="danger">deleted</Badge>:<span></span>}</Link></td>

          <td><Link to={sourceIdLink}>{user.sourceId}</Link></td>
          <td>
          <div style={{display:"flex"}}>
          <AppSwitch
              className={'float-right'}
              variant={'pill'}
              label
              disabled={true}
              color={'success'}
              checked={user.status===1?true:false}
              size={'sm'}/>

          </div>
          </td>
          <td width="10%">
          {this.props.mode==='choose'?
          <Checkbox onChange={this.onChoose}></Checkbox>
          :
          <React.Fragment>
            <Badge color={'primary'} onClick={this.toggleNewClient}>
          <i className="fa fa-edit fa-2x myBtn"></i>
          <Modal size="lg" isOpen={this.state.modalNewClient} toggle={this.toggleNewClient}>
                    <ModalHeader toggle={this.toggleNewClient}>
                    Edit domain: {this.props.user.name}
                    </ModalHeader>
                    <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                    <Row className="justify-content-md-center">
                    <Col md={12}>
                          <Form>
                          <FormGroup>
                            <Col md={4}>
                            <Label ><b>Name</b></Label></Col>
                            <Col md={8}>
                            <AntInput  type="text" value={this.state.domain.name} placeholder="Input name domain" onChange={this.handleChangeNewClientName} required/>
                            </Col>
                          </FormGroup>

                          <FormGroup>
                            <Col md={4}>
                            <Label ><b>SourceId</b></Label></Col>
                            <Col md={8}>
                            <AntInput  type="number" value={this.state.domain.sourceId} placeholder="Input sourceId" onChange={this.handleChangeSourceId} required/>
                            </Col>
                          </FormGroup>

                          <FormGroup>
                            <Col md={4}>
                            <Label ><b>Description</b></Label></Col>
                            <Col md={8}>
                            <Input  type="textarea" value={this.state.domain.description} placeholder="Input description" onChange={this.handleChangeDescription} required/>
                            </Col>
                          </FormGroup>

                          <FormGroup>
                            <Col md={4}>
                              <Label><b>Status<span style ={{color:"#F86C6B"}}></span></b></Label>
                            </Col>
                            <Col md={8}>
                            <Switch checked={this.state.domain.status===1?true:false} onChange={this.handleChangeNewRoleStatus}/>
                            </Col>
                          </FormGroup>
                          </Form>
                    </Col>
                    </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleNewClient}>Cancel</Button>

                        <Button color="primary" onClick={this.handleNewDomain}>Save</Button>
                    </ModalFooter>
                    </Modal>
        </Badge>&nbsp;
        {/* <Badge color={'danger'} onClick={this.toggleDelete}>
          <i className="fa fa-trash-o fa-2x myBtn"></i>
        </Badge> */}
        <Modal size='md' isOpen={this.state.modalDelNav} toggle={this.toggleDelete}>
              <ModalHeader toggle={this.toggleDelete}>
              Delete domain
              </ModalHeader>
              <ModalBody>
                Do you want to delete domain: <strong>{this.props.user.name}</strong>?
              </ModalBody>
              <ModalFooter>
              <Row className="mb-3">
                  <Col>
                  <Button color="primary" className="float-right" onClick = {this.handleDeleteDomain}>
                    Confirm
                  </Button>
                  <Button style={{marginRight:"5px"}} onClick={this.toggleDelete} className="float-right" color="secondary">
                    Cancel
                  </Button>
                  </Col>
              </Row>
              </ModalFooter>
        </Modal>
            </React.Fragment>}
          </td>
        </tr>
        {this.state.expandDescription?
            <Slide left duration="500">
              <tr><td colSpan={9}>
              <Card>
                <CardHeader>
                  <b>Description</b>
                </CardHeader>
                <CardBody>
                    <div>{user.description}</div>
                </CardBody>
              </Card>
            </td></tr>
            </Slide>
              :<tr></tr>}
        </React.Fragment>
      )
  }
}

const mapStateToProps = state => ({
    addDomain: state.EventOptions.addDomain,
  });
  const mapDispatchToProps = dispatch => ({
    setAddDomain:data=>dispatch(setAddDomain(data)),
  });


export default connect(mapStateToProps, mapDispatchToProps)(UserRow);