import React, { useContext } from 'react';
import { toast } from 'react-hot-toast';
import { TasksContext } from '../context/TasksContext';

const TaskTable = () => {
  const context = useContext(TasksContext);
  const { updateTaskAssignment, groups } = context;

  const handleUnassignTeam = (team, siteId) => {
    try {
      console.log(`Unassigning team: ${team} from site: ${siteId}`);
      
      // Validate parameters
      if (!team) {
        toast.error("No team specified for unassignment.");
        return;
      }
      
      // Check if the group exists
      if (!groups[team]) {
        toast.error(`Team ${team} does not exist.`);
        return;
      }
      
      // Direct approach: use updateTaskAssignment with null siteId
      updateTaskAssignment(team, null);
      
      toast.success(`Team ${team} successfully unassigned from ${siteId}`);
    } catch (error) {
      console.error('Error unassigning team:', error);
      toast.error("There was an error removing the team. Please try again.");
    }
  };

  return (
    <div>
      {/* Component content goes here */}
    </div>
  );
};

export default TaskTable; 