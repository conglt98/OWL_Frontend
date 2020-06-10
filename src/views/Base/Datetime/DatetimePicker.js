import React, {Component} from 'react';
import DateRangePicker from 'react-bootstrap-daterangepicker';
// you will need the css that comes with bootstrap@3. if you are using a tool
// like webpack, you can do the following:
// you will also need the css that comes with bootstrap-daterangepicker
import 'bootstrap-daterangepicker/daterangepicker.css';
import {Input} from 'reactstrap';
import moment from 'moment'
export default class MyComponent extends Component {
  constructor(props) {
    super(props);

    this.handleApply = this
      .handleEvent
      .bind(this);

    this.state = {
      startDate: moment().subtract(1, 'months'),
      endDate: moment(),
      ranges: {
        'Today': [
          moment(), moment()
        ],
        'Yesterday': [
          moment().subtract(1, 'days'),
          moment().subtract(1, 'days')
        ],
        'Last 7 Days': [
          moment().subtract(6, 'days'),
          moment()
        ],
        'Last 30 Days': [
          moment().subtract(29, 'days'),
          moment()
        ],
        'This Month': [
          moment().startOf('month'),
          moment().endOf('month')
        ],
        'Last Month': [
          moment()
            .subtract(1, 'month')
            .startOf('month'),
          moment()
            .subtract(1, 'month')
            .endOf('month')
        ]
      }
    };
  }

  handleEvent = (event, picker)=> {
      this.setState({
          startDate:picker.startDate,
          endDate:picker.endDate
      })
  }
  render() {
    let start = this.state.startDate.format("MMM Do YY");
    let end = this.state.endDate.format("MMM Do YY");
    return (
      <DateRangePicker
        startDate={this.state.startDate}
        endDate={this.state.endDate}
        onEvent={this.handleEvent}>
        <Input
          type="text"
          id="filter-date"
          name="filter-date"
          placeholder={"--Select--"}
          value={start+" - "+end}>
        </Input>
      </DateRangePicker>
    );
  }
}