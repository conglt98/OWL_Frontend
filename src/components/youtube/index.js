import React,{useEffect} from 'react'
import {Input, Select,Modal,Spin,DatePicker, Switch,Typography ,PageHeader, Tag, Button, Statistic, Descriptions, Row,Tabs } from 'antd';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {Card, CardBody, Col} from 'reactstrap'
import Dnd from "../dnd";
import Layout from './layout'
import './index.css'
import MyList from './sm-list'
import moment from 'moment'
import {getListChannelStatistic} from  '../../data/youtube'

const { TabPane } = Tabs;
const { Paragraph } = Typography;
const { RangePicker } = DatePicker;
const {Option} = Select

// Drag & Drop node
class TabNode extends React.Component {
  render() {
    const { connectDragSource, connectDropTarget, children } = this.props;

    return connectDragSource(connectDropTarget(children));
  }
}

const cardTarget = {
  drop(props, monitor) {
    const dragKey = monitor.getItem().index;
    const hoverKey = props.index;

    if (dragKey === hoverKey) {
      return;
    }

    props.moveTabNode(dragKey, hoverKey);
    monitor.getItem().index = hoverKey;
  },
};

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    };
  },
};

const WrapTabNode = DropTarget('DND_NODE', cardTarget, connect => ({
  connectDropTarget: connect.dropTarget(),
}))(
  DragSource('DND_NODE', cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }))(TabNode),
);

class DraggableTabs extends React.Component {
  state = {
    order: [],
  };

  moveTabNode = (dragKey, hoverKey) => {
    const newOrder = this.state.order.slice();
    const { children } = this.props;

    React.Children.forEach(children, c => {
      if (newOrder.indexOf(c.key) === -1) {
        newOrder.push(c.key);
      }
    });

    const dragIndex = newOrder.indexOf(dragKey);
    const hoverIndex = newOrder.indexOf(hoverKey);

    newOrder.splice(dragIndex, 1);
    newOrder.splice(hoverIndex, 0, dragKey);

    this.setState({
      order: newOrder,
    });
  };

  renderTabBar = (props, DefaultTabBar) => (
    <DefaultTabBar {...props}>
      {node => (
        <WrapTabNode key={node.key} index={node.key} moveTabNode={this.moveTabNode}>
          {node}
        </WrapTabNode>
      )}
    </DefaultTabBar>
  );

  render() {
    const { order } = this.state;
    const { children } = this.props;

    const tabs = [];
    React.Children.forEach(children, c => {
      tabs.push(c);
    });

    const orderTabs = tabs.slice().sort((a, b) => {
      const orderA = order.indexOf(a.key);
      const orderB = order.indexOf(b.key);

      if (orderA !== -1 && orderB !== -1) {
        return orderA - orderB;
      }
      if (orderA !== -1) {
        return -1;
      }
      if (orderB !== -1) {
        return 1;
      }

      const ia = tabs.indexOf(a);
      const ib = tabs.indexOf(b);

      return ia - ib;
    });

    return (
      <DndProvider backend={HTML5Backend}>
        <Tabs renderTabBar={this.renderTabBar} {...this.props}>
          {orderTabs}
        </Tabs>
      </DndProvider>
    );
  }
}
const IconLink = ({ src, text }) => (
  <a className="example-link">
    <Row>
    {/* <img className="example-link-icon" src={src} alt={text} /> &nbsp;<span style={{color:"#4B90FF"}}>{text}</span> &nbsp;&nbsp; */}

    </Row>
  </a>
);

const content = (
  <>
    <Paragraph>
      OWL platform can support users to add more channel from Youtube then crawler and analyze daily.
      <br></br>
      All data are collected and analyzed then visualized then show on dashboard.
    </Paragraph>
    <Paragraph>
      <Tag color="magenta">Today is:  {moment().format("YYYY-MM-DD")}</Tag>
    </Paragraph>
    <div>
      <IconLink
        src="https://gw.alipayobjects.com/zos/rmsportal/MjEImQtenlyueSmVEfUD.svg"
        text="Information"
      />
      {/* <IconLink
        src="https://gw.alipayobjects.com/zos/rmsportal/NbuDUAuBlIApFuDvWiND.svg"
        text=" Product Info"
      />
      <IconLink
        src="https://gw.alipayobjects.com/zos/rmsportal/ohOEPSYdDTNnyMbGuyLb.svg"
        text="Product Doc"
      /> */}
    </div>
  </>
);

const Content = ({ children, extraContent }) => {
  return (
    <Row>
      <div style={{ flex: 1 }}>{children}</div>
      <div className="image">{extraContent}</div>
    </Row>
  );
};

function checkChannelExist(title, list) {
  for (let i=0;i<list.length;i++){
    if (title == list[i].title){
      return true
    }
  }
  return false
}
export default class Demo extends React.Component{
  constructor(props){
    super(props)
    this.state={
      edit:false,
      layout:Layout,
      loading:false,
      data:[],
      modalAddMore:false,
      newType:'',
      newId:'',
    }
  }  

  componentWillMount=()=>{
    this.setState({ loading: true }, () => {
      getListChannelStatistic({'ymdFrom':'20200608','ymdTo':'20200708'}).then(res=>{
        res = res.data
        let layout = this.state.layout
        let data = res.data && res.data.length > 0?res.data:[]
        console.log(this.state.layout)
        console.log(data)

        let chartSubscriber3 = []
        let chartViews1 = []
        let chartUploads4 = []
        let chartCompareOverall2 = []
        let chartScatter5 = []
        let chartRadar6 = []
        let chartTreeMap7 = {
          name:'root',
          children:[]
        }
        let chartWorldCloud8 = []


        let maxDate = data[0].updatedAt
        data.map(ele=>{
          if (ele.updatedAt > maxDate){
            maxDate = ele.updatedAt
          }
        })

        data.map(ele=>{
          chartSubscriber3.push({
            date:ele.updatedAt.substr(0, 4)+'-'+ele.updatedAt.substr(4, 2)+'-'+ele.updatedAt.substr(6, 2),
            type:ele.title,
            subscribers:parseInt(ele.subscriberCount)
          })
          chartViews1.push({
            date:ele.updatedAt.substr(0, 4)+'-'+ele.updatedAt.substr(4, 2)+'-'+ele.updatedAt.substr(6, 2),
            type:ele.title,
            views:parseInt(ele.viewCount)
          })
          chartUploads4.push({
            type:ele.title,
            date:ele.updatedAt.substr(0, 4)+'-'+ele.updatedAt.substr(4, 2)+'-'+ele.updatedAt.substr(6, 2),
            uploads:parseInt(ele.videoCount)
          })
          chartScatter5.push({
            Topic:"",
            Channel:ele.title,
            Uploads:parseInt(ele.videoCount),
            Views:parseInt(ele.viewCount)
          })



          if (ele.updatedAt == maxDate && !checkChannelExist(ele.title, chartCompareOverall2) ){
            chartCompareOverall2.push({
              channel:ele.title,
              type:'views',
              value:parseInt(ele.viewCount)
            })
          
            chartCompareOverall2.push({
              channel:ele.title,
              type:'subscribers',
              value:parseInt(ele.subscriberCount)
            })

            chartCompareOverall2.push({
              channel:ele.title,
              type:'uploads',
              value:parseInt(ele.videoCount)
            })

            chartRadar6.push({
              type:'views',
              channel:ele.title,
              value:parseInt(ele.viewCount)
            })
          
            chartRadar6.push({
              type:'subscribers',
              channel:ele.title,
              value:parseInt(ele.subscriberCount)
            })

            chartRadar6.push({
              type:'uploads',
              channel:ele.title,
              value:parseInt(ele.videoCount)
            })

            chartTreeMap7.children.push({
              name:ele.title,
              value:parseInt(ele.videoCount)
            })
          }
          chartWorldCloud8.push({
            name:ele.title,
            value:parseInt(ele.videoCount)
          })
        })
        console.log(chartCompareOverall2)
        layout.tasks['task-3'].data = chartSubscriber3.sort((a,b)=>a.subscribers - b.subscribers)
        layout.tasks['task-1'].data = chartViews1.sort((a,b)=>a.views - b.views)
        layout.tasks['task-4'].data = chartUploads4.sort((a,b)=>a.uploads - b.uploads)
        layout.tasks['task-2'].data = chartCompareOverall2
        layout.tasks['task-5'].data = chartScatter5
        layout.tasks['task-6'].data = chartRadar6
        layout.tasks['task-7'].data = chartTreeMap7
        layout.tasks['task-8'].data = chartWorldCloud8


        this.setState({
          layout:layout,
          loading:false
        })
      })
    });
  }

  
  handleOk = e => {
    console.log(e);
    this.setState({
      modalAddMore: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      modalAddMore: false,
    });
  };

  toggleAddMore = ()=>{
    this.setState({
      modalAddMore:!this.state.modalAddMore
    })
  }
  
  changeMode=(e)=>{
    this.setState({
      edit:!this.state.edit
    })
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>


  render()
  {
  return(
  <Card className="animated fadeIn">
    <PageHeader
    title="Youtube"
    className="site-page-header"
    subTitle="analysis"
    // tags={<Tag color="blue">Running</Tag>}
    extra={[
      // <Button key="3">Operation</Button>,
      <Switch onChange={this.changeMode} unCheckedChildren="View mode" checkedChildren="Edit mode" checked={this.state.edit} />,
      <Button key="1" onClick = {this.toggleAddMore} type="primary">
        Add more
      </Button>
    ]}
    avatar={{ src: '/assets/yt.png' }}
  >
    <Content
      extraContent={
        <img
          src="/assets/yt-banner.png"
          alt="content"
          width="100%"
        />
      }
    >
      {content}
    </Content>
    </PageHeader>
    <CardBody className="pt-0">
      <Row>
        <Col>
        <RangePicker className="float-right" value={[moment().add(-30, 'days'),moment()]}/>
        </Col>
      </Row>
      <Modal visible={this.state.modalAddMore}
       title="Add more"
       onOk={this.handleOk}
       onCancel={this.handleCancel}
      >
         <Select
        showSearch
        style={{ width: '100%' }}
        placeholder="Select channel or topic to add"
        optionFilterProp="children"
        onChange={this.onChangeNewType}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value="channel">Channel</Option>
        <Option value="topic">Topic</Option>
      </Select > 
      <br>
      </br>
      <br></br>
      <Input placeholder="Input id">
      </Input>
      </Modal>
      <DraggableTabs>
        <TabPane tab="Overview" key="1">
        {this.state.loading?
              <div style={{textAlign:'center'}}>
              <Spin size="large"></Spin>
              </div>
              :<Row>
              <CardBody className="card-layout">
                  <Dnd id={'layout-yt'} layout={this.state.layout} edit={this.state.edit}></Dnd>
              </CardBody>
      
              </Row>}
        
        </TabPane>
        <TabPane tab="Channels" key="2">
          <MyList type={'channel'}/>
        </TabPane>
        <TabPane tab="Topics" key="3">
          <MyList type={'topic'}/>
        </TabPane>
      </DraggableTabs>
    </CardBody>
  </Card>
  )
  }
}