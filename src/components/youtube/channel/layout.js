const initialData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      content: 'Multiline',
      title:'Reaction trendline'
    },
    'task-2': {
      id: 'task-2',
      content: 'BasicPieChart',
      title:'Reaction component'
    },
    'task-3': {
      id: 'task-3',
      content: 'ColSlider',
      title:'Like trend'
    },
    'task-4': {
      id: 'task-4',
      content: 'PercentArea',
      title:'Sentimental trend'
    },
    'task-5': {
      id: 'task-5',
      content: 'StackColLine',
      title:'Growth trend'
    },
    'task-6': {
      id: 'task-6',
      content: 'Liquid',
      title:'Subscriber'
    }
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: '',
      taskIds: ['task-5', 'task-1', 'task-3', ]
    },
    'column-2': {
      id: 'column-2',
      title: '',
      taskIds: ['task-6', 'task-2', 'task-4', ]
    }
  },
  columnOrder: ['column-1', 'column-2']
};

export default initialData