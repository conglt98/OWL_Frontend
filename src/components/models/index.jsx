import React from 'react'
import { Input, Spin, Select, Modal,Menu, Dropdown, Button,Table, Switch, Radio, message, Form, Tag} from 'antd';
import { DownOutlined,CheckCircleTwoTone, CloseCircleTwoTone} from '@ant-design/icons';
import {getModels} from '../../data/index'
import moment from 'moment'
import {getFromURL, getConfig, postFromURL} from '../../data'
import TableDetail from './tableDetail'
import {Row, Col} from 'reactstrap'

message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
  rtl: true,
});

const {Option} = Select
const expandable = { expandedRowRender: record => <p>{record.description}</p> };
const title = () => 'Here is title';
const showHeader = true;
const footer = () => 'Here is footer';
const pagination = { position: 'bottom' };

export default class Demo extends React.Component {
  constructor(props){
    super(props)
    
    this.state = {
      bordered: false,
      loading: false,
      pagination,
      size: 'default',
      expandable:undefined,
      title: undefined,
      showHeader,
      footer: undefined,
      rowSelection: undefined,
      scroll: undefined,
      hasData: true,
      data:[],
      tableLayout: undefined,
      top: 'none',
      bottom: 'bottomRight',
      visibleModal:false,
      modelChoose:{},
      loading:false,
      visibleCreateModel:false,
      newModel:{}
    };
  
  }
  componentWillMount=()=>{
    this.setState({ loading: true }, () => {
      getModels().then(res=>{
        res.map(ele=>{
          ele.key = ele.id
        })
        this.setState({
          data:res,
          loading:false
        })
      })
    });
  }

  refresh=()=>{
    this.setState({ loading: true }, () => {
      getModels().then(res=>{
        res.map(ele=>{
          ele.key = ele.id
        })
        this.setState({
          data:res,
          loading:false
        })
      })
    });
  }

  deployModel=(modelId, deploy)=>{
    if (deploy == 'true'){
      postFromURL(getConfig('AutoTraining')+"models/undeploy", {modelId:modelId}).then(
        res =>{
          message.success(res.status +" - "+res.statusText)
        }
      )
    }
    if (deploy == 'false'){
      postFromURL(getConfig('AutoTraining')+"models/deploy", {modelId:modelId}).then(
        res =>{
          message.success(res.status +" - "+res.statusText)
        }
      )
    }
  }

  deleteModel=(modelId, status)=>{
    if (status == 'delete'){
      postFromURL(getConfig('AutoTraining')+"models/undelete", {modelId:modelId}).then(
        res =>{
          message.success(res.status +" - "+res.statusText)
        }
      )
    }
    if (status != 'delete'){
      postFromURL(getConfig('AutoTraining')+"models/delete", {modelId:modelId}).then(
        res =>{
          message.success(res.status +" - "+res.statusText)
        }
      )
    }
  }
  
 columns = [
  {
    title: ()=>{
        return <b>Name</b>
    },
    dataIndex: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name)
  },
  {
    title: ()=>{
        return <b>Create at</b>
    },
    dataIndex: 'createAt',
    sorter: (a, b) => a.createAt - b.createAt,
    render:(text,record)=>{
        return moment(record.createAt).format('DD-MM-YYYY HH:mm:ss')
    }
  },
  {
    title: ()=>{
        return <b>Type</b>
    },
    dataIndex: 'type',
    sorter: (a, b) => a.type - b.type
  },
  {
    title: ()=>{
        return <b>Status</b>
    },
    dataIndex: 'status',
    filters: [
      {
        text: 'Trained',
        value: 'Trained',
      },
      {
        text: 'Training',
        value: 'Training',
      },
    ],
    onFilter: (value, record) => record.address.indexOf(value) === 0,
    render:(text,record)=>{
        return record.status=="trained"?<Tag color="green">{record.status.toUpperCase()}</Tag>:<Tag color="magenta">{record.status.toUpperCase()}</Tag>
    }
  },
  {
    title: ()=>{
        return <b>Deploy</b>
    },
    dataIndex: 'deploy',
    render:(text,record)=>{
        return record.deploy==="true"?<CheckCircleTwoTone style={{ fontSize: '24px'}} twoToneColor="#52c41a"/>:<CloseCircleTwoTone style={{ fontSize: '24px'}}  twoToneColor="#eb2f96"/>
    }
  },
  {
    title: ()=>{
        return <b>Action</b>
    },
    key: 'action',
    sorter: true,
    render: (text,record) => (
      <span>
        <Button type="primary" onClick={()=>{this.handleDetail(record)}}>Details</Button>
        &nbsp;
        <Dropdown overlay={
          <Menu>
          <Menu.Item key="deploy" onClick={()=>{this.deployModel(record.id,record.deploy)}}>{record.deploy=='true'? 'Undeploy':'Deploy'}</Menu.Item>
          
          {/* {record.deploy=='true'?
          <Menu.Item key="deploy"><a href={"/#/manual/object-detection/"+record.id}>Use for image</a></Menu.Item>
          :<React.Fragment></React.Fragment>}
          
          {record.deploy=='true'?
          <Menu.Item key="deploy"><a href={"/#/manual/video-highlight/"+record.id}>Use for video</a></Menu.Item> 
          :<React.Fragment></React.Fragment>} */}

          <Menu.Item key="delete" onClick={()=>{this.deleteModel(record.id,record.status)}}>{record.status=='delete'? 'Recycle':'Delete'}</Menu.Item>
        </Menu>
        }>
        <Button type="primary" danger>
        Actions <DownOutlined />
        </Button>
        </Dropdown>
      </span>
    ),
  },
];
 handleDetail=(e)=>{
     console.log(e.key)
     this.setState({
       modelChoose:this.state.data.find(ele=>ele.id == e.key)
     })
     this.showModal()
 }

 showModal = () => {
  this.setState({
    visible: true,
  });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

 

  showCreateModal = () => {
    this.setState({
      visibleCreateModel: true,
    });
  };

  onChangeModelName=(e)=>{
    this.setState({
      newModel:{
        ...this.state.newModel,
        modelName:e.target.value
      }
    })
  }

  onChangeModelType=(e)=>{
    this.setState({
      newModel:{
        ...this.state.newModel,
        type:e
      }
    })
  }

  onChangeDatasetName=(e)=>{
    this.setState({
      newModel:{
        ...this.state.newModel,
        datasetName:e.target.value
      }
    })
  }

  onChangeDatasetLink=(e)=>{
    this.setState({
      newModel:{
        ...this.state.newModel,
        datasetLink:e.target.value
      }
    })
  }

  onChangeDatasetLinkType=(e)=>{
    this.setState({
      newModel:{
        ...this.state.newModel,
        datasetLinkType:e
      }
    })
  }

  onChangeDatasetLabel=(e)=>{
    this.setState({
      newModel:{
        ...this.state.newModel,
        datasetLabel:e
      }
    })
  }

  handleCreateOk = e => {
    if (this.state.newModel){
      console.log(this.state.newModel)
      let request = this.state.newModel
      postFromURL(getConfig('AutoTraining')+"models", request).then(
        res =>{
          message.success(res.status +" - "+res.statusText)
        }
      )
    }
    this.setState({
      visibleCreateModel: false,
    });
  };

  handleCreateCancel = e => {
    console.log(e);
    this.setState({
      visibleCreateModel: false,
    });
  };


  render() {
    // getFromURL(getConfig('AutoTraining')+'/models').then(res=>{
    //   console.log(res)
    // })

    const { xScroll, yScroll, ...state } = this.state;

    const scroll = {};
    if (yScroll) {
      scroll.y = 240;
    }
    if (xScroll) {
      scroll.x = '100vw';
    }

    const tableColumns = this.columns.map(item => ({ ...item, ellipsis: state.ellipsis }));
    if (xScroll === 'fixed') {
      tableColumns[0].fixed = true;
      tableColumns[tableColumns.length - 1].fixed = 'right';
    }

    return (
      <>

        <Button className="float-right" type="primary" onClick={this.showCreateModal}>Create new model</Button>
        <Button className="float-right" style={{marginRight:"10px"}} onClick={this.refresh}>Refresh</Button>

        
        <br></br>
        <br></br>
        {this.state.loading?
              <div style={{textAlign:'center'}}>
              <Spin size="large"></Spin>
              </div>
              :<Table
              {...this.state}
              pagination={{ position: [this.state.top, this.state.bottom] }}
              columns={tableColumns}
              dataSource={this.state.hasData ?this.state.data : null}
              scroll={scroll}
            />}
        
        <Modal
          title={"Detail model"}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={920}
        >
          <TableDetail data={this.state.modelChoose}/>
        </Modal>

        <Modal
          title="Create model"
          visible={this.state.visibleCreateModel}
          onOk={this.handleCreateOk}
          onCancel={this.handleCreateCancel}
          width={720}
        >
      <Row>
      <Col md={6}>
      <div>Model name</div>
      <Input style={{ width: '100%' }} onChange={this.onChangeModelName}></Input>
      <br></br>
      <br></br>
      <br></br>

      <div>Dataset name</div>
      <Input style={{ width: '100%' }} onChange={this.onChangeDatasetName}></Input>
      <br></br>
      <br></br>
      <br></br>
      </Col>

      <Col md={6}>
      <div>Model type</div>
      <Select
        showSearch
        style={{ width: '100%' }}
        placeholder="Select type"
        optionFilterProp="children"
        onChange={this.onChangeModelType}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value="CenterNet">CenterNet</Option>
        {/* <Option value="upload">Upload video local</Option> */}
      </Select>   
      <br></br>
      <br></br>
      <br></br>
      <div>Dataset link type</div>
      <Select
        showSearch
        style={{ width: '100%' }}
        placeholder="Select link type"
        optionFilterProp="children"
        onChange={this.onChangeDatasetLinkType}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value="drive">Google drive</Option>
        {/* <Option value="upload">Upload video local</Option> */}
      </Select>   
      <br></br>
      <br></br>
      <br></br>
      </Col>
      </Row>
      <Row>
        <Col md={12}>
        <div>Dataset label</div>
        <Select mode="tags" style={{ width: '100%' }} onChange={this.onChangeDatasetLabel} tokenSeparators={[',']}>
       </Select>
      <br></br>
      <br></br>
      <br></br>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
        <div>Dataset link</div>
      <Input style={{ width: '100%' }} onChange={this.onChangeDatasetLink}></Input>
      <br></br>
      <br></br>
      <br></br>
        </Col>
      </Row>
        </Modal>
      </>
    );
  }
}