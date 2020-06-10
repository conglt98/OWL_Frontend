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


import fakeAuth from '../api/fakeAuth'
import {getRules} from '../api/rule'
import moment from 'moment'
import {Pagination,Select,Checkbox, Input as AntInput} from 'antd'
import {AppSwitch} from '@coreui/react'
import {typeSearchSuggest} from './suggest'


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
        let addRule = localStorage.getItem("addRule")
        addRule=addRule?JSON.parse(addRule):[]
        let find = addRule.find(rule=>rule.id.toString()===this.props.user.id.toString())
        if (find)
        {
          addRule = addRule.filter(rule=>rule.id.toString()!==this.props.user.id.toString())
        }else
        {
          addRule.push(this.props.user)
        }
        localStorage.setItem("addRule",JSON.stringify(addRule))
      }
  render(){
    const user = this.props.user
    const ruleLink = `/rules/${user.id}`
    const tierLink = `/tiers/${user.tierId}`

    return (
        <React.Fragment>
            
          <tr key={user.id}>
          <th scope="row">
          <Button color="light" size="sm" onClick={this.toggleEventRow}><i className={this.state.expandDescription?"fa fa-caret-up":"fa fa-caret-down"} ></i></Button>
        </th>
          <td>{user.id}</td>
          <td>{moment(user.createAt).format('DD-MM-YYYY HH:mm:ss')}</td>
          <td><Link to={ruleLink}>{user.name}</Link></td>
          
          <td><Link to={tierLink}>{user.tierId}</Link></td>
          <td><div style={{display:"flex"}}>
          <AppSwitch
              className={'float-right'}
              variant={'pill'}
              label
              disabled = {true}
              color={'success'}
              checked={user.status===1?true:false}
              size={'sm'}/>

          </div></td>
          <td><span style={{color:"red"}}>[{user.infoCode.id}]</span> {user.infoCode.message} - {user.infoCode.description}</td>
          <td>{user.infoCode.action?user.infoCode.action:"-"}</td>
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
            </React.Fragment>}</td>
        </tr>
        {this.state.expandDescription?
            <Slide left duration="500">
              <tr><td colSpan={9}>
              <Card>
                <CardHeader>
                  <b>Latest version</b>
                </CardHeader>
                <CardBody>
                    <i><b>ID: </b>{user.latestVersion.id}</i><br></br>
                    <i><b>CreatedAt: </b>{moment(user.latestVersion.createAt).format('DD-MM-YYYY HH:mm:ss')}</i><br></br>
                    <i><b>SourceType: </b>{user.latestVersion.sourceType}</i><br></br>
                    <i><b>SourceID: </b>{user.latestVersion.sourceId}</i><br></br>
                    <i><b>Mapping: </b>{user.latestVersion.mapping?user.latestVersion.mapping:"null"}</i><br></br>
                    <i><b>RuleCatch: </b>{user.latestVersion.ruleCatch?user.latestVersion.ruleCatch:"null"}</i><br></br>
                    <i><b>Interval: </b>{user.latestVersion.interval?user.latestVersion.interval:"null"}</i><br></br>
                    <i><b>MaintenanceStart: </b>{user.latestVersion.maintenanceStart}</i><br></br>
                    <i><b>MaintenanceEnd: </b>{user.latestVersion.maintenanceEnd}</i><br></br>
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
        total:0,
      }
  }

  componentWillMount = () => {
    getRules(fakeAuth.getAccessToken(), 0, 10).then(res => {
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
      getRules(fakeAuth.getAccessToken(), page-1, pageSize).then(res => {
        console.log(res.data.list)
        this.setState({
            data: res.data.list,
            masterData: res.data.list,
            total:res.data.total,
        });
      })
  }
  onShowSizeChange=(page,pageSize)=>{
    getRules(fakeAuth.getAccessToken(), 0, pageSize).then(res => {
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

  searchInResultTier = (input) => {
    let dataFilters = [];
    if (this.state.data && input && input.target.value) {
      for (let i = 0; i < this.state.data.length; i++) {
        if (this.state.data[i].tierId.toString().indexOf(input.target.value.toLowerCase()) > -1) {
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
  

  render() {
    const data = this.state.data;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i>
                Rules
                {this.props.mode==="choose"?<span></span>:
                <Button
                color="success"
                size="md"
                className="float-right"
                onClick={this.toggleNewRole}>
                <i className="fa fa-plus"></i>
                <b>
                  Add new</b>
              </Button>}
              </CardHeader>
              <CardBody>
              <Row>
                    <Col md={3}>
                    <AntInput placeholder="Search name"  onChange={(value) => this.searchInResult(value)}>
                    </AntInput>
                    </Col>
                    <Col md={3}>
                    <AntInput placeholder="Search tierId"  onChange={(value) => this.searchInResultTier(value)}>
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
                     onChange={this.onChangePage}
                     showSizeChanger={true}
                     onShowSizeChange={this.onShowSizeChange}
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
                      <th scope="col">TIER</th>
                      <th scope="col">STATUS</th>
                      <th scope="col">INFO CODE</th>
                      <th scope="col">ACTION INFO</th>
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