import React from 'react'
import { Menu, Dropdown, Button,Table, Switch, Radio, Form, Tag} from 'antd';
import { DownOutlined,CheckCircleTwoTone, CloseCircleTwoTone} from '@ant-design/icons';
import {getModels} from '../../data/index'
import moment from 'moment'



const data = getModels();
data.map(ele=>{
    ele.key = ele.id
})

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
      <Menu.Item key="deploy">Deploy</Menu.Item>
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
        {/* <Form
          layout="inline"
          className="components-table-demo-control-bar"
          style={{ marginBottom: 16 }}
        >
          <Form.Item label="Bordered">
            <Switch checked={state.bordered} onChange={this.handleToggle('bordered')} />
          </Form.Item>
          <Form.Item label="loading">
            <Switch checked={state.loading} onChange={this.handleToggle('loading')} />
          </Form.Item>
          <Form.Item label="Title">
            <Switch checked={!!state.title} onChange={this.handleTitleChange} />
          </Form.Item>
          <Form.Item label="Column Header">
            <Switch checked={!!state.showHeader} onChange={this.handleHeaderChange} />
          </Form.Item>
          <Form.Item label="Footer">
            <Switch checked={!!state.footer} onChange={this.handleFooterChange} />
          </Form.Item>
          <Form.Item label="Expandable">
            <Switch checked={!!state.expandable} onChange={this.handleExpandChange} />
          </Form.Item>
          <Form.Item label="Checkbox">
            <Switch checked={!!state.rowSelection} onChange={this.handleRowSelectionChange} />
          </Form.Item>
          <Form.Item label="Fixed Header">
            <Switch checked={!!yScroll} onChange={this.handleYScrollChange} />
          </Form.Item>
          <Form.Item label="Has Data">
            <Switch checked={!!state.hasData} onChange={this.handleDataChange} />
          </Form.Item>
          <Form.Item label="Ellipsis">
            <Switch checked={!!state.ellipsis} onChange={this.handleEllipsisChange} />
          </Form.Item>
          <Form.Item label="Size">
            <Radio.Group value={state.size} onChange={this.handleSizeChange}>
              <Radio.Button value="default">Default</Radio.Button>
              <Radio.Button value="middle">Middle</Radio.Button>
              <Radio.Button value="small">Small</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Table Scroll">
            <Radio.Group value={xScroll} onChange={this.handleXScrollChange}>
              <Radio.Button value={undefined}>Unset</Radio.Button>
              <Radio.Button value="scroll">Scroll</Radio.Button>
              <Radio.Button value="fixed">Fixed Columns</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Table Layout">
            <Radio.Group value={state.tableLayout} onChange={this.handleTableLayoutChange}>
              <Radio.Button value={undefined}>Unset</Radio.Button>
              <Radio.Button value="fixed">Fixed</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Pagination Top">
            <Radio.Group
              value={this.state.top}
              onChange={e => {
                this.setState({ top: e.target.value });
              }}
            >
              <Radio.Button value="topLeft">TopLeft</Radio.Button>
              <Radio.Button value="topCenter">TopCenter</Radio.Button>
              <Radio.Button value="topRight">TopRight</Radio.Button>
              <Radio.Button value="none">None</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="Pagination Bottom">
            <Radio.Group
              value={this.state.bottom}
              onChange={e => {
                this.setState({ bottom: e.target.value });
              }}
            >
              <Radio.Button value="bottomLeft">BottomLeft</Radio.Button>
              <Radio.Button value="bottomCenter">BottomCenter</Radio.Button>
              <Radio.Button value="bottomRight">BottomRight</Radio.Button>
              <Radio.Button value="none">None</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Form>
         */}
        <Button className="float-right" type="primary">Create new model</Button>
        <br></br>
        <br></br>
        <Table
          {...this.state}
          pagination={{ position: [this.state.top, this.state.bottom] }}
          columns={tableColumns}
          dataSource={state.hasData ? data : null}
          scroll={scroll}
        />
      </>
    );
  }
}