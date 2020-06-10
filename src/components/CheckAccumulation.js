import React from 'react'
import {Input, Button, Badge, Card, CardBody, CardHeader, Col, Row, Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,FormGroup,
  Label } from 'reactstrap';
import Slide from 'react-reveal/Slide';
import {Link} from 'react-router-dom';



import fakeAuth from '../api/fakeAuth'
import {getClients,createClient,editClient,deleteClient} from '../api/client'
import {lookUpValue,editAccKey,deleteAccKey} from '../api/accumulationkeys'

import moment from 'moment'
import uuid from 'react-uuid'
import { Select,Input as AntInput,Switch,Pagination,Button as AntButton,message } from 'antd';
import {AppSwitch} from '@coreui/react'
import swal from 'sweetalert'

const { TextArea } = AntInput;
const { Option } = Select;

export default class App extends React.Component {
  constructor(props){
      super(props);
      this.state={
        request:{
            // key:"",
            // type:"",
            // action:"",
            // value:""
        },
        accKeySuggest:[],
        typeSuggest:[
            "STRING",
            "SET",
            "ZSET"
        ],
        actionSuggest:[],
        valueDisable:false,
        response:""
      }
  }

  
  componentWillMount = () => {
    // getAccKey(fakeAuth.getAccessToken(), 0, 1000).then(res => {
    //   if (res.data && res.data.list){
    //     console.log(res.data.list)
    //     this.setState({
    //         accKeySuggest:res.data.list
    //       });
    //   }
    // })
  }

  handleChangeKey=(e)=>{
    this.setState({
        request:{
            ...this.state.request,
            key:e.target.value
        }
    })
  }

  handleChangeType=(e)=>{
    if (e==="STRING"){
        this.setState({
            actionSuggest:["GET"],
            valueDisable:true
        })
    }else {
        this.setState({
            valueDisable:false,
            actionSuggest:["COUNT","EXIST","GET"]
        })
    }
    this.setState({
        request:{
            ...this.state.request,
            type:e
        }
    })
  }

  handleChangeAction=(e)=>{
    if (e==='COUNT'||this.state.request.type==='STRING'){
        this.setState({
            valueDisable:true
        })
    }else{
        this.setState({
            valueDisable:false
        })
    }
    this.setState({
        request:{
            ...this.state.request,
            action:e
        }
    })
  }

 

  handleChangeValue=(e)=>{
    this.setState({
        request:{
            ...this.state.request,
            value:e.target.value
        }
    })
  }

  handleCheck=()=>{
    if (!this.state.request.key){
        swal("Thông báo","Bạn phải nhập key","error")
    }else if (!this.state.request.type){
        swal("Thông báo","Bạn phải nhập type","error")
    }else if (!this.state.request.action){
        swal("Thông báo","Bạn phải nhập action","error")
    }
    else{
        let data = this.state.request
        lookUpValue(data,fakeAuth.getAccessToken()).then(res=>{
          this.setState({
            response:JSON.stringify(res,null,2)
          })
        })
    }
  }

  handleClear=()=>{
      this.setState({
          request:{},
          response:""
      })
  }

  render() {

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i>
                Check accumulation keys
              </CardHeader>
              <CardBody>
              <Row>
                    <Col md={4}>
                    {/* <Select
                        style={{ width: '100%' }}
                        value={this.state.request.key}
                        showSearch
                        onChange={this.handleChangeKey}
                        placeholder="Key"
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                          }
                      >
                      {this.state.accKeySuggest.map(ele=>(
                        <Option value={ele.id}>[{ele.id}] {ele.name}</Option>
                      ))}
                    </Select> */}
                    <AntInput placeholder="Key"
                    value={this.state.request.key}
                    onChange={this.handleChangeKey} required>
                    </AntInput>
                    </Col>
                    <Col md={2}>
                    <Select
                        style={{ width: '100%' }}
                        value={this.state.request.type}
                        onChange={this.handleChangeType}
                        placeholder="Type"
                      >
                      {this.state.typeSuggest.map(ele=>(
                          <Option value={ele}>{ele}</Option>
                      ))}
                    </Select>
                    </Col>
                    <Col md={2}>
                    <Select
                        style={{ width: '100%' }}
                        value={this.state.request.action}
                        onChange={this.handleChangeAction}
                        placeholder="Action"
                      >
                      >
                      {this.state.actionSuggest.map(ele=>(
                          <Option value={ele}>{ele}</Option>
                      ))}
                    </Select>
                    </Col>
                    <Col md={2}>
                    <AntInput placeholder="Value"
                    disabled={this.state.valueDisable}
                    value={this.state.request.value}
                    onChange={this.handleChangeValue}>
                    </AntInput>
                    </Col>
                    <Col md={2}>
                    <AntButton
                    onClick={this.handleClear}
                    ><i className="fa fa-eraser"></i></AntButton>
                    &nbsp;
                    <AntButton
                    type="primary"
                    onClick={this.handleCheck}
                    >Check</AntButton>
                    </Col>
                </Row>
                <br></br>
                <div>Response</div>
                <div>
                    <Input type="textarea" rows="15" disabled={true} value={this.state.response}></Input>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}