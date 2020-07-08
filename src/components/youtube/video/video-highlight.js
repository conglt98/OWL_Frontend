import React from 'react'
import ReactPlayer from 'react-player'
import {Button, Affix, BackTop } from 'antd'
import {Row, Col} from 'reactstrap'
import Masonry from './masonry/index'
import './index.css'

import {connect} from 'react-redux';
import {setPeekVideo} from '../../../reducers/MainEvent'


class ResponsivePlayer extends React.Component {
    constructor(props){
        super(props)
        this.state={
            pip:false
        }
        this.myRef = React.createRef();
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
            <Col md={10}>
                <Affix offsetTop={55}>
                    <div className='player-wrapper'>
                    <ReactPlayer
                        ref={this.myRef}
                        playing={true}
                        pip ={this.state.pip}
                        className='react-player'
                        controls={true}
                        url={'https://www.youtube.com/watch?v='+this.props.data.videoId}
                        width='100%'
                        height='100%'
                        config={{
                            youtube: {
                            playerVars: { showinfo: 1 }
                            }
                        }}
                    />
                    </div>
                </Affix>
            </Col>
            {/* <Col md={4}>
                <Affix offsetTop={55}>
                <h4 className="list-events">List events</h4>
                </Affix>
                
                <Masonry/>
            </Col> */}
        </Row>
        <BackTop visibilityHeight={20}>
        </BackTop>
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