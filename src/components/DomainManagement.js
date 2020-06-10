import React from 'react'
import {Input, Button, Badge, Card, CardBody, CardHeader, Col, Row, Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,FormGroup,
  Label } from 'reactstrap';

import fakeAuth from '../api/fakeAuth'
import {getDomains,createDomain,editDomain} from '../api/domain'
import {Pagination,Select,Switch, Input as AntInput} from 'antd'
import swal from 'sweetalert'
import UserRow from './row/DomainRow'
const { Option } = Select;


export default class App extends React.Component {
  constructor(props){
      super(props);
      this.state={
        data:[],
        masterData:[],
        total:0,
        modalNewClient:false,
        domain:{
          name:"",
          status:0,
          description:"",
          sourceId:1
        }
      }
  }
  toggleNewClient=()=>{
    this.setState({
      modalNewClient:!this.state.modalNewClient
    })
  }

  componentWillMount = () => {
    getDomains(fakeAuth.getAccessToken(), 0, 10).then(res => {
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
      getDomains(fakeAuth.getAccessToken(), page-1, pageSize).then(res => {
        console.log(res.data.list)
        this.setState({
            data: res.data.list,
            masterData: res.data.list,
            total:res.data.total,
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
  
  handleChangeNewClientName=(e)=>{
    this.setState({
      domain:{
        ...this.state.domain,
        name:e.target.value,
      }
    })
  }

  handleChangeDescription=(e)=>{
    this.setState({
      domain:{
        ...this.state.domain,
        description:e.target.value,
      }
    })
  }

  handleChangeSourceId=(e)=>{
    this.setState({
      domain:{
        ...this.state.domain,
        sourceId:e.target.value,
      }
    })
  }



  handleChangeNewRoleStatus=(e)=>{
    this.setState({
      domain:{
        ...this.state.domain,
        status:e===true?1:0,
      }
    })
  }

  handleNewDomain=async()=>{
    console.log(this.state.domain)
    try{
      let newDomain = this.state.domain
      newDomain.createAt = new Date().getTime()
      await createDomain(newDomain,fakeAuth.getAccessToken())
      swal("Thông báo!", "Tạo domain thành công!", "success")

    }catch(e){
      swal("Thông báo!", "Tạo domain lỗi! "+e, "error")
    }
  }

  onShowSizeChange= async(page,pageSize)=>{
    getDomains(fakeAuth.getAccessToken(), 0, pageSize).then(res => {
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

  render() {
    const data = this.state.data;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i>
                Domains
                {this.props.mode==='choose'?<span></span>:
                <Button
                color="success"
                size="md"
                className="float-right"
                onClick={this.toggleNewClient}>
                <i className="fa fa-plus"></i>
                <b>
                  Add new</b>
                  <Modal size="lg" isOpen={this.state.modalNewClient} toggle={this.toggleNewClient}>
                    <ModalHeader toggle={this.toggleNewClient}>
                    Add new domain
                    </ModalHeader>
                    <ModalBody style={{'max-height': 'calc(100vh - 210px)', 'overflow-y': 'auto'}}>
                    <Row className="justify-content-md-center">
                    <Col md={12}>
                          <Form>
                          <FormGroup>
                            <Col md={4}>
                            <Label ><b>Name</b></Label></Col>
                            <Col md={8}>
                            <AntInput  type="text" value={this.state.domain.name} placeholder="Input name domain" onChange={this.handleChangeNewClientName} required/>
                            </Col>
                          </FormGroup>

                          <FormGroup>
                            <Col md={4}>
                            <Label ><b>SourceId</b></Label></Col>
                            <Col md={8}>
                            <AntInput  type="number" value={this.state.domain.sourceId} placeholder="Input sourceId" onChange={this.handleChangeSourceId} required/>
                            </Col>
                          </FormGroup>

                          <FormGroup>
                            <Col md={4}>
                            <Label ><b>Description</b></Label></Col>
                            <Col md={8}>
                            <Input  type="textarea" value={this.state.domain.description} placeholder="Input description" onChange={this.handleChangeDescription} required/>
                            </Col>
                          </FormGroup>

                          <FormGroup>
                            <Col md={4}>
                              <Label><b>Status<span style ={{color:"#F86C6B"}}></span></b></Label>
                            </Col>
                            <Col md={8}>
                            <Switch checked={this.state.domain.status===1?true:false} onChange={this.handleChangeNewRoleStatus}/>
                            </Col>
                          </FormGroup>
                          </Form>
                    </Col>
                    </Row>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleNewClient}>Cancel</Button>

                        <Button color="primary" onClick={this.handleNewDomain}>Add</Button>
                    </ModalFooter>
                    </Modal>
              </Button>}
              </CardHeader>
              <CardBody>
              <Row>
                    <Col md={3}>
                    <AntInput placeholder="Search name"  onChange={(value) => this.searchInResult(value)}>
                    </AntInput>
                    </Col>
                    <Col md={3}>
                    {/* <Select defaultValue={'Search type'} style={{ width: '100%' }} onChange={value=>this.searchType(value)}>
                        {typeSearchSuggest.map(ele=>(
                                <Option value={ele.split(' ')[1]}>{ele}</Option>
                            ))}
                    </Select> */}
                    </Col>

                    <Col md={6} style={{textAlign:"right"}}>
                    <Pagination size={this.props.mode==='choose'?'small':'medium'} defaultCurrent={1} total={this.state.total} onChange={this.onChangePage}
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
                      <th scope="col">NAME</th>
                      <th scope="col">SOURCE ID</th>
                      <th scope="col">STATUS</th>
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