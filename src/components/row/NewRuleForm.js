import React, {Component} from 'react';
import {
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
  ModalFooter,
  Table
} from 'reactstrap';
import {AppSwitch} from '@coreui/react'
import {eventTypes} from '../../views/Events/Suggest/index'
import moment from 'moment'
import {connect} from 'react-redux'
import {setAddDomain} from '../../reducers/EventOptions'
import {getInfoCodes} from '../../api/info-code'
import {getSources} from '../../api/source'
import fakeAuth from '../../api/fakeAuth'
import {getRuleVersions} from '../../api/ruleVersion'
import {getConditions} from '../../api/condition'
import uuid from 'react-uuid'
import { Select, DatePicker, Input as AntInput } from 'antd'
const { Option } = Select;

const displayCondition = (condition)=>{
  return condition.field +" "+condition.operator+" "+condition.value
}

const getSourceType={
  0:'INTERNAL',
  1:'REQUEST',
  2:'HTTP',
  3:'GRPC',
  4:'REDIS',
  5:'MYSQL',
  6:'MONGODB'
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

class NewForm extends React.Component {
    constructor(props){
      super(props);
      let ruleId = "new"+uuid()
      let latestVersion = {
        ruleId: props.ruleData?props.ruleData.id:ruleId,
        sourceId:"",
        mapping:"",
        ruleCatch:"",
        interval:"",
        maintenanceStart:0,
        maintenanceEnd:0,
    }
     
      this.state = {
        id:props.ruleData?props.ruleData.id:ruleId,
        name:props.ruleData?props.ruleData.name:'',
        status:props.ruleData?props.ruleData.status:1,
        filter:props.ruleData?props.ruleData.filter:'None',
        infoCode:props.ruleData?props.ruleData.infoCode.id:1,
        latestVersion:props.ruleData?props.ruleData.latestVersion:latestVersion,
        latestVersionMaster:props.ruleData?props.ruleData.latestVersion:latestVersion,
        mode:props.mode,
        infoCodeSuggest:[],
        modalChangeRuleVersion:false,
        ruleVersions:[],
        allConditions:props.ruleData?props.ruleData.ruleConditions:[],
        ruleConditions:props.ruleData?props.ruleData.ruleConditions:[],
        ruleConditionsMaster:props.ruleData?props.ruleData.ruleConditions:[],
        versionIdGen:'new'+uuid(),
        sourcesSuggest:[],
        disabledWindowTime:false
      }
      localStorage.removeItem("newRule")
    }

    handleClickNewVersion=()=>{
      let latestVersion = JSON.parse(JSON.stringify(this.state.latestVersion));
      delete latestVersion.id
      delete latestVersion.createAt
      let rule = {
        ...this.state,
        latestVersion:latestVersion
      }
      this.setState(rule)
      localStorage.setItem("newRule",JSON.stringify(rule))
    }

    componentWillMount=async()=>{
        const infoCodeAPI = await getInfoCodes(fakeAuth.getAccessToken(),0,1000);
        const sourceAPI = await getSources(fakeAuth.getAccessToken(),0,1000)
        const conditionAPI = await getConditions(fakeAuth.getAccessToken(),0,1000);
    
        const infoCodes = infoCodeAPI.data.list;
        const sources = sourceAPI.data.list;
        let allConditionsForRule = conditionAPI.data;
        allConditionsForRule = allConditionsForRule.list?allConditionsForRule.list.filter(ele=>ele.conditionType==="rule"):[]
        let ruleVersions = []
        let allUsedConditions = []
        if (this.props.ruleData){
          const ruleVersionsAPI = await getRuleVersions(fakeAuth.getAccessToken(),0,1000);
          ruleVersions = ruleVersionsAPI.data&&ruleVersionsAPI.data.list?ruleVersionsAPI.data.list:[];
          ruleVersions = ruleVersions.filter(ele=>ele.ruleId.toString()===this.props.ruleData.id.toString())
          ruleVersions.map(ruleVersion=>{
            allConditionsForRule.map(conditionForRule=>{
              if (String(conditionForRule.conditionTypeId)===String(ruleVersion.id)){
                allUsedConditions.push(conditionForRule)
              }
            })
          })
        }
        this.setState({
            infoCodeSuggest:infoCodes,
            ruleVersions:ruleVersions,
            allConditions: allUsedConditions,
            sourcesSuggest:sources
        })
    }


    handleChangeFilter=(e)=>{
      let value =  e
      let profile = {
        ...this.state,
        mode:this.props.mode,
        filter:value
      }
      if (this.props.mode==='edit'){
        profile={
          ...profile,
          mode:this.props.mode,
        }
      }
      localStorage.setItem("newRule",JSON.stringify(profile))
      this.setState(profile)
      this.setState({
        filter:e
      })
    }

    onChange=(e)=>{
      let value = ''
      if (e.target.id==='status'){
        value=e.target.checked===true?1:0
      }
      else{
        value = e.target.value
      }
      let domain = {
        ...this.state,
        mode:"new",
        [e.target.id]:value
      }
      if (this.props.mode==='edit'){
        domain={
          ...domain,
          mode:this.props.mode,
        }
      }
      localStorage.setItem("newRule",JSON.stringify(domain))
      this.setState(domain)
    }

    getStatus = (status) => {
        return status === 1
          ? true
          : false
    }

    renderTable=(list,allConditions)=>{
        list.sort(dynamicSort('-id'))
        return(
          <div 
          style={{
            maxHeight: 'calc(100vh - 420px)',
            overflowY: 'auto',
            overflowX:'auto',
          }}>
        <Table responsive hover>
            <thead>
                <tr>
                {list!==undefined?Object.keys(list).length>0?
                Object.keys(list[0]).map(ele=>{
                    if (ele==='latestVersion'){
                        return (
                        <>
                        <th scope='row'>
                        latestVersionId
                        </th>
                        {Object.keys(list[0][ele]).map(eleChild=>(
                            <td scope='row'>
                            {eleChild}
                            </td>
                        ))}
                        </>
                        )
                    }
                    else if (ele!=='isChoose'){
                        return (<th scope="col">{ele}</th>)
                    }
                }):<th></th>
                :<th></th>}
                {Object.keys(list).length>0?<th scope='row'>
                      <strong>conditions</strong>
                </th>:<span></span>}
                </tr>
            </thead>
            <tbody>
            {list !== undefined ? list.map((ele,index)=>{
              if (index<3)
              return (
                <tr key={index}
                >
                {Object.keys(ele).length>0?Object.keys(ele).map(field=>{
                    if (field === 'infoCode'){
                        return (<td scope='row'>
                            [{ele[field].id}] {ele[field].message} - {ele[field].description}
                        </td>)
                    }
                    else if (field==='latestVersion'){
                        return (
                        <React.Fragment>
                        <td scope='row'>
                        {/* {ele[field].id} */}
                        <i className="fa fa-arrow-right"></i>
                        </td>
                        {Object.keys(ele[field]).map(eleChild=>{
                            if (eleChild === 'createAt'){
                                return(
                                    <td scope='row' width="20%">
                                    {moment(ele[field][eleChild]).format('DD-MM-YYYY HH:mm:ss')}
                                    </td>
                                )
                            }else{
                               return (
                                <td scope='row'>
                                {ele[field][eleChild]?ele[field][eleChild].toString():"null"}
                                </td>
                               )
                            }
                    })}
                        </React.Fragment>
                        )
                    }
                    else if (field === 'createAt'||field === 'maintenanceStart'||field === 'maintenanceEnd'){
                        return (<td scope="row">
                        {moment(ele[field]).format('DD-MM-YYYY HH:mm:ss')}
                        </td>)
                    }
                    else if (field!=='isChoose'){
                        return (<td scope="row">
                        {ele[field]}
                        </td>)
                    }
                }):<th></th>}
                <td scope="row">
                  {
                    allConditions.filter(con=>con.conditionTypeId.toString()===ele.id.toString())
                    .map(con=>(
                      <Button size="sm" disabled> {displayCondition(con)}</Button>
                    ))
                  }
                </td>
                </tr>
            )
            }):<tr></tr>}
            </tbody>
        </Table></div>)
    }
    handleSelectVersion=(input)=>{
      let ruleVer = this.state.ruleVersions;
      ruleVer = ruleVer.find(ele=>ele.id.toString()===input.toString())
      let conditions = this.state.allConditions.filter(ele=>ele.conditionTypeId.toString()===input.toString())
      let rule = {
        ...this.state,
        latestVersion:ruleVer,
        ruleConditions:conditions,
        mode:this.props.mode
      }
      this.setState(rule)
      localStorage.setItem("newRule",JSON.stringify(rule))
    }

    handleChangeInfoCode=(input)=>{
      let rule = {
        ...this.state,
        infoCode:input,
      }
      this.setState(rule)
      localStorage.setItem("newRule",JSON.stringify(rule))
    }

    toggleChangeRuleVersion=()=>{
      let rule = {
        ...this.state,
        modalChangeRuleVersion:!this.state.modalChangeRuleVersion,
        latestVersion:this.state.latestVersionMaster,
        ruleConditions:this.state.ruleConditionsMaster,
        mode:this.props.mode
      }
      this.setState(rule)
      localStorage.setItem("newRule",JSON.stringify(rule))
    }

    openChangeRuleVersion=()=>{
      this.setState({
        modalChangeRuleVersion:!this.state.modalChangeRuleVersion,
      })
    }
    handleChangeRuleVersion=()=>{
      this.setState({
        modalChangeRuleVersion:false,
      })
    }

    handleChangeSourceId=(input)=>{
      let rule = {
        ...this.state,
        latestVersion:{
          ...this.state.latestVersion,
          id:this.state.versionIdGen,
          sourceId:input,
        }
      }
      this.setState(rule)
      localStorage.setItem("newRule",JSON.stringify(rule))
    }
    handleChangeFieldLatestVersion=(e)=>{

      let rule = {
        ...this.state,
        latestVersion:{
          ...this.state.latestVersion,
          id:this.state.versionIdGen,
          [e.target.id]:e.target.value,
        }
      }
      this.setState(rule)
      localStorage.setItem("newRule",JSON.stringify(rule))
    }
    onOkMaintenanceStart=(e)=>{
      // console.log(e.valueOf())
      let value = e?e.valueOf():moment().valueOf()
      let rule = {
        ...this.state,
        latestVersion:{
          ...this.state.latestVersion,
          id:this.state.versionIdGen,
          maintenanceStart:value,
        }
      }
      this.setState(rule)
      localStorage.setItem("newRule",JSON.stringify(rule))
    }

    handleChangeRuleCatch=(value)=>{
      let rule = {
        ...this.state,
        latestVersion:{
          ...this.state.latestVersion,
          id:this.state.versionIdGen,
          ruleCatch:value,
        }
      }
      this.setState(rule)
      localStorage.setItem("newRule",JSON.stringify(rule))
    }

    onOkMaintenanceEnd=(e)=>{
      // console.log(e.valueOf())
      let value = e?e.valueOf():moment().valueOf()
      let rule = {
        ...this.state,
        latestVersion:{
          ...this.state.latestVersion,
          id:this.state.versionIdGen,
          maintenanceEnd:value,
        },
      }
      this.setState(rule)
      localStorage.setItem("newRule",JSON.stringify(rule))
    }

    handleChangeWindowTime=(e)=>{
      let interval = JSON.parse(this.state.latestVersion.interval)
      let value = {
        ...interval,
        windowTime:parseInt(e.target.value)
      }
      let rule = {
        ...this.state,
        latestVersion:{
          ...this.state.latestVersion,
          id:this.state.versionIdGen,
          interval:JSON.stringify(value),
        }
      }
      this.setState(rule)
      localStorage.setItem("newRule",JSON.stringify(rule))
    }

    handleChangeWindowUnit=(e)=>{

      let interval = this.state.latestVersion.interval?JSON.parse(this.state.latestVersion.interval):{}

      let value = {
        ...interval,
        windowUnit:e
      }
      if (e==='forever'){
        delete value.windowTime
      }
      let rule = {
        ...this.state,
        latestVersion:{
          ...this.state.latestVersion,
          id:this.state.versionIdGen,
          interval:JSON.stringify(value),
        },
        disabledWindowTime:e==='forever'?true:false

      }
      this.setState(rule)
      localStorage.setItem("newRule",JSON.stringify(rule))
    }

  render(){
    let conditionNow = [];
    if (this.state.latestVersion.id){
      conditionNow = this.state.ruleConditions
    }
    return (
        <Row className="justify-content-md-center">
            <Col md={this.props.mode==='edit'?12:8}>
            <Form>
            <FormGroup row>
            <Col md={4}>
            <Label ><b>Name <span id="EventNameHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
            <UncontrolledTooltip placement="right" target="EventNameHelp">
                Rule name
            </UncontrolledTooltip></Col>
            <Col md={8}>
            <Input type="text" id="name" placeholder="Enter rule name..." onChange = {this.onChange} 
             value={this.state.name}
            required/>
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
                id="status"
                onChange={this.onChange}
                checked={this.getStatus(this.state.status)}
                size={'sm'}/>
            </Col>
            </FormGroup>
            
            <FormGroup row>
                    <Col md={4}>
                    <Label ><b>Info code <span id="ClientHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
                    <UncontrolledTooltip placement="right" target="ClientHelp">
                      Info code of rule to return
                    </UncontrolledTooltip>
                    </Col>
                    <Col md={8}>
                    <Select
                        style={{ width: '100%' }}
                        value={this.state.infoCode}
                        showSearch
                        onChange={this.handleChangeInfoCode}
                        placeholder="Select info code"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                      >
                      {this.state.infoCodeSuggest.map(ele=>(
                        <Option value={ele.id}>[{ele.id}] {ele.message} - {ele.description}</Option>
                      ))}
                    </Select>
                    </Col>
                  </FormGroup>

                  <FormGroup row>
                    <Col md={4}>
                    <Label ><b>Action code <span id="ActionHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
                    <UncontrolledTooltip placement="right" target="ActionHelp">
                      Action code of rule to return
                    </UncontrolledTooltip>
                    </Col>
                    <Col md={8}>
                    <Select
                        style={{ width: '100%' }}
                        value={this.state.infoCode}
                        showSearch
                        onChange={this.handleChangeInfoCode}
                        placeholder="Select action code"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                      >
                      {this.state.infoCodeSuggest.map(ele=>(
                        <Option value={ele.id}>[{ele.id}] {ele.message} - {ele.description}</Option>
                      ))}
                    </Select>
                    </Col>
                  </FormGroup>
        </Form>

        <FormGroup row>
                    <Col md={4}>
                    <Label ><b>Latest version <span id="versionHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
                    <UncontrolledTooltip placement="right" target="versionHelp">
                      Latest version of rule 
                    </UncontrolledTooltip>
                    </Col>
                    <Col md={8}>
                    <Button color="primary" onClick={this.openChangeRuleVersion}>
                        Change
                    </Button>
                    <Modal size="xl" isOpen={this.state.modalChangeRuleVersion} toggle={this.toggleChangeRuleVersion}>
                      <ModalHeader>
                        Change rule version of rule ID: {this.props.ruleData?this.props.ruleData.id:""} - {this.state.name}
                      </ModalHeader>
                      <ModalBody>
                      <FormGroup row>
                        <Col md={4}>
                        <Label ><b>All versions <span id="AllVerHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
                        <UncontrolledTooltip placement="right" target="AllVerHelp">
                            All versions
                        </UncontrolledTooltip></Col>
                        <Col md={8}>
                        </Col>
                        </FormGroup>
                          {this.props.ruleData?this.renderTable(this.state.ruleVersions,this.state.allConditions):<div>No old versions</div>}
                          <hr></hr>
                          <FormGroup row>
                          <Col md={4}>
                          <Label ><b>New version <span id="OldVer" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
                          <UncontrolledTooltip placement="right" target="OldVer">
                            Add new version
                          </UncontrolledTooltip>
                          </Col>
                          <Col md={4}>
                          {/* <Select
                              style={{ width: '100%' }}
                              value={this.state.latestVersion?this.state.latestVersion.id:0}
                              showSearch
                              placeholder="Select a version or not"
                              onChange={this.handleSelectVersion}
                            >
                            {this.state.ruleVersions.map(ele=>(
                              <Option value={ele.id}>{ele.id}</Option>
                            ))}
                          </Select> */}
                          </Col>
                          <Col md={4}>
                          {/* <Button color="primary" onClick={this.handleClickNewVersion}>
                              Or create new version
                          </Button> */}
                          </Col>
                        </FormGroup>
                        <Row className="justify-content-center">
                          <Col md={12}>
                          <Table responsive hover striped>
                          <tbody>
                          {this.state.latestVersion?Object.keys(this.state.latestVersion).map(key=>{
                            if (key === 'sourceId'){
                                return (
                                  <tr>
                                    <td>
                                      {key}
                                    </td>
                                    <td>
                                    <Select
                                      style={{ width: '100%' }}
                                      value={this.state.latestVersion[key]}
                                      showSearch
                                      onChange={this.handleChangeSourceId}
                                      placeholder="Select source id"
                                      optionFilterProp="children"
                                      filterOption={(input, option) =>
                                          option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                    {this.state.sourcesSuggest.map(ele=>(
                                      <Option value={ele.id}>[{ele.id}] type: {getSourceType[ele.type]} - dataSource: {JSON.stringify(ele.dataSource)}</Option>
                                    ))}
                                  </Select>
                                    </td>
                                  </tr>
                                )
                            }
                            else if (key==='ruleCatch'){
                              return (<tr>
                                <td>
                                  {key}
                                </td>
                                <td>
                                <Select
                                    style={{width:"20%"}}
                                    value={this.state.latestVersion[key]}
                                    onChange={this.handleChangeRuleCatch}
                                    placeholder="ruleCatch AND/OR"
                                  >
                                  {['AND','OR'].map(ele=>(
                                      <Option value={ele}>{ele}</Option>
                                  ))}
                                </Select>
                                </td>
                              </tr>)
                            }else if (key==='interval'){
                              return (<tr>
                                <td>
                                  {key}
                                </td>
                                <td scope="row">
                                <Select
                                    style={{width:"20%"}}
                                    value={this.state.windowUnit}
                                    onChange={this.handleChangeWindowUnit}
                                    placeholder="Unit"
                                  >
                                  {['forever','month','fixed_month','week','day','fixed_day','hour','minute','second'].map(ele=>(
                                      <Option value={ele}>{ele}</Option>
                                  ))}
                                </Select>
                                <AntInput
                                    style={{width:"20%"}}
                                    type="number"
                                    value={this.state.windowTime}
                                    disabled={this.state.disabledWindowTime}
                                    onChange={this.handleChangeWindowTime}
                                    placeholder="Value"
                                  >
                                </AntInput>
                                </td>
                              </tr>)
                            }
                            else if (key==='maintenanceStart'){
                              return (<tr>
                                <td>
                                  {key}
                                </td>
                                <td>
                                <DatePicker showTime onOk={this.onOkMaintenanceStart} onChange={this.onOkMaintenanceStart} />
                                </td>
                              </tr>)
                            }
                            else if (key==='maintenanceEnd'){
                              return (<tr>
                                <td>
                                  {key}
                                </td>
                                <td>
                                <DatePicker showTime onOk={this.onOkMaintenanceEnd} onChange={this.onOkMaintenanceEnd} />
                                </td>
                              </tr>)
                            }
                            else if (key!=='id'&&key!=='createAt'&&key!=='ruleId')
                            return(
                              <tr>
                                <td>{key}</td>
                            <td><Input type="text" id={key} value={this.state.latestVersion[key]} onChange={this.handleChangeFieldLatestVersion}>
                            </Input></td>
                              </tr>
                            )
                          }):<div>No versions</div>}
                          {this.state.latestVersion&&this.props.mode==='edit'&&this.state.ruleVersions.length>0?
                          <tr>
                            <td>conditions</td>
                           <td>{this.state.ruleConditions.map(con=>(
                             <Button size="sm" disabled> {displayCondition(con)}</Button>
                           ))}</td>
                          </tr>
                          :<span></span>}
                          </tbody>
                        </Table></Col>
                        </Row>
                      </ModalBody>
                      <ModalFooter>
                      <Button color="secondary" onClick={this.toggleChangeRuleVersion}>Cancel</Button>
                      <Button color="primary" onClick={this.handleChangeRuleVersion}>OK</Button>
                      </ModalFooter>
                    </Modal>
                    </Col>
        </FormGroup>
        <Table responsive hover striped>
          <tbody>
          {this.state.latestVersion?
          Object.keys(this.state.latestVersion).map(key=>{
            if (key ==='createAt'||key==='maintenanceStart' || key==='maintenanceEnd'){
              return(
                <tr>
                  <td>{key}</td>
              <td>{moment(this.state.latestVersion[key]).format('DD-MM-YYYY HH:mm:ss')}</td>
                </tr>
              )
            }else
            return(
              <tr>
                <td>{key}</td>
            <td>{this.state.latestVersion[key]}</td>
              </tr>
            )
          }):<div>No versions</div>}
          {this.props.mode==='edit'?<tr>
              <td>conditions</td>
              <td>{this.state.ruleConditions?this.state.ruleConditions.map(con=>(
                <Button size="sm" disabled>{displayCondition(con)}</Button>
              )):"None"}</td>
          </tr>:<span></span>}
          </tbody>
        </Table>
        </Col>
        </Row>

      )
  }
}

const mapStateToProps = state => ({
    addDomain: state.EventOptions.addDomain,
  });
  const mapDispatchToProps = dispatch => ({
    setAddDomain:data=>dispatch(setAddDomain(data)),
  });


export default connect(mapStateToProps, mapDispatchToProps)(NewForm);