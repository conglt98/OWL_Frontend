import React, {Component} from 'react';
import styled from 'styled-components';
import {Draggable} from 'react-beautiful-dnd'
const Container = styled.div`
     border:1px solid lightgrey;
     border-radius: 2px;
     padding: 8px;
     margin-bottom:8px;
     background-color: ${props => (props.isDragging ? 'lightgreen': 'white')};
     display:flex;
     `;

const Handle = styled.div`
    text-align:center;
    color:white;
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
      isDragDisabled = {this.props.mode === 'view'}
      >
        {(provided, snapshot) => (
          <Container
            {...provided.draggableProps}
            ref={provided.innerRef}
            isDragging = {snapshot.isDragging}
            aria-roledescription="Press bar to lift the task"
          
            >
            <Handle {...provided.dragHandleProps}>{this.props.index+1}</Handle>
            {this.props.task.content}
          </Container>
        )
}
      </Draggable>
    );
  }
}

export default Task