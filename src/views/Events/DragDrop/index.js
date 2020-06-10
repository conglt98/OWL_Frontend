import React, {Component, Fragment} from 'react';
import Column from './column';

import {DragDropContext, Droppable} from 'react-beautiful-dnd'
import styled from 'styled-components'
const Container = styled.div `
  display:flex;
`;

const initialData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      content: 'BYPASS'
    },
    'task-2': {
      id: 'task-2',
      content: 'REJECT'
    },
    'task-3': {
      id: 'task-3',
      content: 'CHALLENGE'
    },
    'task-4': {
      id: 'task-4',
      content: 'APPROVE'
    }
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'Decision priority',
      taskIds: ['task-1', 'task-2', 'task-3', 'task-4']
    }
  },
  columnOrder: ['column-1']
};

class InnerList extends React.PureComponent {
  render() {
    const {column, taskMap, index} = this.props;
    const tasks = column
      .taskIds
      .map(taskId => taskMap[taskId]);
    return <Column mode={this.props.mode}
    typeDrop={this.props.typeDrop}
    column={column} tasks={tasks} index={index}/>
  }
}

export default class DragDropDashboard extends Component {
  constructor() {
    super();

    this.state = {
      dropdownOpen: false,
      activeTab1: '11',
      data: initialData
    };
    this.toggle = this
      .toggle
      .bind(this);
    this.toggle1 = this
      .toggle1
      .bind(this);

  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  toggle1(tab) {
    if (this.state.activeTab1 !== tab) {
      this.setState({activeTab1: tab});
    }
  }

  onDragStart = (start,provided) => {
    document.body.style.color = 'orange';
    document.body.style.transition = 'background-color 0.2 ease';

    provided.announce(`
    You have lifted the task in position ${start.source.index +1}`)
  }

  onDragUpdate = (update,provided) => {
    const message = update.destination
    ?`You have moved the task to position ${update.destination.index +1}`
    :`You are currently not over a droppable area`;
    provided.announce(message);


    const {destination} = update;
    const opacity = destination
      ? destination.index / Object
        .keys(this.state.data.tasks)
        .length
      : 0;
    document.body.style.backgroundColor = `rgba(153,141,217,${opacity})`;
  }

  onDragEnd = (result,provided) => {
    const message = result.destination
    ?`You have moved the task from ${result.source.index+1} to ${result.destination.index +1}`
    :`The task has been returned to its starting position of ${result.source.index+1}`;
    provided.announce(message);

    document.body.style.color = 'inherit';
    document.body.style.backgroundColor = 'inherit';

    const {destination, source, draggableId, type} = result;
    if (!destination) {
      return;
    }
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    if (type === 'column') {
      const newColumnOrder = Array.from(this.state.data.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);

      const newState = {
        ...this.state.data,
        columnOrder: newColumnOrder
      }
      this.setState({data: newState})
      return;
    }

    const start = this.state.data.columns[source.droppableId];
    const finish = this.state.data.columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds
      };

      const newState = {
        ...this.state.data,
        columns: {
          ...this.state.data.columns,
          [newColumn.id]: newColumn
        }
      };
      this.setState({data: newState})
      return;
    }

    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds
    };

    const newState = {
      ...this.state.data,
      columns: {
        ...this.state.data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish
      }
    };
    this.setState({data: newState});
  }

  render() {
    // console.log(this.state.data)
    return (
      <DragDropContext
        onDragStart={this.onDragStart}
        onDragUpdate={this.onDragUpdate}
        onDragEnd={this.onDragEnd}>
        <Droppable droppableId="all-columns" direction="horizontal" type="column">
          {(provided) => (
            <Container {...provided.droppableProps} ref={provided.innerRef}>
              {this
                .state
                .data
                .columnOrder
                .map((columnId, index) => {
                  const column = this.state.data.columns[columnId];

                  return <InnerList
                    mode={this.props.mode}
                    typeDrop={this.props.typeDrop}
                    key={column.id}
                    column={column}
                    taskMap={this.state.data.tasks}
                    index={index}/>;
                })}
              {provided.placeholder}
            </Container>
          )
}
        </Droppable>
      </DragDropContext>
    )
  }
}
