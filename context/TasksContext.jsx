import React, { createContext, useContext, useState } from 'react';

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [sites, setSites] = useState({});
  const [groups, setGroups] = useState({});
  
  const updateTaskAssignment = (group, siteId) => {
    // Logic to update task assignments
  };

  return (
    <TasksContext.Provider value={{ tasks, sites, groups, updateTaskAssignment }}>
      {children}
    </TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within a TasksProvider');
  }
  return context;
};
