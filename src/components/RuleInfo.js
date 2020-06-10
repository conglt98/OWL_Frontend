import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';

import usersData from '../views/Users/UsersData'
import fakeAuth from '../api/fakeAuth'
import {getRules} from '../api/rule'
import {getRuleVersions} from '../api/ruleVersion'
import moment from 'moment'
class User extends Component {

  constructor(props){
      super(props);
      this.state={
        data:[],
        ruleVersions:[]
      }
  }

  componentWillMount=()=>{
    getRules(fakeAuth.getAccessToken(),0,1000).then(res=>{
       console.log(res.data.list)
       if (res.data && res.data.list){
        this.setState({
            data:res.data.list
        })
       }
    })
    getRuleVersions(fakeAuth.getAccessToken(),0,1000).then(res=>{
        if (res.data && res.data.list){
            this.setState({ruleVersions:res.data.list})
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
                        if (eleChild === 'createAt'||eleChild==='maintenanceStart'||eleChild==='maintenanceEnd'){
                            return(
                                <td scope='row'>
                        {moment(ele[field][eleChild]).format('DD-MM-YYYY HH:mm:ss')}
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
                else if (field === 'createAt'||field==='maintenanceStart'||field==='maintenanceEnd'){
                    return (<td scope="row">
                    {moment(ele[field]).format('DD-MM-YYYY HH:mm:ss')}
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
    const rulesData = this.state.data;
    const rule = rulesData.find( rule => rule.id.toString() === this.props.match.params.id)
    const ruleVersions = this.state.ruleVersions.filter( ruleVersion => ruleVersion.ruleId.toString() === this.props.match.params.id)

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Rule id: {this.props.match.params.id}</strong>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>
                    <tbody>
                      {
                        rule?Object.keys(rule).map(key => {
                            if (key ==='createAt'){
                                return (
                                    <tr key={key}>
                                      <td>{`${key}:`}</td>
                                      <td><strong>{moment(rule[key]).format('DD-MM-YYYY HH:mm:ss')}</strong></td>
                                    </tr>
                                  )
                            }
                            else if (key ==='infoCode'){
                                return (
                                    <tr key={key}>
                                      <td>{`${key}:`}</td>
                                      <td><strong><span style={{color:"red"}}>[{rule.infoCode.id}]</span> {rule.infoCode.message} - {rule.infoCode.description}</strong></td>
                                    </tr>
                                  )
                            }
                            else if (key!=='latestVersion'&&key!=='infoCode'){
                              return (
                                  <tr key={key}>
                                    <td>{`${key}:`}</td>
                                    <td><strong>{rule[key]}</strong></td>
                                  </tr>
                                )
                            }
                          }):<tr></tr>
                      }
                    </tbody>
                  </Table>
              </CardBody>
            </Card>
          </Col>

          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Latest version</strong>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>
                    <tbody>
                      {
                        rule?Object.keys(rule).map((key,index) => {
                            if (key ==='latestVersion'){
                                return Object.keys(rule[key]).map(keyChild=>{
                                    if (keyChild==='createAt'||keyChild==='maintenanceStart'||keyChild==='maintenanceEnd'){
                                        return (
                                            <tr key={index}>
                                              <td>{`${keyChild}:`}</td>
                                              <td><strong>{moment(rule[key][keyChild]).format('DD-MM-YYYY HH:mm:ss')}</strong></td>
                                            </tr>
                                          )
                                    }else{
                                        return (
                                            <tr key={index}>
                                              <td>{`${keyChild}:`}</td>
                                              <td><strong>{rule[key][keyChild]}</strong></td>
                                            </tr>
                                          )
                                    }
                                })
                            }
                          }):<tr></tr>
                      }
                    </tbody>
                  </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
        <Col lg={12}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>All version</strong>
              </CardHeader>
              <CardBody>
                  {this.renderTable(ruleVersions)}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default User;
