import React from 'react';
import { TasksProvider } from '../context/TasksContext';
import Dashboard from './index';

const ParentComponent = () => {
  return (
    <TasksProvider>
      <Dashboard />
    </TasksProvider>
  );
};

export default ParentComponent;
