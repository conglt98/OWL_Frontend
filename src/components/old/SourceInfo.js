import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';

import usersData from '../views/Users/UsersData'
import fakeAuth from '../api/fakeAuth'
import {getSources} from '../api/source'
import moment from 'moment'

const sourceTypeCode={
  '0':'[0] INTERNAL',
  '1':'[1] REQUEST',
  '2':'[2] HTTP',
  '3':'[3] GRPC',
  '4':'[4] REDIS',
  '5':'[5] MYSQL',
  '6':'[6] MONGODB'
}
class User extends Component {

  constructor(props){
      super(props);
      this.state={
        data:[],
      }
  }

  componentWillMount=()=>{
    getSources(fakeAuth.getAccessToken(),0,1000).then(res=>{
       console.log(res.data.list)
       if (res.data && res.data.list){
        this.setState({
            data:res.data.list
        })
       }
    })
}
renderTable=(list)=>{
    return(<Table responsive hover>
        <thead>
            <tr>
            {list!==undefined?Object.keys(list).length>0?
            Object.keys(list[0]).map(ele=>{
                if (ele==='latestVersion'){
                    return (
                    <>
                    <th scope='row'>
                    latestVersionId
                    </th>
                    {Object.keys(list[0][ele]).map(eleChild=>(
                        <td scope='row'>
                        {eleChild}
                        </td>
                    ))}
                    </>
                    )
                }
                else if (ele!=='isChoose'){
                    return (<th scope="col">{ele}</th>)
                }
            }):<th></th>
            :<th></th>}
            </tr>
        </thead>
        <tbody>
        {list !== undefined ? list.map((ele,index)=>(
            <tr key={index}
            
            >
            {Object.keys(ele).length>0?Object.keys(ele).map(field=>{
                if (field === 'infoCode'){
                    return (<td scope='row' width="20%">
                        [{ele[field].id}] {ele[field].message} - {ele[field].description}
                    </td>)
                }
                else if (field==='latestVersion'){
                    return (
                    <React.Fragment>
                    <td scope='row'>
                    {/* {ele[field].id} */}
                    <i className="fa fa-arrow-right"></i>
                    </td>
                    {Object.keys(ele[field]).map(eleChild=>{
                        if (eleChild === 'createdAt'){
                            return(
                                <td scope='row'>
                        {moment(ele[field][eleChild]).format('lll')}
                        </td>
                            )
                        }else{
                           return (
                            <td scope='row'>
                            {ele[field][eleChild]?ele[field][eleChild].toString():"null"}
                            </td>
                           )
                        }
                })}
                    </React.Fragment>
                    )
                }
                else if (field === 'createdAt'){
                    return (<td scope="row">
                    {moment(ele[field]).format('lll')}
                    </td>)
                }
                else if (field!=='isChoose'){
                    return (<td scope="row">
                    {ele[field]}
                    </td>)
                }
            }):<th></th>}
            </tr>
        )):<tr></tr>}
        </tbody>
    </Table>)
}

  render() {
    const sourcesData = this.state.data;
    const source = sourcesData.find( rule => rule.id.toString() === this.props.match.params.id)
    console.log(source)
    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Source id: {this.props.match.params.id}</strong>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>
                    <tbody>
                      {
                        source?Object.keys(source).map(key => {
                        if (key === 'createdAt')
                        {
                            return (
                                <tr key={key}>
                                  <td>{`${key}:`}</td>
                                  <td><strong>{moment(source[key]).format('lll')}</strong></td>
                                </tr>
                              )
                        }
                        else if (key === 'type')
                        {
                            return (
                                <tr key={key}>
                                  <td>{`${key}:`}</td>
                                  <td><strong>{sourceTypeCode[source[key]]}</strong></td>
                                </tr>
                              )
                        }
                        else if (key!=='dataSource'){
                            return (
                                <tr key={key}>
                                  <td>{`${key}:`}</td>
                                  <td><strong>{source[key]!==undefined?source[key].toString():"undefined"}</strong></td>
                                </tr>
                              )
                        }else{
                            return (<tr></tr>)
                        }
                        }
                            ):<tr></tr>
                      }
                    </tbody>
                  </Table>
              </CardBody>
            </Card>
          </Col>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Data source</strong>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>
                    <tbody>
                      {
                        source&&source.dataSource?Object.keys(source.dataSource).map(key => {
                        return (
                                  <tr key={key}>
                                    <td>{`${key}:`}</td>
                                    <td><strong>{source.dataSource[key]!==undefined?source.dataSource[key].toString():"undefined"}</strong></td>
                                  </tr>
                                )
                          }):<tr></tr>
                      }
                    </tbody>
                  </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        
      </div>
    )
  }
}

export default User;
