import React from 'react'
import { Spin, DatePicker,Switch,PageHeader, Tag, Button, Statistic, Descriptions, Row,Tabs } from 'antd';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {Card, CardBody,Col} from 'reactstrap'
import Dnd from "../../dnd";
import Layout from './layout'
import LayoutSubscriber from './layoutsubscriber'
import LayoutView from './layoutview'
import LayoutUpload from './layoutupload'
import {getInfoChannel, getVideoChannel, getChannelStatistic} from '../../../data/youtube'
import moment from 'moment'
import './index.css'
// import MyList from './list'
import MyList from '../../masonry/index'
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;


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

export default class Demo extends React.Component{
  constructor(props){
    super(props)
    this.state={
      edit:false,
      channel:{},
      loading:false,
      layout:Layout
    }
  }  
  
  changeMode=(e)=>{
    this.setState({
      edit:!this.state.edit
    })
  }
  

  componentWillMount= async()=>{
    this.setState({ loading: true }, () => {
      getInfoChannel({'ymdFrom':'20200707','ymdTo':'20200708'},this.props.match.params.id).then(async (res)=>{
        res = res.data?res.data:{data:[]}
        console.log(res)
        
        let videos = await getVideoChannel({
          'ymdFrom':'20200708',
          'ymdTo':'20200708'
        }, this.props.match.params.id)
        videos = videos.data

        let channelStatistic = await getChannelStatistic({'ymdFrom':'20200608','ymdTo':'20200708'}, this.props.match.params.id)

        channelStatistic = channelStatistic.data
        let layout = this.state.layout
        let data = channelStatistic.data && channelStatistic.data.length > 0?channelStatistic.data:[]

        let chart1 = 0
        let chart2 = []
        let chart2_1 = []
        let chart2_2 = []
        let chart3 = []
        let chart4 = {
          name:'root',
          children:[]
        }

        let maxDate = data[0].updatedAt
        data.map(ele=>{
          if (ele.updatedAt > maxDate){
            maxDate = ele.updatedAt
          }
        })
        data.map(ele=>{
          if (ele.updatedAt == maxDate){
            chart1 = parseInt(ele.subscriberCount)
          }
          chart2_1.push({
            time:ele.updatedAt.substr(0, 4)+'-'+ele.updatedAt.substr(4, 2)+'-'+ele.updatedAt.substr(6, 2),
            value:parseInt(ele.videoCount),
            type:'uploads',
          })
          chart2_1.push({
            time:ele.updatedAt.substr(0, 4)+'-'+ele.updatedAt.substr(4, 2)+'-'+ele.updatedAt.substr(6, 2),
            value:parseInt(ele.subscriberCount),
            type:'subscribers',
          })
          chart2_2.push({
            time:ele.updatedAt.substr(0, 4)+'-'+ele.updatedAt.substr(4, 2)+'-'+ele.updatedAt.substr(6, 2),
            views:parseInt(ele.viewCount),
          })
          chart3.push({
            date:ele.updatedAt.substr(0, 4)+'-'+ele.updatedAt.substr(4, 2)+'-'+ele.updatedAt.substr(6, 2),
            type:'uploads',
            value:parseInt(ele.videoCount)
          })
          chart3.push({
            date:ele.updatedAt.substr(0, 4)+'-'+ele.updatedAt.substr(4, 2)+'-'+ele.updatedAt.substr(6, 2),
            type:'views (M)',
            value:parseInt(ele.viewCount)/1000000
          })
          chart3.push({
            date:ele.updatedAt.substr(0, 4)+'-'+ele.updatedAt.substr(4, 2)+'-'+ele.updatedAt.substr(6, 2),
            type:'subscribers (K)',
            value:parseInt(ele.subscriberCount)/1000
          })
         
        })
        chart2 = [chart2_1, chart2_2]
        layout.tasks['task-2'].data = chart1
        layout.tasks['task-1'].data = chart2
        layout.tasks['task-3'].data = chart3
        if (videos.data){
          videos.data.map(ele=>{
            chart4.children.push({
              name:ele.title,
              value:parseInt(ele.updatedAt)
            })
          })
        }

        layout.tasks['task-4'].data = chart4
        let videosOut = videos.data?videos.data:[]
        this.setState({
          channel: res.data.length > 0? res.data[0]:{},
          loading:false,
          videos: videosOut,
          layout:layout
        })
      })
    });
  }

    render()
    {
        return(
          <div>
            {this.state.loading?
            <div style={{textAlign:'center'}}>
            <Spin size="large"></Spin>
            </div>
            :<Card>
            <PageHeader
        className="site-page-header"
        onBack={() => window.history.back()}
        title={this.state.channel.title}
        subTitle="channel"
        extra={[
          // <Button key="3">Operation</Button>,
          <Switch onChange={this.changeMode} unCheckedChildren="View mode" checkedChildren="Edit mode" checked={this.state.edit} />,
        ]}
        avatar={{ src: this.state.channel.thumbnails }}
      >
        <Descriptions size="small" column={2}>
        <Descriptions.Item label="Country">{this.state.channel.country}</Descriptions.Item>
          <Descriptions.Item label="">
            <a></a>
          </Descriptions.Item>
      <Descriptions.Item label="Published at">{this.state.channel.publishedAt}</Descriptions.Item>
          <Descriptions.Item label=""></Descriptions.Item>
          <Descriptions.Item label="Updated at">
            {this.state.channel.updatedAt}
          </Descriptions.Item>
        </Descriptions>
      </PageHeader>
              <CardBody className="pt-0">
              <Row>
                <Col>
                <RangePicker className="float-right" value={[moment().add(-1, 'days'),moment().add(-1, 'days')]}/>
                </Col>
              </Row>
              <DraggableTabs>
              <TabPane tab="Overview" key="1">
              <Row>
          
              <CardBody className="card-layout">
                  <Dnd layout={this.state.layout} edit={this.state.edit}></Dnd>
              </CardBody>
  
              </Row>
              </TabPane>
              <TabPane tab="Subscribers" key="2">
                <Row>
          
                <CardBody className="card-layout">
                    <Dnd layout={LayoutSubscriber} edit={this.state.edit}></Dnd>
                </CardBody>
  
                </Row>
              </TabPane>
              <TabPane tab="Views" key="3">
              <Row>
          
                <CardBody className="card-layout">
                    <Dnd layout={LayoutView} edit={this.state.edit}></Dnd>
                </CardBody>
  
                </Row>
              </TabPane>
              <TabPane tab="Uploads" key="4">
              <Row>
          
                <CardBody className="card-layout">
                    <Dnd layout={LayoutUpload} edit={this.state.edit}></Dnd>
                </CardBody>
  
                </Row>
              </TabPane>
              <TabPane tab="Videos" key="5">
              <MyList id={this.props.match.params.id} data = {this.state.videos}/>
              </TabPane>
          </DraggableTabs>
              </CardBody>
          </Card>}
          </div>
        )
    }
}