import React,{useEffect} from 'react'
import {DatePicker, Switch,Typography ,PageHeader, Tag, Button, Statistic, Descriptions, Row,Tabs } from 'antd';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {Card, CardBody, Col} from 'reactstrap'
import Dnd from "../dnd";
import Layout from './layout'
import './index.css'
import MyList from './sm-list'
import moment from 'moment'
const { TabPane } = Tabs;
const { Paragraph } = Typography;
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
export default class Demo extends React.Component{
  constructor(props){
    super(props)
    this.state={
      edit:false,
      layout:Layout
    }
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
    title="Youtube"
    className="site-page-header"
    subTitle="analysis"
    // tags={<Tag color="blue">Running</Tag>}
    extra={[
      // <Button key="3">Operation</Button>,
      <Switch onChange={this.changeMode} unCheckedChildren="View mode" checkedChildren="Edit mode" checked={this.state.edit} />,
      <Button key="1" type="primary">
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
        <RangePicker className="float-right" value={[moment().add(-1, 'days'),moment().add(-1, 'days')]}/>
        </Col>
      </Row>
      <DraggableTabs>
        <TabPane tab="Overview" key="1">
        <Row>
        
        <CardBody className="card-layout">
            <Dnd id={'layout-yt'} layout={this.state.layout} edit={this.state.edit}></Dnd>
        </CardBody>

        </Row>
        </TabPane>
        <TabPane tab="Channels" key="2">
          <MyList/>
        </TabPane>
      </DraggableTabs>
    </CardBody>
  </Card>
  )
  }
}