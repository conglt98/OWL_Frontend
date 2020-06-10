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
    ModalHeader,
    ModalBody,
    FormGroup,
    Label,
    Input,
    ModalFooter,
    UncontrolledCollapse,
    Table,
}from 'reactstrap'
import {connect} from 'react-redux';
import {setEditProfile,setEditDomain,setDelProfile,setCurrentEvent,setDelDomain} from '../../../reducers/EventOptions'
import ComboBox from '../ComboBox'
import ProfileItem from './ProfileItem'
import {AppSwitch} from '@coreui/react'
import uuid from 'react-uuid'
import ProfileList from '../../../components/ProfileManagement'
import DragDrop from '../DragDrop'
import {Link} from 'react-router-dom'
import NewDomainForm from '../../../components/row/NewDomainForm'
import NewProfileForm from '../../../components/row/NewProfileForm'

import {getTiers} from '../../../api/tier'
import {getRules} from '../../../api/rule'
import {getConditions} from '../../../api/condition'
import fakeAuth from '../../../api/fakeAuth';
import moment from 'moment'
import { Select } from 'antd'

const { Option } = Select;

const iconStyle = {
  "margin-right":"5px"
}

const isInList = (elementName,elementFilter, list) =>{
  for (let  index = 0; index < list.length; ++index) {
    if (list[index].profile === elementName && list[index].filter === elementFilter)
      return true;
  }
  return false;
}

class DomainItem extends React.Component{
    constructor(props){
        super(props);
        this.state={
            collapse:false,
            profile:'',
            filter:'',
            cbxName:props.domain,
            domain:props.domain,
            status:props.domainStatus,
            domainData:props.domainData,
            modalEditDomain:false,
            modalAddProfile:false,
            modeAddProfile:'Select mode',
        }
        // console.log(props.domainData)
    }

    toggleAddProfile=()=>{
      localStorage.removeItem("addProfile")
      this.setState({
        modalAddProfile:!this.state.modalAddProfile
      })
    }

    renderModeAddNewProfile=()=>{
      return(
        <React.Fragment>
          <hr></hr>
          <NewProfileForm></NewProfileForm>
        </React.Fragment>
      )
    }
  
    renderModeAddAvailableProfile=()=>{
      localStorage.removeItem("addProfile")

      return(
        <Row>
          <Col md={12}>
            <br></br>
            <ProfileList mode={'choose'}></ProfileList>
          </Col>
        </Row>
      )
    }
  
    handleChangeModeAddProfile=(input)=>{
      this.setState({
        modeAddProfile:input
      })
    }

    toggle=()=>{
        this.setState({
            collapse:!this.state.collapse
        })
    }

    toggleDelete=()=>{
      this.props.setDelDomain(this.state.domainData.id.toString())
    }

    componentWillReceiveProps = (nextProps)=>{
      this.setState({
        profile:nextProps.comboBox["cbx-profile"],
        filter: nextProps.comboBox["cbx-profile-filter"]
      })

      let delProfile = nextProps.delProfile;
      if (delProfile.domain === this.props.domain){
        let listProfiles = JSON.parse(JSON.stringify(this.state.domainData.listProfiles));
        if (Object.keys(delProfile).length !== 0){
        let filtered = listProfiles.filter(
          function(value)
          {
            return !(value.id === delProfile.id)}
          );
        console.log(delProfile)

        this.setState({
          domainData:{
            ...this.state.domainData,
            listProfiles:filtered
          }
        })
        this.props.setDelProfile({});
        console.log(this.props.currentEvent)
        let newCurEvent = this.props.currentEvent
        newCurEvent.data.find(domain=>domain.name===this.props.domain).listProfiles = filtered;
        this.props.setCurrentEvent(newCurEvent);
        }
      }

      let editProfile = nextProps.editProfile;
      if (Object.keys(editProfile).length>0){
        let currentEvent = this.props.currentEvent;
        let listProfiles = this.state.domainData.listProfiles;
        listProfiles.map(ele=>{
          if (ele.id===editProfile.profileId){
            ele.profile=editProfile.profile;
            ele.filter=editProfile.filter;
          }
        })
        currentEvent={
          ...currentEvent,
          listProfiles:{
            ...currentEvent.listProfiles,
            [this.props.domain]:listProfiles
          }
        }
        this.props.setEditProfile({})
        this.props.setCurrentEvent(currentEvent)
      }
    }

    handleAddProfile = async () => {
      if (this.state.modeAddProfile==='Add available'){
        let profiles = localStorage.getItem("addProfile");
        profiles = profiles?JSON.parse(profiles):[]
        let event = this.props.currentEvent;

        let conditionAPI = await getConditions(fakeAuth.getAccessToken(),0,1000)
        let allConditions = conditionAPI.data.list
        let allTiersAPI = await getTiers(fakeAuth.getAccessToken(),0,1000)
        let allTiers = allTiersAPI.data.list
        let allRulesAPI = await getRules(fakeAuth.getAccessToken(),0,1000)
        let allRules = allRulesAPI.data.list
        for (let i=0;i<profiles.length;i++){
          profiles[i].listTiers = allTiers.filter(tier=>tier.profileId.toString()===profiles[i].id.toString())
          profiles[i].listTiers.map(tier=>{
            tier.listRules = allRules.filter(rule=>rule.tierId.toString()===tier.id.toString())
            tier.listRules.map(rule=>{
              rule.ruleConditions = allConditions.filter(con=>con.conditionType==='rule'&&con.conditionTypeId.toString()===rule.latestVersion.id.toString())
            })
            tier.conditions = allConditions.filter(con=>con.conditionType==='tier'&&con.conditionTypeId.toString()===tier.id.toString())
          })
          profiles[i].conditions = allConditions.filter(con=>con.conditionType==='profile'&&con.conditionTypeId.toString()===profiles[i].id.toString())
          event.data.find(ele=>ele.name===this.props.domain).listProfiles.push(profiles[i])
        }
        this.props.setCurrentEvent(event)
        this.setState({
          modalAddProfile:false
        })
      }else if (this.state.modeAddProfile==='Add new'){
        let newProfile = localStorage.getItem("newProfile")
        newProfile = newProfile?JSON.parse(newProfile):{};
        if (Object.keys(newProfile).length>0 && newProfile.mode==='new'){
          newProfile.listTiers=[];
          newProfile.id ="new$"+ uuid();
          let event = this.props.currentEvent;
          event.data.find(ele=>ele.name===this.props.domain).listProfiles.push(newProfile)
          this.props.setCurrentEvent(event)
          this.setState({modalAddProfile:false})
          localStorage.removeItem("newProfile")
        }
      }
    }

    handleChangeStatus=(e)=>{
      this.setState({
        status:e.target.checked===true?1:0
      })
      let currentEvent = this.props.currentEvent;
      currentEvent.data.find(domain=>domain.name===this.props.domain).status = e.target.checked===true?1:0;
      this.props.setCurrentEvent(currentEvent)
    }

    getStatus = (status) => {
      return status === 1
        ? true
        : false
    }

    toggleEditDomain=()=>{
      this.setState({
        modalEditDomain:!this.state.modalEditDomain,
      })
    }

    handleChangeCbxName=(e)=>{
      this.setState({
        cbxName:e.target.value,
      })
    }

    handleSaveEdit=()=>{
      let newDomain = localStorage.getItem("newDomain")
      newDomain = newDomain?JSON.parse(localStorage.getItem("newDomain")):{};
      if (Object.keys(newDomain).length>0 && newDomain.mode==='edit'){
        newDomain.dataDefinitions = JSON.parse(newDomain.dataDefinitions)
        let event = this.props.currentEvent;
        event.data.map(ele=>{
          if (ele.id.toString()===newDomain.id.toString()){
            ele.name = newDomain.name
            ele.sourceId = newDomain.sourceId
            ele.status = newDomain.status
            ele.description = newDomain.description
            ele.mode = newDomain.mode
            ele.dataDefinitions = newDomain.dataDefinitions
          }
        })
        this.props.setCurrentEvent(event)
        this.setState({modalEditDomain:false})
        localStorage.removeItem("newDomain")
      }
    }


    render(){      
        return (
            <Row className="align-items-center animated fadeIn" key={this.props.key}>
                <Col md={12}>
                <Card>
                          <CardHeader className="text-danger myBtn" onClick={this.toggle}>
                          <span
                          style={{color: 'red'}}>
                            <span 
                            className={this.props.mode==='edit'?"title":''}
                            onClick={this.props.mode==='edit'?'':''}>
                            <strong >Domain: </strong>{this.state.domainData.name}
                          </span>

                            <div className="card-header-actions">
                              {/*eslint-disable-next-line*/}
                              <a className="card-header-action btn btn-minimize" data-target={`#collapseDomain${this.props.key}`} onClick={this.toggle}><i className={this.state.collapse===true?"icon-arrow-up":"icon-arrow-down"}></i></a>
                              &nbsp;
                              {this.props.mode==='view'?<span></span>:
                                /*eslint-disable-next-line*/
                                <a className="card-header-action btn btn-close" onClick={this.toggleDelete}><i className="icon-close"></i></a>
                              }
                            </div>
                            </span>
                            <Modal size="lg" isOpen={this.state.modalEditDomain} toggle={this.toggleEditDomain}>
                              <ModalHeader toggle={this.toggleEditDomain}>
                              Edit domain ID: {this.state.domainData.id}
                              </ModalHeader>
                              <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                                <NewDomainForm mode="edit" domainData={this.state.domainData}></NewDomainForm>
                              </ModalBody>
                              <ModalFooter>
                                <Button color="secondary" onClick={this.toggleEditDomain}>Cancel</Button>
                                <Button color="primary" onClick={this.handleSaveEdit}>Save</Button>
                              </ModalFooter>
                            </Modal>
                            &nbsp;
                            <AppSwitch
                              className="float-right mr-2"
                              variant={'pill'}
                              label
                              color={'success'}
                              onChange={this.handleChangeStatus}
                              checked={this.getStatus(this.state.status)}
                              size={'sm'}/>
                            &nbsp;
                          </CardHeader>
                          <Collapse isOpen={this.state.collapse} id={`#collapseDomain${this.props.key}`}>
                            <CardBody>
                            <Row className="align-items-center">
                              <Col md={6}>
                                <Card className="mt-4">
                                  <CardHeader className="pb-4">
                                  <div>
                                    <b>Domain information</b>
                                  </div>
                                  <div>&mdash;<i>ID: <Link to={'/domains/'+this.state.domainData.id}>{this.state.domainData.id}</Link></i></div>
                                  <div>&mdash;<i>Created at: {moment(this.state.domainData.createAt).format('DD-MM-YYYY HH:mm:ss')}</i></div>

                                  <div>&mdash;<i>SourceID: <Link to={'/sources/'+this.state.domainData.sourceId}>{this.state.domainData.sourceId}</Link></i></div>
                                  <div>&mdash;<i>Description: {this.state.domainData.description}</i></div>

                                  </CardHeader>
                                </Card>
                              </Col>
                              <Col md={6}><DragDrop mode={this.props.mode} typeDrop="horizontal"></DragDrop></Col>
                            </Row>
                            <br></br>
                            <Card>
                            <CardHeader color="primary" className="myBtn" id="toggler">
                              <strong>Data definitions</strong>
                            </CardHeader>
                            <UncontrolledCollapse toggler="#toggler">
                                <CardBody>
                                  {this.state.domainData&&this.state.domainData.dataDefinitions?
                                  this.state.domainData.dataDefinitions.map(ele=>{
                                    return (
                                      <Card>
                                        <CardHeader color="primary" className="myBtn" id={"togglerDataDef"+ele.id}>
                                        <strong>{ele.name}</strong>
                                        </CardHeader>
                                        <UncontrolledCollapse toggler={"#togglerDataDef"+ele.id}>
                                        <CardBody>
                                          <Row>
                                            <Col md={6}>
                                            <Table hover striped responsive>
                                              <thead>
                                                <tr>
                                                <th>information</th>
                                                <th></th>
                                                </tr>

                                              </thead>
                                            <tbody>
                                              {ele?
                                              Object.keys(ele).map(field=>{
                                                if (field!=='defs'&&field!=='accumulationKeys'){
                                                  return( 
                                                    <tr>
                                                      <td>{field}</td>
                                                      <td>{ele[field]}</td>
                                                    </tr>
                                                  )
                                                }
                                              })
                                              :<tr></tr>}
                                            </tbody>
                                          </Table></Col>
                                              
                                              <Col md={6}>
                                              <Table hover striped responsive>
                                              <thead>
                                                <tr>
                                                <th>defs</th>
                                                <th></th>
                                                </tr>

                                              </thead>
                                            <tbody>
                                              {ele.defs?
                                              JSON.parse(ele.defs).map(dataDef=>(
                                                <tr>
                                                      <td>{dataDef.name}</td>
                                                      <td>{dataDef.type}</td>
                                                    </tr>
                                              ))
                                              :<tr></tr>}
                                            </tbody>
                                          </Table>
                                              </Col>
                                          </Row>
                                          <Row>
                                            <Col md={12}>
                                            <Card>
                                              <CardHeader color="primary" className="myBtn" id={"togglerAccKeys"}>
                                              <strong>accumulationKeys</strong>
                                              </CardHeader>
                                              <UncontrolledCollapse toggler={"#togglerAccKeys"}>
                                              <CardBody>
                                                {ele.accumulationKeys?
                                                ele.accumulationKeys.map(accKey=>(
                                                  <React.Fragment>
                                                    <CardHeader color="primary" className="myBtn" id={"togglerAccKeys"+accKey.id}>
                                                  <strong>{accKey.name}</strong>
                                                  </CardHeader>
                                                  <UncontrolledCollapse toggler={'#togglerAccKeys'+accKey.id}>
                                                      <Table hover striped responsive>
                                                          <tbody>
                                                            {accKey?
                                                            Object.keys(accKey).map(field=>(
                                                              <tr>
                                                                <td>{field}</td>
                                                                <td>{accKey[field]!==null?accKey[field].toString():"None"}</td>
                                                              </tr>
                                                            ))
                                                            :<span></span>}
                                                          </tbody>
                                                      </Table>
                                                  </UncontrolledCollapse>
                                                  </React.Fragment>
                                                ))
                                                :<span></span>}
                                              </CardBody>
                                              </UncontrolledCollapse>
                                              </Card>
                                            </Col>
                                          </Row>
                                        </CardBody>
                                        </UncontrolledCollapse>
                                      </Card>
                                    )
                                  })
                                  :<span></span>}
                                </CardBody>
                            </UncontrolledCollapse>
                            </Card>
                            <hr></hr>
                            {this.props.mode==='view'?<div><br></br></div>:
                              <Row className="mb-3 align-items-center">
                              <Col md={2}>
                              <Button size="md" className="mt-2 p-2" color="primary" outline onClick={this.toggleAddProfile}>Add profile</Button>
                              </Col>
                              <Modal size="xl" isOpen={this.state.modalAddProfile} toggle={this.toggleAddProfile}>
                                <ModalHeader>
                                  Add profile for domain ID: {this.state.domainData.id} - {this.state.domainData.name}
                                </ModalHeader>
                                <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                                    <Row>
                                    <Col md={3}>
                                      <Select
                                          style={{ width: '100%' }}
                                          value={this.state.modeAddProfile}
                                          onChange={this.handleChangeModeAddProfile}
                                        >
                                        {['Add new','Add available'].map(ele=>(
                                          <Option value={ele}>{ele}</Option>
                                        ))}
                                      </Select>
                                      </Col>
                                    </Row>
                                    {this.state.modeAddProfile==='Add new'?this.renderModeAddNewProfile():
                                    this.state.modeAddProfile==='Add available'?this.renderModeAddAvailableProfile():<Row></Row>}
                                </ModalBody>
                                <ModalFooter>
                                <Row className="mb-3">
                              <Col>
                                  <Button color="primary" className="float-right" onClick = {this.handleAddProfile}>
                                    Add
                                  </Button>
                                  <Button onClick={this.toggleAddProfile} className="float-right" style={iconStyle} color="secondary">
                                    Cancel
                                  </Button>
                                  </Col>
                                  </Row>
                                </ModalFooter>
                              </Modal>
                              </Row>}
                            {this.state.domainData&&this.state.domainData.listProfiles?this.state.domainData.listProfiles.map((profile)=>(
                               <ProfileItem key={profile.id} domain={this.props.domain} profile={profile.profile} filter={profile.filter}
                               mode={this.props.mode} profileData={profile} id={profile.id}>

                               </ProfileItem>
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
    delProfile: state.EventOptions.delProfile,
    currentEvent: state.EventOptions.currentEvent,
    editProfile:state.EventOptions.editProfile,
  });
  const mapDispatchToProps = dispatch => ({
    setDelProfile:data=> dispatch(setDelProfile(data)),
    setCurrentEvent:data=> dispatch(setCurrentEvent(data)),
    setDelDomain:data=> dispatch(setDelDomain(data)),
    setEditDomain:data=> dispatch(setEditDomain(data)),
    setEditProfile:data=>dispatch(setEditProfile(data)),
  });


export default connect(mapStateToProps, mapDispatchToProps)(DomainItem);