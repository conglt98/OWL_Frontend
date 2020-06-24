import React from 'react'
import BannerAnim, { Element } from 'rc-banner-anim';
import TweenOne from 'rc-tween-one';
import 'rc-banner-anim/assets/index.css';
import './index.css'
const BgElement = Element.BgElement;

export default class Demo extends React.Component {
  constructor(){
    super(...arguments);
    this.imgArray = [
      'https://zos.alipayobjects.com/rmsportal/hzPBTkqtFpLlWCi.jpg',
      'https://zos.alipayobjects.com/rmsportal/gGlUMYGEIvjDOOw.jpg',
    ];
  }

  render(){
    return (
      <BannerAnim prefixCls="banner-user" autoPlay>
        <Element 
          prefixCls="banner-user-elem"
          key="0"
        >
          <BgElement
            key="bg"
            className="bg"
            style={{
                backgroundImage: `url(${this.imgArray[0]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
          />
          <TweenOne className="banner-user-title" animation={{ y: 30, opacity: 0, type: 'from' }}>
            Owl Platform 
          </TweenOne>
          <TweenOne className="banner-user-text" 
            animation={{ y: 30, opacity: 0, type: 'from', delay: 100 }}
          >
            The Specific Way For Social Listening
          </TweenOne>
        </Element>
        <Element 
          prefixCls="banner-user-elem"
          key="1" 
        >
          <BgElement
            key="bg"
            className="bg"
            style={{
                backgroundImage: `url(${this.imgArray[1]})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
          />
          <TweenOne className="banner-user-title" animation={{ y: 30, opacity: 0, type: 'from' }}>
            Owl Platform
          </TweenOne>
          <TweenOne className="banner-user-text" 
            animation={{ y: 30, opacity: 0, type: 'from', delay: 100 }}
          >
            The System Supporting Analyzing Social Information
          </TweenOne>
        </Element>
      </BannerAnim>);
  }
}