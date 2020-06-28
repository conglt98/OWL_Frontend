import React from 'react'
import { Card, Avatar, BackTop } from 'antd';
import { ShareAltOutlined, CommentOutlined, LikeOutlined } from '@ant-design/icons';

import {Row, Col} from 'reactstrap'
import './index.css'

import {connect} from 'react-redux';
import {setPeekVideo} from '../../../reducers/MainEvent'

const { Meta } = Card;

class ResponsivePlayer extends React.Component {
    constructor(props){
        super(props)
        this.state={
            pip:false,
            zoom:false
        }
        this.myRef = React.createRef();
    }

    zoomImg=()=>{
        this.setState({
            zoom:!this.state.zoom
        })
    }
    togglePIP=()=>{
        this.setState({
            pip:!this.state.pip
        })
    }

    componentWillReceiveProps=(nextProps)=>{
        console.log(nextProps.seekVideo)
        this.myRef.current.seekTo(nextProps.seekVideo.time, 'seconds');
    }

    render () {
      return (
        <>
        <Row className="animated fadeIn justify-content-center">
            <Col md={this.state.zoom?12:6}>
                {/* <img src="https://drive.google.com/uc?export=view&id=1CBhvLjshAFJOnHYOzjEGye7mJ5o2Xpcw" alt="img of posts"></img> */}
                <Card
                hoverable
                style={{ width: 'auto' }}
                cover={
                <img onClick={this.zoomImg}
                    alt="example"
                    src="https://drive.google.com/uc?export=view&id=1CBhvLjshAFJOnHYOzjEGye7mJ5o2Xpcw"
                />
                }
                actions={[
                <LikeOutlined />,
                <CommentOutlined />,
                <ShareAltOutlined />,

                ]}
            >
                <Meta
                avatar={<Avatar src="https://drive.google.com/uc?export=view&id=1CBhvLjshAFJOnHYOzjEGye7mJ5o2Xpcw" />}
                title="Card title"
                description="This is the description"
                />
            </Card>
        
            </Col>
            
        </Row>
        {/* <BackTop visibilityHeight={20}>
        </BackTop> */}
        </>
      )
    }
  }


const mapStateToProps = state => ({
    seekVideo: state.MainEvent.peekVideo,
});
const mapDispatchToProps = dispatch => ({
setPeekVideo:data => dispatch(setPeekVideo(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResponsivePlayer);