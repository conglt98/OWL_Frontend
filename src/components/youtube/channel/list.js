import React from 'react'
import { List, message, Avatar, Card, Spin , Space} from 'antd';
import {DeleteOutlined} from '@ant-design/icons'
import { MessageOutlined, LikeOutlined, EyeOutlined } from '@ant-design/icons';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';

import reqwest from 'reqwest';

import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import VList from 'react-virtualized/dist/commonjs/List';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';

const { Meta } = Card;

const dataRaw = [
  {
    title: 'Title 1',
  },
  {
    title: 'Title 2',
  },
  {
    title: 'Title 3',
  },
  {
    title: 'Title 4',
  },
  {
    title: 'Title 5',
  },
  {
    title: 'Title 6',
  },
];

const fakeDataUrl = 'https://randomuser.me/api/?results=5&inc=name,gender,email,nat&noinfo';
message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
  rtl: true,
});

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);


export default class VirtualizedExample extends React.Component {
  state = {
    data: [],
    loading: false,
  };

  loadedRowsMap = {};

  componentDidMount() {
    this.fetchData(res => {
      this.setState({
        data: dataRaw,
      });
    });
  }

  fetchData = callback => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: res => {
        callback(res);
      },
    });
  };

  handleInfiniteOnLoad = ({ startIndex, stopIndex }) => {
    let { data } = this.state;
    this.setState({
      loading: true,
    });
    for (let i = startIndex; i <= stopIndex; i++) {
      // 1 means loading
      this.loadedRowsMap[i] = 1;
    }
    if (data.length > 19) {
      message.warning('Virtualized List loaded all');
      this.setState({
        loading: false,
      });
      return;
    }
    this.fetchData(res => {
      data = data.concat(res.results);
      this.setState({
        data,
        loading: false,
      });
    });
  };

  isRowLoaded = ({ index }) => !!this.loadedRowsMap[index];

  renderItem = ({ index, key, style }) => {
    const { data } = this.state;
    const item = data[index];
    return (
      <List.Item 
      key={key} 
      style={style}
      actions={[
        <IconText icon={EyeOutlined} text="156" key="list-vertical-star-o" />,
        <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
        <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
      ]}
      extra={
        <img
          width={272}
          alt="logo"
          src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
        />
      }
      >
        <List.Item.Meta
          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title={<a href={"/#/project/youtube/"+index}>{item.name.last}</a>}
          description={item.email}
        />
      </List.Item>
    );
  };

  render() {
    const { data } = this.state;
    const vlist = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered, width }) => (
      <VList
        autoHeight
        height={height}
        isScrolling={isScrolling}
        onScroll={onChildScroll}
        overscanRowCount={2}
        rowCount={data.length}
        rowHeight={200}
        rowRenderer={this.renderItem}
        onRowsRendered={onRowsRendered}
        scrollTop={scrollTop}
        width={width}
      />
    );
    const autoSize = ({ height, isScrolling, onChildScroll, scrollTop, onRowsRendered }) => (
      <AutoSizer disableHeight>
        {({ width }) =>
          vlist({
            height,
            isScrolling,
            onChildScroll,
            scrollTop,
            onRowsRendered,
            width,
          })
        }
      </AutoSizer>
    );
    const infiniteLoader = ({ height, isScrolling, onChildScroll, scrollTop }) => (
      <InfiniteLoader
        isRowLoaded={this.isRowLoaded}
        loadMoreRows={this.handleInfiniteOnLoad}
        rowCount={data.length}
      >
        {({ onRowsRendered }) =>
          autoSize({
            height,
            isScrolling,
            onChildScroll,
            scrollTop,
            onRowsRendered,
          })
        }
      </InfiniteLoader>
    );
    return (
      <List
    grid={{
      gutter: 16,
      xs: 1,
      sm: 2,
      md: 3,
      lg: 3,
      xl: 3,
      xxl: 3,
    }}
    dataSource={data}
    renderItem={item => (
      <List.Item>
        <Card
          style={{ width: 300 }}
          cover={
            <img
              alt="example"
              src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
            />
          }
          actions={[
            <EyeOutlined key="setting" />,
            <LikeOutlined key="edit" />,
            <MessageOutlined key="ellipsis" />,
          ]}
        >
          <Meta
            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
            title={<a href={`/#/project/youtube/${this.props.id}/${item.title}`}>{item.title}</a>}
            description="This is the description"
          />
        </Card>
      </List.Item>
    )}
    />
      // <List>
      //   {data.length > 0 && <WindowScroller>{infiniteLoader}</WindowScroller>}
      //   {this.state.loading && <Spin className="demo-loading" />}
      // </List>
      
    );
  }
}