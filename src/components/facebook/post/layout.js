const initialData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      content: 'Liquid',
      title:'Share overall'
    },
    'task-2': {
      id: 'task-2',
      content: 'Donut',
      title:'Reaction overall'
    }
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: '',
      taskIds: ['task-2']
    },
    'column-2': {
      id: 'column-2',
      title: '',
      taskIds: ['task-1']
    }
  },
  columnOrder: ['column-1', 'column-2']
};

export default initialData