import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';

import usersData from '../views/Users/UsersData'
import fakeAuth from '../api/fakeAuth'
import {getTiers} from '../api/tier'
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
    getTiers(fakeAuth.getAccessToken(),0,1000).then(res=>{
       console.log(res.data.list)
       if (res.data && res.data.list){
        this.setState({
            data:res.data.list
        })
       }
    })
    }

  render() {
    const rulesData = this.state.data;
    const rule = rulesData.find( rule => rule.id.toString() === this.props.match.params.id)

    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Tier id: {this.props.match.params.id}</strong>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>
                    <tbody>
                      {
                        rule?Object.keys(rule).map(key => {
                            if (key ==='createdAt'){
                                return (
                                    <tr key={key}>
                                      <td>{`${key}:`}</td>
                                      <td><strong>{moment(rule[key]).format('lll')}</strong></td>
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
        </Row>
      </div>
    )
  }
}

export default User;
