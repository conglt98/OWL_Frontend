import React from 'react'

import {
Card,
CardHeader,
Collapse,
CardBody,
Button,
Modal,
ModalHeader,
ModalBody,
ModalFooter,
Row,
Col,
Label,
Input,
Table,
FormGroup,
UncontrolledTooltip,
}from 'reactstrap'

import {connect} from 'react-redux';

import {setEditRule,setDelRule,setCurrentEvent} from '../../../reducers/EventOptions'

import {AppSwitch} from '@coreui/react'

import {sources, versionRuleSuggest} from '../Suggest/tierSuggest'

import Condition from '../Conditions/indexTier'

import ComboBox from '../ComboBox'

import {ruleInfoCodeSuggest,filterSuggest} from '../Suggest/tierSuggest'

import {getSources} from '../../../api/source'
import fakeAuth from '../../../api/fakeAuth'
import {Link} from 'react-router-dom'
import NewRuleForm from '../../../components/row/NewRuleForm';
import moment from 'moment'
import uuid from 'react-uuid'
const displayCondition = (condition)=>{
    return condition.operation === "compare"||!condition.operation ?
    condition.field +" "+condition.operator+" "+condition.value:
    condition.operation+'('+condition.field+') '+condition.operator+' '+condition.value;
}

const iconStyle={
    'margin-right': '5px'
}

const sourceTypeCode={
    '0':'[0] INTERNAL',
    '1':'[1] REQUEST',
    '2':'[2] HTTP',
    '3':'[3] GRPC',
    '4':'[4] REDIS',
    '5':'[5] MYSQL',
    '6':'[6] MONGODB'
}
const getSourceTypeFromCode=(code)=>{
    return sourceTypeCode[code.toString()]
}

class RuleItem extends React.Component{
    constructor(props){
        super(props);
        let conditionData = props.rule;
        conditionData.conditions = conditionData.ruleConditions;

        let sourceType = props.rule.sourceType;
        let listSource = [];
        let sourceChoose = props.rule.sourceChoose
        if (sourceType){
            sources.map(ele=>{
                if (ele.sourceType === sourceType){
                    listSource = ele.listSource
                }
            })
        }
        listSource.map(ele1=>{
            sourceChoose.map(ele2=>{
                if (ele1.id===ele2.id){
                    ele1.isChoose=true;
                }
            })
        })

        this.state={
            collapse:false,
            status:props.rule.status,
            modalEditRule:false,
            conditionData:conditionData,
            rule:props.rule,
            sourceType:props.rule.sourceType,
            listSource:listSource,
            sourceChoose:sourceChoose,
            infoCode:props.rule.infoCode,
            filter:props.rule.filter,
            version:props.rule.version,
            maintenanceStart:props.rule.maintenanceStart,
            maintenanceEnd:props.rule.maintenanceEnd,
            timeInterval:props.rule.timeInterval,
        }
    }

    toggle=()=>{
        this.setState({
            collapse:!this.state.collapse
        })
    }

    toggleDelete=()=>{
        this.props.setDelRule({...this.props.rule,tierId:this.props.tierId})
    }

    handleChangeStatus=(e)=>{
        this.setState({
          status:e.target.checked===true?1:0
        })
        let status = e.target.checked===true?1:0;
        let rule = this.props.rule;
        rule.status=status
    }

    getStatus = (status) => {
        return status === 1
          ? true
          : false
      }

      toggleEditRule=()=>{
        this.setState({
            modalEditRule:!this.state.modalEditRule,
        })
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

    componentWillReceiveProps=(nextProps)=>{
        this.setState({modalEditRule:false})
    }

    handleSaveEdit=()=>{
        let newRule = localStorage.getItem("newRule")
        newRule = newRule?JSON.parse(localStorage.getItem("newRule")):{};
        if (Object.keys(newRule).length>0 && newRule.mode==='edit'){
          let event = this.props.currentEvent;
          event.data.find(ele=>ele.name===this.props.domain).listProfiles.map(profile=>{
            if (profile.id.toString()===this.props.profileId.toString()){
              profile.listTiers.map(tier=>{
                if (tier.id.toString()===this.props.tierId.toString()){
                  tier.listRules.map(rule=>{
                    if (rule.id.toString()===this.props.rule.id.toString()){
                        rule.name = newRule.name
                        rule.mode = newRule.mode
                        rule.status = newRule.status
                        rule.infoCode = newRule.infoCodeSuggest.find(ele=>ele.id.toString()===newRule.infoCode.toString())
                        rule.latestVersion = newRule.latestVersion
                        rule.ruleConditions = newRule.ruleConditions
                        if (!newRule.latestVersion.id){
                            rule.latestVersion.id = "new"+uuid()
                        }
                    }
                  })
                }
              })
            }
          })
          this.props.setCurrentEvent({...event})
          this.setState({modalEditRule:false})
          localStorage.removeItem("newRule")
        }
      }

    render(){
        return(
            <Card>
                <CardHeader className="myBtn" onClick={this.toggle}>
                <span style={{color: 'purple'}}>
                <span    className={this.props.mode==='edit'?"title":''}
                            onClick={this.props.mode==='edit'?this.toggleEditRule:''}>
                <strong>Rule:</strong> {this.state.rule.name?this.state.rule.name:"no name"} 
                {/* <strong>Filter: </strong>{this.state.rule.filter?this.state.rule.filter:"None"}  */}
                </span>
                <div className="card-header-actions">
                &nbsp; 
                {/*eslint-disable-next-line*/}
                <a className="card-header-action btn btn-minimize" data-target={`#collapseDomain${this.props.key}`} onClick={this.toggle}><i className={this.state.collapse===true?"icon-arrow-up":"icon-arrow-down"}></i></a>
                &nbsp;
                {/*eslint-disable-next-line*/}
                {this.props.mode==='view'?<span></span>:
                   <a className="card-header-action btn btn-close" onClick={this.toggleDelete}><i className="icon-close"></i></a>
                }
                </div>
                </span>
                &nbsp;
                <AppSwitch
                              variant={'pill'}
                              className='float-right mr-2'
                              label
                              color={'success'}
                              onChange={this.handleChangeStatus}
                              checked={this.getStatus(this.state.status)}
                              size={'sm'}/>
                </CardHeader>
                <Collapse isOpen={this.state.collapse} id={`#collapseDomain${this.props.key}`}>
                <CardHeader>
                    {/* {rule.sourceType} - {JSON.stringify(rule.sourceChoose)} - {rule.timeInterval}
                    - {rule.maintenanceStart} - {rule.maintenanceEnd}
                    - {JSON.stringify(rule.ruleConditions)} */}
                    {/* <div><b>ID: </b> {this.state.rule.id}</div> */}
                    <div><strong>ID: </strong><Link to={'/rules/'+this.state.rule.id}>{this.state.rule.id}</Link></div>
                    <div><strong>CreatedAt: </strong>{moment(this.state.rule.createAt).format('DD-MM-YYYY HH:mm:ss')}</div>
                    
                    <div><strong>InfoCode: </strong>[{this.state.rule.infoCode.id}] {this.state.rule.infoCode.message} &mdash; {this.state.rule.infoCode.description}</div>
                    <div><strong>Action: </strong>{this.state.rule.infoCode.action?this.state.rule.infoCode.action.toString():'None'}</div>
                    <div><b>Rule version ID: </b> <Link to={'/ruleVersions/'+this.state.rule.latestVersion.id}>{this.state.rule.latestVersion.id}</Link></div>

                    {/* <div>&mdash; Source type: <span id="sourceTypeHelp" style ={{color:"#63c2de"}}>{getSourceTypeFromCode(this.state.rule.latestVersion.sourceType)}</span></div>
                    <UncontrolledTooltip size="lg" placement="right" target="sourceTypeHelp">
                      <div style={{textAlign:"left"}}>
                      0: INTERNAL<br></br>
                      1: REQUEST<br></br>
                      2: HTTP <br></br>
                      3: GRPC <br></br>
                      4: REDIS <br></br>
                      5: MYSQL <br></br>
                      6: MONGODB<br></br>
                      </div>
                    </UncontrolledTooltip> */}
                     <div>&mdash; CreatedAt:  {moment(this.state.rule.latestVersion.createAt).format('DD-MM-YYYY HH:mm:ss')}</div>

                    <div>&mdash; Source ID:  <Link to={'/sources/'+this.state.rule.latestVersion.sourceId}>{this.state.rule.latestVersion.sourceId.toString()}</Link></div>
                    {/* <div>&mdash; Mapping:  {this.state.rule.latestVersion.mapping}</div> */}
                    <div>&mdash; RuleCatch:  {this.state.rule.latestVersion.ruleCatch}</div>
                    <div>&mdash; Interval:  {this.state.rule.latestVersion.interval?(JSON.parse(this.state.rule.latestVersion.interval).windowTime?JSON.parse(this.state.rule.latestVersion.interval).windowTime:"")+" "+JSON.parse(this.state.rule.latestVersion.interval).windowUnit:"NONE"}</div>
                    <div>&mdash; MaintenanceStart:  {moment(this.state.rule.latestVersion.maintenanceStart).format('DD-MM-YYYY HH:mm:ss')}</div>
                    <div>&mdash; MaintenanceEnd:  {moment(this.state.rule.latestVersion.maintenanceEnd).format('DD-MM-YYYY HH:mm:ss')}</div>




                    {this.state.rule.sourceChoose?this.state.rule.sourceChoose.map(ele=>{
                        return(
                            <div>
                            <b>Name: </b>{ele.name} - <b>Type: </b>{ele.type} - <b>ServerAddress: </b>{ele.serverAddress} - <b>Method: </b>{ele.method} - <b>Timeout: </b>{ele.timeoutMs}ms

                        </div>
                        )
                    }):<span></span>}
                    {this.state.rule.mapping?<div><b>Mapping: </b>{this.state.rule.mapping}</div>:<span></span>}
                    {this.state.rule.ruleCatch?<div><b>Rule catch: </b>{this.state.rule.ruleCatch}</div>:<span></span>}

                    {this.state.rule.maintenanceStart?<div><b>Maintenance start: </b>{this.state.rule.maintenanceStart}</div>:<span></span>}
                    {this.state.rule.maintenanceEnd?<div><b>Maintenance end: </b>{this.state.rule.maintenanceEnd}</div>:<span></span>}
                    {this.state.rule.timeInterval?<div><b>Time interval: </b>{this.state.rule.timeInterval}</div>:<span></span>}

                <div>&mdash; Conditions: <Condition ruleConditions={this.state.rule.ruleConditions} key="cdt-rule" type = "cdt-rule" tierData={this.state.rule} mode={this.props.mode} domain = {this.props.domain} profile={this.props.profile} profileId={this.props.profileId} tierId={this.props.tierId} filter={this.props.profileFilter}></Condition>
                </div>
                </CardHeader>
                </Collapse>
                <Modal size="lg" isOpen={this.state.modalEditRule} toggle={this.toggleEditRule}>
                    <ModalHeader toggle={this.toggleEditRule}>
                    Edit rule ID: {this.state.rule.id}
                    </ModalHeader>
                    <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                    <NewRuleForm mode="edit" ruleData={this.state.rule}></NewRuleForm>
                    </ModalBody>
                    <ModalFooter>
                    <Button color="secondary" onClick={this.toggleEditRule}>Cancel</Button>
                    <Button color="primary" onClick={this.handleSaveEdit}>OK</Button>
                    </ModalFooter>
                </Modal>
            </Card>
        )
    }
}

const mapStateToProps = state => ({
    ruleConditions:state.EventOptions.ruleConditions,
    comboBox:state.EventOptions.comboBoxTier,
    currentEvent:state.EventOptions.currentEvent,
  });
  const mapDispatchToProps = dispatch => ({
      setDelRule:data=>dispatch(setDelRule(data)),
      setEditRule:data=>dispatch(setEditRule(data)),
      setCurrentEvent:data=>dispatch(setCurrentEvent(data)),


  });


export default connect(mapStateToProps, mapDispatchToProps)(RuleItem);