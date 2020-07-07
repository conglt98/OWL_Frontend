import React from 'react'
import {Modal, Menu, Dropdown, Button,Table, Switch, Radio, Form, Tag} from 'antd';
import { DownOutlined,CheckCircleTwoTone, CloseCircleTwoTone} from '@ant-design/icons';
import moment from 'moment'
import {getTasks} from '../../../data'
import { element } from 'prop-types';
import TableDetail from '../../models/tableDetail'

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
      visibleDetail:false,

    };
  }

  componentWillMount=()=>{
    getTasks().then(res=>{
      this.setState({
        data: res.filter(ele=>(ele.typeSrc?ele.typeSrc=='video':false))
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
    sorter: (a, b) => a.name.localeCompare(b.name),
    render:(text,record)=>{
    return <a href={'/#/manual/object-detection/video-highlight/'+record.id}>{record.name}</a>
  }
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

handleDetail=(e)=>{
  console.log(e.key)
  this.setState({
    taskChoose:this.state.data.find(ele=>ele.id == e.id)
  })
  this.showDetailModal()
}

showDetailModal = () => {
  this.setState({
    visibleDetail: true,
  });
  };

  handleDetailOk = e => {
    console.log(e);
    this.setState({
      visibleDetail: false,
    });
  };

  handleDetailCancel = e => {
    console.log(e);
    this.setState({
      visibleDetail: false,
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
          visible={this.state.visibleDetail}
          onOk={this.handleDetailOk}
          onCancel={this.handleDetailCancel}
          width={920}
        >
          <TableDetail data={this.state.taskChoose}/>
        </Modal>
      </>
    );
  }
}