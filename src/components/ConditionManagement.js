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
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from 'reactstrap';
import Slide from 'react-reveal/Slide';
import {Link} from 'react-router-dom';


import fakeAuth from '../api/fakeAuth'
import {getConditions,deleteCondition} from '../api/condition'
import moment from 'moment'
import {Pagination,Select, Input as AntInput} from 'antd'
import swal from 'sweetalert'


const { Option } = Select;
class UserRow extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        modalEditNav:false,
        expandDescription: false,
        modalDel:false,
      }
    }

    toggleDelete=()=>{
      this.setState({
        modalDel:!this.state.modalDel
      })
    }
    handleDelete=async()=>{
      try{
        await deleteCondition(this.props.user.id,{},fakeAuth.getAccessToken())
        swal("Thông báo!", "Delete condition thành công!", "success").then(res=>{
          if (res){
            window.location.reload(false)
          }
        })

      }catch(e){
        swal("Thông báo!", "Delete condition lỗi! "+e, "error")
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
    const conditionLink = `/conditions/${user.id}`
    let conditionOfLink = `/${user.conditionType}s/${user.conditionTypeId}`
    if (user.conditionType==='rule'){
      conditionOfLink = `/${user.conditionType}Versions/${user.conditionTypeId}`
    }
    return (
        <React.Fragment>
            
          <tr key={user.id}>
          <th scope="row">
          <Button color="light" size="sm" onClick={this.toggleEventRow}><i className={this.state.expandDescription?"fa fa-caret-up":"fa fa-caret-down"} ></i></Button>
        </th>
          <td><Link to={conditionLink}>{user.id}</Link></td>
          <td>{moment(user.createAt).format('DD-MM-YYYY HH:mm:ss')}</td>
          
          <td><Link to={conditionOfLink}><strong>{user.conditionType}: {user.conditionTypeId}</strong></Link></td>
          <td>{user.fieldType}</td>
    <td><Button disabled size="sm" color="light"><strong>{user.field} {user.operator} {user.value}</strong></Button></td>

          <td width="10%">
          {/* <Badge color={'primary'} onClick={this.toggleEdit}>
            <i className="fa fa-edit fa-2x myBtn"></i>
          </Badge>&nbsp; */}
          <Badge color={'danger'} onClick={this.toggleDelete}>
            <i className="fa fa-trash-o fa-2x myBtn"></i>
            <Modal isOpen={this.state.modalDel} toggle={this.toggleDelete}>
              <ModalHeader>
                Delete condition: {this.props.user.id}
              </ModalHeader>
              <ModalBody>
                Do you want to delete?
              </ModalBody>
              <ModalFooter>
              <Button color="secondary" onClick={this.toggleDelete}>Cancel</Button>

              <Button color="primary" onClick={this.handleDelete}>Delete</Button>
              </ModalFooter>
            </Modal>
          </Badge>
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
        total:500,
      }
  }

  componentWillMount = () => {
    getConditions(fakeAuth.getAccessToken(), 0, 10).then(res => {
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
      getConditions(fakeAuth.getAccessToken(), page-1, pageSize).then(res => {
        console.log(res.data.list)
        this.setState({
            data: res.data.list,
            masterData: res.data.list,
            total:res.data.total,
        });
      })
  }
  onShowSizeChange=(page,pageSize)=>{
    getConditions(fakeAuth.getAccessToken(), 0, pageSize).then(res => {
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
        if (this.state.data[i].conditionType.toLowerCase().indexOf(input.target.value.toLowerCase()) > -1) {
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
                Conditions
                <Button
                  color="success"
                  size="md"
                  className="float-right"
                  onClick={this.toggleNewRole}>
                  <i className="fa fa-plus"></i>
                  <b>
                    Add new</b>
                </Button>
              </CardHeader>
              <CardBody>
              <Row>
                    <Col md={3}>
                    <AntInput placeholder="Search condition type"  onChange={(value) => this.searchInResult(value)}>
                    </AntInput>
                    </Col>
                    <Col md={3}>
                    {/* <AntInput placeholder="Search profileId"  onChange={(value) => this.searchInResultProfile(value)}>
                    </AntInput> */}
                    {/* <Select defaultValue={'Search type'} style={{ width: '100%' }} onChange={value=>this.searchType(value)}>
                        {typeSearchSuggest.map(ele=>(
                                <Option value={ele.split(' ')[1]}>{ele}</Option>
                            ))}
                    </Select> */}
                    </Col>
                    
                    <Col md={6} style={{textAlign:"right"}}>
                    <Pagination defaultCurrent={1} total={this.state.total} onChange={this.onChangePage}
                     responsive 
                     showSizeChanger={true}
                     onShowSizeChange={this.onShowSizeChange}
                     showTotal={total => `Total ${total} items`}
                     />
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
                      <th scope="col">CONDITION TYPE</th>
                      <th scope="col">FIELD TYPE</th>
                      <th scope="col">EXPRESSION</th>
                      <th scope="col">ACTION</th>

                    </tr>
                  </thead>
                  <tbody>
                    {data.map((user) =>
                      <UserRow key={user.id} user={user}/>
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