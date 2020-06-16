import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table,Button } from 'reactstrap';
import fakeAuth from '../api/fakeAuth'
import {getOneDomain} from '../api/domain'
import moment from 'moment'
import Slide from 'react-reveal/Slide';
import {Link} from 'react-router-dom';

class UserRow extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        expandDescription: false,
      }
    }
    toggleEditNav=()=>{
      this.setState({
        modalEditNav:!this.state.modalEditNav
      })
    }
    toggleEventRow=()=>{
        let toggle = this.state.expandDescription?false:true;
        this.setState({expandDescription:toggle})
      }
    
  render(){
    const user = this.props.user
    const ruleLink = `/domains/${user.id}`
    const sourceIdLink = `/sources/${user.sourceId}`
    return (
        <React.Fragment>

          <tr key={user.id}>
          <th scope="row">
          <Button color="light" size="sm" onClick={this.toggleEventRow}><i className={this.state.expandDescription?"fa fa-caret-up":"fa fa-caret-down"} ></i></Button>
        </th>
          <td>{user.id}</td>
          <td>{user.createdAt}</td>
          <td>{user.name}</td>
          <td>{user.source}</td>
          <td>{user.dataType}</td>
        </tr>
        {this.state.expandDescription?
            <Slide left duration="500">
              <tr><td colSpan={9}>
              <Card>
                <CardHeader>
                  <b>dataDef</b>
                </CardHeader>
                <CardBody>
                    <div><pre>{JSON.stringify(JSON.parse(user.defs),null,2)}</pre></div>
                </CardBody>
              </Card>
              <Card>
                <CardHeader>
                  <b>accumulationKeys</b>
                </CardHeader>
                <CardBody>
                    <div><pre>{JSON.stringify(user.accumulationKeys,null,2)}</pre></div>
                </CardBody>
              </Card>
            </td></tr>
            </Slide>
              :<tr></tr>}
        </React.Fragment>
      )
  }
}

class User extends Component {

  constructor(props){
      super(props);
      this.state={
        data:{},
      }
  }

  componentWillMount=()=>{
    getOneDomain(fakeAuth.getAccessToken(), this.props.match.params.id).then(res=>{
       console.log(res.data)
       if (res.data){
        this.setState({
            data:res.data
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
                else if (ele!=='accumulationKeys'){
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
                else if (field!=='accumulationKeys'){
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
    const domainsData = this.state.data;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Domain id: {this.props.match.params.id}</strong>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>
                    <tbody>
                      {
                        domainsData?Object.keys(domainsData).map(key => {
                            if (key ==='createdAt'){
                                return (
                                    <tr key={key}>
                                      <td>{`${key}:`}</td>
                                      <td><strong>{moment(domainsData[key]).format('lll')}</strong></td>
                                    </tr>
                                  )
                            }
                            else if (key!=='dataDefinitions'){
                              return (
                                  <tr key={key}>
                                    <td>{`${key}:`}</td>
                                    <td><strong>{domainsData[key]}</strong></td>
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
        </Row>
        <Row>
        <Col lg={12}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Data definitions</strong>
              </CardHeader>
              <CardBody>
              <Table responsive hover>
                <thead>
                    <tr>
                    <th scope="col"></th>
                      <th scope="col">ID</th>
                      <th scope="col">CREATED AT</th>
                      <th scope="col">NAME</th>
                      <th scope="col">SOURCE</th>
                      <th scope="col">DATA TYPE</th>

                    </tr>
                  </thead>
                  <tbody>
                    {domainsData.dataDefinitions?domainsData.dataDefinitions.map((user) =>
                      <UserRow key={user.id} user={user}/>
                    ):<tr></tr>}
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
