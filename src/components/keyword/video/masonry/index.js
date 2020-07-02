import React from "react";
import useWindowScroll from "@react-hook/window-scroll";
import catNames from "cat-names";
import cats from "./cats";
import mock from './mock'
import { styles } from "./theme";
import { Masonry } from "masonic";
import 'animate.css/animate.css'
import {connect} from 'react-redux';
import {Drawer, Tag} from 'antd'
import {setPeekVideo} from '../../../../reducers/MainEvent'
import {getFromURL,getConfig} from '../../../../data'
import { controls } from "react-redux-form";

function format(time) {   
  // Hours, minutes and seconds
  var hrs = ~~(time / 3600);
  var mins = ~~((time % 3600) / 60);
  var secs = ~~time % 60;

  // Output like "1:01" or "4:03:59" or "123:03:59"
  var ret = "";
  if (hrs > 0) {
      ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
  }
  ret += "" + mins + ":" + (secs < 10 ? "0" : "");
  ret += "" + secs;
  return ret;
}

class App extends React.Component {
  constructor(props){
    super(props)

    let mockData = []
    if (!props.videoData){
      Object.keys(mock).map(ele=>{
        mockData.push({
          id:parseInt(ele.split('.')[0]),
          name:format(parseInt(ele.split('.')[0])),
          src:`https://drive.google.com/uc?export=view&id=${mock[ele]}`
        })
      })
  
      mockData.sort((a,b)=>a.id - b.id)
    }

    this.state = {
      mainId: this.props.id,
      showImg:false,
      item:{
        src:"",
        seconds: ""
      },
      // items: 
      // Array.from(Array(5000), () => ({
      //   id: i++,
      //   name: catNames.random(),
      //   src: randomChoice(cats)
      // })),
      masterItems: mockData,
      items:mockData
    }
  }

  componentWillMount= async ()=>{
    if (this.props.videoData){
      let videoId = this.props.videoData.link.split("=")
      videoId = videoId[videoId.length - 1]
      let modelId = this.props.videoData.modelId
      let url = getConfig('MODEL')+'result/video/'+videoId+"/"+modelId

      let res = await getFromURL(url)
      res = res.data
      let mockData = []
      Object.keys(res).map(ele=>{
        mockData.push({
          id:parseInt(ele.split('.')[0]),
          name:format(parseInt(ele.split('.')[0])),
          src:`https://drive.google.com/uc?export=view&id=${res[ele]}`
        })
      })
      mockData.sort((a,b)=>a.id - b.id)
      this.setState({
        masterItems:mockData,
        items:mockData
      })
    }
  }

  toggleShowImg = (id)=>{
    let src = this.state.items.find(ele=>ele.id == id).src
    this.setState({
      showImg:true,
      item:{
        src: src,
        seconds: id,
        id: id
      }
    })
  }

  toggleCloseImg = ()=>{
    this.setState({
      showImg:false
    })
  }

  componentWillReceiveProps=(nextProps)=>{
    let seconds = parseInt(nextProps.currentTime.split(":")[0])*60+parseInt(nextProps.currentTime.split(":")[1])
    if (seconds >= 0){
      this.setState({
        items:this.state.masterItems.filter(ele=>ele.id>=seconds)
      })
    }
    this.state.items.map(ele=>{
      let myId = 'imglist'+ ele.id 
      if (document.getElementById(myId)){
        if (document.getElementById(myId).classList.contains("animate__zoomOutLeft")){
          document.getElementById(myId).classList.remove("animate__zoomOutLeft")
          // document.getElementById(myId).classList.add("animate__zoomOutRight")
  
        }
      }
    })
  }

  processClickImg(id){
    let myId = 'imglist'+ id    
    document.getElementById(myId).classList.add("animate__animated");
    document.getElementById(myId).classList.add("animate__zoomOutLeft");
    this.props.setPeekVideo(JSON.parse(JSON.stringify({"time":id})))
  }
  
  FakeCard = ({ data: { id, name, src, animated } }) => (
        <div id={'imglist'+id} className={style("card")}>
        <img className={style("img")} alt="kitty" src={src} onClick={()=>{this.toggleShowImg(id)}}/>
        <span onClick={()=>{this.processClickImg(id)}} style={{marginTop:"5px"}} children={name} />
        {/* <span children={name}/> */}
        </div>
  );
  render(){
    return (
      <div className="animated fadeIn">
          <main className={style("container")}>
              <div className={style("masonic")}>
                  <Masonry
                  // Provides the data for our grid items
                  items={this.state.items}
                  // Adds 8px of space between the grid cells
                  columnGutter={8}
                  // Sets the minimum column width to 172px
                  columnWidth={250}
                  // Pre-renders 5 windows worth of content
                  overscanBy={5}
                  // This is the grid item component
                  render={this.FakeCard}
                  />
              </div>
              </main>
              <Drawer
                title="Basic Drawer"
                placement="right"
                closable={false}
                width={720}
                onClose={this.toggleCloseImg}
                visible={this.state.showImg}
              >
                <img style={{width:'auto'}} src={this.state.item.src} alt="img"></img>
                <br></br>
                <Tag color = "magenta" className="myBtn">
                  Object detection for keyword at {this.state.item.id} seconds
                </Tag>
              </Drawer>
      </div>
      
    );
  }
};

const Header = () => {
  const scrollY = useWindowScroll(5);
  return (
    <h1 className={style("header", scrollY > 64 && "minify")}>
      <span role="img" aria-label="bricks">
        🧱
      </span>{" "}
      MASONIC
    </h1>
  );
};

const style = styles({
  masonic: `
    padding: 8px;
    width: 100%;
    max-width: 960px;
    margin: 0px auto 0;
    box-sizing: border-box;
    color:white;
  `,
  container: `
    min-height: 100vh;
    width: 100%;
  `,
  minify: ({ pad, color }) => `
    padding: ${pad.md};
    background-color: ${color.dark};
    color: ${color.light};
  `,
  header: ({ pad, color }) => `
    font-family: Quantico, sans-serif;
    font-size: 1.5rem;
    font-weight: 900;
    letter-spacing: -0.075em;
    color: ${color.body};
    top: 0;
    position: fixed;
    padding: ${pad.xl};
    z-index: 1000;
    width: 100%;
    text-align: center;
    transition: padding 200ms ease-in-out, background-color 200ms 200ms linear;
  `,
  card: ({ shadow, color, pad, radius }) => `
    display: flex;
    flex-direction: column;
    background: ${color.dark};
    border-radius: ${radius.lg};
    justify-content: center;
    align-items: center;
    transition: transform 100ms ease-in-out;
    width: 100%;
    min-height: 220px;

    span:last-of-type {
      color: #fff;
      padding: ${pad.md};
    }

    &:hover {
      position: relative;
      background: ${color.light};
      transform: scale(1.125);
      z-index: 1000;
      box-shadow: ${shadow.lg};
      color:black;
      cursor:pointer;
      span:last-of-type {
        color: ${color.dark};
        padding: ${pad.md};
      }
    }
  `,
  img: ({ radius }) => `
    width: 100%;
    display: block;
    border-top-left-radius: ${radius.md};
    border-top-right-radius: ${radius.md};
    display: block;
  `
});

const randomChoice = items => items[Math.floor(Math.random() * items.length)];
let i = 0;


const mapStateToProps = state => ({
});
const mapDispatchToProps = dispatch => ({
  setPeekVideo:data => dispatch(setPeekVideo(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(App);