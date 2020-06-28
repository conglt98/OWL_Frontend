const initialData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      content: 'StackColLine',
      title:'Growth trend'
    },
    'task-2': {
      id: 'task-2',
      content: 'Liquid',
      title:'Subscriber'
    },
    'task-3': {
      id: 'task-3',
      content: 'Multiline',
      title:'Features trendline'
    },
    'task-4': {
      id: 'task-4',
      content: 'TreeMap',
      title:'Reaction component'
    },
    
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

export default initialData