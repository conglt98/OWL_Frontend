import React from 'react'
import {
  CardBody,
  Row,
  Col,
  Card,
  CardHeader,
  Button,
  Table,
  Badge,
} from 'reactstrap';
import Slide from 'react-reveal/Slide';
import {Link} from 'react-router-dom';

import {Tag} from 'antd'
import fakeAuth from '../api/fakeAuth'
import {getTiers} from '../api/tier'
import moment from 'moment'
import {Checkbox,Pagination,Select, Input as AntInput} from 'antd'


const decisionCode = {
  '-1':'REJECT',
  '0':'CHALLENGE',
  '1':'APPROVE',
  '2':'BYPASS'
}
const { Option } = Select;
class UserRow extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        modalEditNav:false,
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
      onChoose=()=>{
        let addRule = localStorage.getItem("addTier")
        addRule=addRule?JSON.parse(addRule):[]
        let find = addRule.find(rule=>rule.id.toString()===this.props.user.id.toString())
        if (find)
        {
          addRule = addRule.filter(rule=>rule.id.toString()!==this.props.user.id.toString())
        }else
        {
          addRule.push(this.props.user)
        }
        localStorage.setItem("addTier",JSON.stringify(addRule))
      }
  render(){
    const user = this.props.user
    const tierLink = `/tiers/${user.id}`
    const profileLink = `/profiles/${user.id}`

    return (
        <React.Fragment>
            
          <tr key={user.id}>
          <th scope="row">
          <Button color="light" size="sm" onClick={this.toggleEventRow}><i className={this.state.expandDescription?"fa fa-caret-up":"fa fa-caret-down"} ></i></Button>
        </th>
          <td>{user.id}</td>
          <td>{moment(user.createAt).format('DD-MM-YYYY HH:mm:ss')}</td>
          <td><Link to={tierLink}>{user.name}</Link></td>
          
          <td><Link to={profileLink}>{user.profileId}</Link></td>
          <td>{user.priority}</td>
          <td>{decisionCode[String(user.code)]==='REJECT'?<Tag color={'volcano'} key={user.code}>{decisionCode[String(user.code)]}</Tag>:
          decisionCode[String(user.code)]==='BYPASS'?<Tag color={'green'} key={user.code}>{decisionCode[String(user.code)]}</Tag>:
          <Tag color={'geekblue'} key={user.code}>{decisionCode[String(user.code)]}</Tag>
          }</td>
          <td>{user.filter}</td>

          <td width="10%">
          {this.props.mode==='choose'?
          <Checkbox onChange={this.onChoose}></Checkbox>
          :
          <React.Fragment>
            {/* <Badge color={'primary'} onClick={this.toggleEdit}>
          <i className="fa fa-edit fa-2x myBtn"></i>
        </Badge>&nbsp;
        <Badge color={'danger'} onClick={this.toggleDelete}>
          <i className="fa fa-trash-o fa-2x myBtn"></i>
        </Badge> */}-
            </React.Fragment>}
          </td>
        </tr>
        {this.state.expandDescription?
            <Slide left duration="500">
              <tr><td colSpan={9}>
              <Card>
                <CardHeader>
                  <b>Description</b>
                </CardHeader>
                <CardBody>
                    {user.description}
                </CardBody>
              </Card>
            </td></tr>
            </Slide>
              :<tr></tr>}
        </React.Fragment>
      )
  }
}

export default class App extends React.Component {
  constructor(props){
      super(props);
      this.state={
        data:[],
        masterData:[],
        fieldSort:{},
        total:0,
      }
  }

  componentWillMount = () => {
    getTiers(fakeAuth.getAccessToken(), 0, 10).then(res => {
      if (res.data && res.data.list){
        console.log(res.data.list)
        this.setState({
            data: res.data.list,
            masterData: res.data.list,
            total:res.data.total,
          });
      }
    })
  }

  onChangePage=(page,pageSize)=>{
      console.log(page)
      console.log(pageSize)
      getTiers(fakeAuth.getAccessToken(), page-1, pageSize).then(res => {
        console.log(res.data.list)
        this.setState({
            data: res.data.list,
            masterData: res.data.list,
            total:res.data.total,
        });
      })
  }

  onShowSizeChange=(page,pageSize)=>{
    getTiers(fakeAuth.getAccessToken(), 0, pageSize).then(res => {
      console.log(res.data.list)
      this.setState({
          data: res.data.list,
          masterData: res.data.list,
          total:res.data.total
      });
    })
  }

  searchInResult = (input) => {
    let dataFilters = [];
    if (this.state.data && input && input.target.value) {
      for (let i = 0; i < this.state.data.length; i++) {
        if (this.state.data[i].name.toLowerCase().indexOf(input.target.value.toLowerCase()) > -1) {
          dataFilters.push(this.state.data[i]);
        }
      }
      if(dataFilters) {
        this.setState({
          data: dataFilters
        });
      }
    }

    if (!input || !input.target.value) {
      this.setState({
        data: this.state.masterData
      });
    }
  }

  searchInResultProfile = (input) => {
    let dataFilters = [];
    if (this.state.data && input && input.target.value) {
      for (let i = 0; i < this.state.data.length; i++) {
        if (this.state.data[i].profileId.toString().indexOf(input.target.value.toLowerCase()) > -1) {
          dataFilters.push(this.state.data[i]);
        }
      }
      if(dataFilters) {
        this.setState({
          data: dataFilters
        });
      }
    }

    if (!input || !input.target.value) {
      this.setState({
        data: this.state.masterData
      });
    }
  }

  searchType = (input) => {
    let dataFilters = [];
    if (this.state.masterData&&input) {
      for (let i = 0; i < this.state.masterData.length; i++) {
        if (this.state.masterData[i].dataSource.type===input) {
          dataFilters.push(this.state.masterData[i]);
        }
      }
      if(dataFilters) {
        this.setState({
          data: dataFilters
        });
      }
    }
    if (input==='All'){
        this.setState({
            data: this.state.masterData
          });
    }
  }
  
  sort = (field)=>{
    console.log("Click and sort")
    if (!this.state.fieldSort[field])
    {
        this.state.data.sort((a,b)=>a[field]-b[field])
        this.setState({
            fieldSort:{
                ...this.state.fieldSort,
                [field]:1
            },
            data:this.state.data
        })
    }else if (this.state.fieldSort[field]===1){
        this.state.data.sort((a,b)=>b[field]-a[field])
        this.setState({
            fieldSort:{
                ...this.state.fieldSort,
                [field]:0
            },
            data:this.state.data
        })
    }
  }

  render() {
    const data = this.state.data;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i>
                Tiers
                {this.props.mode==='choose'?<span></span>:
                <Button
                color="success"
                size="md"
                className="float-right"
                onClick={this.toggleNewRole}>
                <i className="fa fa-plus"></i>
                <b>
                  Add new</b></Button>
                }
              </CardHeader>
              <CardBody>
              <Row>
                    <Col md={3}>
                    <AntInput placeholder="Search name"  onChange={(value) => this.searchInResult(value)}>
                    </AntInput>
                    </Col>
                    <Col md={3}>
                    <AntInput placeholder="Search profileId"  onChange={(value) => this.searchInResultProfile(value)}>
                    </AntInput>
                    {/* <Select defaultValue={'Search type'} style={{ width: '100%' }} onChange={value=>this.searchType(value)}>
                        {typeSearchSuggest.map(ele=>(
                                <Option value={ele.split(' ')[1]}>{ele}</Option>
                            ))}
                    </Select> */}
                    </Col>
                    
                    <Col md={6} style={{textAlign:'right'}}>
                    <Pagination size={this.props.mode==='choose'?'small':'medium'} defaultCurrent={1} total={this.state.total} 
                     showTotal={total => `Total ${total} items`}
                      showSizeChanger={true}
                      onShowSizeChange={this.onShowSizeChange}
                     onChange={this.onChangePage}
                     responsive />
                    </Col>
                </Row>
                <br></br>
                  <div 
                //   style={{
                //   maxHeight: 'calc(100vh - 310px)',
                //   overflowY: 'auto'
                // }}
                >
                <Table responsive hover>
                <thead>
                    <tr>
                    <th scope="col"></th>
                      <th scope="col">ID</th>
                      <th scope="col">CREATED AT</th>
                      <th scope="col">NAME</th>
                      <th scope="col">PROFILE ID</th>
                      <th scope="col" className="myBtn" onClick={()=>{this.sort('priority')}}>PRIORITY</th>
                      <th scope="col">CODE</th>
                      <th scope="col">FILTER</th>
                      <th scope="col">ACTION</th>

                    </tr>
                  </thead>
                  <tbody>
                    {data.map((user) =>
                      <UserRow key={user.id} user={user} mode={this.props.mode}/>
                    )}
                  </tbody>
                </Table>
                </div>
               
                <Row className="justify-content-md-center">
                    
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
        
      </div>
    );
  }
}