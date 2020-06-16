import React from 'react'
import {Input, Button, Badge, Card, CardBody, CardHeader, Col, Row, Table,
  Collapse,
  Label } from 'reactstrap';

import { Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

import fakeAuth from '../api/fakeAuth'
import {getOneDataDefinitions, getDataDefinitions} from '../api/datadefinitions'
import {checkExistValueManualList,addArrayToManualList,delArrayToManualList} from '../api/manual-list'

import { Popover,Select,Input as AntInput,Switch,Pagination,Button as AntButton,message,Progress } from 'antd';
import { QuestionCircleTwoTone } from '@ant-design/icons';
import swal from 'sweetalert'
import manualHelpImg from'../assets/img/help-manual-list.jpg';

const { TextArea } = AntInput;
const { Option } = Select;

function splitarray(input, spacing)
{
    var output = [];

    for (var i = 0; i < input.length; i += spacing)
    {
        output[output.length] = input.slice(i, i + spacing);
    }

    return output;
}

const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
      authorization: 'authorization-text',
    },
    onChange(info) {
      message.config({
        top: 100,
        duration: 2,
        maxCount: 3,
        rtl: true,
        });
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === 'done') {
        message.success(`${info.file.name} file uploaded successfully`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

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
        visible:false,
        datadefinitions:[],
        keys:[],
        response:""
      }
  }

  handleChangeDataDef=(e)=>{
    getOneDataDefinitions(fakeAuth.getAccessToken(),e).then(res => {
        if (res.data){
            this.setState({
                datadefinitionId:e,
                keys:res.data.keys
            })
        }
      })
  }
  componentWillMount = () => {
    getDataDefinitions(fakeAuth.getAccessToken(),0,1000).then(res => {
      if (res.data && res.data.list){
        console.log(res.data.list)
        let tmp = res.data.list
        tmp = tmp.find(ele=>String(ele.name)==='manual_data')
        this.setState({
            datadefinitions:res.data.list,
            datadefinitionId:tmp?tmp.id:'Select data definition',
            keys:tmp?tmp.keys:[]
          });
      }
    })
  }

  handleChangeValue=(e, acc_key)=>{
    this.state.keys.find(ele=>ele.id===acc_key.id).request = e.target.value
    this.setState({
      request:{
        value:e.target.value
      }
    })
  }

  handleCheckExist=(acc_key)=>{
    if (!this.state.request.value){
        swal("Thông báo","Bạn phải nhập value","error")
    }
    else{
        let data = this.state.request
        data = {
          value: this.state.request.value,
          accKeyName:acc_key.name
        }
        message.config({
          top: 100,
          duration: 2,
          maxCount: 3,
          rtl: true,
          });
        try{
          checkExistValueManualList(data,fakeAuth.getAccessToken()).then(res=>{
            this.state.keys.find(ele=>ele.id===acc_key.id).response = JSON.stringify(res,null,2)

            this.setState({
              response:JSON.stringify(res,null,2)
            })
            message.success('Check exist')
          })
        }catch (e){
          swal("Thông báo","Lỗi: "+e,"error")

        }
    }
  }

  handleAdd=(acc_key)=>{
    if (!this.state.request.value){
        swal("Thông báo","Bạn phải nhập value","error")
    }
    else{
        let data = this.state.request
        let tmp = []
        tmp.push(this.state.request.value)
        data = {
          data:tmp,
          accKeyName:acc_key.name
        }
        message.config({
          top: 100,
          duration: 2,
          maxCount: 3,
          rtl: true,
          });
        try{
          addArrayToManualList(data,fakeAuth.getAccessToken()).then(res=>{
            this.state.keys.find(ele=>ele.id===acc_key.id).response = JSON.stringify(res,null,2)

            this.setState({
              response:JSON.stringify(res,null,2)
            })
            message.success("Add value")
          })
        }catch (e){
          swal("Thông báo","Lỗi: "+e,"error")

        }
    }
  }

  handleFileAdd= async (acc_key)=>{
    if (!acc_key.fileContent){
        swal("Thông báo","Bạn phải chọn file","error")
    }
    else{
        let tmp = acc_key.fileContent.split("\n")
        tmp.map((ele,index)=>{
          if (ele.length===0){
            tmp.splice(index, 1);
          }
        })
        message.config({
          top: 100,
          duration: 2,
          maxCount: 3,
          rtl: true,
          });
        let data = {
          data:tmp,
          accKeyName:acc_key.name
        }
        let request = []
        let batch = splitarray(data.data,200)
        for (let i=0;i<batch.length;i++){
          request.push({
            data:batch[i],
            accKeyName:acc_key.name
          })
        }
        try{
          message.info('Adding value from file')
          for (let i = 0;i<request.length;i++){
            console.log(request[i])
            let res = await addArrayToManualList(request[i],fakeAuth.getAccessToken())

            let temp = this.state.keys.find(ele=>ele.id===acc_key.id)
            temp.response = JSON.stringify(res,null,2)
            // temp.fileContent = JSON.stringify(data,null,2)
            temp.fileContent = ''
            temp.progress = ((i+1)/request.length*100).toPrecision(2)>=100?100:((i+1)/request.length*100).toPrecision(2)
            temp.status = temp.progress>=100?'done':'active'
            temp.fileAddOrDel = temp.progress>=100?'Adding done!':'Adding...'
            this.setState({
              response:JSON.stringify(res,null,2)
            })
          }
        }catch (e){
          swal("Thông báo","Lỗi: "+e,"error")

        }
    }
  }


  handleFileDel= async (acc_key)=>{
    if (!acc_key.fileContent){
        swal("Thông báo","Bạn phải chọn file","error")
    }
    else{
        let tmp = acc_key.fileContent.split("\n")
        tmp.map((ele,index)=>{
          if (ele.length===0){
            tmp.splice(index, 1);
          }
        })
        message.config({
          top: 100,
          duration: 2,
          maxCount: 3,
          rtl: true,
          });
        let data = {
          data:tmp,
          accKeyName:acc_key.name
        }
        let request = []
        let batch = splitarray(data.data,200)
        for (let i=0;i<batch.length;i++){
          request.push({
            data:batch[i],
            accKeyName:acc_key.name
          })
        }
        try{
          message.info('Delete value from file')
          for (let i = 0;i<request.length;i++){
            console.log(request[i])
            let res = await delArrayToManualList(request[i],fakeAuth.getAccessToken())

            let temp = this.state.keys.find(ele=>ele.id===acc_key.id)
            temp.request = ''
            temp.response = JSON.stringify(res,null,2)
            // temp.fileContent = JSON.stringify(data,null,2)
            temp.fileContent = ''
            temp.progress = ((i+1)/request.length*100).toPrecision(2)>=100?100:((i+1)/request.length*100).toPrecision(2)
            temp.status = temp.progress>=100?'done':'active'
            temp.fileAddOrDel = temp.progress>=100?'Deleting done!':'Deleting...'
            this.setState({
              response:JSON.stringify(res,null,2)
            })
          }
        }catch (e){
          swal("Thông báo","Lỗi: "+e,"error")

        }
    }
  }

  handleClear=(acc_key)=>{
    this.state.keys.find(ele=>ele.id===acc_key.id).request = ""
    this.state.keys.find(ele=>ele.id===acc_key.id).response = ""
    this.setState({
      keys:this.state.keys
    })
  }

  handleClearFile=(acc_key)=>{
    let temp = this.state.keys.find(ele=>ele.id===acc_key.id)
    temp.fileContent = ""
    temp.response = ""
    temp.fileInfo = ""

    temp.fileAddOrDel = ''
    temp.status = ''
    temp.progress = 0
    this.setState({
      keys:this.state.keys
    })
  }

  handleDel=(acc_key)=>{
    if (!this.state.request.value){
        swal("Thông báo","Bạn phải nhập value","error")
    }
    else{
        let data = this.state.request
        let tmp = []
        tmp.push(this.state.request.value)
        data = {
          data: tmp,
          accKeyName:acc_key.name
        }
        message.config({
          top: 100,
          duration: 2,
          maxCount: 3,
          rtl: true,
          });
        try{
          delArrayToManualList(data,fakeAuth.getAccessToken()).then(res=>{
            this.state.keys.find(ele=>ele.id===acc_key.id).response = JSON.stringify(res,null,2)
            this.setState({
              response:JSON.stringify(res,null,2)
            })
            message.success('Delete value')
          })
        }catch(e){
          swal("Thông báo","Lỗi: "+e,"error")
        }
    }
  }

  handleChangeMode=(e,acc_key)=>{
    this.state.keys.find(ele=>ele.id===acc_key.id).mode = e
    this.setState({
      keys:this.state.keys
    })
  }

  toggleCollapse = (acc_key)=>{
    let tmp = this.state.keys.find(ele=>ele.id===acc_key.id)
    tmp.collapse = tmp.collapse?!tmp.collapse:true
    this.setState({
      keys:this.state.keys
    })
  }

  hide = () => {
    this.setState({
      visible: false,
    });
  };

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  render() {

    return (
      <div className="animated fadeIn">
          <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <Row>
                    <Col>
                    <i className="fa fa-align-justify"></i>
                    &nbsp;
                    <strong>Data_definition</strong>
                    </Col>
                    <Col md={3}>
                    <Select
                    className="float-right"
                    style={{ width: '100%' }}
                    value={this.state.datadefinitionId}
                    showSearch
                    onChange={this.handleChangeDataDef}
                    placeholder="Select data definition"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                {this.state.datadefinitions.map(ele=>(
                    <Option value={ele.id}>{ele.name}</Option>
                ))}
                </Select></Col>
                </Row>
              </CardHeader>
            </Card>
          </Col>
        </Row>
        {this.state.keys.map((key,index)=>{
            return(<Row key={index}>
                <Col xl={12}>
                  <Card>
                    <CardHeader>
                      <Row >
                        <Col className="myBtn" onClick={()=>{this.toggleCollapse(key)}}>
                        <i className="icon-notebook"></i> <strong>{key.name}</strong>
                        </Col>
                        <Col md={3}>
                        <Select
                      className="float-right"
                              style={{ width: '100%' }}
                              value={key.mode?key.mode:'single value'}
                              onChange={(e)=>{this.handleChangeMode(e,key)}}
                              placeholder="Mode"
                            >
                            {['single value','file'].map(ele=>(
                              <Option value={ele}>{ele}</Option>
                            ))}
                          </Select>
                        </Col>
                      </Row>
                    </CardHeader>
                    <Collapse
                        isOpen={key.collapse?key.collapse:false}
                      >
                    <CardBody>
                    {key.mode==='file'?
                    <>
                    <Row>
                      <Col>
                      <Upload
                           accept=".txt, .csv, .json"
                           showUploadList={false}
                           beforeUpload={file => {
                               const reader = new FileReader();
                               this.state.keys.find(ele=>ele.id===key.id).fileInfo = file.name
                                  this.setState({
                                    keys:this.state.keys
                                  })

                               reader.onloadstart = e =>{
                                console.log("Start load file")
                               }

                               reader.onloadend = e =>{
                                console.log('End load file')
                               }

                               reader.onload = e => {
                                  this.state.keys.find(ele=>ele.id===key.id).fileContent = e.target.result
                                  this.setState({
                                    keys:this.state.keys
                                  })
                               };

                               reader.readAsBinaryString(file);

                               // Prevent upload
                               return false;
                           }}
                          >
                              <AntButton>
                              <UploadOutlined /> Upload file
                              </AntButton>
                          </Upload>
                          &nbsp;&nbsp;
                          <AntButton
                          onClick={()=>{this.handleClearFile(key)}}
                          ><i className="fa fa-eraser"></i></AntButton>
                          &nbsp;&nbsp;
                          <Popover
                          content={
                          <img src={manualHelpImg}></img>
                          }
                          title="Help - File's content structure"
                          trigger="hover"
                          visible={this.state.visible}
                          onVisibleChange={this.handleVisibleChange}
                        >
                          <QuestionCircleTwoTone
                          className="myBtn" style={{ fontSize: '28px', color: '#08c' }}/>
                        </Popover>
                      </Col>
                    </Row>
                    <br></br>
                    <Row>
                      <Col>
                      File name: {key.fileInfo}
                      </Col>
                    </Row>
                    <br></br>
                    <Row>
                      <Col md={6}>
                      <div>File content: </div>
                      <div>
                          <Input type="textarea" rows="5" disabled={true} value={key.fileContent}></Input>
                      </div>
                      </Col>
                      <Col md={6}>
                      <br></br>
                      <AntButton
                        type="primary"
                        onClick={()=>{this.handleFileAdd(key)}}
                        >Add</AntButton>
                        &nbsp;&nbsp;
                        <AntButton
                        type="primary" danger
                        onClick={()=>{this.handleFileDel(key)}}
                        >Delete
                        </AntButton>
                        <br>
                        </br>
                        <br></br>
                          <div>{key.fileAddOrDel}</div>
                        <div>
                        <Progress percent={key.progress} status={key.status} />
                        </div>
                      </Col>
                    </Row>
                    </>:
                    <Row>
                    <Col md={4}>
                    <AntInput placeholder="Value"
                    value={key.request}
                    onChange={(e)=>{this.handleChangeValue(e,key)}} required>
                    </AntInput>
                    </Col>
                    <Col md={6}>
                    <AntButton
                    onClick={()=>{this.handleClear(key)}}
                    ><i className="fa fa-eraser"></i></AntButton>
                    &nbsp;&nbsp;
                    <AntButton
                    onClick={()=>{this.handleCheckExist(key)}}
                    >Check exist</AntButton>
                    &nbsp;&nbsp;
                    <AntButton
                    type="primary"
                    onClick={()=>{this.handleAdd(key)}}
                    >Add</AntButton>
                    &nbsp;&nbsp;
                    <AntButton
                    type="primary" danger
                    onClick={()=>{this.handleDel(key)}}
                    >Delete</AntButton>
                    </Col>
                </Row>}
                      <br></br>
                      <div>Response</div>
                      <div>
                          <Input type="textarea" rows="8" disabled={true} value={key.response}></Input>
                      </div>
                    </CardBody>
                    </Collapse>

                 </Card>
                </Col>
              </Row>)
        })}
      </div>
    );
  }
}