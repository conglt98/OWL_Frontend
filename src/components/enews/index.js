import React,{useEffect} from 'react'
import {message,BackTop,Affix,Select,Spin,DatePicker, Switch,Typography ,PageHeader, Tag, Button, Statistic, Descriptions, Row,Tabs } from 'antd';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {Card, CardBody, Col} from 'reactstrap'
import './index.css'
import moment from 'moment'
import Masonry from './masonry/index'
import {getListNews} from '../../data/enews'
const { TabPane } = Tabs;
const { Paragraph } = Typography;
const { RangePicker } = DatePicker;
const{Option} = Select

message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
});
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
      OWL platform can support users to get news from online newspaper daily.
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
      listNews:[],
      language:'all',
      range:[moment().add(-30, 'days'),moment()],
    }
  }  

  onChangeRangePicker=(e)=>{
    console.log(e)
    this.setState({
      range:e
    })
  }

  componentWillMount=()=>{
    if (!(this.state.range&&this.state.range[0]&&this.state.range[1])){
      message.error("Input date range!")
      return;
    }

    let start = moment(this.state.range[0]).format('YYYYMMDD')
    let end = moment(this.state.range[1]).format('YYYYMMDD')
    
    let dataRange = {
      'ymdFrom':start,
      'ymdTo':end
    }
    this.setState({ loading: true }, () => {
      getListNews(dataRange, 'vnexpress').then(res=>{
        res = res.data
        res = res.data&&res.data.length > 0?res.data:[]
        this.setState({
          listNews:res,
          loading:false
        })
      })
    });
  }

  refresh=()=>{
    this.componentWillMount()
  }
  
  changeMode=(e)=>{
    this.setState({
      edit:!this.state.edit
    })
  }

  onChangeLanguage=(e)=>{
    this.setState({ 
      language:e
    })
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  render()
  {
  return(
  <Card>
    <PageHeader
    title="E-news"
    className="site-page-header animated fadeIn"
    subTitle="feed"
    // tags={<Tag color="blue">Running</Tag>}
    extra={[
      // <Button key="3">Operation</Button>,
      // <Switch onChange={this.changeMode} unCheckedChildren="View mode" checkedChildren="Edit mode" checked={this.state.edit} />,
    ]}
    avatar={{ src: '/assets/feed-icon.png' }}
  >
    <Content
      extraContent={
        <img
          src="/assets/feed-banner.jpeg"
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
        <Col md={12}>
        <Button className="float-right"  key="1" onClick={this.refresh} type="primary">
          Refresh
        </Button>
        <RangePicker className="float-right" style={{marginRight:'5px'}}  
                     value={this.state.range}
                     onChange={this.onChangeRangePicker}
                     />
        <Select 
         className="float-right"
         defaultValue="all"
         style={{ width: '200px', marginRight:'5px'}}
         placeholder="Select language"
         onChange={this.onChangeLanguage}>
          <Option value='all'>
            All
          </Option>
          <Option value='vi'>
            Vietnamese
          </Option>
          <Option value='en'>
            English
          </Option>
        </Select>

        </Col>
      </Row>      
      <DraggableTabs>
        <TabPane tab="Articles" key="1">
        <Row>
        
        <CardBody className="card-layout">
        {this.state.loading?
              <div style={{textAlign:'center'}}>
              <Spin size="large"></Spin>
              </div>
              :<Masonry language={this.state.language} data={this.state.listNews}/>}
        </CardBody>

        </Row>
        <BackTop />
        </TabPane>
      </DraggableTabs>
    </CardBody>
  </Card>
  )
  }
}