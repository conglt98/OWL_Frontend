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

class NewForm extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        id:props.profileData?props.profileData.id:'',
        name:props.profileData?props.profileData.name:'',
        filter:props.profileData?props.profileData.filter:'Select filter',
        description:props.profileData?props.profileData.description:'',
      }
      localStorage.removeItem("newProfile")
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
      localStorage.setItem("newProfile",JSON.stringify(profile))
      this.setState(profile)
      this.setState({
        filter:e
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
      localStorage.setItem("newProfile",JSON.stringify(profile))
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
                Profile name
            </UncontrolledTooltip></Col>
            <Col md={8}>
            <Input id="name" type="text" placeholder="Enter profile name..." onChange = {this.onChange} 
             value={this.state.name}
            required/>
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
                >
                {['AND','OR'].map(ele=>(
                <Option value={ele}>{ele}</Option>
                ))}
            </Select>
            </Col>
            </FormGroup>


            <FormGroup row>
            <Col md={4}>
            <Label ><b>Description <span id="desHelp" style ={{color:"#63c2de"}}><i className="icon-question myBtn"></i></span></b></Label>
            <UncontrolledTooltip size="lg" placement="right" target="desHelp">
                <div style={{textAlign:"left"}}>
                Description for profile
                </div>
            </UncontrolledTooltip></Col>
            <Col md={8}>
            <Input id="description" type="textarea" placeholder="Description for profile" onChange={this.onChange}
            value={this.state.description}>
            </Input>
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