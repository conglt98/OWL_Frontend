import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import fakeAuth from '../api/fakeAuth'
import {getOneProfile} from '../api/profile'
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
    getOneProfile(fakeAuth.getAccessToken(),this.props.match.params.id).then(res=>{
       console.log(res.data)
       if (res.data){
        this.setState({
            data:res.data
        })
       }
    })

}

  render() {
      const data = this.state.data
    return (
      <div className="animated fadeIn">
        <Row>
          <Col lg={6}>
            <Card>
              <CardHeader>
                <strong><i className="icon-info pr-1"></i>Profile id: {this.props.match.params.id}</strong>
              </CardHeader>
              <CardBody>
                  <Table responsive striped hover>
                    <tbody>
                      {
                        data?Object.keys(data).map(key => {
                            if (key ==='createdAt'){
                                return (
                                    <tr key={key}>
                                      <td>{`${key}:`}</td>
                                      <td><strong>{moment(data[key]).format('lll')}</strong></td>
                                    </tr>
                                  )
                            }
                            else if (key ==='infoCode'){
                                return (
                                    <tr key={key}>
                                      <td>{`${key}:`}</td>
                                      <td><strong><span style={{color:"red"}}>[{data.infoCode.id}]</span> {data.infoCode.message} - {data.infoCode.description}</strong></td>
                                    </tr>
                                  )
                            }
                            else if (key!=='latestVersion'&&key!=='infoCode'){
                              return (
                                  <tr key={key}>
                                    <td>{`${key}:`}</td>
                                    <td><strong>{data[key]}</strong></td>
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
