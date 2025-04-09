import React from 'react';
import { TasksContextProvider } from '../context/TasksContext';
import Dashboard from './index';

const ParentComponent = () => {
  return (
    <TasksContextProvider>
      <Dashboard />
    </TasksContextProvider>
  );
};

export default ParentComponent;
