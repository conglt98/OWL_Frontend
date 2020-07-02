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
        this.myRef = React.createRef();

        this.state={
            pip:false,
            listEvent:[],
            played: 0,
            loaded: 0,
            duration: 0,
            refresh:false,
      }
    }

    togglePIP=()=>{
        this.setState({
            pip:!this.state.pip
        })
    }

    refreshEvent=()=>{
        this.setState({
            listEvent:[],
        })
    }

    handleSeekChange = e => {
        this.setState({ played: parseFloat(e.target.value) })
    }

    handleDuration = (duration) => {
        console.log('onDuration', duration)
        this.setState({ duration })
      }

    componentWillReceiveProps=(nextProps)=>{
        console.log(nextProps.seekVideo)
        this.myRef.current.seekTo(nextProps.seekVideo.time-1, 'seconds');
    }

    handlePlay = () => {
        console.log('onPlay')
        this.setState({ playing: true })
      }
    
      handleEnablePIP = () => {
        console.log('onEnablePIP')
        this.setState({ pip: true })
      }
    
      handleDisablePIP = () => {
        console.log('onDisablePIP')
        this.setState({ pip: false })
      }
    
      handlePause = () => {
        console.log('onPause')
        this.setState({ playing: false })
      }
    
      handleSeekMouseDown = e => {
        this.setState({ seeking: true })
      }
    
      handleSeekChange = e => {
        this.setState({ played: parseFloat(e.target.value) })
      }
    
      handleSeekMouseUp = e => {
        this.setState({ seeking: false })
        this.player.seekTo(parseFloat(e.target.value))
      }
    
      handleProgress = state => {
        console.log('onProgress', state)
        // We only want to update time slider if we are not currently seeking
        if (!this.state.seeking) {
          this.setState(state)
        }
      }
    
      handleEnded = () => {
        console.log('onEnded')
        this.setState({ playing: this.state.loop })
      }
    
      handleDuration = (duration) => {
        console.log('onDuration', duration)
        this.setState({ duration })
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
                        url={this.props.data?this.props.data.link:'https://www.youtube.com/watch?v=zI2QH6flLzI'}
                        width='100%'
                        height='100%'
                        config={{
                            youtube: {
                            playerVars: { showinfo: 1 }
                            }
                        }}
                        onPlay={this.handlePlay}
                        onEnablePIP={this.handleEnablePIP}
                        onDisablePIP={this.handleDisablePIP}
                        onPause={this.handlePause}
                        onBuffer={() => console.log('onBuffer')}
                        onSeek={e => console.log('onSeek', e)}
                        onEnded={this.handleEnded}
                        onError={e => console.log('onError', e)}
                        onProgress={this.handleProgress}
                        onDuration={this.handleDuration}
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
                <Masonry data = {this.state.listEvent} videoData = {this.props.data} currentTime = {format(this.state.played*this.state.duration)}/>
            </Col>
        </Row>
        <BackTop visibilityHeight={20}>
        </BackTop>
        </>
      )
    }
  }

function format (seconds) {
const date = new Date(seconds * 1000)
const hh = date.getUTCHours()
const mm = date.getUTCMinutes()
const ss = pad(date.getUTCSeconds())
if (hh) {
    return `${hh}:${pad(mm)}:${ss}`
}
return `${mm}:${ss}`
}

function pad (string) {
return ('0' + string).slice(-2)
}

const mapStateToProps = state => ({
    seekVideo: state.MainEvent.peekVideo,
});
const mapDispatchToProps = dispatch => ({
setPeekVideo:data => dispatch(setPeekVideo(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ResponsivePlayer);