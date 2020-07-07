import React from 'react'
import {Tabs, Modal, Menu, Dropdown, Button,Table, Switch, Radio, Form, Tag} from 'antd';
import { DownOutlined,CheckCircleTwoTone, CloseCircleTwoTone} from '@ant-design/icons';
import moment from 'moment'
import {getTasks, getFromURL,getConfig} from '../../../data'
import TableDetail from '../../models/tableDetail'
const expandable = { expandedRowRender: record => <p>{record.description}</p> };
const title = () => 'Here is title';
const showHeader = true;
const footer = () => 'Here is footer';
const pagination = { position: 'bottom' };
const { TabPane } = Tabs;


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
      visible:false,
      taskChoose:{},
      isZoom:false,
      imageStatus:'loading'
    };
  }

  handleImageLoaded = ()=> {
    this.setState({ imageStatus: "loaded" });
  }

  handleImageErrored = () =>{
    this.setState({ imageStatus: "failed to load" });
  }

  zoomImg=()=>{
    this.setState({
      isZoom:!this.state.isZoom
    })
  }

  componentWillMount=()=>{
    getTasks('FaceRecognition').then(res=>{
      this.setState({
        data: res.filter(ele=>(ele.typeSrc?ele.typeSrc!='video':true))
      })
    })
  }
  
 menu = (
    <Menu>
      <Menu.Item key="delete">Delete</Menu.Item>
    </Menu>
);

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
        return <b>Model</b>
    },
    dataIndex: 'modelId',
  },
  {
    title: ()=>{
        return <b>Status</b>
    },
    dataIndex: 'status',
    filters: [
      {
        text: 'Done',
        value: 'Done',
      },
      {
        text: 'Pending',
        value: 'Pending',
      },
    ],
    onFilter: (value, record) => record.address.indexOf(value) === 0,
    render:(text,record)=>{
        return record.status==="Done"?<Tag color="green">{record.status.toUpperCase()}</Tag>:<Tag color="magenta">{record.status.toUpperCase()}</Tag>
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
        <Dropdown overlay={this.menu}>
        <Button type="primary" danger>
        Actions <DownOutlined />
        </Button>
        </Dropdown>
      </span>
    ),
  },
];
handleDetail= async (e)=>{
  console.log(e.id)
  let taskChoose = this.state.data.find(ele=>ele.id == e.id)
  if (!taskChoose.linkImage){
    let res = await getFromURL(getConfig('MODEL','FaceRecognition')+"/result/image/"+taskChoose.id+"/"+taskChoose.modelId)
    res = res.data
    let linkImage = 'https://drive.google.com/uc?export=view&id='+res[taskChoose.modelId+'.png']

    taskChoose.linkImage = linkImage
    this.state.data.find(ele=>ele.id == e.id).linkImage = linkImage
  }

  console.log(taskChoose)
  this.setState({
    taskChoose: taskChoose
  })
  this.showModal()
}

loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>


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

    console.log(this.state.taskChoose)
    return (
      <>
        <Table
          {...this.state}
          pagination={{ position: [this.state.top, this.state.bottom] }}
          columns={tableColumns}
          dataSource={this.state.hasData ? this.state.data : null}
          scroll={scroll}
        />
        <Modal
          title={"Detail task"}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={this.state.isZoom?900:600}
        >
          <Tabs tabPosition={'left'} defaultActiveKey="1">
            <TabPane tab="Info" key="1">
            <TableDetail data={this.state.taskChoose}/>
            </TabPane>
            <TabPane tab="Result" key="2">
                <img 
              onClick={this.zoomImg} 
              width={'100%'} src={this.state.taskChoose.linkImage}>
              </img>
            </TabPane>
          </Tabs>
        </Modal>
      </>
    );
  }
}