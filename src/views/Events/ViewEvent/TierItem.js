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
    Input,
    Table,
    Label,
    FormGroup,
    Form,
}from 'reactstrap'
import {connect} from 'react-redux';
import {setEditRule,setEditTier,setDelTier,setDelRule,setCurrentEvent} from '../../../reducers/EventOptions'
import Condition from '../Conditions/indexTier'
import uuid from 'react-uuid'
import { Checkbox } from '@material-ui/core';
import './css/tierItem.css'
import RuleItem from './RuleItem'
import {sources,ruleInfoCodeSuggest,filterSuggest} from '../Suggest/tierSuggest'
import { tierNameSuggest, prioritySuggest, decisionSuggest } from '../Suggest';
import {getSources} from '../../../api/source'
import fakeAuth from '../../../api/fakeAuth'
import {getConditions} from '../../../api/condition'
import RuleList from '../../../components/RulesManagement'
import { Select } from 'antd'
import NewTierForm from '../../../components/row/NewTierForm'
import NewRuleForm from '../../../components/row/NewRuleForm'
import {dynamicSort} from './ProfileItem'

const { Option } = Select;

const iconStyle = {
  "margin-right":"5px"
}


const decisionCode = {
    '-1':'REJECT',
    '0':'CHALLENGE',
    '1':'APPROVE',
    '2':'BYPASS'
}

const getDecisionFromCode = (code)=>{
    return decisionCode[code.toString()]
}


class TierItem extends React.Component{
    constructor(props){
        super(props);
        this.state={
            collapse:false,
            modal:false,
            name:'',
            infoCode:'',
            filter:'',
            listRules:props.tierData.listRules,
            tierData:props.tierData,
            sourceType:'',
            listSource:[],
            sourceChoose:[],
            maintenanceStart:'',
            maintenanceEnd:'',
            timeInterval:'',
            ruleConditions:[],
            cbxName:props.tierData.name,
            cbxPriority:props.tierData.priority,
            cbxDecision:props.tierData.code,
            cbxFilter:props.tierData.filter,
            modalEditTier:false,
            modalAddRule:false,
            modeAddRule:'Add new',
        }
    }

    toggleAddRule=()=>{
        this.setState({
          modalAddRule:!this.state.modalAddRule
        })
      }
      renderModeAddNewRule=()=>{
        return(
          <React.Fragment>
            <hr></hr>
            <NewRuleForm></NewRuleForm>
          </React.Fragment>
        )
      }

      renderModeAddAvailableRule=()=>{
        localStorage.removeItem("addRule")
        return(
          <Row>
            <Col md={12}>
              <br></br>
              <RuleList mode={'choose'}></RuleList>
            </Col>
          </Row>
        )
      }
    
      handleChangeModeAddRule=(input)=>{
        this.setState({
          modeAddRule:input
        })
      }
  
  

    toggle=()=>{
        this.setState({
            collapse:!this.state.collapse,

        })
    }

    toggleDelete=()=>{
        this.props.setDelTier({...this.props.tier,profileId:this.props.profileId})
    }


    componentWillReceiveProps = (nextProps)=>{
        let delRule = nextProps.delRule;

        if (Object.keys(delRule).length !== 0){
            if (delRule.tierId === this.props.tier.id){
                let listRules = JSON.parse(JSON.stringify(this.state.listRules));
                let filtered = listRules.filter(
                function(value)
                {
                    return !(value.id === delRule.id)}
                );

                //update currentEvent
                let listProfiles = this.props.currentEvent.data.find(domain=>domain.name===this.props.domain).listProfiles;
                listProfiles = listProfiles?listProfiles:[];
                listProfiles.map(ele=>{
                    if (ele.id === this.props.profileId){
                    ele.listTiers.map(eleTier=>{
                        if (eleTier.id === this.props.tier.id){
                            eleTier.listRules = filtered
                        }
                    })
                    }
                })
                this.props.setCurrentEvent({
                    ...this.props.currentEvent,
                    listProfiles:{
                    ...this.props.currentEvent.listProfiles,
                    [this.props.domain]:listProfiles,
                    }
                });

                this.setState({
                listRules:filtered
                })
                this.props.setDelRule({});
            }
        }

        let editRule = nextProps.editRule;
        if (Object.keys(editRule).length>0){
            let currentEvent = this.props.currentEvent;
            let listRules = this.state.listRules;
            listRules.map(ele=>{
            if (ele.id===editRule.id){
                ele.infoCode=editRule.infoCode;
                ele.filter=editRule.filter;
                ele.ruleConditions=editRule.ruleConditions;
                ele.sourceChoose=editRule.sourceChoose;
                ele.sourceType=editRule.sourceType;
                ele.maintenanceStart= editRule.maintenanceStart;
                ele.maintenanceEnd=editRule.maintenanceEnd;
                ele.timeInterval=editRule.timeInterval;
                if (ele.conditions) delete ele.conditions
            }
            })
            let listProfiles = this.props.currentEvent.data.find(domain=>domain.name === this.props.domain).listProfiles
            listProfiles.map(profile=>{
            if (profile.id===this.props.profileId){
                profile.listTiers.map(tier=>{
                    if (tier.id===this.props.tier.id){
                        tier.listRules=listRules
                    }
                })
            }
            })
            currentEvent={
            ...currentEvent,
            listProfiles:{
                ...currentEvent.listProfiles,
                [this.props.domain]:listProfiles
            }
            }


            this.props.setEditRule({})
            this.props.setCurrentEvent(currentEvent)
        }




      this.setState({
        name: nextProps.comboBox["cbx-rule-name"]?nextProps.comboBox["cbx-rule-name"]:this.state.name,
        infoCode: nextProps.comboBox["cbx-info-code"]?nextProps.comboBox["cbx-info-code"]:this.state.infoCode,
        filter: nextProps.comboBox["cbx-rule-filter"]?nextProps.comboBox["cbx-rule-filter"]:this.state.filter,
        ruleConditions:nextProps.ruleConditions,
        status:nextProps.ruleStatus,
        cbxName:nextProps.comboBox["cbx-edit-tier-name"],
        cbxPriority:nextProps.comboBox["cbx-edit-tier-priority"],
        cbxDecision:nextProps.comboBox["cbx-edit-tier-decision"],
        cbxFilter:nextProps.comboBox["cbx-edit-tier-filter"],
      })
    }

    toggleModal = ()=>{
        this.setState({
            modal:!this.state.modal,
        })
    //   let listRules = this.state.listRules
    //   listRules.push({infoCode: "test",filter:"test"})
    //   this.setState({
    //     listRules:listRules
    //   })

    //   this.props.setCurrentEvent({...this.props.currentEvent,listProfiles:{...this.props.currentEvent.listProfiles,[this.props.domain]:listProfiles}});
    }


    handleChangeSourceType=(e)=>{
        let sourceType= e.target.value
        let listSource = []
        sources.map(ele=>{
            if (ele.sourceType === sourceType){
                listSource = ele.listSource
            }
        })
        getSources(fakeAuth.getAccessToken(), 0, 100).then(res => {
            let data =[];
            let result = [];
            if (res.data && res.data.list){
                data = res.data.list;
                data.map(ele=>{
                  if (ele.dataSource.type===sourceType){
                    let a ={};
                    a = ele.dataSource;
                    a.sourceType = ele.type;
                    result.push(a)
                  }
                })
                this.setState({
                    sourceType:sourceType,
                    listSource:result
                })
            }
        })
    }

    handleAddRule = async ()=>{
      if (this.state.modeAddRule==='Add available'){
        let rules = localStorage.getItem("addRule");
        rules = rules?JSON.parse(rules):[]
        let event = this.props.currentEvent;
        let conditionAPI = await getConditions(fakeAuth.getAccessToken(),0,1000)
        let allConditionForRule = conditionAPI.data.list.filter(con=>con.conditionType==='rule')
        for (let i=0;i<rules.length;i++){
          rules[i].ruleConditions= allConditionForRule.filter(con=>con.conditionTypeId===rules[i].latestVersion.id.toString())
          event.data.find(ele=>ele.name===this.props.domain)
          .listProfiles.find(profile=>profile.id.toString()===this.props.profileId.toString())
          .listTiers.find(tier=>tier.id.toString()===this.props.tierData.id.toString())
          .listRules.push(rules[i])
        }

        this.props.setCurrentEvent(event)
        this.setState({
          modalAddRule:false
        })
      }else if (this.state.modeAddRule==='Add new'){
        let newRule = localStorage.getItem("newRule")
        newRule = newRule?JSON.parse(newRule):{};
        if (Object.keys(newRule).length>0 && newRule.mode==='new'){
          let event = this.props.currentEvent;
          let rule = {}
          rule.id = newRule.id
          rule.name = newRule.name
          rule.mode = newRule.mode
          rule.status = newRule.status
          rule.infoCode = newRule.infoCodeSuggest.find(ele=>ele.id.toString()===newRule.infoCode.toString())
          rule.latestVersion = newRule.latestVersion
          rule.ruleConditions = newRule.ruleConditions
          if (!newRule.latestVersion.id){
            rule.latestVersion.id = "new"+uuid()
          }
          if (!newRule.latestVersion.ruleCatch){
            rule.latestVersion.ruleCatch = "AND"
          }
          if (!newRule.latestVersion.interval){
            rule.latestVersion.interval = "{\"windowUnit\":\"forever\"}"
          }
          if (!newRule.latestVersion.maintenanceStart){
            rule.latestVersion.maintenanceStart = 0
          }
          if (!newRule.latestVersion.maintenanceEnd){
            rule.latestVersion.maintenanceEnd = 0
          }

          event.data.find(ele=>ele.name===this.props.domain)
          .listProfiles.find(profile=>profile.id.toString()===this.props.profileId.toString())
          .listTiers.find(tier=>tier.id.toString()===this.props.tierData.id.toString())
          .listRules.push(rule)

          this.props.setCurrentEvent(event)
          this.setState({modalAddRule:false})
          localStorage.removeItem("newRule")
        }
      }
    }


    handleClickRow=(ele,index)=>{
        this.state.listSource[index].isChoose = this.state.listSource[index].isChoose?(!this.state.listSource[index].isChoose):true;
        let listSource = JSON.parse(JSON.stringify(this.state.listSource))
        let sourceChose = [];
        listSource.map(ele=>{
            if (ele.isChoose===true){
                sourceChose.push(ele)
            }
        })
        this.setState({listSource:this.state.listSource,sourceChoose:sourceChose})
    }

    handleChangeTimeInterval=(e)=>{
        this.setState({
            timeInterval:e.target.value 
        })
    }

    handleChangeMaintenanceStart=(e)=>{
        this.setState({
            maintenanceStart:e.target.value 
        })
    }

    handleChangeMaintenanceEnd=(e)=>{
        this.setState({
            maintenanceEnd:e.target.value 
        })
    }

    toggleEditTier=()=>{
        this.setState({
            modalEditTier:!this.state.modalEditTier,
        })
    }

    handleSaveEdit=()=>{
      let newTier = localStorage.getItem("newTier")
      newTier = newTier?JSON.parse(localStorage.getItem("newTier")):{};
      if (Object.keys(newTier).length>0 && newTier.mode==='edit'){
        let event = this.props.currentEvent;
        event.data.find(ele=>ele.name===this.props.domain).listProfiles.map(profile=>{
          if (profile.id.toString()===this.props.profileId.toString()){
            profile.listTiers.map(tier=>{
              if (tier.id.toString()===this.props.tierData.id.toString()){
                tier.name = newTier.name;
                tier.mode = newTier.mode;
                tier.priority = parseInt(newTier.priority);
                tier.filter = newTier.filter;
                tier.code = parseInt(newTier.code);
                tier.decisionType = newTier.decisionType;
              }
            })
          }
        })
        this.props.setCurrentEvent(event)
        this.setState({modalEditTier:false})
        localStorage.removeItem("newTier")
      }
    }

    render(){
       
        return (
            <Row className="align-items-center animated fadeIn" key={this.props.key}>
                <Col md={12}>
                <Card>
                          <CardHeader className="text-success myBtn" onClick={this.toggle}>
                            <span style={{color: '#bb3b0e'}}>
                            <span 
                            className={this.props.mode==='edit'?"title":''}
                            onClick={this.props.mode==='edit'?this.toggleEditTier:''}>
                            <strong>Tier[{this.state.tierData.priority}]: </strong>{this.state.tierData.name} &mdash; <strong>Decision: </strong>{getDecisionFromCode(this.state.tierData.code)} &mdash; <strong>Filter: </strong>{this.state.tierData.filter} &mdash; <strong>Decision type: </strong>{this.state.tierData.decisionType} &mdash; <strong>Conditions: </strong> </span><Condition key="cdt-tier" type = "cdt-tier" domain = {this.props.domain} profileId={this.props.profileId} profile={this.props.profile} filter={this.props.profileFilter} mode={this.props.mode} tier={this.props.tier} tierData={this.state.tierData}/>

                            <div className="card-header-actions">
                              {/*eslint-disable-next-line*/}
                              <a className="card-header-action btn btn-minimize" data-target={`#collapseDomain${this.props.key}`} onClick={this.toggle}><i className={this.state.collapse===true?"icon-arrow-up":"icon-arrow-down"}></i></a>
                              {/*eslint-disable-next-line*/}
                              {this.props.mode==='view'?<span></span>:
                                <a className="card-header-action btn btn-close" onClick={this.toggleDelete}><i className="icon-close"></i></a>
                              }
                            </div>
                            </span>
                            <Modal isOpen={this.state.modalEditTier} toggle={this.toggleEditTier}>
                              <ModalHeader toggle={this.toggleEditTier}>
                              Edit tier ID: {this.state.tierData.id}
                              </ModalHeader>
                              <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                              <NewTierForm mode="edit" tierData={this.state.tierData}></NewTierForm>
                              </ModalBody>
                              <ModalFooter>
                                <Button color="secondary" onClick={this.toggleEditTier}>Cancel</Button>
                                <Button color="primary" onClick={this.handleSaveEdit}>Save</Button>
                              </ModalFooter>
                            </Modal>
                          </CardHeader>
                          <Collapse isOpen={this.state.collapse} id={`#collapseDomain${this.props.key}`}>
                            <CardBody>
                            {this.props.mode==='view'?<div></div>:
                              <Row className="mb-3 align-items-center">
                              <Col md={2}>
                              <Button size="md" className="mt-2 p-2" color="primary" outline onClick={this.toggleAddRule}>Add rule</Button>
                              </Col>
                              <Modal size="xl" isOpen={this.state.modalAddRule} toggle={this.toggleAddRule}>
                                <ModalHeader>
                                  Add rule for tier ID: {this.state.tierData.id} - {this.state.tierData.name}
                                </ModalHeader>
                                <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                                    <Row>
                                    <Col md={3}>
                                      <Select
                                          style={{ width: '100%' }}
                                          value={this.state.modeAddRule}
                                          onChange={this.handleChangeModeAddRule}
                                        >
                                        {['Add new'].map(ele=>(
                                          <Option value={ele}>{ele}</Option>
                                        ))}
                                      </Select>
                                      </Col>
                                    </Row>
                                    {this.state.modeAddRule==='Add new'?this.renderModeAddNewRule():
                                    this.state.modeAddRule==='Add available'?this.renderModeAddAvailableRule():<Row></Row>}
                                </ModalBody>
                                <ModalFooter>
                                <Row className="mb-3">
                              <Col>
                                  <Button color="primary" className="float-right" onClick = {this.handleAddRule}>
                                    Add
                                  </Button>
                                  <Button onClick={this.toggleAddRule} className="float-right" style={iconStyle} color="secondary">
                                    Cancel
                                  </Button>
                                  </Col>
                                  </Row>
                                </ModalFooter>
                              </Modal>
                              </Row>}
                            {this.state.listRules?this.state.listRules.map((rule,index)=>(
                                <RuleItem key={rule.id} mode={this.props.mode} rule={rule} tierId={this.props.tier.id} domain = {this.props.domain} profile={this.props.profile} profileId={this.props.profileId} filter={this.props.profileFilter} ></RuleItem>
                              )):<span></span>}
                              <Modal size='lg' isOpen={this.state.modal} toggle={this.toggleModal}>
                                    <ModalHeader toggle={this.toggleModal}>
                                    <span style={{color: 'purple'}}>
                                    <strong>Rule:</strong> {this.state.name} &mdash; <strong>InfoCode: </strong>{this.state.infoCode} &mdash; <strong>Filter: </strong>{this.state.filter}
                                    </span>
                                    </ModalHeader>
                                    <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                                        <Row>
                                            <Col md={3}>
                                            <Label >Source type</Label>
                                            <Input type="select" id="select-source-type" onChange = {this.handleChangeSourceType} value={this.state.sourceType}>
                                            <option value="-1">--Select--</option>
                                                {sources.map(ele=>(
                                                    <option value={ele.sourceType}>{ele.sourceType}</option>
                                                )
                                                )}
                                            </Input>
                                            </Col>

                                            <Col md={9}>
                                            <Label >List sources</Label>
                                            <Table responsive hover>
                                            <thead>
                                                <tr>
                                                {this.state.listSource!==undefined?Object.keys(this.state.listSource).length>0?
                                                Object.keys(this.state.listSource[0]).map(ele=>{
                                                    if (ele!=='isChoose'){
                                                        return (<th scope="col">{ele}</th>)
                                                    }
                                                }):<th></th>
                                                :<th></th>}
                                                </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.listSource !== undefined ? this.state.listSource.map((ele,index)=>(
                                                <tr key={index} className={ele.isChoose===true?'isChoose':'isNotChoose'} onClick={(e)=>{this.handleClickRow(ele,index)}}
                                                
                                                >
                                                {Object.keys(ele).length>0?Object.keys(ele).map(field=>{
                                                    if (field!=='isChoose'){
                                                        return (<td scope="row">
                                                        {ele[field].toString()}
                                                        </td>)
                                                    }
                                                }):<th></th>}
                                                </tr>
                                            )):<tr></tr>}
                                            </tbody>
                                        </Table>
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col md={6}>
                                            <Label >Maintenance start</Label>
                                            <Input type="datetime-local" value={this.state.maintenanceStart} onChange={this.handleChangeMaintenanceStart}>
                                                        
                                            </Input>
                                            </Col>
                                            <Col md={6}>
                                            <Label >Maintenance end</Label>
                                            <Input type="datetime-local" value={this.state.maintenanceEnd} onChange={this.handleChangeMaintenanceEnd}>
                                                        
                                            </Input>
                                            </Col>
                                        </Row>
                                        <hr></hr>
                                        <Row>
                                            <Col md={6}>
                                            <Label >Condition</Label>
                                            <div><Condition key="cdt-rule" type = "cdt-rule" domain = {this.props.domain} profile={this.props.profile} filter={this.props.profileFilter}></Condition></div>
                                            </Col>
                                            <Col md={6}>
                                            <Label >Interval</Label>
                                            <Input type="text" value={this.state.timeInterval} onChange={this.handleChangeTimeInterval}>
                                                        
                                            </Input>
                                            </Col>
                                        </Row>
                                    </ModalBody>
                                    <ModalFooter>
                                    <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>

                                    <Button color="primary" onClick={this.handleAddRule}>Add</Button>
                                    </ModalFooter>
                                </Modal>
                            </CardBody>
                          </Collapse>
                        </Card>
                </Col>
            </Row>
        )
    }
}

const mapStateToProps = state => ({
    comboBox: state.EventOptions.comboBoxTier,
    currentEvent: state.EventOptions.currentEvent,
    ruleConditions: state.EventOptions.ruleConditions,
    delRule:state.EventOptions.delRule,
    ruleStatus:state.EventOptions.ruleStatus,
    editRule:state.EventOptions.editRule,
  });
  const mapDispatchToProps = dispatch => ({
      setDelTier:data=>dispatch(setDelTier(data)),
      setDelRule:data=>dispatch(setDelRule(data)),
      setCurrentEvent:data=>dispatch(setCurrentEvent(data)),
      setEditTier:data=>dispatch(setEditTier(data)),
      setEditRule:data=>dispatch(setEditRule(data)),
  });


export default connect(mapStateToProps, mapDispatchToProps)(TierItem);