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
      content: 'BasicColChart'
    },
    'task-2': {
      id: 'task-2',
      content: 'BasicPieChart'
    },
    'task-3': {
      id: 'task-3',
      content: 'ColSlider'
    },
    'task-4': {
      id: 'task-4',
      content: 'BasicPieChart'
    }
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: '',
      taskIds: ['task-1', 'task-3', ]
    },
    'column-2': {
      id: 'column-2',
      title: '',
      taskIds: ['task-2', 'task-4', ]
    }
  },
  columnOrder: ['column-1', 'column-2']
};

class InnerList extends React.PureComponent {
  render() {
    const {column, taskMap, index} = this.props;
    const tasks = column
      .taskIds
      .map(taskId => taskMap[taskId]);
    return <Column edit={this.props.edit} column={column} tasks={tasks} index={index}/>
  }
}

export default class DragDropDashboard extends Component {
  constructor(props) {
    super(props);
    let savedLayout = this.props.layout?this.props.layout:initialData
    let local = localStorage.getItem(this.props.id)
    local = local?JSON.parse(local):savedLayout

    //convert data to local
    //
    
    this.state = {
      dropdownOpen: false,
      activeTab1: '11',
      data: savedLayout
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
  }

  onDragEnd = (result,provided) => {
    const message = result.destination
    ?`You have moved the task from ${result.source.index+1} to ${result.destination.index +1}`
    :`The task has been returned to its starting position of ${result.source.index+1}`;
    provided.announce(message);

    document.body.style.color = 'inherit';

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
    localStorage.setItem([this.props.id],JSON.stringify(this.state.data))
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
                    key={column.id}
                    column={column}
                    taskMap={this.state.data.tasks}
                    edit={this.props.edit}
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