import React from 'react'
import ReactPlayer from 'react-player'
import {Tag, Button, Affix, BackTop } from 'antd'
import {Row, Col} from 'reactstrap'
import Masonry from './masonry/index'
import './index.css'
import {SyncOutlined} from '@ant-design/icons'
import {connect} from 'react-redux';
import {setPeekVideo} from '../../../reducers/MainEvent'

class ResponsivePlayer extends React.Component {
    constructor(props){
        super(props)
        this.state={
            pip:false,
            listEvent:[]
        }
        this.myRef = React.createRef();
    }
    togglePIP=()=>{
        this.setState({
            pip:!this.state.pip
        })
    }

    refreshEvent=()=>{
        this.setState({
            listEvent:[]
        })
    }

    componentWillReceiveProps=(nextProps)=>{
        console.log(nextProps.seekVideo)
        this.myRef.current.seekTo(nextProps.seekVideo.time, 'seconds');
    }

    render () {
      return (
        <>
        <Row className="animated fadeIn">
            <Col md={8}>
                <Affix offsetTop={55}>
                    <div className='player-wrapper'>
                    <ReactPlayer
                        ref={this.myRef}
                        playing={true}
                        pip ={this.state.pip}
                        className='react-player'
                        controls={true}
                        url='https://www.youtube.com/watch?v=knW7-x7Y7RE'
                        width='100%'
                        height='100%'
                        config={{
                            youtube: {
                            playerVars: { showinfo: 1 }
                            }
                        }}
                    />
                    </div>
                    <br></br>
                    <div>
                    <Tag className="float-left" color="magenta">Keyword</Tag>
                    <Button onClick={this.refreshEvent} className="float-right" type="primary">Refresh</Button>
                    </div>
                </Affix>
                
            </Col>
            <Col md={4}>
                <Affix offsetTop={55}>
                <h4 className="list-events">List events</h4> 
                </Affix>
                <Masonry data = {this.state.listEvent}/>
            </Col>
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