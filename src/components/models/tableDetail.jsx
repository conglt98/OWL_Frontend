import React from 'react'
import { Card, Menu, Dropdown, Button,Table, Switch, Radio, Form, Tag} from 'antd';
import { DownOutlined,CheckCircleTwoTone, CloseCircleTwoTone} from '@ant-design/icons';
import {getModelsAPI} from '../../data/index'
import moment from 'moment'
import './index.css'

const expandable = { expandedRowRender: record => <p>{record.description}</p> };
const title = () => 'Here is title';
const showHeader = true;
const footer = () => 'Here is footer';
const pagination = { position: 'bottom' };

export default class Demo extends React.Component {
  state = {
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
    tableLayout: undefined,
    top: 'none',
    bottom: 'bottomRight',
  };
 menu = (
    <Menu>
      <Menu.Item key="delete">Delete</Menu.Item>
    </Menu>
);

 columns = [
    {
    title: ()=>{
        return <b>Info</b>
    },
    dataIndex: 'field',
    // sorter: (a, b) => a.field - b.field
    render:(text,record)=>{
        return <b>{record.field}</b>
    }
    },
  {
    title: ()=>{
        return <b>Value</b>
    },
    dataIndex: 'value',
    // sorter: (a, b) => a.value - b.value
    render:(text,record)=>{
        if (record.field == 'createAt'){
            return moment(record.value).format('DD-MM-YYYY HH:mm:ss')
        }else if (record.field == 'dataset'){
            return record.value.label.map(ele=>{
                return <Tag color="purple">{ele}</Tag>
        })
        }
        else if (record.field=='status'){
            return record.value!=="training"?<Tag color="green">{record.value.toUpperCase()}</Tag>:<Tag color="magenta">{record.value.toUpperCase()}</Tag>
        }
        else if (record.field == 'modelConfig'){
            return Object.keys(record.value).map(ele=>{
            return <Tag color="#f50">{ele}: {record.value[ele]}</Tag>
            })
        }
        else
            return record.value
    }
  }
];
 handleDetail=(e)=>{
     console.log(e.key)
 }

  render() {
    const { xScroll, yScroll, ...state } = this.state;
    let data = []
    Object.keys(this.props.data).map(ele=>{
        data.push({
            field:ele,
            value:this.props.data[ele]
        })
    })
    
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
        //   pagination={{ position: [this.state.top, this.state.bottom] }}
            pagination={{
                total: data.length,
                pageSize: data.length,
                hideOnSinglePage: true
            }}
          columns={tableColumns}
          dataSource={state.hasData ? data : null}
          scroll={scroll}
        />
      </>
    );
  }
}