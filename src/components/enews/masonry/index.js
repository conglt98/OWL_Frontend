import React from "react";
import useWindowScroll from "@react-hook/window-scroll";
import catNames from "cat-names";
import cats from "./cats";
import { styles } from "./theme";
import { Masonry } from "masonic";
import 'animate.css/animate.css'
import {connect} from 'react-redux';
import {Modal, Tag} from 'antd'
import {Row,Col} from 'reactstrap'
class App extends React.Component {
  constructor(props){
    super(props)
    let items = []
    let tmp = props.data
    tmp.map(ele=>{
      items.push({
        id:ele.url,
        name:ele.title,
        src:ele.image,
        date:ele.fullDate
      })
    })
    if (props.language == 'vi'){
      items = items.filter(ele=>!String(ele.id).includes('https://e.') )
    }else if (props.language == 'en'){
      items = items.filter(ele=>String(ele.id).includes('https://e.') )
    }
    items = items.sort((a,b)=> b.date.localeCompare(a.date))
    this.state = {
      items: items,
      itemChoose:{},
      masterItems: items,
      modalInfo:false,
    }
  }

  componentWillReceiveProps=(props)=>{
    let items = this.state.masterItems
    if (props.language == 'vi'){
      items = items.filter(ele=>!String(ele.id).includes('https://e.') )
    }else if (props.language == 'en'){
      items = items.filter(ele=>String(ele.id).includes('https://e.') )
    }
    this.setState({
      items:items
    })
  }

  toggleModalInfo =()=>{
    this.setState({
      modalInfo:!this.state.modalInfo
    })
  }

  processClickImg(id){
    this.setState({
      itemChoose:this.props.data.find(ele=>ele.url == id),
      modalInfo:true
    })
  }
  
  FakeCard = ({ data: { id, name, src, date } }) => (
        <div id={'imglist'+id} className={style("card")} onClick={()=>{this.processClickImg(id)}}>
        <img className={style("img")} alt="kitty" src={src} />
        <span style={{marginTop:"5px",fontWeight:'bold',fontSize:'1.1em'}} children={name} />
        <span children={<i>{date}</i>} />
        </div>
  );

  handleOk = e => {
    console.log(e);
    this.setState({
      modalInfo: false,
    });
    window.open(this.state.itemChoose.url, "_blank")
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      modalInfo: false,
    });
  };
  render(){
    return (
      <div className="animated fadeIn">
          <Modal
          title={this.state.itemChoose.title}
          width={920}
          zIndex={100000}
          visible={this.state.modalInfo}
          okText={this.props.language=='vi'?'Đến trang báo':'Go to news'}
          onOk={this.handleOk}
          onCancel={this.handleCancel}>
            <Row style={{width:'100%'}}>
              <Col md={6}>
                <img src={this.state.itemChoose.image} style={{width:'auto'}} />
              </Col>
              <Col md={6}>
              <div><b><i>{this.props.language=='vi'?'Tóm tắt':'Summary'}</i></b></div>
              {this.state.itemChoose.summary}
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col>
              <div><b><i>{this.props.language=='vi'?'Ngày đăng:   ':'Publish date:  '} </i></b> <Tag color={'magenta'}>{this.state.itemChoose.fullDate}</Tag></div>
              <br></br>
              <div><b><i>{this.props.language=='vi'?'Từ khóa':'Keywords'}: </i></b> 
              {this.state.itemChoose&&this.state.itemChoose.keywords?
              this.state.itemChoose.keywords.map(ele=>{
                return(
                  <Tag color={'cyan'}>{ele}</Tag>
                )
              }):<span></span>}
              </div>
              </Col>
            </Row>
          </Modal>
          <main className={style("container")}>
              <div className={style("masonic")}>
                  <Masonry
                  // Provides the data for our grid items
                  items={this.state.items}
                  // Adds 8px of space between the grid cells
                  columnGutter={8}
                  // Sets the minimum column width to 172px
                  columnWidth={400}
                  // Pre-renders 5 windows worth of content
                  overscanBy={5}
                  // This is the grid item component
                  render={this.FakeCard}
                  />
              </div>
              </main>
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
    min-height: 340px;

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
});

export default connect(mapStateToProps, mapDispatchToProps)(App);