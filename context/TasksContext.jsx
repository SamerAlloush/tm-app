// import React, { createContext, useContext, useState, useCallback } from 'react';

// // Create the context with default values
// export const TasksContext = createContext({
//   tasks: [],
//   sites: {},
//   groups: {},
//   updateTaskAssignment: () => { console.warn('Default updateTaskAssignment called'); },
//   setSitesDirectly: () => { console.warn('Default setSitesDirectly called'); },
//   unassignTask: () => { console.warn('Default unassignTask called'); return false; }
// });

// // Initial state data
// const initialSites = {
//   'Site A': {
//     location: 'Downtown District',
//     progress: 0,
//     assignedGroups: []
//   },
//   'Site B': {
//     location: 'Riverside Area',
//     progress: 0,
//     assignedGroups: []
//   },
//   'Site C': {
//     location: 'Mountain View',
//     progress: 0,
//     assignedGroups: []
//   }
// };

// const initialGroups = {
//   'Group 1': {
//     color: '#4CAF50',
//     leader: 'John Doe',
//     members: ['John Doe', 'Jane Smith', 'Bob Wilson']
//   },
//   'Group 2': {
//     color: '#2196F3',
//     leader: 'Sarah Johnson',
//     members: ['Sarah Johnson', 'Mike Brown', 'Lisa Davis']
//   },
//   'Group 3': {
//     color: '#FF9800',
//     leader: 'Michael Brown',
//     members: ['Michael Brown', 'Emily Davis', 'David Wilson']
//   },
//   'Group 4': {
//     color: '#9C27B0',
//     leader: 'Jennifer Lee',
//     members: ['Jennifer Lee', 'Robert Taylor', 'Patricia Anderson']
//   },
//   'Group 5': {
//     color: '#E91E63',
//     leader: 'David Miller',
//     members: ['David Miller', 'Susan White', 'James Johnson']
//   }
// };

// export const TasksProvider = ({ children }) => {
//   const [tasks, setTasks] = useState([]);
//   const [sites, setSites] = useState(initialSites);
//   const [groups, setGroups] = useState(initialGroups);
  
//   // Direct function to update sites
//   const setSitesDirectly = useCallback((newSites) => {
//     console.log('Direct sites update:', newSites);
//     setSites(newSites);
//   }, []);
  
//   // Dedicated function to unassign a team from a site
//   const unassignTask = useCallback((group) => {
//     console.log(`[unassignTask] Starting for group: ${group}`);
    
//     // Validate group parameter
//     if (!group) {
//       console.error('[unassignTask] Error: No group specified.');
//       return false;
//     }
    
//     // Check if the group exists in the current groups state
//     if (!groups[group]) {
//       console.error(`[unassignTask] Error: Group ${group} does not exist in current groups state.`);
//       return false;
//     }
    
//     let wasUnassigned = false; // Flag to track if any change was made

//     setSites(currentSites => {
//       console.log('[unassignTask] Running functional state update.');
      
//       // Create a deep copy of the current sites state passed to the updater
//       let updatedSites;
//       try {
//           updatedSites = JSON.parse(JSON.stringify(currentSites));
//       } catch (e) {
//           console.error("[unassignTask] Error deep copying sites state inside functional update:", e);
//           return currentSites; // Return original state if copy fails
//       }

//       // Reset flag for this update cycle
//       wasUnassigned = false; 

//       // Go through each site and remove the group if present
//       Object.keys(updatedSites).forEach(siteId => {
//         console.log(`[unassignTask] Processing siteId: ${siteId}`);
//         const site = updatedSites[siteId];

//         // Rigorous check if site object exists
//         if (!site) {
//           console.warn(`[unassignTask] Site object for ${siteId} is missing or undefined in current state. Skipping.`);
//           return; // Skip this iteration
//         }
        
//         // Ensure assignedGroups exists and is an array
//         if (typeof site.assignedGroups === 'undefined' || site.assignedGroups === null) {
//           console.log(`[unassignTask] Initializing assignedGroups for site ${siteId} as it was undefined/null.`);
//           site.assignedGroups = [];
//         } else if (!Array.isArray(site.assignedGroups)) {
//            console.warn(`[unassignTask] site.assignedGroups for ${siteId} was not an array. Resetting to empty array. Value was:`, site.assignedGroups);
//            site.assignedGroups = []; // Reset to empty array if it's not an array
//         }

//         // Now we are sure site.assignedGroups is an array
//         console.log(`[unassignTask] Checking if group '${group}' is in assignedGroups for ${siteId}:`, JSON.stringify(site.assignedGroups));
        
//         try {
//             const initialLength = site.assignedGroups.length;
//             // Use filter to create a new array - safer than splice
//             site.assignedGroups = site.assignedGroups.filter(g => g !== group);
            
//             if (site.assignedGroups.length < initialLength) {
//                 console.log(`[unassignTask] Removed ${group} from ${siteId}. New assignedGroups:`, JSON.stringify(site.assignedGroups));
//                 wasUnassigned = true; // Mark that an unassignment occurred
//             } else {
//                  console.log(`[unassignTask] Group '${group}' not found in ${siteId}.`);
//             }
//         } catch (innerError) {
//             console.error(`[unassignTask] Error processing assignedGroups for site ${siteId}:`, innerError);
//         }
//       });

//       console.log(`[unassignTask] Finished processing sites in functional update. Was unassigned this cycle: ${wasUnassigned}`);
      
//       // Only return the updated state if a change was actually made
//       if (wasUnassigned) {
//           console.log('[unassignTask] Returning updated sites state.');
//           return updatedSites;
//       } else {
//           console.log('[unassignTask] No changes made, returning original sites state.');
//           return currentSites; // Return the original state if no group was removed
//       }
//     });

//     // The return value needs to reflect if the operation *intended* to unassign,
//     // but the actual state update is asynchronous.
//     // We return true immediately if validation passed, assuming the update will likely succeed.
//     // The caller should rely on state changes, not this return value for UI updates.
//     console.log(`[unassignTask] Exiting function for group: ${group}. Update scheduled.`);
//     return true; // Indicate the operation was initiated successfully

//   }, [groups]); // Dependency only on groups for validation
  
//   // Function for updating task assignments
//   const updateTaskAssignment = useCallback((group, siteId) => {
//     try {
//       console.log('Updating assignment:', { group, siteId });
      
//       // Validate group parameter
//       if (!group) {
//         console.error('No group specified for assignment update');
//         return;
//       }
      
//       // Check if the group exists
//       if (!groups[group]) {
//         console.error(`Group ${group} does not exist`);
//         return;
//       }
      
//       // Create a new sites object to avoid mutating state directly
//       const updatedSites = JSON.parse(JSON.stringify(sites));
      
//       // Case: Unassign (remove from any site)
//       if (siteId === null) {
//         console.log(`Unassigning group ${group} from all sites`);
        
//         // Simple approach: go through each site and remove the group if it exists
//         Object.keys(updatedSites).forEach(site => {
//           // Skip if site doesn't exist
//           if (!updatedSites[site]) {
//             console.warn(`Site ${site} does not exist, skipping`);
//             return;
//           }
          
//           // Initialize assignedGroups if it doesn't exist
//           if (!updatedSites[site].assignedGroups) {
//             console.log(`Initializing assignedGroups for site ${site}`);
//             updatedSites[site].assignedGroups = [];
//           }
          
//           // Remove group if it's in this site's assignedGroups
//           const index = updatedSites[site].assignedGroups.indexOf(group);
//           if (index !== -1) {
//             updatedSites[site].assignedGroups.splice(index, 1);
//             console.log(`Removed ${group} from ${site}`);
//           }
//         });
        
//         // Update state
//         setSites(updatedSites);
//         return;
//       }
      
//       // Case: Assign to a specific site
      
//       // Check if the site exists
//       if (!updatedSites[siteId]) {
//         console.error(`Site with ID ${siteId} does not exist`);
//         return;
//       }
      
//       // Ensure assignedGroups array exists
//       if (!updatedSites[siteId].assignedGroups) {
//         console.log(`Initializing assignedGroups for site ${siteId}`);
//         updatedSites[siteId].assignedGroups = [];
//       }
      
//       // Check if already assigned
//       if (updatedSites[siteId].assignedGroups.includes(group)) {
//         console.log(`Group ${group} is already assigned to site ${siteId}`);
//         return;
//       }
      
//       // Remove from other sites first
//       Object.keys(updatedSites).forEach(site => {
//         // Skip the target site and sites without assignedGroups
//         if (site === siteId) {
//           return;
//         }
        
//         // Initialize assignedGroups if it doesn't exist
//         if (!updatedSites[site].assignedGroups) {
//           console.log(`Initializing assignedGroups for site ${site}`);
//           updatedSites[site].assignedGroups = [];
//         }
        
//         // Remove group if it's in this site's assignedGroups
//         const index = updatedSites[site].assignedGroups.indexOf(group);
//         if (index !== -1) {
//           updatedSites[site].assignedGroups.splice(index, 1);
//         }
//       });
      
//       // Add to target site
//       updatedSites[siteId].assignedGroups.push(group);
      
//       // Update state
//       setSites(updatedSites);
//       console.log(`Group ${group} assigned to site ${siteId}`);
      
//     } catch (error) {
//       console.error('Error in updateTaskAssignment:', error);
//     }
//   }, [sites, groups]);

//   const contextValue = {
//     tasks,
//     sites,
//     groups,
//     updateTaskAssignment,
//     setSitesDirectly,
//     unassignTask
//   };

//   return (
//     <TasksContext.Provider value={contextValue}>
//       {children}
//     </TasksContext.Provider>
//   );
// };

// export const useTasks = () => {
//   const context = useContext(TasksContext);
//   if (!context) {
//     throw new Error('useTasks must be used within a TasksProvider');
//   }
//   return context;
// };
import React, { createContext, useContext, useState, useCallback } from 'react';

// Initial state data
const initialSites = {
  'Site A': {
    location: 'Downtown District',
    progress: 0,
    assignedGroups: []
  },
  'Site B': {
    location: 'Riverside Area',
    progress: 0,
    assignedGroups: []
  },
  'Site C': {
    location: 'Mountain View',
    progress: 0,
    assignedGroups: []
  }
};

const initialGroups = {
  'Group 1': {
    color: '#FF6B6B',
    leader: 'John Smith',
    members: ['Alice Johnson', 'Bob Williams', 'Charlie Brown'],
    contact: 'group1@example.com'
  },
  'Group 2': {
    color: '#4ECDC4',
    leader: 'Sarah Davis',
    members: ['David Wilson', 'Eva Green', 'Frank White'],
    contact: 'group2@example.com'
  },
  'Group 3': {
    color: '#FFD166',
    leader: 'Michael Lee',
    members: ['Grace Taylor', 'Henry Clark', 'Ivy Adams'],
    contact: 'group3@example.com'
  },
  'Group 4': {
    color: '#A5DD9B',
    leader: 'Olivia Martinez',
    members: ['Jack Wilson', 'Karen Smith', 'Liam Johnson'],
    contact: 'group4@example.com'
  },
  'Group 5': {
    color: '#B8B8FF',
    leader: 'Noah Garcia',
    members: ['Sophia Brown', 'Thomas Davis', 'Uma Wilson'],
    contact: 'group5@example.com'
  }
};

const initialTasks = [
  { id: 1, name: "Pour concrete", siteId: "Site A", assignedTo: "Group 1", completed: false, deadline: '2025-11-01' },
  { id: 2, name: "Install frames", siteId: "Site A", assignedTo: "Group 2", completed: false, deadline: '2025-10-28' },
  { id: 3, name: "Setup electrical wiring", siteId: "Site A", assignedTo: "Group 3", completed: true, deadline: '2025-10-25' },
];

// Create the context with default values
export const TasksContext = createContext({
  tasks: [],
  sites: {},
  groups: {},
  updateTaskAssignment: () => console.warn('Default updateTaskAssignment called'),
  setSitesDirectly: () => console.warn('Default setSitesDirectly called'),
  unassignTask: () => {
    console.warn('Default unassignTask called');
    return false;
  },
  setTasks: () => console.warn('Default setTasks called'),
  setGroups: () => console.warn('Default setGroups called')
});

export const TasksProvider = ({ children }) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [sites, setSites] = useState(initialSites);
  const [groups, setGroups] = useState(initialGroups);
  
  // Direct function to update sites
  const setSitesDirectly = useCallback((newSites) => {
    console.log('Direct sites update:', newSites);
    setSites(newSites);
  }, []);
  
  // Dedicated function to unassign a team from a site
  const unassignTask = useCallback((group) => {
    console.log(`[unassignTask] Starting for group: ${group}`);
    
    // Validate group parameter
    if (!group) {
      console.error('[unassignTask] Error: No group specified.');
      return false;
    }
    
    // Check if the group exists in the current groups state
    if (!groups[group]) {
      console.error(`[unassignTask] Error: Group ${group} does not exist in current groups state.`);
      return false;
    }
    
    let wasUnassigned = false; // Flag to track if any change was made

    setSites(currentSites => {
      console.log('[unassignTask] Running functional state update.');
      
      // Create a deep copy of the current sites state passed to the updater
      let updatedSites;
      try {
          updatedSites = JSON.parse(JSON.stringify(currentSites));
      } catch (e) {
          console.error("[unassignTask] Error deep copying sites state inside functional update:", e);
          return currentSites; // Return original state if copy fails
      }

      // Reset flag for this update cycle
      wasUnassigned = false; 

      // Go through each site and remove the group if present
      Object.keys(updatedSites).forEach(siteId => {
        console.log(`[unassignTask] Processing siteId: ${siteId}`);
        const site = updatedSites[siteId];

        // Rigorous check if site object exists
        if (!site) {
          console.warn(`[unassignTask] Site object for ${siteId} is missing or undefined in current state. Skipping.`);
          return; // Skip this iteration
        }
        
        // Ensure assignedGroups exists and is an array
        if (typeof site.assignedGroups === 'undefined' || site.assignedGroups === null) {
          console.log(`[unassignTask] Initializing assignedGroups for site ${siteId} as it was undefined/null.`);
          site.assignedGroups = [];
        } else if (!Array.isArray(site.assignedGroups)) {
           console.warn(`[unassignTask] site.assignedGroups for ${siteId} was not an array. Resetting to empty array. Value was:`, site.assignedGroups);
           site.assignedGroups = []; // Reset to empty array if it's not an array
        }

        // Now we are sure site.assignedGroups is an array
        console.log(`[unassignTask] Checking if group '${group}' is in assignedGroups for ${siteId}:`, JSON.stringify(site.assignedGroups));
        
        try {
            const initialLength = site.assignedGroups.length;
            // Use filter to create a new array - safer than splice
            site.assignedGroups = site.assignedGroups.filter(g => g !== group);
            
            if (site.assignedGroups.length < initialLength) {
                console.log(`[unassignTask] Removed ${group} from ${siteId}. New assignedGroups:`, JSON.stringify(site.assignedGroups));
                wasUnassigned = true; // Mark that an unassignment occurred
            } else {
                 console.log(`[unassignTask] Group '${group}' not found in ${siteId}.`);
            }
        } catch (innerError) {
            console.error(`[unassignTask] Error processing assignedGroups for site ${siteId}:`, innerError);
        }
      });

      console.log(`[unassignTask] Finished processing sites in functional update. Was unassigned this cycle: ${wasUnassigned}`);
      
      // Only return the updated state if a change was actually made
      if (wasUnassigned) {
          console.log('[unassignTask] Returning updated sites state.');
          return updatedSites;
      } else {
          console.log('[unassignTask] No changes made, returning original sites state.');
          return currentSites; // Return the original state if no group was removed
      }
    });

    console.log(`[unassignTask] Exiting function for group: ${group}. Update scheduled.`);
    return true; // Indicate the operation was initiated successfully

  }, [groups]); // Dependency only on groups for validation
  
  // Function for updating task assignments
  const updateTaskAssignment = useCallback((group, targetSiteId, sourceSiteId = null) => {
    try {
      console.log('Updating assignment:', { group, targetSiteId, sourceSiteId });
      
      // Validate group parameter
      if (!group) {
        console.error('No group specified for assignment update');
        return;
      }
      
      // Check if the group exists
      if (!groups[group]) {
        console.error(`Group ${group} does not exist`);
        return;
      }
      
      // If this is an unassignment
      if (targetSiteId === null) {
        const updatedSites = { ...sites };
        if (sourceSiteId && updatedSites[sourceSiteId]) {
          updatedSites[sourceSiteId] = {
            ...updatedSites[sourceSiteId],
            assignedGroups: (updatedSites[sourceSiteId].assignedGroups || [])
              .filter(g => g !== group)
          };
        }
        setSites(updatedSites);
        return;
      }
      
      // Create a new sites object to avoid mutating state directly
      const updatedSites = JSON.parse(JSON.stringify(sites));
      
      // Check if the site exists
      if (!updatedSites[targetSiteId]) {
        console.error(`Site with ID ${targetSiteId} does not exist`);
        return;
      }
      
      // Ensure assignedGroups array exists
      if (!updatedSites[targetSiteId].assignedGroups) {
        console.log(`Initializing assignedGroups for site ${targetSiteId}`);
        updatedSites[targetSiteId].assignedGroups = [];
      }
      
      // Check if already assigned
      if (updatedSites[targetSiteId].assignedGroups.includes(group)) {
        console.log(`Group ${group} is already assigned to site ${targetSiteId}`);
        return;
      }
      
      // Remove from other sites first
      Object.keys(updatedSites).forEach(site => {
        // Skip the target site and sites without assignedGroups
        if (site === targetSiteId) {
          return;
        }
        
        // Initialize assignedGroups if it doesn't exist
        if (!updatedSites[site].assignedGroups) {
          console.log(`Initializing assignedGroups for site ${site}`);
          updatedSites[site].assignedGroups = [];
        }
        
        // Remove group if it's in this site's assignedGroups
        const index = updatedSites[site].assignedGroups.indexOf(group);
        if (index !== -1) {
          updatedSites[site].assignedGroups.splice(index, 1);
        }
      });
      
      // Add to target site
      updatedSites[targetSiteId].assignedGroups.push(group);
      
      // Update state
      setSites(updatedSites);
      console.log(`Group ${group} assigned to site ${targetSiteId}`);
      
    } catch (error) {
      console.error('Error in updateTaskAssignment:', error);
    }
  }, [sites, groups]);

  const contextValue = {
    tasks,
    setTasks,
    sites,
    setSites,
    groups,
    setGroups,
    updateTaskAssignment,
    setSitesDirectly,
    unassignTask
  };

  return (
    <TasksContext.Provider value={contextValue}>
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