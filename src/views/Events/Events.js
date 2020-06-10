import React, {Component} from 'react';

import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Form,
  FormGroup,
  FormText,
  Input,
  Label,
  Row,
  Table,
  Collapse,
  ButtonDropdown,
  DropdownToggle,
  DropdownItem,
  DropdownMenu,
  CustomInput,
} from 'reactstrap';
import {connect} from 'react-redux';
import eventsData from './EventsData'
import 'bootstrap-daterangepicker/daterangepicker.css';
import EventRow from './EventRow'
import moment from 'moment'
import {getEvents, getEventClients} from '../../api/event'
import {getClients} from '../../api/client'
import {setAllEvents} from '../../reducers/EventOptions'
import fakeAuth from '../../api/fakeAuth'
import {Pagination} from 'antd'

const columnStyle = {
  display: "flex"
}
const iconStyle = {
  "margin-right": "5px"
}

const clients = []
const eventTypes = [1,2,3]
const status = [0,1]

class Events extends Component {
  constructor(props) {
    super(props);
    
    this.toggle = this
      .toggle
      .bind(this);
    this.toggleAccordion = this
      .toggleAccordion
      .bind(this);
  
      this.handleApply = this
      .handleEvent
      .bind(this);

    this.toggle = this.toggle.bind(this);

    this.state = {
      collapse: false,
      accordion: [
        false, false, false
      ],
      startDate: moment().subtract(1, 'months'),
      endDate: moment(),
      filterEvent:"",
      filterClient:"-1",
      filterStatus:"-1",
      filterEventType:"",
      eventLists:eventsData,
      data:eventsData,
      masterData:eventsData,
      total:0,
      dropdownOpen: new Array(19).fill(false),
      clientSuggest:[]
    };
  }

  componentWillMount = async ()=>{
    const eventClients = await getEventClients(fakeAuth.getAccessToken(),0,1000);
    const clientsAPI = await getClients(fakeAuth.getAccessToken(),0,1000);
    getEvents(fakeAuth.getAccessToken(),0,10).then(res=>{
      if (res.data && res.data.list){
        console.log(res.data.list)
        let dataRaw = res.data.list;
        dataRaw.map(event=>{
          let eventClientsFiltered = eventClients.data.list.filter(ele=>ele.eventId.toString()===event.id.toString())
          let clients = []
          eventClientsFiltered.map(client=>{
            let clientAPI = clientsAPI.data.list.find(ele=>ele.id===client.clientId)
            clients.push({id:client.clientId,name:clientAPI.name})
          })
          event.client = clients;
        })
        this.setState({
          clientSuggest:clientsAPI.data?clientsAPI.data.list:[],
          eventLists:dataRaw,
          data:dataRaw,
          masterData:dataRaw,
          total:res.data.total,
      })
      }
    })
  }

  toggle() {
    this.setState({
      collapse: !this.state.collapse
    });
  }

  toggleAccordion(tab) {

    const prevState = this.state.accordion;
    const state = prevState.map((x, index) => tab === index
      ? !x
      : false);

    this.setState({accordion: state});
  }

  handleEvent = (event, picker)=> {
    this.setState({
        startDate:picker.startDate,
        endDate:picker.endDate
    })
  }

handleChangeEvent = (event)=>{
  this.searchInResult(event);
  this.setState({filterEvent: event.target.value});
}

handleChangeClient = (event)=>{
  let dataFilters = [];
  let input = event.target.value
  let field = 'client'
  if (this.state.masterData&&input) {
    for (let i = 0; i < this.state.masterData.length; i++) {
      let clients = []
      this.state.masterData[i][field].map(ele=>{clients.push(ele.name)})
      if (clients.includes(input)) {
        dataFilters.push(this.state.masterData[i]);
      }
    }
    if(dataFilters) {
      this.setState({
        data: dataFilters
      });
    }
  }
  if (input==='-1'){
      this.setState({
          data: this.state.masterData
        });
  }

  this.setState({filterClient: event.target.value});
}

handleChangeStatus = (event)=>{
  this.searchField(event.target.value,'status')
  this.setState({filterStatus: event.target.value});
}

handleChangeEventType = (event)=>{
  this.searchField(event.target.value,'type')
  this.setState({filterEventType: event.target.value});
}

handleClearFilter = (event)=>{
  this.setState({
  filterEvent:"",
  filterClient:"-1",
  filterStatus:"-1",
  filterEventType:"-1",
  startDate: moment().subtract(1, 'months'),
  endDate: moment(),
  eventLists:eventsData,
  data:this.state.masterData,

});

}
handleRefresh=async ()=>{
  const eventClients = await getEventClients(fakeAuth.getAccessToken(),0,1000);
  const clientsAPI = await getClients(fakeAuth.getAccessToken(),0,1000);
  getEvents(fakeAuth.getAccessToken(),0,10).then(res=>{
    if (res.data && res.data.list){
      console.log(res.data.list)
      let dataRaw = res.data.list;
      dataRaw.map(event=>{
        let eventClientsFiltered = eventClients.data.list.filter(ele=>ele.eventId.toString()===event.id.toString())
        let clients = []
        eventClientsFiltered.map(client=>{
          let clientAPI = clientsAPI.data.list.find(ele=>ele.id===client.clientId)
          clients.push({id:client.clientId,name:clientAPI.name})
        })
        event.client = clients
      })
      this.setState({
        eventLists:dataRaw,
        data:dataRaw,
        masterData:dataRaw,
        total:res.data.total,
        filterEvent:"",
        filterClient:"-1",
        filterStatus:"-1",
        filterEventType:"-1",
    })
    }
  })
}

toggle = (i) =>{
  const newArray = this.state.dropdownOpen.map((element, index) => { return (index === i ? !element : false); });
  this.setState({
    dropdownOpen: newArray,
  });
}
handleAllEvent = (event)=>{
  this.toggleAccordion(0)
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

searchField = (input,field) => {
  let dataFilters = [];

  if (this.state.masterData&&input) {
    for (let i = 0; i < this.state.masterData.length; i++) {
      
      if (this.state.masterData[i][field]==input) {
        dataFilters.push(this.state.masterData[i]);
      }
    }
    if(dataFilters) {
      this.setState({
        data: dataFilters
      });
    }
  }
  if (input==='-1'){
      this.setState({
          data: this.state.masterData
        });
  }
}

onChangePage= async(page,pageSize)=>{
  const eventClients = await getEventClients(fakeAuth.getAccessToken(),0,1000);
  const clientsAPI = await getClients(fakeAuth.getAccessToken(),0,1000);
  getEvents(fakeAuth.getAccessToken(),page-1,pageSize).then(res=>{
    if (res.data && res.data.list){
      console.log(res.data.list)
      let dataRaw = res.data.list;
      dataRaw.map(event=>{
        let eventClientsFiltered = eventClients.data.list.filter(ele=>ele.eventId.toString()===event.id.toString())
        let clients = []
        eventClientsFiltered.map(client=>{
          let clientAPI = clientsAPI.data.list.find(ele=>ele.id===client.clientId)
          clients.push({id:client.clientId,name:clientAPI.name})
        })
        event.client = clients
      })
      this.setState({
        eventLists:dataRaw,
        data:dataRaw,
        masterData:dataRaw,
        total:res.data.total,
    })
    }
  })
}

onShowSizeChange= async(page,pageSize)=>{

  const eventClients = await getEventClients(fakeAuth.getAccessToken(),0,1000);
  const clientsAPI = await getClients(fakeAuth.getAccessToken(),0,1000);
  await getEvents(fakeAuth.getAccessToken(),0,pageSize).then(res=>{
    if (res.data && res.data.list){
      console.log(res.data.list)
      let dataRaw = res.data.list;
      dataRaw.map(event=>{
        let eventClientsFiltered = eventClients.data.list.filter(ele=>ele.eventId.toString()===event.id.toString())
        let clients = []
        eventClientsFiltered.map(client=>{
          let clientAPI = clientsAPI.data.list.find(ele=>ele.id===client.clientId)
          clients.push({id:client.clientId,name:clientAPI.name})
        })
        event.client = clients
      })
      this.setState({
        eventLists:dataRaw,
        data:dataRaw,
        masterData:dataRaw,
        total:res.data.total,
    })
    }
  })
}

  render() {

    const eventsList = this.state.data
    let start = this.state.startDate.format("MMM Do YY");
    let end = this.state.endDate.format("MMM Do YY");

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i>
                Events
                
                <Button
                  color="success"
                  size="md"
                  className="float-right"
                  href="#/events/event/add">
                  <i className="fa fa-plus"></i><b> Add event</b>
                </Button>

                <Button
                          color="primary"
                          style={iconStyle}
                          size="md"
                          className="float-right"
                          onClick={this.handleRefresh}>
                          <i className="fa fa-refresh"></i> <b>Refresh</b>
                </Button>

                <ButtonDropdown color="secondary" className="float-right" style={iconStyle} isOpen={this.state.dropdownOpen[0]} toggle={() => { this.toggle(0); }}>
                  {/* <DropdownToggle caret>
                    <i className="fa fa-cog"></i>
                  </DropdownToggle> */}
                  <DropdownMenu right>
                    <DropdownItem header>Customize column</DropdownItem>
                    <DropdownItem  toggle={false}>
                    <Form>
                      <FormGroup>
                        <div>
                          <CustomInput type="checkbox" id="exampleCustomCheckbox" label="Event name" />
                          <CustomInput type="checkbox" id="exampleCustomCheckbox2" label="Client" />
                          <CustomInput type="checkbox" id="exampleCustomCheckbox3" label="Status" />
                          <CustomInput type="checkbox" id="exampleCustomCheckbox4" label="Action"/>
                        </div>
                      </FormGroup>
                    </Form>
                    </DropdownItem>
                    <DropdownItem  toggle={false}>
                    <Button color="secondary" style={iconStyle} onClick={()=>{this.toggle(0);}}><b>Reset</b></Button>
                      <Button color="primary" onClick={()=>{this.toggle(0);}}><b>Apply</b></Button>
                    
                    </DropdownItem>
                  </DropdownMenu>
                </ButtonDropdown>
              </CardHeader>
              <CardBody>
                <Card className="mb-0">
                  <CardHeader id="headingOne">
                    <Row>
                    <Col md={3}>
                    <Button
                      // block
                      // color="link"
                      color="link"
                      className="text-left m-0 p-0"
                      onClick={() => this.toggleAccordion(0)}
                      aria-expanded={this.state.accordion[0]}
                      aria-controls="collapseOne">
                      <h5 className="m-0 p-0"><i className="fa fa-filter"></i> Filter</h5>
                    </Button>
                    </Col>
                    <Col md={3}>
                    </Col>
                    <Col md={6} style={{textAlign:'right'}}>
                    <Pagination defaultCurrent={1} total={this.state.total} 
                      showTotal={total => `Total ${total} items`}
                      showSizeChanger={true}
                      onShowSizeChange={this.onShowSizeChange}
                      showLessItems={true} onChange={this.onChangePage}
                      responsive/>
                    </Col>
                  {/* <Badge color="primary" className="float-right" style={iconStyle}>
                        Display: {eventsList.length}/{this.state.masterData.length} events
                  </Badge> */}
                    </Row>
                  
                  </CardHeader>
                  <Collapse
                    isOpen={this.state.accordion[0]}
                    data-parent=  "#accordion"
                    id="collapseOne"
                    aria-labelledby="headingOne">
                    <Card className="mb-0">
                      <CardHeader>
                        <Form>
                          <Row form>
                            <Col md={3}>
                              <FormGroup>
                                <Label htmlFor="filter-event">
                                  <b>Event name</b>
                                </Label>
                                <Input
                                  type="text"
                                  id="filter-event"
                                  name="filter-event"
                                  placeholder="Search event"
                                  value={this.state.filterEvent}
                                  onChange={this.handleChangeEvent}
                                  autoComplete="off"/>
                                <FormText className="help-block"></FormText>
                              </FormGroup>
                            </Col>
                            <Col md={3}>
                              <FormGroup>
                                <Label htmlFor="filer-client">
                                  <b>Client</b>
                                </Label>
                                <Input type="select" name="select-client" id="select-client" value={this.state.filterClient} onChange={this.handleChangeClient}>
                                  <option value="-1">--Select--</option>
                                  {this.state.clientSuggest.map(ele=>(
                                    <option value={ele.name}>{ele.name}</option>
                                  ))}
                                </Input>
                                <FormText className="help-block"></FormText>
                              </FormGroup>
                            </Col>

                            <Col md={3}>
                              {/* <FormGroup>
                                <Label htmlFor="filer-client">
                                  <b>Time updated &nbsp;</b>
                                </Label>
                                <br></br>
                                <DateRangePicker
                                  containerStyles={columnStyle}
                                  startDate={this.state.startDate}
                                  endDate={this.state.endDate}
                                  onEvent={this.handleEvent}>
                                  <InputGroup>
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText>
                                        <i className="fa fa-calendar"></i>
                                      </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                    type="text"
                                    id="filter-date"
                                    name="filter-date"
                                    placeholder={"--Select--"}
                                    value={start+" - "+end}>
                                  </Input>
                                  </InputGroup>
                                </DateRangePicker>
                                <FormText className="help-block"></FormText>
                              </FormGroup> */}
                              <FormGroup>
                                <Label >
                                  <b>Event type</b>
                                </Label>
                                <Input type="select" name="select-event-type" id="select-event-type" value={this.state.filterEventType} onChange={this.handleChangeEventType}>
                                  <option value="-1">--Select--</option>
                                  {eventTypes.map(ele=>(
                                    <option value={ele}>{ele}</option>
                                  ))}
                                </Input>
                                <FormText className="help-block"></FormText>
                              </FormGroup>
                            </Col>

                            <Col md={3}>
                              <FormGroup>
                                <Label htmlFor="filer-client">
                                  <b>Status</b>
                                </Label>
                                <Input type="select" name="select-status" id="select-status" value={this.state.filterStatus} onChange={this.handleChangeStatus}>
                                  <option value="-1">--Select--</option>
                                  {status.map(ele=>(
                                    <option value={ele}>{ele}</option>
                                  ))}
                                </Input>
                                <FormText className="help-block"></FormText>
                              </FormGroup>
                            </Col>
                          </Row>
                        </Form>

                        {/* <Button color="success" size="sm" className="float-right" href="#/events">
                          <b>Filter</b>
                        </Button> */}
                        <Button
                          color="secondary"
                          size="sm"
                          className="float-right"
                          onClick={this.handleAllEvent}>
                          <i className="fa fa-circle  fa-sm"></i> All events
                        </Button>

                        <Button
                          color="secondary"
                          style={iconStyle}
                          size="sm"
                          className="float-right"
                          onClick={this.handleClearFilter}>
                          <i className="fa fa-times  fa-sm"></i> Clear filter
                        </Button>

                      </CardHeader>
                    </Card>
                  </Collapse>
                </Card>

                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col"></th>
                      <th scope="col">ID</th>
                      <th scope="col">EVENT NAME</th>
                      <th scope="col">CLIENT</th>
                      <th scope="col">EVENT TYPE</th>
                      <th scope="col">CREATED AT</th>
                      <th scope="col">STATUS</th>
                      <th scope="col">ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {eventsList.map((event, index) => <EventRow key={index} event={event}/>)}
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

const mapStateToProps = state => ({
});

const mapDispatchToProps = dispatch => ({
  setAllEvents:data=> dispatch(setAllEvents(data)),


});

export default connect(mapStateToProps, mapDispatchToProps)(Events);
