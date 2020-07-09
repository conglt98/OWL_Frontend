import React from 'react'
import {Spin,DatePicker,Switch, PageHeader, Tag, Button, Statistic, Descriptions, Row,Tabs } from 'antd';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {Card, Col,CardBody} from 'reactstrap'
import Dnd from "../../dnd";
import Layout from './layout'
import LayoutView from './layoutview'
import LayoutSentimental from './layoutsentimental'
import LayoutReaction from './layoutreaction'
import LayoutFavourite from './layoutfavourite'
import VideoHighlight from './video-highlight'
import moment from 'moment'
import {getVideoInfo, getVideoStatistic, getVideoAnalysisComments} from '../../../data/youtube'
import './index.css'
// import MyList from './list'
// import MyList from '../../masonry/index'
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
      video:{},
      layout:Layout,
      loading:false,
      range:[moment().add(-30, 'days'),moment()],

    }
  }  
  onChangeRangePicker=(e)=>{
    console.log(e)
    this.setState({
      range:e
    })
  }

   refresh=()=>{
    this.componentWillMount()
  }
  

  componentWillMount=async()=>{
    let start = moment(this.state.range[0]).format('YYYYMMDD')
    let end = moment(this.state.range[1]).format('YYYYMMDD')
    
    this.setState({ loading: true }, () => {
    getVideoInfo({'ymdFrom':start,'ymdTo':end},this.props.match.params.videoid).then(
      async (res)=>{
        res = res.data


        let videoStatistic = await getVideoStatistic({'ymdFrom':start,'ymdTo':end}, this.props.match.params.videoid)
        videoStatistic = videoStatistic.data
        
        let layout = this.state.layout
        let data = videoStatistic.data && videoStatistic.data.length > 0?videoStatistic.data:[]
        let chart1 = 0
        let chart2 = []
        let chart3 = 0
        let chart4 = []


        let maxDate = data[0].updatedAt
        data.map(ele=>{
          if (ele.updatedAt > maxDate){
            maxDate = ele.updatedAt
          }
        })


        data.map(ele=>{
          if (ele.updatedAt == maxDate){
            chart1 = parseInt(ele.viewCount)

            chart2.push({
              type:'Like',
              value:parseInt(ele.likeCount)
            })

            chart2.push({
              type:'Dislike',
              value:parseInt(ele.dislikeCount)
            })
            chart2.push({
              type:'Comment',
              value:parseInt(ele.commentCount)
            })
            chart2.push({
              type:'Favourite',
              value:parseInt(ele.favoriteCount)
            })

            chart4.push({
              type:'Like',
              video:ele.title,
              value:parseInt(ele.likeCount)
            })

            
            chart4.push({
              type:'Comment',
              video:ele.title,
              value:parseInt(ele.commentCount)
            })
            chart4.push({
              type:'Dislike',
              video:ele.title,
              value:parseInt(ele.dislikeCount)
            })
            chart4.push({
              type:'Favourite',
              video:ele.title,
              value:parseInt(ele.favoriteCount)
            })

          }  
        })

        let comments = await getVideoAnalysisComments({'ymdFrom':start,'ymdTo':end}, this.props.match.params.videoid)
        comments = comments.data
        comments = comments.data?comments.data:[]
        let positive = 0;
        let negative = 0;
        comments.map(ele=>{
          if (ele.sentiment == -1){
            negative = negative + ele.count
          }
          if (ele.sentiment == 1){
            positive = positive + ele.count
          }
        })
        if (positive +negative > 0){
          chart3 = positive*100/(positive+negative)

        }else{
          chart3 = 0
        }
        
        layout.tasks['task-1'].data = chart1
        layout.tasks['task-2'].data = chart3

        layout.tasks['task-3'].data = chart2
        layout.tasks['task-4'].data = chart4


        console.log(chart1)
        this.setState({
          video: res.data && res.data.length > 0?res.data[0]:{},
          layout:layout,
          loading:false
        })
      }
    )
    })
  }
  
  changeMode=(e)=>{
    this.setState({
      edit:!this.state.edit
    })
  }
    render()
    {
        return(
          <div>
            {this.state.loading?
            <div style={{textAlign:'center'}}>
            <Spin size="large"></Spin>
            </div>
            :
            <Card>
              <PageHeader
          className="site-page-header"
          onBack={() => window.history.back()}
          title={this.state.video.title}
          subTitle="video"
          extra={[
            // <Button key="3">Operation</Button>,
            <Switch onChange={this.changeMode} unCheckedChildren="View mode" checkedChildren="Edit mode" checked={this.state.edit} />,
          ]}
          avatar={{ src: '/assets/yt.png' }}
        >
          {/* <Descriptions size="small" column={2}>
            <Descriptions.Item label="Created">Lili Qu</Descriptions.Item>
            <Descriptions.Item label="Association">
              <a>421421</a>
            </Descriptions.Item>
            <Descriptions.Item label="Creation Time">2017-01-10</Descriptions.Item>
            <Descriptions.Item label="Effective Time">2017-10-10</Descriptions.Item>
            <Descriptions.Item label="Remarks">
              Gonghu Road, Xihu District, Hangzhou, Zhejiang, China
            </Descriptions.Item>
          </Descriptions> */}
        </PageHeader>
            <CardBody className="pt-0">
            <Row>
                <Col md={12}>
                  <Button className="float-right"  key="1" onClick={this.refresh} type="primary">
                    Refresh
                  </Button>
                  <RangePicker className="float-right" style={{marginRight:'5px'}}  value={this.state.range} onChange={this.onChangeRangePicker}/>
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
    
                <TabPane tab="Views" key="2">
                <Row>
                <CardBody className="card-layout">
                    <Dnd layout={LayoutView} edit={this.state.edit}></Dnd>
                </CardBody>
                </Row>
                </TabPane>
    
                <TabPane tab="Sentimental" key="3">
                <Row>
                <CardBody className="card-layout">
                    <Dnd layout={LayoutSentimental} edit={this.state.edit}></Dnd>
                </CardBody>
                </Row>
                </TabPane>
    
                <TabPane tab="Reaction" key="4">
                <Row>
                <CardBody className="card-layout">
                    <Dnd layout={LayoutReaction} edit={this.state.edit}></Dnd>
                </CardBody>
                </Row>
                </TabPane>
    
                <TabPane tab="Favourite" key="5">
                <Row>
                <CardBody className="card-layout">
                    <Dnd layout={LayoutFavourite} edit={this.state.edit}></Dnd>
                </CardBody>
                </Row>
                </TabPane>
    
                <TabPane tab="Video" key="6">
                  <VideoHighlight data={this.state.video}/>
                </TabPane>
            </DraggableTabs>
                </CardBody>
            </Card>
            }
          </div>

        )
    }
}