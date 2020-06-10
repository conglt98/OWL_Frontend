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
const dataDefTemplate1 = [
    {
      "name": "A30 Check",
      "source": "ZALO_A30",
      "dataType": "JSON",
      "defs": "[{\"name\": \"userID\",\"type\": \"string\"},{\"name\": \"isA30\",\"type\": \"boolean\"}]",
      "accumulationKeys": [
        {
          "name": "is_a30_key",
          "filter": "[[\"isA30 == false\"]]",
          "keyFormat": "zpi|user_a30_nonactive:#staticCfg(campaign.zpi.a30.month)",
          "cacheType": "SET",
          "elementType": "RAW",
          "elementValue": "${userID}",
          "description": null,
          "expire": -1,
          "active": true
        }
      ]
    }
  ]
const dataDefTemplate= []
class NewForm extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        id:props.domainData?props.domainData.id:'',
        name:props.domainData?props.domainData.name:'',
        sourceId:props.domainData?props.domainData.sourceId:'',
        description:props.domainData?props.domainData.description:'',
        dataDefinitions:props.domainData?JSON.stringify(props.domainData.dataDefinitions,null,2):JSON.stringify(dataDefTemplate,null,2)
      }
      localStorage.removeItem("newDomain")
    }

getStatus = (status) => {
    return status === 1
      ? true
      : false
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
        mode:"edit",
      }
    }
    localStorage.setItem("newDomain",JSON.stringify(domain))
    this.setState(domain)
  }

  render(){
    return (
        <Row className="justify-content-md-center">
            <Col md={12}>
            <Form>
            <FormGroup row>
            <Col md={4}>
            <Label ><b>Name <span id="EventNameHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
            <UncontrolledTooltip placement="right" target="EventNameHelp">
                Domain name
            </UncontrolledTooltip></Col>
            <Col md={8}>
            <Input type="text" placeholder="Enter domain name..." onChange = {this.onChange} 
             value={this.state.name} id="name"
            required/>
            </Col>
            </FormGroup>

            <FormGroup row>
            <Col md={4}>
            <Label ><b>Source ID <span id="SourceHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
            <UncontrolledTooltip placement="right" target="SourceHelp">
                Source ID for domain
            </UncontrolledTooltip></Col>
            <Col md={8}>
            <Input type="text" placeholder="Enter source id..." onChange = {this.onChange} 
             value={this.state.sourceId} id="sourceId"
            required/>
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
            <Input type="textarea" placeholder="Description for domain" onChange={this.onChange}
            value={this.state.description} id = {"description"}>
            </Input>
            </Col>
            </FormGroup>
            <hr></hr>
        </Form>
        <FormGroup>
            <Col md={12}>
            <Label ><b>Data definitions <span id="dataHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
            <UncontrolledTooltip size="lg" placement="right" target="dataHelp">
                <div style={{textAlign:"left"}}>
                JSON template data definitions for event
                </div>
            </UncontrolledTooltip></Col>
            <Col md={12}>
            <Input type="textarea" disabled={true} rows="20" spellcheck="false" id="dataDefinitions" onChange={this.onChange}
            value={this.state.dataDefinitions}>
            </Input>
            </Col>
            </FormGroup>
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