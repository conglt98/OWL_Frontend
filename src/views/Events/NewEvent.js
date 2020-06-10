import React, {Component} from 'react';


import PageTitle from './PageTitle'
import ViewEvent from './ViewEvent/ViewEvent'
export default class NewEvent extends Component {

  constructor(props) {
    super(props);
    this.state = {
      message: "Default message"
    }
  }

  render() {
    return (
      <div className="animated fadeIn">
        <PageTitle
            heading="Create event"
            subheading="This page is a form for creating a new event"
            icon="fa fa-plus icon-gradient bg-mean-fruit"
        />
        <ViewEvent mode="edit" newEvent={true} event ={{data:[]}}></ViewEvent>
      </div>
    )
  }
}
