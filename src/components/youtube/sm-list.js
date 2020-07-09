import React from 'react'
import { List, message, Avatar, Spin } from 'antd';
import {DeleteOutlined} from '@ant-design/icons'

import reqwest from 'reqwest';
import moment from 'moment'
import WindowScroller from 'react-virtualized/dist/commonjs/WindowScroller';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import VList from 'react-virtualized/dist/commonjs/List';
import InfiniteLoader from 'react-virtualized/dist/commonjs/InfiniteLoader';
import {getListChannel, getTopicChannel} from '../../data/youtube'
import TOPIC from '../youtube/TOPIC'

message.config({
  top: 100,
  duration: 2,
  maxCount: 3,
});

export default class VirtualizedExample extends React.Component {
  state = {
    data: [],
    loading: false,
  };

  loadedRowsMap = {};

  componentWillReceiveProps=(props)=>{
    let start = moment(props.range[0]).format('YYYYMMDD')
    let end = moment(props.range[1]).format('YYYYMMDD')
    this.reload(start, end)  }

  componentDidMount() {
    let start = moment(this.props.range[0]).format('YYYYMMDD')
    let end = moment(this.props.range[1]).format('YYYYMMDD')
    this.reload(start, end)
  }

  reload = (start, end) =>{
    this.setState({loading:true},()=>{
      if (this.props.type=='topic'){
        getTopicChannel({
          "ymdFrom":end,
          "ymdTo":end,
        }).then(res=>{
          if (res.status == 200)
          {
            res = res.data
            this.setState({
              data: res.data,
              loading:false,
            });
            message.success(res.msg)
          }
        })
      }else{
        getListChannel({
          "ymdFrom":end,
          "ymdTo":end
        }).then(res=>{
          if (res.status == 200)
          {
            res = res.data
            this.setState({
              data: res.data,
              loading:false,
            });
            message.success(res.msg)
          }
        })
      }
    })
  }


  handleInfiniteOnLoad = ({ startIndex, stopIndex }) => {
    let { data } = this.state;
    this.setState({
      loading: true,
    });
    for (let i = startIndex; i <= stopIndex; i++) {
      // 1 means loading
      this.loadedRowsMap[i] = 1;
    }
    if (data.length >= data.length) {
      // message.info('Virtualized List loaded all');
      this.setState({
        loading: false,
      });
      return;
    }
    let start = moment(this.props.range[0]).format('YYYYMMDD')
    let end = moment(this.props.range[1]).format('YYYYMMDD')
    if (this.props.type == 'topic'){
      getTopicChannel({
        "ymdFrom":end,
        "ymdTo":end
      }).then(res=>{
        if (res.status==200){
          res =res.data
          data = data.concat(res.data);
          this.setState({
            data,
            loading: false,
          });
        }
      })
    }
    else{
      getListChannel({
        "ymdFrom":end,
        "ymdTo":end
      }).then(res=>{
        if (res.status==200){
          res =res.data
          data = data.concat(res.data);
          this.setState({
            data,
            loading: false,
          });
        }
      })
    }
  };

  isRowLoaded = ({ index }) => !!this.loadedRowsMap[index];

  renderItem = ({ index, key, style }) => {
    const { data } = this.state;
    const item = data[index];
    const type = this.props.type

    const id = type == 'topic'?item.replaceAll('/','_'):item.channelId
    const name =  type == 'topic'?TOPIC[item]:item.title
    return (
      <List.Item key={key} style={style}>
        <List.Item.Meta
          avatar={<Avatar src={this.props.type==='topic'?"/assets/topic-icon.png":item.thumbnails} />}
          title={<a href={"/#/project/youtube/"+this.props.type+"/"+id}>{name}</a>}
          description={item.email}
        />
        <div><DeleteOutlined style={{color:'red'}} /></div>
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
        rowHeight={73}
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
      <List>
        {data.length > 0 && <WindowScroller>{infiniteLoader}</WindowScroller>}
        {this.state.loading && <Spin className="demo-loading" />}
      </List>
    );
  }
}