import React from 'react'
import { Spin, Modal,Menu, Dropdown, Button,Table, Switch, Radio, Form, Tag} from 'antd';
import { DownOutlined,CheckCircleTwoTone, CloseCircleTwoTone} from '@ant-design/icons';
import {getModels} from '../../data/index'
import moment from 'moment'
import {getFromURL, getConfig} from '../../data'
import TableDetail from './tableDetail'
import { controls } from 'react-redux-form';




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
      loading:false
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
        return record.status!=="training"?<Tag color="green">{record.status.toUpperCase()}</Tag>:<Tag color="magenta">{record.status.toUpperCase()}</Tag>
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
          <Menu.Item key="deploy">{record.deploy=='true'? 'Undeploy':'Deploy'}</Menu.Item>
          
          {record.deploy=='true'?
          <Menu.Item key="deploy"><a href={"/#/manual/object-detection/"+record.id}>Use for image</a></Menu.Item>
          :<React.Fragment></React.Fragment>}
          
          {record.deploy=='true'?
          <Menu.Item key="deploy"><a href={"/#/manual/video-hightlight/"+record.id}>Use for video</a></Menu.Item> 
          :<React.Fragment></React.Fragment>}

          <Menu.Item key="delete">Delete</Menu.Item>
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
        <Button className="float-right" type="primary">Create new model</Button>
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
      </>
    );
  }
}