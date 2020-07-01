import React from 'react'
import { Spin,Card, Menu, Dropdown, Button,Table, Switch, Radio, Form, Tag} from 'antd';
import { DownOutlined,CheckCircleTwoTone, CloseCircleTwoTone} from '@ant-design/icons';
import {getModelsAPI} from '../../data/index'
import moment from 'moment'


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
      modelChoose:{}
    };
  
  }
  componentWillMount=()=>{
    this.setState({ loading: true }, () => {
      getModelsAPI().then(res=>{
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
 
  menu = (
    <Menu>
      <Menu.Item key="delete">Delete</Menu.Item>
    </Menu>
);

 columns = [
    {
    title: ()=>{
        return <b>API route</b>
    },
    dataIndex: 'id',
    render:(text,record)=>{
        return `/models/${record.id}`
    }
    },
  {
    title: ()=>{
        return <b>Model</b>
    },
    dataIndex: 'name',
    sorter: (a, b) => a.name - b.name
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
 }

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
      </>
    );
  }
}