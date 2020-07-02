import React from 'react'
import {message, Modal, Select, Input, DatePicker,Switch, PageHeader, Tag, Button, Statistic, Descriptions, Row,Tabs } from 'antd';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {Card, Col,CardBody} from 'reactstrap'
import Dnd from "../../dnd";
import Layout from './layout'
import VideoHighlight from './video-highlight'
import moment from 'moment'
import './index.css'
import {getModelsAPI, postFromURL, getConfig} from '../../../data'
import TableDetail from '../../models/tableDetail'

const {Option} = Select
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
      modelType:'',
      isAPIModelDisable:true,
      visible:false,
      modelAPI:[],
      modelAPIChoose:{},
    }
  }  

  componentWillMount=()=>{
    this.setState({ loading: true }, () => {
      getModelsAPI().then(res=>{
        this.setState({
          modelAPI:res,
          modelAPIChoose: res[0],
          loading:false
        })
      })
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  onChange = (value)=> {
    this.setState({
      modelAPIChoose:this.state.modelAPI.find(ele=>ele.id==value)
    })
  }

  onChangeModelType = (value)=> {
    if (value){
      this.setState({
        isAPIModelDisable: false
      })  
    }
    this.setState({
      modelType: value
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
        <Card>
          <PageHeader
      className="site-page-header"
      onBack={() => window.history.back()}
      title={"Video_"+this.props.match.params.videoid}
      subTitle="video"
      extra={[
        // <Button key="3">Operation</Button>,
        <Switch onChange={this.changeMode} unCheckedChildren="View mode" checkedChildren="Edit mode" checked={this.state.edit} />,
        <Button key="1"  onClick={this.showModal}>
         {this.state.modelAPIChoose.type} - {this.state.modelAPIChoose.name}
        </Button>
      ]}
      avatar={{ src: '/assets/keyword-icon.png' }}
    >
      <Modal
          title="Choose model for video"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={950}
    >
      <Row>
      <Col md={4}>
      <div>Select model type</div>
        <Select
        showSearch
        style={{ width: '100%' }}
        placeholder="Select type"
        optionFilterProp="children"
        onChange={this.onChangeModelType}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value={'CenterNet'}>CenterNet</Option>
      </Select>
      <br></br>
      <br></br>
      <br></br>
      <div>Select API model</div>
        <Select
        showSearch
        disabled={this.state.isAPIModelDisable}
        style={{ width: '100%' }}
        placeholder="Select model"
        optionFilterProp="children"
        onChange={this.onChange}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {this.state.modelAPI.map(ele=>{
          return (
          <Option value={ele.id}>{ele.name}</Option>
          )
      })}
      </Select>

      <div>
        {this.state.sourceType?
        
        <React.Fragment>
          <div>Link video</div>
          <Input style={{ width: '100%' }} onChange={this.onChangeLink}></Input>  
        </React.Fragment>
        
        :<span></span>}
      </div>
      </Col>
      <Col md={8}>
      {this.state.modelAPIChoose?
          <TableDetail data={this.state.modelAPIChoose}></TableDetail>
      :<div></div>}
      </Col>  
      </Row>   
    </Modal>
    </PageHeader>
        <CardBody className="pt-0">
            <Row>
              <Col>
              {/* <RangePicker className="float-right" value={[moment().add(-1, 'days'),moment().add(-1, 'days')]}/> */}
              </Col>
            </Row>
            <DraggableTabs>
            
            <TabPane tab="Analysis" key="1">
            <Row>
        
            <CardBody className="card-layout">
                <Dnd layout={Layout} edit={this.state.edit}></Dnd>
            </CardBody>

            </Row>
            </TabPane>
            <TabPane tab="Video" key="2">
              <VideoHighlight/>
            </TabPane>
        </DraggableTabs>
            </CardBody>
        </Card>
        )
    }
}