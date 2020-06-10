import React from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    Collapse,
    Row,
    Col,
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    ModalFooter,
    Form,
    FormGroup,
    Label,

}from 'reactstrap'
import {connect} from 'react-redux';
import {Link} from 'react-router-dom'
import {setEditTier,setEditProfile,setDelProfile,setDelTier,setCurrentEvent} from '../../../reducers/EventOptions'
import ComboBox from '../ComboBox'
import Condition from '../Conditions'
import uuid from 'react-uuid'
import TierItem from './TierItem'
import TierList from '../../../components/TierManagement'
import { Select } from 'antd'
import NewProfileForm from '../../../components/row/NewProfileForm'
import NewTierForm from '../../../components/row/NewTierForm'
import {getRules} from '../../../api/rule'
import {getConditions} from '../../../api/condition'
import fakeAuth from '../../../api/fakeAuth';
import moment from 'moment';

const { Option } = Select;

const iconStyle = {
  "margin-right":"5px"
}


export function dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }
  return function (a,b) {
      /* next line works with strings and numbers, 
       * and you may want to customize it to your needs
       */
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
  }
}

class ProfileItem extends React.Component{
    constructor(props){
        super(props);
        this.state={
            collapse:false,
            tier:'',
            priority:'',
            decision:'',
            filter:'',
            profileData:props.profileData,
            listTiers:props.profileData.listTiers,
            cbxName:props.profileData.name,
            cbxFilter:props.profileData.filter,
            profileName:props.profileData.name,
            profileFilter:props.profileData.filter,
            modalEditProfile:false,
            modalAddTier:false,
            modeAddTier:'Add new',
        }
    }

    toggleAddTier=()=>{
      localStorage.removeItem("addTier")
      this.setState({
        modalAddTier:!this.state.modalAddTier
      })
    }

    toggle=()=>{
        this.setState({
            collapse:!this.state.collapse
        })
    }

    toggleDelete=()=>{
        this.props.setDelProfile({id:this.props.id,profile:this.props.profile,filter:this.props.filter,domain:this.props.domain})
    }


    componentWillReceiveProps = (nextProps)=>{
      let delTier = nextProps.delTier;
        if (Object.keys(delTier).length !== 0){
          if (delTier.profileId === this.props.id){
            let listTiers = JSON.parse(JSON.stringify(this.state.listTiers));
            let filtered = listTiers.filter(
              function(value)
              {
                return !(value.id === delTier.id)}
              );

            this.setState({
              listTiers:filtered,
            })
            this.props.setDelTier({});

            //update currentEvent
            let listProfiles = this.props.currentEvent.data.find(domain=>domain.name===this.props.domain).listProfiles;
            listProfiles = listProfiles?listProfiles:[];
            listProfiles.map(ele=>{
              if (ele.id === this.props.id){
                ele.listTiers = filtered
              }
            })
            this.props.setCurrentEvent({
              ...this.props.currentEvent,
              listProfiles:{
                ...this.props.currentEvent.listProfiles,
                [this.props.domain]:listProfiles,
              }
            });
        }
      }

      let editTier = nextProps.editTier;
      if (Object.keys(editTier).length>0){
        let currentEvent = this.props.currentEvent;
        let listTiers = this.state.listTiers;
        listTiers.map(ele=>{
          if (ele.id===editTier.id){
            ele.tier=editTier.tier;
            ele.priority=editTier.priority;
            ele.decision=editTier.decision;
            ele.filter=editTier.filter;
          }
        })
        let listProfiles = this.props.currentEvent.data.find(domain=>domain.name===this.props.domain).listProfiles;
        listProfiles = listProfiles?listProfiles:[];
        listProfiles.map(ele=>{
          if (ele.id===this.props.id){
            ele.listTiers=listTiers;
          }
        })
        currentEvent={
          ...currentEvent,
          listProfiles:{
            ...currentEvent.listProfiles,
            [this.props.domain]:listProfiles
          }
        }
        this.props.setEditTier({})
        this.props.setCurrentEvent(currentEvent)
      }


      this.setState({
        tier:nextProps.comboBox["cbx-tier"],
        priority: nextProps.comboBox["cbx-tier-priority"],
        decision: nextProps.comboBox["cbx-tier-decision"],
        filter: nextProps.comboBox["cbx-tier-filter"],
        cbxName:nextProps.comboBox['cbx-edit-profile-name'],
        cbxFilter:nextProps.comboBox['cbx-edit-profile-filter'],
      })
    }

    handleAddTier = async ()=>{
      if (this.state.modeAddTier==='Add available'){
        let tiers = localStorage.getItem("addTier");
        tiers = tiers?JSON.parse(tiers):[]
        let event = this.props.currentEvent;

        let allRuleAPI = await getRules(fakeAuth.getAccessToken(),0,1000)
        let allRules = allRuleAPI.data.list

        let conditionAPI = await getConditions(fakeAuth.getAccessToken(),0,1000)
        let allConditions = conditionAPI.data.list
        for (let i=0;i<tiers.length;i++){
          tiers[i].listRules = allRules.filter(rule=>rule.tierId.toString()===tiers[i].id.toString())
          tiers[i].listRules.map(rule=>{
            rule.ruleConditions = allConditions.filter(con=>con.conditionType==='rule'&&con.conditionTypeId.toString()===rule.latestVersion.id.toString())
          })
          tiers[i].conditions = allConditions.filter(con=>con.conditionType==='tier'&&con.conditionTypeId.toString()===tiers[i].id.toString())
          event.data.find(ele=>ele.name===this.props.domain)
          .listProfiles.find(profile=>profile.id.toString()===this.props.profileData.id.toString())
          .listTiers.push(tiers[i])
        }

        event.data.find(ele=>ele.name===this.props.domain)
          .listProfiles.find(profile=>profile.id.toString()===this.props.profileData.id.toString())
          .listTiers.sort(dynamicSort('priority'))
        this.props.setCurrentEvent(event)
        this.setState({
          modalAddTier:false
        })
      }else if (this.state.modeAddTier==='Add new'){
        let newTier = localStorage.getItem("newTier")
        newTier = newTier?JSON.parse(newTier):{};
        if (Object.keys(newTier).length>0 && newTier.mode==='new'){
          newTier.listRules=[];
          newTier.id ="new$"+ uuid();
          let event = this.props.currentEvent;

          event.data.find(ele=>ele.name===this.props.domain)
          .listProfiles.find(profile=>profile.id.toString()===this.props.profileData.id.toString())
          .listTiers.push(newTier)

          this.props.setCurrentEvent(event)
          this.setState({modalAddTier:false})
          localStorage.removeItem("newTier")
        }
      }
    }

    toggleEditProfile=()=>{
      this.setState({
        modalEditProfile:!this.state.modalEditProfile,
      })
    }

    handleSaveEdit=()=>{
      let newProfile = localStorage.getItem("newProfile")
      newProfile = newProfile?JSON.parse(localStorage.getItem("newProfile")):{};
      if (Object.keys(newProfile).length>0 && newProfile.mode==='edit'){
        let event = this.props.currentEvent;
        event.data.find(ele=>ele.name===this.props.domain).listProfiles.map(profile=>{
          if (profile.id.toString()===this.props.profileData.id.toString()){
            profile.name = newProfile.name;
            profile.mode = newProfile.mode;
            profile.filter = newProfile.filter;
            profile.description = newProfile.description
          }
        })
        this.props.setCurrentEvent(event)
        this.setState({modalEditProfile:false})
        localStorage.removeItem("newProfile")
      }
    }

    renderModeAddNewTier=()=>{
      return(
        <React.Fragment>
          <hr></hr>
          <NewTierForm></NewTierForm>
        </React.Fragment>
      )
    }
  
    renderModeAddAvailableTier=()=>{
      localStorage.removeItem("addTier")
      return(
        <Row>
          <Col md={12}>
            <br></br>
            <TierList mode={'choose'}></TierList>
          </Col>
        </Row>
      )
    }
  
    handleChangeModeAddTier=(input)=>{
      this.setState({
        modeAddTier:input
      })
    }

    handleSortPriority=()=>{
      this.setState({
        modalEditProfile:false
      })
    }

    render(){
      let listTiers = this.state.listTiers?this.state.listTiers:[];
      listTiers.sort(dynamicSort('priority'))
      return (
            <Row className="align-items-center animated fadeIn" key={this.props.key}>
                <Col md={12}>
                <Card>
                          <CardHeader className="text-success myBtn"  onClick={this.toggle}>
                            <span style={{color: 'blue'}}>
                            <span 
                            className={this.props.mode==='edit'?"title":''}
                            onClick={this.props.mode==='edit'?this.toggleEditProfile:''}>
                            <strong>Profile: </strong>{this.state.profileData.name} &mdash; <strong>Filter: </strong>{this.state.profileData.filter} &mdash; <strong>Conditions: </strong></span> <Condition key={this.props.domain+this.props.profileId} conditionData={this.state.profileData.conditions} type = "cdt-profile" domain = {this.props.domain} profile={this.props.profile} filter={this.props.filter} profileId={this.props.id} mode = {this.props.mode}/>

                            <div className="card-header-actions">
                              {/*eslint-disable-next-line*/}
                              <a className="card-header-action btn btn-minimize" data-target={`#collapseDomain${this.props.key}`} onClick={this.toggle}><i className={this.state.collapse===true?"icon-arrow-up":"icon-arrow-down"}></i></a>
                              {/*eslint-disable-next-line*/}
                              {this.props.mode==='view'?<span></span>:
                                <a className="card-header-action btn btn-close" onClick={this.toggleDelete}><i className="icon-close"></i></a>
                              }
                            </div>
                            </span>
                            <Modal isOpen={this.state.modalEditProfile} toggle={this.toggleEditProfile}>
                              <ModalHeader toggle={this.toggleEditProfile}>
                              Edit profile ID: {this.state.profileData.id}
                              </ModalHeader>
                              <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                              <NewProfileForm mode="edit" profileData={this.state.profileData}></NewProfileForm>
                              </ModalBody>
                              <ModalFooter>
                                <Button color="secondary" onClick={this.toggleEditProfile}>Cancel</Button>
                                <Button color="primary" onClick={this.handleSaveEdit}>Save</Button>
                              </ModalFooter>
                            </Modal>
                          </CardHeader>
                          <Collapse isOpen={this.state.collapse} id={`#collapseDomain${this.props.key}`}>
                            <CardBody>
                            <Row className="align-items-center">
                              <Col md={6}>
                                <Card className="mt-1 mb-0">
                                  <CardHeader className="pb-1">
                                  <div>
                                    <b>Profile information</b>
                                  </div>
                                  <div>&mdash;<i>ID: <Link to={'/profiles/'+this.state.profileData.id}>{this.state.profileData.id}</Link></i></div>
                                  <div>&mdash;<i>Created at: {moment(this.state.profileData.createAt).format('DD-MM-YYYY HH:mm:ss')}</i></div>

                                  <div>&mdash;<i>Description: {this.state.profileData.description}</i></div>

                                  </CardHeader>
                                </Card>
                              </Col>
                              <Col md={6}></Col>
                            </Row>
                            <hr></hr>
                            {this.props.mode==='view'?<div></div>:
                              <Row className="mb-3 align-items-center">
                              <Col md={6}>
                              <Button size="md" className="mt-2 p-2" color="primary" outline onClick={this.toggleAddTier}>Add tier</Button> 
                              &nbsp;
                              <Button size="md" className="mt-2 p-2" color="primary" outline onClick={this.handleSortPriority}><i className="fa fa-refresh"></i></Button>

                              </Col>
                              <Modal size="xl" isOpen={this.state.modalAddTier} toggle={this.toggleAddTier}>
                                <ModalHeader>
                                  Add tier for profile ID: {this.state.profileData.id} - {this.state.profileData.name}
                                </ModalHeader>
                                <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                                    <Row>
                                    <Col md={3}>
                                      <Select
                                          style={{ width: '100%' }}
                                          value={this.state.modeAddTier}
                                          onChange={this.handleChangeModeAddTier}
                                        >
                                        {['Add new'].map(ele=>(
                                          <Option value={ele}>{ele}</Option>
                                        ))}
                                      </Select>
                                      </Col>
                                    </Row>
                                    {this.state.modeAddTier==='Add new'?this.renderModeAddNewTier():
                                    this.state.modeAddTier==='Add available'?this.renderModeAddAvailableTier():<Row></Row>}
                                </ModalBody>
                                <ModalFooter>
                                <Row className="mb-3">
                              <Col>
                                  <Button color="primary" className="float-right" onClick = {this.handleAddTier}>
                                    Add
                                  </Button>
                                  <Button onClick={this.toggleAddTier} className="float-right" style={iconStyle} color="secondary">
                                    Cancel
                                  </Button>
                                  </Col>
                                  </Row>
                                </ModalFooter>
                              </Modal>
                              </Row>}
                            {listTiers?
                            listTiers
                            .map((tier)=>(
                              <TierItem key={tier.id} domain={this.props.domain} profileId = {this.props.id} profile={this.props.profile} profileFilter={this.props.filter} tier={tier}
                              mode={this.props.mode} tierData={tier}
                              >

                              </TierItem>
                             )):<span></span>}
                            </CardBody>
                          </Collapse>
                        </Card>
                </Col>
            </Row>
        )
    }
}

const mapStateToProps = state => ({
    comboBox: state.EventOptions.comboBox,
    currentEvent: state.EventOptions.currentEvent,
    delTier: state.EventOptions.delTier,
    editTier:state.EventOptions.editTier,
  });
  const mapDispatchToProps = dispatch => ({
    setDelProfile:data=> dispatch(setDelProfile(data)),
    setDelTier:data=> dispatch(setDelTier(data)),
    setCurrentEvent:data=> dispatch(setCurrentEvent(data)),
    setEditProfile:data=> dispatch(setEditProfile(data)),
    setEditTier:data=>dispatch(setEditTier(data)),

  });


export default connect(mapStateToProps, mapDispatchToProps)(ProfileItem);