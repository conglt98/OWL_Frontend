import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Slide from 'react-reveal/Slide';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Row,
  Col
} from 'reactstrap';
import swal from 'sweetalert'

import {Popconfirm} from 'antd'
import eventsData from './EventsData'
import {AppSwitch} from '@coreui/react'
import DateRangePicker from 'react-bootstrap-daterangepicker';
// you will need the css that comes with bootstrap@3. if you are using a tool
// like webpack, you can do the following:
// you will also need the css that comes with bootstrap-daterangepicker
import 'bootstrap-daterangepicker/daterangepicker.css';
import {deleteEvent as deleteEventAPI, editEvent as editEventAPI} from '../../api/event'
import moment from 'moment'
import fakeAuth from '../../api/fakeAuth';

const columnStyle = {
  display: "flex"
}
const iconStyle = {
  "margin-right": "5px"
}

const clients = ['tpe','promotion','zpi','account']


const getEventType = {
  3:'[3] get data',
  2:'[2] get cache',
  1:'[1] decision',
}

export default class EventRow extends Component {
  constructor(props){
    super(props)
    this.state={
      expandDescription: false,
      modal:false,
      status:props.event.status,
    }
  }

  toggleModal=()=>{
    this.setState({
      modal:!this.state.modal
    })
  }

  getBadge = (status) => {
    return status === 'Delete'
      ? 'danger'
      : 'primary'
  }

  getStatus = (status) => {
    return status === 1
      ? true
      : false
  }

  toggleEventRow=()=>{
    let toggle = this.state.expandDescription?false:true;
    this.setState({expandDescription:toggle})
  }

  delete=async (jsonRequest)=>{
    try{
      await deleteEventAPI(jsonRequest.event.id,jsonRequest.event,fakeAuth.getAccessToken())
      swal("Thông báo!", "Delete event thành công!", "success").then(res=>{
        if (res){
          window.location.reload(false)
        }
      })
    }catch(e){
      swal("Thông báo!", "Lỗi delete event! "+e, "error")
    }
  }

  confirmChangeStatusEvent=async()=>{
    try{
      let status = this.state.status===1?0:1;
      let event = this.props.event;
      event.status = status
      await editEventAPI(this.props.event.id,event,fakeAuth.getAccessToken())
      swal("Thông báo!", "Edit event thành công!", "success")
      this.setState({
        status:status
      })
    }catch(e){
      swal("Thông báo!", "Lỗi edit event! "+e, "error")
    }
  }

  render(){
    const event = this.props.event
    const eventLink = `/events/${event.id}`
    const jsonRequest = {
      action:'delete event',
      event:event,
    }
    const editLink = `${eventLink}/edit`
    let clients = []
    for (let i =0;i<event.client.length;i++){
      clients.push(event.client[i])
    }
    const onOff = this.state.status===1?'OFF':'ON'
    return (
      <React.Fragment>
        <tr key={event
        .id
        .toString()}>
        <th scope="row">
          <Button color="light" size="sm" onClick={this.toggleEventRow}><i className={this.state.expandDescription?"fa fa-caret-up":"fa fa-caret-down"} ></i></Button>
        </th>
        <th scope="row">
          <Link to={eventLink}>{event.id}</Link>
        </th>
        <td>
          <Link to={eventLink}>{event.name}</Link>
        </td>
        <td>{clients.map(client=>{
          return(
            <span>
              <Link to={'/clients/'+client.id}>{client.name} &nbsp;</Link>
            </span>
          )
        })}</td>
        <td>{getEventType[event.type]}</td>
  
        <td>{moment(event.createAt).format("DD-MM-YYYY HH:mm:ss")}</td>
        <td>
          <div style={columnStyle}>
          <Popconfirm
            title={"Are you sure to "+onOff+" this event?"}
            onConfirm={this.confirmChangeStatusEvent}
            okText="Yes"
            cancelText="No"
          >
              <AppSwitch
              className={'float-right'}
              variant={'pill'}
              label
              color={'success'}
              checked={this.state.status===1?1:0}
              size={'sm'}/>
          </Popconfirm>
          </div>
        </td>
        <td>
          <div style={columnStyle}>
            <div style={iconStyle}>
              <Link to={editLink}>
                <Badge color={this.getBadge('Edit')}>
                  <i className="fa fa-pencil-square-o fa-2x"></i>
                </Badge>
              </Link>
            </div>
            <div>
              <Link to={'#'} onClick={this.toggleModal}>
                <Badge color={this.getBadge('Delete')}>
                  <i className="fa fa-trash-o fa-2x"></i>
                </Badge>
                <Modal size='lg' isOpen={this.state.modal} toggle={this.toggleModal}>
                      <ModalHeader toggle={this.toggleModal}>
                      JSON delete event
                      </ModalHeader>
                      <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                      <div><pre>{JSON.stringify(jsonRequest, null, 2) }</pre></div>
                      </ModalBody>
                      <ModalFooter>
                      <Row className="mb-3">
                          <Col>
                          <Button color="primary" className="float-right" onClick = {()=>{this.delete(jsonRequest)}}>
                            Confirm
                          </Button>
                          <Button onClick={this.toggleModal} className="float-right" style={iconStyle} color="secondary">
                            Cancel
                          </Button>
                          </Col>
                      </Row>
                      </ModalFooter>
                </Modal>
              </Link>
            </div>
          </div>
        </td>
      </tr>
      {this.state.expandDescription?
      <Slide left duration="500">
        <tr><td colSpan={8}>
        <Card>
          <CardHeader>
            <b>Description</b>
          </CardHeader>
          <CardBody>
            {event.description}
          </CardBody>
        </Card>
      </td></tr>
      </Slide>
        :<tr></tr>}
      </React.Fragment>
    )
  }
}
