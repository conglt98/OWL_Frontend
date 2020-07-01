import React from 'react'
import {Spin, DatePicker,Switch, PageHeader, Tag, Button, Statistic, Descriptions, Row,Tabs } from 'antd';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {Card, Col,CardBody} from 'reactstrap'
import VideoHighlight from '../keyword/video/video-highlight'
import {getTasks} from '../../data'
import moment from 'moment'
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
      task:{},
      loading:false
    }
  }  

  componentWillMount=()=>{
    this.setState({ loading: true }, () => {
        getTasks().then(res=>{
            this.setState({
                task:res.find(ele=>ele.id==this.props.match.params.taskid),
                loading:false
            })
        })
    });
  }
  
  changeMode=(e)=>{
    this.setState({
      edit:!this.state.edit
    })
  }
    render()
    {
        return(
        <Card>
          <PageHeader
      className="site-page-header"
      onBack={() => window.history.back()}
      title={this.state.task?this.state.task.name:"None"}
      subTitle="task"
      avatar={{ src: '/assets/keyword-icon.png' }}
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
        {this.state.loading?
              <div style={{textAlign:'center'}}>
              <Spin size="large"></Spin>
              </div>
              :<VideoHighlight data={this.state.task}/>
            }
            
            </CardBody>
        </Card>
        )
    }
}