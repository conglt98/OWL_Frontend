import React from 'react'
import Dnd from './index'
import {Card, CardBody} from 'reactstrap'
export default class Demo extends React.Component{
    render(){
        return(
        <Card>
            <CardBody>
                <Dnd></Dnd>
            </CardBody>
        </Card>
        )
    }
}