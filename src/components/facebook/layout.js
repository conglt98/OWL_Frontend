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
      content: 'BasicColChart'
    }
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: '',
      taskIds: ['task-2', 'task-1', ]
    },
    'column-2': {
      id: 'column-2',
      title: '',
      taskIds: ['task-3', 'task-4', ]
    }
  },
  columnOrder: ['column-1', 'column-2']
};

export default initialData