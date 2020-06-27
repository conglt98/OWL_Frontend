import React, {Component} from 'react';
import styled from 'styled-components';
import {Draggable} from 'react-beautiful-dnd'
import getChart from '../chart/listChart'


const Container = styled.div`
     border:1px solid lightgrey;
     border-radius: 2px;
     padding: 8px;
     margin-bottom:8px;
     background-color: ${props => (props.isDragging ? 'lightgreen': 'white')};
     display:flex;
     `;

const Handle = styled.div`
    width:20px;
    height:20px;
    background-color:orange;
    border-radius:4px;
    margin-right:8px;
`;

class Task extends Component {
  render() {
    return (
      <Draggable draggableId={this.props.task.id} index={this.props.index}
      isDragDisabled = {this.props.edit===true?false:true}
      >
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            isDragging = {snapshot.isDragging}
            aria-roledescription="Press bar to lift the task"
          >
            <div>
            {getChart(this.props.task.content,this.props.task.title)} 
            </div>
          </Container>
        )
}
      </Draggable>
    );
  }
}

export default Task