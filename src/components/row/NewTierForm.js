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
  ModalFooter
} from 'reactstrap';
import {AppSwitch} from '@coreui/react'
import {eventTypes} from '../../views/Events/Suggest/index'

import {connect} from 'react-redux'
import {setAddDomain} from '../../reducers/EventOptions'
import { Select } from 'antd'
const { Option } = Select;
const decisionCode = {
  '-1':'REJECT',
  '0':'CHALLENGE',
  '1':'APPROVE',
  '2':'BYPASS'
}
class NewForm extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        id:props.tierData?props.tierData.id:'',
        name:props.tierData?props.tierData.name:'',
        priority:props.tierData?props.tierData.priority:'',
        code:props.tierData?props.tierData.code:'',
        filter:props.tierData?props.tierData.filter:'Select filter',
        decisionType:props.tierData?props.tierData.decisionType:'Select decision type',

      }
    }

    handleChangeFilter=(e)=>{
      let value =  e
      let profile = {
        ...this.state,
        mode:"new",
        filter:value
      }
      if (this.props.mode==='edit'){
        profile={
          ...profile,
          mode:"edit",
        }
      }
      localStorage.setItem("newTier",JSON.stringify(profile))
      this.setState(profile)
      this.setState({
        filter:e
      })
    }

    handleChangeDecisionType=(e)=>{
      let value =  e
      let profile = {
        ...this.state,
        mode:"new",
        decisionType:value
      }
      if (this.props.mode==='edit'){
        profile={
          ...profile,
          mode:"edit",
        }
      }
      localStorage.setItem("newTier",JSON.stringify(profile))
      this.setState(profile)
      this.setState({
        decisionType:e
      })
    }

    onChange=(e)=>{
      let value =  e.target.value
      let profile = {
        ...this.state,
        mode:"new",
        [e.target.id]:value
      }
      if (this.props.mode==='edit'){
        profile={
          ...profile,
          mode:"edit",
        }
      }
      localStorage.setItem("newTier",JSON.stringify(profile))
      this.setState(profile)
    }

    getStatus = (status) => {
        return status === 1
          ? true
          : false
      }
    
  render(){
 
    return (
        <Row className="justify-content-md-center">
            <Col md={this.props.mode==='edit'?12:6}>
            <Form>
            <FormGroup row>
            <Col md={4}>
            <Label ><b>Name <span id="EventNameHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
            <UncontrolledTooltip placement="right" target="EventNameHelp">
                Tier name
            </UncontrolledTooltip></Col>
            <Col md={8}>
            <Input type="text" placeholder="Enter tier name..." id="name" onChange = {this.onChange} 
             value={this.state.name}
            required/>
            </Col>
            </FormGroup>

            <FormGroup row>
            <Col md={4}>
            <Label ><b>Priority <span id="priHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
            <UncontrolledTooltip placement="right" target="priHelp">
                Tier priority
            </UncontrolledTooltip></Col>
            <Col md={8}>
            <Input type="number" id="priority" placeholder="Enter number priority..." onChange = {this.onChange} 
             value={this.state.priority}
            required/>
            </Col>
            </FormGroup>

            <FormGroup row>
            <Col md={4}>
            <Label ><b>Code <span id="CodeHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
            <UncontrolledTooltip placement="right" target="CodeHelp">
            <div style={{textAlign:"left"}}>
            -1: REJECT <br></br>
            0: CHALLENGE<br></br>
            1: APPROVE<br></br>
            2: BYPASS
            </div>
            </UncontrolledTooltip></Col>
            <Col md={8}>
            <Input type="select" id="code" placeholder="Enter code decision..." onChange = {this.onChange} 
             value={this.state.code}
            required>
              {Object.keys(decisionCode).map(key=>{
                return (<option value={key}>[{key}] {decisionCode[key]}</option>)
              })}
            </Input>
            </Col>
            </FormGroup>

            <FormGroup row>
            <Col md={4}>
            <Label ><b>Filter <span id="AndOrHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
            <UncontrolledTooltip placement="right" target="AndOrHelp">
                And or filter
            </UncontrolledTooltip></Col>
            <Col md={8}>
            <Select
                style={{ width: '100%' }}
                value={this.state.filter}
                onChange={this.handleChangeFilter}
                id="filter"
                >
                {['AND','OR'].map(ele=>(
                <Option value={ele}>{ele}</Option>
                ))}
            </Select>
            </Col>
            </FormGroup>

            <FormGroup row>
            <Col md={4}>
            <Label ><b>Decision type <span id="DecisionHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
            <UncontrolledTooltip placement="right" target="DecisionHelp">
                Decision type: AND/OR
            </UncontrolledTooltip></Col>
            <Col md={8}>
            <Select
                style={{ width: '100%' }}
                value={this.state.decisionType}
                onChange={this.handleChangeDecisionType}
                id="decisionType"
                >
                {['AND','OR'].map(ele=>(
                <Option value={ele}>{ele}</Option>
                ))}
            </Select>
            </Col>
            </FormGroup>
        </Form>
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