import React from 'react'
import {Spin,Input, Select, Modal, Typography ,PageHeader, Tag, Button, Statistic, Descriptions, Row,Tabs, message } from 'antd';
import { DndProvider, DragSource, DropTarget } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {Card, CardBody,Col} from 'reactstrap'
import './index.css'  
import MyList from './list'
import {getModelsAPI, postFromURL, getConfig} from '../../../data'
import TableDetail from '../../models/tableDetail'
const { TabPane } = Tabs;
const { Paragraph } = Typography;
const {Option} = Select

message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
  rtl: true,
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
    <img className="example-link-icon" src={src} alt={text} /> &nbsp;<span style={{color:"#4B90FF"}}>{text}</span> &nbsp;&nbsp;

    </Row>
  </a>
);

const content = (
  <>
    <Paragraph>
      OWL platform can support users to upload data from local or put link for video highlight.
      <br></br>
      All data are collected and analyzed then visualized then show on dashboard.
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
      visible:false,
      modelAPI:[],
      modelAPIChoose:{},
      sourceType:'',
      link:'',
      manualName:'',
      loading:false,
      modelType:'',
      isAPIModelDisable:true,
    }
  }
  componentWillMount=()=>{
    this.setState({ loading: true }, () => {
      getModelsAPI('FaceRecognition').then(res=>{
        this.setState({
          modelAPI:res,
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

  refresh=()=>{
    this.setState({ loading: true }, () => {
      getModelsAPI('FaceRecognition').then(res=>{
        this.setState({
          modelAPI:res,
          loading:false
        })
      })
    });
  }


  handleOk = e => {
    let request = {}

    if (this.state.sourceType != 'upload'){
      request.link = this.state.link
      request.typeSrc = 'video'
      request.username = localStorage.getItem('auth')
      request.manualName = this.state.manualName
      request.modelId = this.state.modelAPIChoose.id

      postFromURL(getConfig('MODEL', 'FaceRecognition')+"models/"+request.modelId, request).then(
        res =>{
          message.success(res.status +" - "+res.statusText)
        }
      )
    }

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

  onChangeSourceType = (value)=> {
    this.setState({
      sourceType:value
    })
  }

  onChangeLink = (value)=> {
    this.setState({
      link:value.target.value
    })
  }

  onChangeManualName = (value)=> {
    this.setState({
      manualName:value.target.value
    })
  }

    render()
    {
        return(
        <Card>
           <PageHeader
    title="Video highlight"
    className="site-page-header"
    subTitle="manual"
    // tags={<Tag color="blue">Running</Tag>}
    extra={[
      // <Button key="3">Operation</Button>,
      // <Button key="2">Operation</Button>,
      <Button key="2" onClick={this.refresh}>Refresh</Button>,

      <Button key="1" type="primary" onClick={this.showModal}>
        Create task
      </Button>
    ]}
    avatar={{ src: '/assets/videohighlight.png' }}
  >
    <Content
      extraContent={
        <img
          src="/assets/videohighlight-banner.jpg"
          alt="content"
          width="100%"
        />
      }
    >
      {content}
    </Content>
    <Modal
          title="Create task"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={950}
    >
      <Row>
      <Col md={4}>
      <div>Name task</div>
      <Input style={{ width: '100%' }} onChange={this.onChangeManualName}></Input>
      <br></br>
      <br></br>
      <br></br>
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
        <Option value={'FaceRecognition'}>FaceRecognition</Option>
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
      <br></br>
      <br></br>
      <br></br>

      <div>
        Select source type
      </div>
      <Select
        showSearch
        style={{ width: '100%' }}
        placeholder="Select link or upload"
        optionFilterProp="children"
        onChange={this.onChangeSourceType}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value="link">Link video youtube</Option>
        {/* <Option value="upload">Upload video local</Option> */}
      </Select>   

      <br></br>
      <br></br>
      <br></br>

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
    <DraggableTabs>
            <TabPane tab="Task Videos" key="1">
            {this.state.loading?
              <div style={{textAlign:'center'}}>
              <Spin size="large"></Spin>
              </div>
              :<MyList/>}

            </TabPane>
        </DraggableTabs>
    </CardBody>
        </Card>
        )
    }
}