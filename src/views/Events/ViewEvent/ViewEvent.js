import React, {Component} from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Row,
  Input,
  Form,
  FormGroup,
  Label,
  Col,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  UncontrolledTooltip,
  ModalFooter
} from 'reactstrap';
import { Link } from 'react-router-dom';
import {AppSwitch} from '@coreui/react'
import ComboBox from '../ComboBox'
import {connect} from 'react-redux';
import DomainItem from './DomainItem'
import {setEditDomain,setCurrentEvent,setAddDomain} from '../../../reducers/EventOptions'
import {setDelDomain} from '../../../reducers/EventOptions'
import DragDrop from '../DragDrop'
import uuid from 'react-uuid'
import {eventTypes} from '../Suggest'
import {
  createEvent as createEventAPI,
      editEvent as editEventAPI,
      editEventClient as editEventClientAPI,
      editEventDomain as editEventDomainAPI,
      editProfileEvent as editProfileEventAPI,
    } from '../../../api/event'
import {getOneDomain, createDomain as createDomainAPI,
        editDomain as editDomainAPI} from '../../../api/domain'
import {  createCondition as createConditionAPI,
          editCondition as editConditionAPI,
          deleteCondition as deleteConditionAPI} from '../../../api/condition'
import {createProfile as createProfileAPI, editProfile as editProfileAPI} from '../../../api/profile'

import {createTier as createTierAPI, editTier as editTierAPI, deleteTier as deleteTierAPI} from '../../../api/tier'
import {createRule as createRuleAPI, editRule as editRuleAPI, deleteRule as deleteRuleAPI} from '../../../api/rule'
import {createRuleVersion as createRuleVersionAPI} from '../../../api/ruleVersion'
import {getClients} from '../../../api/client'
import fakeAuth from '../../../api/fakeAuth'
import DomainList from '../../../components/DomainManagement'
import NewDomainForm from '../../../components/row/NewDomainForm'
import swal from 'sweetalert'
import Visualize from '../Visualize/index'
import { Select, DatePicker, Input as AntInput } from 'antd'
import moment from 'moment'
const { Option } = Select;

const iconStyle = {
  "margin-right":"5px"
}

const getClientsForSelect=(array)=>{
  let res=[];
  if (array){
    for(let i=0;i<array.length;i++){
      res.push(array[i].clientId.toString())
    }
  }
  return res;
}

const eventTypeSuggest = {
  1:'make decision',
  2:'get data from cache',
  3:'get data from database'
}

class ViewEvent extends Component {

  constructor(props) {
    super(props);

    this.state = {
      name:'',
      client:'',
      clientSelect:[],
      status:1,
      type:'',
      maintenanceStart:0,
      maintenanceEnd:0,
      description:'',
      domain:'',
      modal:false,
      event:{},
      clientsSuggest:[],
      modalAddDomain:false,
      modeAddDomain:'Select mode',
      modalVisualize:false,
    }
  }

  toggleSubmit =(jsonRequest)=>{
    let baseEvent = sessionStorage.getItem("event")
    baseEvent = JSON.parse(baseEvent)
    let editEvent = jsonRequest
    console.log("======START=======")
    console.log(baseEvent)
    console.log(editEvent)
    console.log("=======END======")
    this.setState({
      modal:!this.state.modal
    })
  }

  changeConditionTier = async(oldCon, newCon, tierId)=>{
    console.log(oldCon)
    console.log(newCon)
    console.log(tierId)
    oldCon.forEach(async con1=>{
      let isExist1 = false
      newCon.forEach(async con2=>{
        if (con1.id.toString()===con2.id.toString()){
          isExist1 = true
        }
      })
      if (!isExist1){
        console.log("delete "+con1.id)
        await deleteConditionAPI(con1.id,con1,fakeAuth.getAccessToken())
      }
    })
    newCon.forEach(async con1=>{
      let isExist2 = false
      oldCon.forEach(async con2=>{
        if (con1.id.toString()===con2.id.toString()){
          isExist2 = true
          if (JSON.stringify(con1)!==JSON.stringify(con2)){
            console.log("edit "+con1.id)
            await editConditionAPI(con1.id,con1,fakeAuth.getAccessToken())
          }
        }
      })
      if (!isExist2 && con1.id.toString().length>10){
        console.log("add "+con1.id)
        let con = JSON.parse(JSON.stringify(con1))
        delete con.id
        con.conditionTypeId = tierId
        await createConditionAPI(con,fakeAuth.getAccessToken())
      }
    })

  }

  createRuleFromTierWhenCallAPI = async (oldListRules, newListRules, tierId)=>{
    console.log(oldListRules)
    console.log(newListRules)
    console.log(tierId)
    await oldListRules.forEach(async con1=>{
      let isExist1 = false
      await newListRules.forEach(async con2=>{
        if (con1.id.toString()===con2.id.toString()){
          isExist1 = true
        }
      })
      if (!isExist1){
        console.log("delete "+con1.id)
        await deleteRuleAPI(con1.id,con1,fakeAuth.getAccessToken())
      }
    })
    await newListRules.forEach(async con1=>{
      let isExist2 = false
      await oldListRules.forEach(async con2=>{
        if (con1.id.toString()===con2.id.toString()){
          isExist2 = true
          if (JSON.stringify(con1)!==JSON.stringify(con2)){
            console.log("edit "+con1.id)
            con1.tierId = tierId
            con1.tier={
              id:tierId
            }
            await editRuleAPI(con1.id,con1,con2,fakeAuth.getAccessToken())
          }
        }
      })
      if (!isExist2 && con1.id.toString().length>10){
        console.log("add rule"+con1.id)
        let con = JSON.parse(JSON.stringify(con1))
        delete con.id
        con.tierId = tierId
        con.tier={
          id:tierId
        }
        con.createAt = new Date().getTime()
        await createRuleAPI(con,fakeAuth.getAccessToken())

      }
    })

  }

  submit= async (jsonRequest) =>{
    let baseEvent = sessionStorage.getItem("event")
    baseEvent = JSON.parse(baseEvent)
    if (this.props.newEvent) baseEvent = {data:[]}
    let editEvent = jsonRequest

    //edit info event
    let infoEvent = {
      createAt:new Date().getTime(),
      name:editEvent.name,
      status:editEvent.status,
      type:editEvent.type,
      description:editEvent.description,
      maintenanceStart:editEvent.maintenanceStart,
      maintenanceEnd:editEvent.maintenanceEnd
    }

    let clientEvent = {
      clients: editEvent.client
    }

    let eventDomainForEditAvailable = {
      domains: []
    }

    let eventDomainForEditNew = {
      domains: []
    }

    for(let i=0;i<editEvent.data.length;i++){
      if (editEvent.data[i].id.toString().length > 10){
        eventDomainForEditNew.domains.push(editEvent.data[i])
      }else{
        eventDomainForEditAvailable.domains.push(editEvent.data[i])
      }
    }
    try {
      //event info
      let eventDone = {}
      if (this.props.newEvent){
        eventDone = await createEventAPI(infoEvent,fakeAuth.getAccessToken())

      }else{
         eventDone = await editEventAPI(editEvent.id, infoEvent,fakeAuth.getAccessToken())
      }
      editEvent.id = eventDone.id
      if (JSON.stringify(editEvent.client)!==JSON.stringify(baseEvent.client))
      {
        let editEventClient = await editEventClientAPI(editEvent.id,clientEvent,fakeAuth.getAccessToken())
      }

      //create new domain
      for(let i=0;i<eventDomainForEditNew.domains.length;i++){
        let tmpDomain = JSON.parse(JSON.stringify(eventDomainForEditNew.domains[i]));
        delete tmpDomain.id
        let newDomain  = await createDomainAPI(tmpDomain,fakeAuth.getAccessToken())
        newDomain.listProfiles=tmpDomain.listProfiles
        eventDomainForEditAvailable.domains.push(newDomain)
      }

      //edit per domain
      for(let i=0;i<eventDomainForEditAvailable.domains.length;i++){
        let tmpDomain = JSON.parse(JSON.stringify(eventDomainForEditAvailable.domains[i]));
        // tmpDomain  = await editDomainAPI(tmpDomain.id,tmpDomain,fakeAuth.getAccessToken())
        let tmpProfiles = eventDomainForEditAvailable.domains[i].listProfiles
        for (let j=0;j < tmpProfiles.length;j++){
          let tmpProfile = eventDomainForEditAvailable.domains[i].listProfiles[j]
          tmpProfile = JSON.parse(JSON.stringify(tmpProfile))
          if (tmpProfile.id.toString().length > 10){
            delete tmpProfile.id
            tmpProfile.createAt = new Date().getTime()
            eventDomainForEditAvailable.domains[i].listProfiles[j] = await createProfileAPI(tmpProfile,fakeAuth.getAccessToken())
            eventDomainForEditAvailable.domains[i].listProfiles[j].listTiers = []
            tmpProfile.id = eventDomainForEditAvailable.domains[i].listProfiles[j].id
          }else{
            eventDomainForEditAvailable.domains[i].listProfiles[j] = await editProfileAPI(tmpProfile.id,tmpProfile,fakeAuth.getAccessToken())
            eventDomainForEditAvailable.domains[i].listProfiles[j].listTiers = tmpProfile.listTiers
          }

          console.log("==========Tiers================")
          //call api edit tier

          let baseListTiers = baseEvent.data.find(domain=>domain.id.toString()===tmpDomain.id.toString())
          baseListTiers = baseListTiers?baseListTiers.listProfiles:[]
          baseListTiers = baseListTiers.find(profile=>profile.id.toString()===eventDomainForEditAvailable.domains[i].listProfiles[j].id.toString())
          baseListTiers = baseListTiers?baseListTiers.listTiers:[]
          console.log(baseListTiers)
          baseListTiers = baseListTiers?baseListTiers:[]
          console.log(tmpProfile.listTiers)
          tmpProfile.listTiers.forEach(async tier=>{
            let isExist = false
            baseListTiers.forEach(async baseTier=>{
              if (tier.id.toString()===baseTier.id.toString()){
                isExist = true
                console.log(tier)
                console.log(baseTier)
                if (JSON.stringify(tier)!==JSON.stringify(baseTier)){
                  console.log("edit tier "+tier.name)
                  let newTier = JSON.parse(JSON.stringify(tier))
                  newTier.profile={
                    id:tmpProfile.id
                  }
                  tier = await editTierAPI(newTier.id,newTier,fakeAuth.getAccessToken())
                  tier.listRules = newTier.listRules
                  tier.conditions = newTier.conditions
                  let baseTier = baseListTiers.find(eleTier=>eleTier.id.toString()===tier.id.toString())
                  let baseTierConditions = baseTier?baseTier.conditions:[]
                  let baseTierListRules = baseTier?baseTier.listRules:[]
                  console.log(baseTier)
                  console.log("============Rule==========")
                  tier.listRules = tier.listRules?tier.listRules:[]
                  await this.createRuleFromTierWhenCallAPI(baseTierListRules,tier.listRules,tier.id)
                  console.log("===========Tier condition=======")

                  tier.conditions = tier.conditions?tier.conditions:[]
                  await this.changeConditionTier(baseTierConditions,tier.conditions,tier.id)
                  console.log(tier)
                }
              }
            })
            if (!isExist){
              if (tier.id.toString().length>10){
                console.log("Add new tier "+tier.name+" to "+ tmpProfile.id+" "+tmpProfile.name)
                let newTier = JSON.parse(JSON.stringify(tier))
                delete newTier.id
                newTier.createAt =new Date().getTime()
                newTier.profile={
                  id:tmpProfile.id
                }
                tier = await createTierAPI(newTier,fakeAuth.getAccessToken())
                tier.profileId = tmpProfile.id
                tier.listRules = newTier.listRules
                tier.conditions = newTier.conditions
              }
              let baseTier = baseListTiers.find(eleTier=>eleTier.id.toString()===tier.id.toString())
              let baseTierConditions = baseTier?baseTier.conditions:[]
              let baseTierListRules = baseTier?baseTier.listRules:[]

              console.log("============Rule==========")
              tier.listRules = tier.listRules?tier.listRules:[]
              await this.createRuleFromTierWhenCallAPI(baseTierListRules,tier.listRules,tier.id)
              console.log("===========Tier condition=======")

              tier.conditions = tier.conditions?tier.conditions:[]
              await this.changeConditionTier(baseTierConditions,tier.conditions,tier.id)
              console.log(tier)
            }
          })
          console.log(baseListTiers)
          baseListTiers.forEach(async baseTier=>{
            let isExist = false
            tmpProfile.listTiers.forEach(async tier=>{
              if (tier.id.toString()===baseTier.id.toString()){
                isExist = true
                // if (JSON.stringify(tier)!==JSON.stringify(baseTier)){
                //   console.log("edit tier "+tier.name)
                //   let newTier = JSON.parse(JSON.stringify(tier))
                //   newTier.profile={
                //     id:tmpProfile.id
                //   }
                //   tier = await editTierAPI(newTier.id,newTier,fakeAuth.getAccessToken())
                //   tier.listRules = newTier.listRules
                //   tier.conditions = newTier.conditions
                //   let baseTier = baseListTiers.find(eleTier=>eleTier.id.toString()===tier.id.toString())
                //   let baseTierConditions = baseTier?baseTier.conditions:[]
                //   let baseTierListRules = baseTier?baseTier.listRules:[]
                //   console.log(baseTier)
                //   console.log("============Rule==========")
                //   tier.listRules = tier.listRules?tier.listRules:[]
                //   await this.createRuleFromTierWhenCallAPI(baseTierListRules,tier.listRules,tier.id)
                //   console.log("===========Tier condition=======")

                //   tier.conditions = tier.conditions?tier.conditions:[]
                //   await this.changeConditionTier(baseTierConditions,tier.conditions,tier.id)
                //   console.log(tier)
                // }
              }
            })
            if (!isExist){
              console.log("Delete tier "+baseTier.name)
              await deleteTierAPI(baseTier.id,baseTier,fakeAuth.getAccessToken())
            }
          })

          console.log("===============================")

          console.log("==========Profile Conditions==========")
          console.log(tmpProfile.conditions)
          let baseProfileConditions = baseEvent.data.find(domain=>domain.id.toString()===tmpDomain.id.toString())
          baseProfileConditions = baseProfileConditions?baseProfileConditions.listProfiles:[]
          baseProfileConditions = baseProfileConditions.find(profile=>profile.id.toString()===eventDomainForEditAvailable.domains[i].listProfiles[j].id.toString())
          baseProfileConditions = baseProfileConditions?baseProfileConditions.conditions:[]
          console.log(baseProfileConditions)
          tmpProfile.conditions = tmpProfile?tmpProfile.conditions:[]
          tmpProfile.conditions = tmpProfile.conditions?tmpProfile.conditions:[]
          baseProfileConditions.forEach(async con1=>{
            let isExist1 = false
            tmpProfile.conditions.forEach(async con2=>{
              if (con1.id.toString()===con2.id.toString()){
                isExist1 = true
              }
            })
            if (!isExist1){
              console.log("delete "+con1.id)
              await deleteConditionAPI(con1.id,con1,fakeAuth.getAccessToken())
            }
          })
          tmpProfile.conditions.forEach(async con1=>{
            let isExist2 = false
            baseProfileConditions.forEach(async con2=>{
              if (con1.id.toString()===con2.id.toString()){
                isExist2 = true
                if (JSON.stringify(con1)!==JSON.stringify(con2)){
                  console.log("edit "+con1.id)
                  await editConditionAPI(con1.id,con1,fakeAuth.getAccessToken())
                }
              }
            })
            if (!isExist2 && con1.id.toString().length>10){
              console.log("add "+con1.id)
              let con = JSON.parse(JSON.stringify(con1))
              delete con.id
              con.conditionTypeId = eventDomainForEditAvailable.domains[i].listProfiles[j].id
              await createConditionAPI(con,fakeAuth.getAccessToken())

            }
          })

          console.log("===================")
        }
      }

      //edit eventDomain available
      let domainEventList = await editEventDomainAPI(editEvent.id,eventDomainForEditAvailable,fakeAuth.getAccessToken())

      //profile for eventDomain
      for (let i=0; i <eventDomainForEditAvailable.domains.length;i++){
        let domainEventId = domainEventList.list.find(ele=>ele.domainId.toString()===eventDomainForEditAvailable.domains[i].id.toString()).id
        let domainTmp = JSON.parse(JSON.stringify(eventDomainForEditAvailable.domains[i]))
        domainTmp = {
          ...domainTmp,
          profiles:domainTmp.listProfiles
        }
        let profileEventDone = await editProfileEventAPI(domainEventId,domainTmp,fakeAuth.getAccessToken())
      }

      swal("Thông báo!", "Edit event thành công!", "success").then((value) => {
        if (value){
          window.location.reload(false)
        }
      });
    } catch (e) {
      swal("Thông báo!", "Lỗi edit event! "+e, "error")
    }
  }

  toggleAddDomain=()=>{
    this.props.setAddDomain([])
    this.setState({
      modalAddDomain:!this.state.modalAddDomain
    })
  }

  componentWillMount=async()=>{
    
    if (this.props.event){
      let event = this.props.event;
      this.props.setCurrentEvent(event);

      const clientsAPI = await getClients(fakeAuth.getAccessToken(),0,1000);
      const clients = clientsAPI.data?clientsAPI.data.list:[];

      this.setState({
        name:this.props.event.name,
        client:this.props.event.client,
        clientSelect:getClientsForSelect(this.props.event.client),
        status:this.props.event.status,
        type:this.props.event.type,
        maintenanceStart:this.props.event.maintenanceStart,
        maintenanceEnd:this.props.event.maintenanceEnd,
        description:this.props.event.description,
        domain:'',
        event:event,
        clientsSuggest:clients
      })
    }
  }

  

  toggleModal=()=>{
    this.setState({
      modal:!this.state.modal
    })
  }
  componentWillReceiveProps = (nextProps)=>{
    if (nextProps.event && Object.keys(this.state.event).length===0){
      let event = nextProps.event;
      this.props.setCurrentEvent(event);
      this.setState({
        name:nextProps.event.name,
        client:nextProps.event.client,
        clientSelect:getClientsForSelect(nextProps.event.client),
        status:nextProps.event.status,
        type:nextProps.event.type,
        maintenanceStart:nextProps.event.maintenanceStart,
        maintenanceEnd:nextProps.event.maintenanceEnd,
        description:nextProps.event.description,
        domain:'',
        event:event
      })
    }

    let delDomain = nextProps.delDomain;
    let event = this.state.event;
    if (delDomain.length>0){

      let filtered = event.data.filter(
        function(value)
        {
          return value.id.toString() !== delDomain.toString()}
        );
        console.log(filtered)
      event = {
        ...this.state.event,
        data:filtered
      }
      this.setState({
        event:event
      })
      this.props.setDelDomain('');
      this.props.setCurrentEvent(event);
    }

    let editDomain = nextProps.editDomain;
    if (Object.keys(editDomain).length>0){

      event.data.find(domain=>domain.id.toString()===editDomain.id.toString()).name = editDomain.name;
      this.props.setCurrentEvent(event)
      this.props.setEditDomain({})
      this.setState({
        event:event,
      })
    }
  }

  handleAddDomain = async()=>{
    if (this.state.modeAddDomain==='Add available'){
      let domains = this.props.addDomain;
      let event = this.props.currentEvent;

      for (let i=0;i<domains.length;i++){
        let domainAPI = await getOneDomain(fakeAuth.getAccessToken(),domains[i]);
        let domain = domainAPI.data;
        domain.listProfiles=[];
        event.data.push(domain)
      }
      this.props.setCurrentEvent(event)
      this.setState({
        modalAddDomain:false
      })
      this.props.setAddDomain([])
    }else if (this.state.modeAddDomain==='Add new'){
      let newDomain = localStorage.getItem("newDomain")
      newDomain = newDomain?JSON.parse(localStorage.getItem("newDomain")):{};
      if (Object.keys(newDomain).length>0 && newDomain.mode==='new'){
        newDomain.listProfiles=[];
        newDomain.id ="new$"+ uuid();
        newDomain.dataDefinitions = JSON.parse(newDomain.dataDefinitions)
        let event = this.props.currentEvent;
        event.data.push(newDomain)
        this.props.setCurrentEvent(event)
        this.setState({modalAddDomain:false})
        localStorage.removeItem("newDomain")
      }
    }
  }

  handleChangeName=(e)=>{
    this.setState({
      name:e.target.value
    })
  }

  handleChangeClient=(e)=>{
    let clientsSuggest = this.state.clientsSuggest;
    let res = []
    clientsSuggest.map(ele=>{
      if (e.includes(ele.id.toString())){
        res.push(ele)
      }
    })
    this.setState({
      clientSelect:e,
      client:res,
    })
  }

  handleChangeStatus=(e)=>{
    this.setState({
      status:e.target.checked===true?1:0
    })
  }

  handleChangeEventType=(e)=>{
    this.setState({
      type:parseInt(e.target.value)
    })
  }

  getStatus = (status) => {
    return status === 1
      ? true
      : false
  }

  renderModeAddNewDomain=()=>{
    return(
      <React.Fragment>
        <hr></hr>
        <NewDomainForm></NewDomainForm>
      </React.Fragment>
    )
  }

  renderModeAddAvailableDomain=()=>{
    return(
      <Row>
        <Col md={12}>
          <br></br>
          <DomainList mode={'choose'}></DomainList>
        </Col>
      </Row>
    )
  }

  handleChangeModeAddDomain=(input)=>{
    this.setState({
      modeAddDomain:input
    })
  }

  handleCancel=()=>{
    console.log("CANCEL")
  }

  handleChangeDescription=(e)=>{
    this.setState({
      description:e.target.value
    })
  }

  handleChangeMaintenanceStart=(e)=>{
    this.setState({
      maintenanceStart:parseInt(e.target.value)
    })
  }

  onOkMaintenanceStart=(e)=>{
    let value = e?e.valueOf():moment().valueOf()
    this.setState({
      maintenanceStart:value
    })
  }

  onOkMaintenanceEnd=(e)=>{
    let value = e?e.valueOf():moment().valueOf()
    this.setState({
      maintenanceEnd:value
    })
  }

  handleChangeMaintenanceEnd=(e)=>{
    this.setState({
      maintenanceEnd:parseInt(e.target.value)
    })
  }

  toggleVisualize=()=>{
    this.setState({
      modalVisualize:!this.state.modalVisualize
    })
  }

  render() {
    let data = {};
    if (this.props.currentEvent && this.props.currentEvent.data){
      data = this.props.currentEvent.data;

      data.map(domain=>{
        domain.listProfiles.map(profile=>{
          if (profile.listTiers){
            profile.listTiers.map(tier=>{
              if (tier.listRules){
                tier.listRules.map(rule=>{
                  if (rule.conditions)
                    delete rule.conditions
                })
              }
            })
          }
        })
      })
    }

    const jsonRequest = {
      action:this.props.newEvent===true?'create event':'edit event',
      id:this.props.event?this.props.event.id:'',
      name: this.state.name,
      client: this.state.client,
      type:this.state.type,
      status: this.state.status,
      maintenanceStart:this.state.maintenanceStart,
      maintenanceEnd:this.state.maintenanceEnd,
      description:this.state.description,
      data: this.state.event.data,
    }
    console.log(this.state.event)
    return (
      <div className="animated fadeIn">
        <Row  >
        <Col md={12}>
        <Card>
              <CardHeader className="text-primary">
                <strong>&mdash; Basic Information</strong>
                <span className="myBtn float-right" 
                onClick = {this.state.event&&this.state.event.data?this.toggleVisualize:''}><i className="icon-info" ></i> <b>Visualize</b></span>
                <Modal size='xl' isOpen={this.state.modalVisualize}>
                   <ModalHeader toggle={this.toggleVisualize}>
                Visualize event
                   </ModalHeader>
                   <ModalBody>
                   <Visualize event = {jsonRequest}></Visualize>
                   </ModalBody>
                 </Modal>
              </CardHeader>
              <CardBody>
                <Row className="justify-content-md-center">
                  <Col md={6}>
                  <Form>
                  <FormGroup row>
                    <Col md={4}>
                    <Label ><b>Event name <span id="EventNameHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
                    <UncontrolledTooltip placement="right" target="EventNameHelp">
                      Event name
                    </UncontrolledTooltip></Col>
                    <Col md={8}>
                    <Input type="text" placeholder="Enter event name..." onChange = {this.handleChangeName} 
                    disabled={this.props.mode==='view'?true:false} value={this.state.name}
                    required/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md={4}>
                    <Label ><b>Client <span id="ClientHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
                    <UncontrolledTooltip placement="right" target="ClientHelp">
                      Client uses this event
                    </UncontrolledTooltip>
                    </Col>
                    <Col md={8}>
                    <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        disabled={this.props.mode==='view'?true:false}
                        value={this.state.clientSelect}
                        onChange={this.handleChangeClient}
                      >
                      {this.state.clientsSuggest.map(ele=>(
                        <Option value={ele.id.toString()}>{ele.name}</Option>
                      ))}
                    </Select>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md={4}>
                    <Label ><b>Event type <span id="EventTypeHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
                    <UncontrolledTooltip size="lg" placement="right" target="EventTypeHelp">
                      <div style={{textAlign:"left"}}>
                      <div>1: make decision</div>
                      <div>2: get data from cache</div>
                      <div>3: get data from database</div>
                      </div>
                    </UncontrolledTooltip></Col>
                    <Col md={8}>
                    <Input type="select" name="select-event-type" id="select-event-type" 
                    disabled={this.props.mode==='view'?true:false} value={this.state.type}
                    onChange={this.handleChangeEventType}>
                    <option value="-1">--Select--</option>
                    {Object.keys(eventTypeSuggest).map((keys, index)=>(
                          <option value={keys}>{eventTypeSuggest[keys]}</option>))}
                    </Input>
                    {/* <Link color = "primary" className="help-block" onClick={()=>{console.log("Add event type")}}><small>Add a event type</small></Link> */}

                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md={4}>

                    <Label ><b>Status <span id="StatusHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
                    <UncontrolledTooltip placement="right" target="StatusHelp">
                      Mode ON/OFF event
                    </UncontrolledTooltip></Col>
                    <Col md={8}>
                
                    <AppSwitch
                        variant={'pill'}
                        label
                        color={'success'}
                        onChange={this.handleChangeStatus}
                        checked={this.getStatus(this.state.status)}
                        size={'sm'}/>
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md={4}>
                    <Label ><b>MaintenanceStart <span id="mainStartHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
                    <UncontrolledTooltip size="lg" placement="right" target="mainStartHelp">
                      <div style={{textAlign:"left"}}>
                      MaintenanceStart
                      </div>
                    </UncontrolledTooltip></Col>
                    <Col md={8}>
                    {this.props.mode==='edit'?<AntInput type="text" onChange={this.handleChangeMaintenanceStart}
                    disabled={this.props.mode==='view'?true:false} value={this.state.maintenanceStart}>
                    </AntInput>:<span></span>}
                    <DatePicker 
                     style={{width:'100%'}}
                     disabled={this.props.mode==='view'?true:false}
                     value={moment(this.state.maintenanceStart)} 
                     showTime onOk={this.onOkMaintenanceStart} 
                     onChange={this.onOkMaintenanceStart} />

                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md={4}>
                    <Label ><b>MaintenanceEnd <span id="mainEndHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
                    <UncontrolledTooltip size="lg" placement="right" target="mainEndHelp">
                      <div style={{textAlign:"left"}}>
                      MaintenanceEnd
                      </div>
                    </UncontrolledTooltip></Col>
                    <Col md={8}>
                    {this.props.mode==='edit'?<AntInput type="text" onChange={this.handleChangeMaintenanceEnd}
                    disabled={this.props.mode==='view'?true:false} value={this.state.maintenanceEnd}>
                    </AntInput>:<span></span>}
                    <DatePicker 
                     style={{width:'100%'}}
                     disabled={this.props.mode==='view'?true:false}
                     value={moment(this.state.maintenanceEnd)} 
                     showTime onOk={this.onOkMaintenanceEnd} 
                     onChange={this.onOkMaintenanceEnd} />
                    </Col>
                  </FormGroup>
                  <FormGroup row>
                    <Col md={4}>
                    <Label ><b>Description <span id="desHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
                    <UncontrolledTooltip size="lg" placement="right" target="desHelp">
                      <div style={{textAlign:"left"}}>
                      Description for event
                      </div>
                    </UncontrolledTooltip></Col>
                    <Col md={8}>
                    <Input type="textarea" onChange={this.handleChangeDescription}
                    disabled={this.props.mode==='view'?true:false} value={this.state.description}>
                    </Input>
                    </Col>
                  </FormGroup>
                </Form>
                  </Col>
                  <Col md={3}>
                      <DragDrop mode={this.props.mode}></DragDrop>
                    </Col>
                </Row>

              </CardBody>
            </Card>
        </Col>
        </Row>
        <Row>
            <Col md={12}>
                <Card>
                    <CardHeader className="text-primary">
                    <strong>&mdash; Detail Information</strong>
                    </CardHeader>
                    <CardBody>
                    {this.props.mode==='view'?<div></div>:
                    <Row className="mb-3 align-items-center">
                    <Col md={2}>
                    <Button size="md" className="mt-2 p-2" color="primary" outline onClick={this.toggleAddDomain}>Add domain</Button>
                    </Col>
                    <Modal size="xl" isOpen={this.state.modalAddDomain} toggle={this.toggleAddDomain}>
                      <ModalHeader>
                        Add domain
                      </ModalHeader>
                      <ModalBody style={{maxHeight: 'calc(100vh - 210px)', overflowY: 'auto'}}>
                          <Row>
                          <Col md={3}>
                            <Select
                                style={{ width: '100%' }}
                                value={this.state.modeAddDomain}
                                onChange={this.handleChangeModeAddDomain}
                              >
                              {['Add new','Add available'].map(ele=>(
                                <Option value={ele}>{ele}</Option>
                              ))}
                            </Select>
                            </Col>
                          </Row>
                          {this.state.modeAddDomain==='Add new'?this.renderModeAddNewDomain():
                          this.state.modeAddDomain==='Add available'?this.renderModeAddAvailableDomain():<Row></Row>}
                      </ModalBody>
                      <ModalFooter>
                      <Row className="mb-3">
                     <Col>
                        <Button color="primary" className="float-right" onClick = {this.handleAddDomain}>
                          Add
                        </Button>
                        <Button onClick={this.toggleAddDomain} className="float-right" style={iconStyle} color="secondary">
                          Cancel
                        </Button>
                        </Col>
                        </Row>
                      </ModalFooter>
                    </Modal>
                    </Row>}

                    {this.state.event&&this.state.event.data?this.state.event.data.map((domain)=>(
                      <DomainItem key={domain.id} domain = {domain.name} mode={this.props.mode} domainData={domain} domainStatus={domain.status}>
                      </DomainItem>
                    )):<span></span>}

                    <hr>
                    </hr>
                    {this.props.mode==='view'?<div></div>:
                     <Row className="mb-3">
                     <Col>
                     <Button color="primary" className="float-right" onClick = {()=>{this.toggleSubmit(jsonRequest)}}>
                       Submit
                     </Button>
                     <Button href="/#/events" onClick={this.handleCancel} className="float-right" style={iconStyle} color="secondary">
                       Cancel
                     </Button>
                     </Col>
                 </Row>
                 }
                 <Modal size='lg' isOpen={this.state.modal} toggle={this.toggleModal}>
                   <ModalHeader toggle={this.toggleModal}>
                Do you confirm this event?
                   </ModalHeader>
                   <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                   <div><pre>{JSON.stringify(jsonRequest, null, 2) }</pre></div>
                   </ModalBody>
                   <ModalFooter>
                   <Row className="mb-3">
                     <Col>
                     <Button color="primary" className="float-right" onClick = {()=>{this.submit(jsonRequest)}}>
                       Submit
                     </Button>
                     <Button onClick={this.toggleModal} className="float-right" style={iconStyle} color="secondary">
                       Cancel
                     </Button>
                     </Col>
                 </Row>
                   </ModalFooter>
                 </Modal>
                    </CardBody>
                </Card>
            </Col>
        </Row>
        
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentEvent: state.EventOptions.currentEvent,
  comboBox: state.EventOptions.comboBox,
  addDomain:state.EventOptions.addDomain,
  delDomain: state.EventOptions.delDomain,
  editDomain:state.EventOptions.editDomain,
});

const mapDispatchToProps = dispatch => ({
  setCurrentEvent:data=> dispatch(setCurrentEvent(data)),
  setDelDomain:data=>dispatch(setDelDomain(data)),
  setEditDomain:data=>dispatch(setEditDomain(data)),
  setAddDomain:data=>dispatch(setAddDomain(data)),


});

export default connect(mapStateToProps, mapDispatchToProps)(ViewEvent);