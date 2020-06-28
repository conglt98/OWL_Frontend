const initialData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      content: 'Multiline',
      title:'Page comparison likes'
    },
    'task-2': {
      id: 'task-2',
      content: 'StackBar',
      title:'Page comparision overall'
    },
    'task-3': {
      id: 'task-3',
      content: 'GroupCol',
      title:'Page comparision follows'
    },
    'task-4': {
      id: 'task-4',
      content: 'PercentArea',
      title:'Page comparision posts'
    },
    'task-5': {
      id: 'task-5',
      content: 'Scatter',
      title:'Pages distribution overall (follows, likes)'
    },
    'task-6': {
      id: 'task-6',
      content: 'Radar',
      title:'Page comparision features'
    },
    'task-7': {
      id: 'task-7',
      content: 'TreeMap',
      title:'Pages'
    },
    'task-8': {
      id: 'task-8',
      content: 'WorldCloud',
      title:'Pages'
    }
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: '',
      taskIds: ['task-3', 'task-2', 'task-5','task-7' ]
    },
    'column-2': {
      id: 'column-2',
      title: '',
      taskIds: ['task-1', 'task-4', 'task-6','task-8']
    }
  },
  columnOrder: ['column-1', 'column-2']
};

export default initialData