// // TasksContext.js
// import React, { createContext, useState } from 'react';

// // Create the context
// export const TasksContext = createContext();

// // Create the provider component
// export const TasksProvider = ({ children }) => {
//   const [tasks, setTasks] = useState([
//     { id: 1, name: "Pour concrete", siteId: 101, assignedTo: 201, completed: false, deadline: '2025-11-01' },
//     { id: 2, name: "Install frames", siteId: 101, assignedTo: 202, completed: false, deadline: '2025-10-28' },
//     { id: 3, name: "Setup electrical wiring", siteId: 101, assignedTo: 203, completed: true, deadline: '2025-10-25' },
//   ]);

//   return (
//     <TasksContext.Provider value={{ tasks, setTasks }}>
//       {children}
//     </TasksContext.Provider>
//   );
// };
import React, { createContext, useState } from 'react';

export const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [sites, setSites] = useState({
    'Site A': {
      location: 'Downtown District',
      progress: 0,
      assignedGroups: [],
    },
    'Site B': {
      location: 'Riverside Area',
      progress: 0,
      assignedGroups: [],
    },
    'Site C': {
      location: 'Mountain View',
      progress: 0,
      assignedGroups: [],
    },
  });

  const [groups, setGroups] = useState({
    'Group 1': {
      leader: 'John Smith',
      members: ['Alice Johnson', 'Bob Williams', 'Charlie Brown'],
      contact: 'group1@example.com',
      color: '#FF6B6B',
    },
    'Group 2': {
      leader: 'Sarah Davis',
      members: ['David Wilson', 'Eva Green', 'Frank White'],
      contact: 'group2@example.com',
      color: '#4ECDC4',
    },
    'Group 3': {
      leader: 'Michael Lee',
      members: ['Grace Taylor', 'Henry Clark', 'Ivy Adams'],
      contact: 'group3@example.com',
      color: '#FFD166',
    },
    'Group 4': {
      leader: 'Olivia Martinez',
      members: ['Jack Wilson', 'Karen Smith', 'Liam Johnson'],
      contact: 'group4@example.com',
      color: '#A5DD9B',
    },
    'Group 5': {
      leader: 'Noah Garcia',
      members: ['Sophia Brown', 'Thomas Davis', 'Uma Wilson'],
      contact: 'group5@example.com',
      color: '#B8B8FF',
    },
  });

  const updateTaskAssignment = (groupName, siteId) => {
    const updatedSites = { ...sites };

    // Remove the group from all sites
    Object.keys(updatedSites).forEach((site) => {
      updatedSites[site].assignedGroups = updatedSites[site].assignedGroups.filter(
        (group) => group !== groupName
      );
    });

    // Assign the group to the new site
    if (siteId !== 'unassigned') {
      updatedSites[siteId].assignedGroups.push(groupName);
    }

    setSites(updatedSites);
  };

  return (
    <TasksContext.Provider
      value={{
        tasks,
        setTasks,
        sites,
        setSites,
        groups,
        setGroups,
        updateTaskAssignment,
      }}
    >
      {children}
    </TasksContext.Provider>
  );
};