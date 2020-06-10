import React from 'react';
import styled from 'styled-components'
import Task from './task';
import {Droppable, Draggable} from 'react-beautiful-dnd'

const Title = styled.div`
    font-weight: bold;
    padding 8px;`;

const ContainerHorizontal = styled.div `
    margin: 0px;
    border: 1px solid lightgrey;
    border-radius: 2px;
    background-color:#f0f3f5;
    width:  100%;
    display:flex;
    flex-direction: column;
`;

const TaskListHorizontal = styled.div`
    padding: 8px;
    background-color: ${props => (props.isDraggingOver
  ? 'skyblue'
  : '#f0f3f5')};
     display:flex;
`;

const Container = styled.div `
    margin: 0px;
    background-color:#f0f3f5;
    border: 1px solid lightgrey;
    border-radius: 2px;
    width:  220px;
    display:flex;
    flex-direction: column;
`;

const TaskList = styled.div`
    padding: 8px;
    background-color: ${props => (props.isDraggingOver
  ? 'skyblue'
  : '#f0f3f5')};
    flex-grow: 1;
    min-height: 100px;
`;

class InnerList extends React.Component{

  shouldComponentUpdate(nextProps){
    if (nextProps.tasks === this.props.tasks){
      return false;
    }
    return true;
  }
  render(){
    return(
      this
        .props
        .tasks
        .map((task, index) => (<Task mode={this.props.mode} key={task.id} task ={task} index={index}/>))
    )
  }
}

export default class Column extends React.Component {
  render() {
    return (
      <Draggable draggableId={this.props.column.id} index = {this.props.index}>
       {this.props.typeDrop==='horizontal'?(provided)=>(
          <ContainerHorizontal
            {...provided.draggableProps}
            ref = {provided.innerRef}
          >
          <Title {...provided.dragHandleProps}>
            {this.props.column.title}
          </Title>
          <Droppable droppableId={this.props.column.id} type = "task" direction="horizontal">
            {(provided, snapshot) => (
              <TaskListHorizontal
                ref={provided.innerRef}
                {...provided.droppableProps}
                isDraggingOver={snapshot.isDraggingOver}>
                <InnerList mode={this.props.mode} tasks = {this.props.tasks}/>
                {provided.placeholder}
              </TaskListHorizontal>
            )
}
          </Droppable>
        </ContainerHorizontal>
       ):(provided)=>(
        <Container
          {...provided.draggableProps}
          ref = {provided.innerRef}
        >
        <Title {...provided.dragHandleProps}>
          {this.props.column.title}
        </Title>
        <Droppable droppableId={this.props.column.id} type = "task">
          {(provided, snapshot) => (
            <TaskList
              ref={provided.innerRef}
              {...provided.droppableProps}
              isDraggingOver={snapshot.isDraggingOver}>
              <InnerList mode={this.props.mode} tasks = {this.props.tasks}/>
              {provided.placeholder}
            </TaskList>
          )
}
        </Droppable>
      </Container>
     )}
      </Draggable>
    );
  }
}