import React from 'react'
import Viz from './visualize'
export default class Visualize extends React.Component{
    render(){
        if (!this.props.event) return;
        return(<Viz event = {this.props.event}/>)
    }
}