
// // // // // export default Chantier;
// // // // // chantier.jsx
// // // // import React, { useState, useContext } from 'react';
// // // // import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Button, Modal } from 'react-native';
// // // // import  TasksContext from './tasks'; // Import the TasksContext

// // // // const Chantier = () => {
// // // //   const { tasks, setTasks } = useContext(TasksContext); // Use the shared tasks state and setter

// // // //   const [newTaskName, setNewTaskName] = useState('');
// // // //   const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
// // // //   const [newTaskDeadline, setNewTaskDeadline] = useState('');
// // // //   const [isModalVisible, setIsModalVisible] = useState(false);

// // // //   const toggleTaskCompletion = (taskId) => {
// // // //     const updatedTasks = tasks.map(task =>
// // // //       task.id === taskId ? { ...task, completed: !task.completed } : task
// // // //     );
// // // //     setTasks(updatedTasks); // Update the shared tasks state
// // // //   };

// // // //   const addTask = () => {
// // // //     if (newTaskName.trim() && newTaskAssignedTo.trim() && newTaskDeadline.trim()) {
// // // //       const newTask = {
// // // //         id: tasks.length + 1,
// // // //         name: newTaskName,
// // // //         siteId: 101,
// // // //         assignedTo: parseInt(newTaskAssignedTo),
// // // //         completed: false,
// // // //         deadline: newTaskDeadline,
// // // //       };
// // // //       setTasks([...tasks, newTask]); // Update the shared tasks state
// // // //       setNewTaskName('');
// // // //       setNewTaskAssignedTo('');
// // // //       setNewTaskDeadline('');
// // // //       setIsModalVisible(false); // Close the modal after adding the task
// // // //     }
// // // //   };

// // // //   const isTaskUrgent = (deadline) => {
// // // //     const today = new Date();
// // // //     const taskDeadline = new Date(deadline);
// // // //     const timeDifference = taskDeadline - today;
// // // //     const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
// // // //     return daysDifference <= 3; // Tasks with deadlines within 3 days are considered urgent
// // // //   };

// // // //   const completedTasks = tasks.filter(task => task.completed).length;
// // // //   const totalTasks = tasks.length;
// // // //   const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

// // // //   return (
// // // //     <View style={styles.container}>
// // // //       {/* Navigation Bar */}
// // // //       <View style={styles.navBar}>
// // // //         <Text style={styles.navBarTitle}>Construction Site - ID: 101</Text>
// // // //         <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.addButton}>
// // // //           <Text style={styles.addButtonText}>+</Text>
// // // //         </TouchableOpacity>
// // // //       </View>

// // // //       {/* Content */}
// // // //       <ScrollView contentContainerStyle={styles.content}>
// // // //         {/* Progress Bar */}
// // // //         <View style={styles.progressContainer}>
// // // //           <View style={[styles.progressBar, { width: `${progress}%` }]} />
// // // //         </View>
// // // //         <Text style={styles.progressText}>{`${Math.round(progress)}% Completed`}</Text>

// // // //         {/* Task List */}
// // // //         {tasks.map(task => (
// // // //           <View
// // // //             key={task.id}
// // // //             style={[
// // // //               styles.taskCard,
// // // //               task.completed && styles.completedTask,
// // // //               isTaskUrgent(task.deadline) && !task.completed && styles.urgentTask,
// // // //             ]}
// // // //           >
// // // //             <Text style={task.completed ? styles.taskDone : styles.taskName}>{task.name}</Text>
// // // //             <Text style={styles.taskDetails}>Assigned to Worker ID: {task.assignedTo}</Text>
// // // //             <Text style={styles.taskDetails}>Deadline: {task.deadline}</Text>
// // // //             <TouchableOpacity
// // // //               style={[styles.button, task.completed && styles.undoButton]}
// // // //               onPress={() => toggleTaskCompletion(task.id)}
// // // //             >
// // // //               <Text style={styles.buttonText}>{task.completed ? 'Undo' : 'Mark as Done'}</Text>
// // // //             </TouchableOpacity>
// // // //           </View>
// // // //         ))}
// // // //       </ScrollView>

// // // //       {/* Modal for Adding a Task */}
// // // //       <Modal visible={isModalVisible} transparent={true} animationType="slide">
// // // //         <View style={styles.modalContainer}>
// // // //           <View style={styles.modalContent}>
// // // //             <Text style={styles.modalHeader}>Add New Task</Text>
// // // //             <TextInput
// // // //               style={styles.input}
// // // //               placeholder="Task Name"
// // // //               value={newTaskName}
// // // //               onChangeText={setNewTaskName}
// // // //             />
// // // //             <TextInput
// // // //               style={styles.input}
// // // //               placeholder="Assigned to Worker ID"
// // // //               value={newTaskAssignedTo}
// // // //               onChangeText={setNewTaskAssignedTo}
// // // //               keyboardType="numeric"
// // // //             />
// // // //             <TextInput
// // // //               style={styles.input}
// // // //               placeholder="Deadline (YYYY-MM-DD)"
// // // //               value={newTaskDeadline}
// // // //               onChangeText={setNewTaskDeadline}
// // // //             />
// // // //             <View style={styles.modalButtons}>
// // // //               <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
// // // //               <Button title="Add Task" onPress={addTask} />
// // // //             </View>
// // // //           </View>
// // // //         </View>
// // // //       </Modal>
// // // //     </View>
// // // //   );
// // // // };

// // // // const styles = StyleSheet.create({
// // // //   container: {
// // // //     flex: 1,
// // // //     backgroundColor: '#f9f9f9',
// // // //   },
// // // //   navBar: {
// // // //     height: 60,
// // // //     backgroundColor: '#007bff',
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     paddingTop: 10,
// // // //     flexDirection: 'row',
// // // //   },
// // // //   navBarTitle: {
// // // //     fontSize: 20,
// // // //     fontWeight: 'bold',
// // // //     color: '#fff',
// // // //   },
// // // //   addButton: {
// // // //     position: 'absolute',
// // // //     right: 20,
// // // //     backgroundColor: '#fff',
// // // //     borderRadius: 20,
// // // //     width: 40,
// // // //     height: 40,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //   },
// // // //   addButtonText: {
// // // //     fontSize: 24,
// // // //     color: '#007bff',
// // // //   },
// // // //   content: {
// // // //     flexGrow: 1,
// // // //     padding: 20,
// // // //     paddingBottom: 80, // Add padding to avoid overlapping with the tab bar
// // // //   },
// // // //   progressContainer: {
// // // //     height: 20,
// // // //     backgroundColor: '#e0e0e0',
// // // //     borderRadius: 10,
// // // //     marginBottom: 20,
// // // //     overflow: 'hidden',
// // // //   },
// // // //   progressBar: {
// // // //     height: '100%',
// // // //     backgroundColor: '#007bff',
// // // //   },
// // // //   progressText: {
// // // //     fontSize: 16,
// // // //     fontWeight: 'bold',
// // // //     color: '#333',
// // // //     textAlign: 'center',
// // // //     marginBottom: 20,
// // // //   },
// // // //   taskCard: {
// // // //     marginBottom: 15,
// // // //     padding: 15,
// // // //     backgroundColor: '#fff',
// // // //     borderRadius: 10,
// // // //     shadowColor: '#000',
// // // //     shadowOffset: { width: 0, height: 2 },
// // // //     shadowOpacity: 0.1,
// // // //     shadowRadius: 5,
// // // //     elevation: 3,
// // // //   },
// // // //   completedTask: {
// // // //     backgroundColor: '#e0f7fa',
// // // //   },
// // // //   urgentTask: {
// // // //     borderColor: 'red',
// // // //     borderWidth: 2,
// // // //   },
// // // //   taskName: {
// // // //     fontSize: 18,
// // // //     fontWeight: 'bold',
// // // //     color: '#333',
// // // //     marginBottom: 5,
// // // //   },
// // // //   taskDone: {
// // // //     fontSize: 18,
// // // //     fontWeight: 'bold',
// // // //     color: '#888',
// // // //     textDecorationLine: 'line-through',
// // // //     marginBottom: 5,
// // // //   },
// // // //   taskDetails: {
// // // //     fontSize: 14,
// // // //     color: '#666',
// // // //     marginBottom: 5,
// // // //   },
// // // //   button: {
// // // //     marginTop: 10,
// // // //     backgroundColor: '#007bff',
// // // //     padding: 10,
// // // //     borderRadius: 5,
// // // //     alignItems: 'center',
// // // //   },
// // // //   undoButton: {
// // // //     backgroundColor: '#6c757d',
// // // //   },
// // // //   buttonText: {
// // // //     color: '#fff',
// // // //     fontSize: 16,
// // // //     fontWeight: 'bold',
// // // //   },
// // // //   modalContainer: {
// // // //     flex: 1,
// // // //     justifyContent: 'center',
// // // //     alignItems: 'center',
// // // //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// // // //   },
// // // //   modalContent: {
// // // //     width: '80%',
// // // //     backgroundColor: '#fff',
// // // //     borderRadius: 10,
// // // //     padding: 20,
// // // //   },
// // // //   modalHeader: {
// // // //     fontSize: 18,
// // // //     fontWeight: 'bold',
// // // //     marginBottom: 10,
// // // //     textAlign: 'center',
// // // //   },
// // // //   input: {
// // // //     height: 40,
// // // //     borderColor: '#ccc',
// // // //     borderWidth: 1,
// // // //     borderRadius: 5,
// // // //     paddingHorizontal: 10,
// // // //     marginBottom: 10,
// // // //   },
// // // //   modalButtons: {
// // // //     flexDirection: 'row',
// // // //     justifyContent: 'space-between',
// // // //     marginTop: 10,
// // // //   },
// // // // });

// // // // export default Chantier;
// // // // chantier.jsx
// // // import React, { useState, useContext } from 'react';
// // // import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Button, Modal } from 'react-native';
// // // import { TasksContext } from './tasks'; // Ensure the correct import path

// // // const Chantier = () => {
// // //   const { tasks, setTasks } = useContext(TasksContext); // Use the shared tasks state and setter

// // //   const [newTaskName, setNewTaskName] = useState('');
// // //   const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
// // //   const [newTaskDeadline, setNewTaskDeadline] = useState('');
// // //   const [isModalVisible, setIsModalVisible] = useState(false);

// // //   const toggleTaskCompletion = (taskId) => {
// // //     const updatedTasks = tasks.map(task =>
// // //       task.id === taskId ? { ...task, completed: !task.completed } : task
// // //     );
// // //     setTasks(updatedTasks); // Update the shared tasks state
// // //   };

// // //   const addTask = () => {
// // //     if (newTaskName.trim() && newTaskAssignedTo.trim() && newTaskDeadline.trim()) {
// // //       const newTask = {
// // //         id: tasks.length + 1,
// // //         name: newTaskName,
// // //         siteId: 101,
// // //         assignedTo: parseInt(newTaskAssignedTo),
// // //         completed: false,
// // //         deadline: newTaskDeadline,
// // //       };
// // //       setTasks([...tasks, newTask]); // Update the shared tasks state
// // //       setNewTaskName('');
// // //       setNewTaskAssignedTo('');
// // //       setNewTaskDeadline('');
// // //       setIsModalVisible(false); // Close the modal after adding the task
// // //     }
// // //   };

// // //   const isTaskUrgent = (deadline) => {
// // //     const today = new Date();
// // //     const taskDeadline = new Date(deadline);
// // //     const timeDifference = taskDeadline - today;
// // //     const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
// // //     return daysDifference <= 3; // Tasks with deadlines within 3 days are considered urgent
// // //   };

// // //   const completedTasks = tasks.filter(task => task.completed).length;
// // //   const totalTasks = tasks.length;
// // //   const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

// // //   return (
// // //     <View style={styles.container}>
// // //       {/* Navigation Bar */}
// // //       <View style={styles.navBar}>
// // //         <Text style={styles.navBarTitle}>Construction Site - ID: 101</Text>
// // //         <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.addButton}>
// // //           <Text style={styles.addButtonText}>+</Text>
// // //         </TouchableOpacity>
// // //       </View>

// // //       {/* Content */}
// // //       <ScrollView contentContainerStyle={styles.content}>
// // //         {/* Progress Bar */}
// // //         <View style={styles.progressContainer}>
// // //           <View style={[styles.progressBar, { width: `${progress}%` }]} />
// // //         </View>
// // //         <Text style={styles.progressText}>{`${Math.round(progress)}% Completed`}</Text>

// // //         {/* Task List */}
// // //         {tasks.map(task => (
// // //           <View
// // //             key={task.id}
// // //             style={[
// // //               styles.taskCard,
// // //               task.completed && styles.completedTask,
// // //               isTaskUrgent(task.deadline) && !task.completed && styles.urgentTask,
// // //             ]}
// // //           >
// // //             <Text style={task.completed ? styles.taskDone : styles.taskName}>{task.name}</Text>
// // //             <Text style={styles.taskDetails}>Assigned to Worker ID: {task.assignedTo}</Text>
// // //             <Text style={styles.taskDetails}>Deadline: {task.deadline}</Text>
// // //             <TouchableOpacity
// // //               style={[styles.button, task.completed && styles.undoButton]}
// // //               onPress={() => toggleTaskCompletion(task.id)}
// // //             >
// // //               <Text style={styles.buttonText}>{task.completed ? 'Undo' : 'Mark as Done'}</Text>
// // //             </TouchableOpacity>
// // //           </View>
// // //         ))}
// // //       </ScrollView>

// // //       {/* Modal for Adding a Task */}
// // //       <Modal visible={isModalVisible} transparent={true} animationType="slide">
// // //         <View style={styles.modalContainer}>
// // //           <View style={styles.modalContent}>
// // //             <Text style={styles.modalHeader}>Add New Task</Text>
// // //             <TextInput
// // //               style={styles.input}
// // //               placeholder="Task Name"
// // //               value={newTaskName}
// // //               onChangeText={setNewTaskName}
// // //             />
// // //             <TextInput
// // //               style={styles.input}
// // //               placeholder="Assigned to Worker ID"
// // //               value={newTaskAssignedTo}
// // //               onChangeText={setNewTaskAssignedTo}
// // //               keyboardType="numeric"
// // //             />
// // //             <TextInput
// // //               style={styles.input}
// // //               placeholder="Deadline (YYYY-MM-DD)"
// // //               value={newTaskDeadline}
// // //               onChangeText={setNewTaskDeadline}
// // //             />
// // //             <View style={styles.modalButtons}>
// // //               <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
// // //               <Button title="Add Task" onPress={addTask} />
// // //             </View>
// // //           </View>
// // //         </View>
// // //       </Modal>
// // //     </View>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   container: {
// // //     flex: 1,
// // //     backgroundColor: '#f9f9f9',
// // //   },
// // //   navBar: {
// // //     height: 60,
// // //     backgroundColor: '#007bff',
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     paddingTop: 10,
// // //     flexDirection: 'row',
// // //   },
// // //   navBarTitle: {
// // //     fontSize: 20,
// // //     fontWeight: 'bold',
// // //     color: '#fff',
// // //   },
// // //   addButton: {
// // //     position: 'absolute',
// // //     right: 20,
// // //     backgroundColor: '#fff',
// // //     borderRadius: 20,
// // //     width: 40,
// // //     height: 40,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //   },
// // //   addButtonText: {
// // //     fontSize: 24,
// // //     color: '#007bff',
// // //   },
// // //   content: {
// // //     flexGrow: 1,
// // //     padding: 20,
// // //     paddingBottom: 80, // Add padding to avoid overlapping with the tab bar
// // //   },
// // //   progressContainer: {
// // //     height: 20,
// // //     backgroundColor: '#e0e0e0',
// // //     borderRadius: 10,
// // //     marginBottom: 20,
// // //     overflow: 'hidden',
// // //   },
// // //   progressBar: {
// // //     height: '100%',
// // //     backgroundColor: '#007bff',
// // //   },
// // //   progressText: {
// // //     fontSize: 16,
// // //     fontWeight: 'bold',
// // //     color: '#333',
// // //     textAlign: 'center',
// // //     marginBottom: 20,
// // //   },
// // //   taskCard: {
// // //     marginBottom: 15,
// // //     padding: 15,
// // //     backgroundColor: '#fff',
// // //     borderRadius: 10,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 5,
// // //     elevation: 3,
// // //   },
// // //   completedTask: {
// // //     backgroundColor: '#e0f7fa',
// // //   },
// // //   urgentTask: {
// // //     borderColor: 'red',
// // //     borderWidth: 2,
// // //   },
// // //   taskName: {
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     color: '#333',
// // //     marginBottom: 5,
// // //   },
// // //   taskDone: {
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     color: '#888',
// // //     textDecorationLine: 'line-through',
// // //     marginBottom: 5,
// // //   },
// // //   taskDetails: {
// // //     fontSize: 14,
// // //     color: '#666',
// // //     marginBottom: 5,
// // //   },
// // //   button: {
// // //     marginTop: 10,
// // //     backgroundColor: '#007bff',
// // //     padding: 10,
// // //     borderRadius: 5,
// // //     alignItems: 'center',
// // //   },
// // //   undoButton: {
// // //     backgroundColor: '#6c757d',
// // //   },
// // //   buttonText: {
// // //     color: '#fff',
// // //     fontSize: 16,
// // //     fontWeight: 'bold',
// // //   },
// // //   modalContainer: {
// // //     flex: 1,
// // //     justifyContent: 'center',
// // //     alignItems: 'center',
// // //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// // //   },
// // //   modalContent: {
// // //     width: '80%',
// // //     backgroundColor: '#fff',
// // //     borderRadius: 10,
// // //     padding: 20,
// // //   },
// // //   modalHeader: {
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     marginBottom: 10,
// // //     textAlign: 'center',
// // //   },
// // //   input: {
// // //     height: 40,
// // //     borderColor: '#ccc',
// // //     borderWidth: 1,
// // //     borderRadius: 5,
// // //     paddingHorizontal: 10,
// // //     marginBottom: 10,
// // //   },
// // //   modalButtons: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     marginTop: 10,
// // //   },
// // // });

// // // export default Chantier;
// // // Chantier.jsx
// // import React, { useState, useContext } from 'react';
// // import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Button, Modal } from 'react-native';
// // import { TasksContext } from '../context/TasksContext'; // Import the TasksContext

// // const Chantier = () => {
// //   const { tasks, setTasks } = useContext(TasksContext); // Use the shared tasks state and setter

// //   const [newTaskName, setNewTaskName] = useState('');
// //   const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
// //   const [newTaskDeadline, setNewTaskDeadline] = useState('');
// //   const [isModalVisible, setIsModalVisible] = useState(false);

// //   const toggleTaskCompletion = (taskId) => {
// //     const updatedTasks = tasks.map(task =>
// //       task.id === taskId ? { ...task, completed: !task.completed } : task
// //     );
// //     setTasks(updatedTasks); // Update the shared tasks state
// //   };

// //   const addTask = () => {
// //     if (newTaskName.trim() && newTaskAssignedTo.trim() && newTaskDeadline.trim()) {
// //       const newTask = {
// //         id: tasks.length + 1,
// //         name: newTaskName,
// //         siteId: 101,
// //         assignedTo: parseInt(newTaskAssignedTo),
// //         completed: false,
// //         deadline: newTaskDeadline,
// //       };
// //       setTasks([...tasks, newTask]); // Update the shared tasks state
// //       setNewTaskName('');
// //       setNewTaskAssignedTo('');
// //       setNewTaskDeadline('');
// //       setIsModalVisible(false); // Close the modal after adding the task
// //     }
// //   };

// //   const isTaskUrgent = (deadline) => {
// //     const today = new Date();
// //     const taskDeadline = new Date(deadline);
// //     const timeDifference = taskDeadline - today;
// //     const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
// //     return daysDifference <= 3; // Tasks with deadlines within 3 days are considered urgent
// //   };

// //   const completedTasks = tasks.filter(task => task.completed).length;
// //   const totalTasks = tasks.length;
// //   const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

// //   return (
// //     <View style={styles.container}>
// //       {/* Navigation Bar */}
// //       <View style={styles.navBar}>
// //         <Text style={styles.navBarTitle}>Construction Site - ID: 101</Text>
// //         <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.addButton}>
// //           <Text style={styles.addButtonText}>+</Text>
// //         </TouchableOpacity>
// //       </View>

// //       {/* Content */}
// //       <ScrollView contentContainerStyle={styles.content}>
// //         {/* Progress Bar */}
// //         <View style={styles.progressContainer}>
// //           <View style={[styles.progressBar, { width: `${progress}%` }]} />
// //         </View>
// //         <Text style={styles.progressText}>{`${Math.round(progress)}% Completed`}</Text>

// //         {/* Task List */}
// //         {tasks.map(task => (
// //           <View
// //             key={task.id}
// //             style={[
// //               styles.taskCard,
// //               task.completed && styles.completedTask,
// //               isTaskUrgent(task.deadline) && !task.completed && styles.urgentTask,
// //             ]}
// //           >
// //             <Text style={task.completed ? styles.taskDone : styles.taskName}>{task.name}</Text>
// //             <Text style={styles.taskDetails}>Assigned to Worker ID: {task.assignedTo}</Text>
// //             <Text style={styles.taskDetails}>Deadline: {task.deadline}</Text>
// //             <TouchableOpacity
// //               style={[styles.button, task.completed && styles.undoButton]}
// //               onPress={() => toggleTaskCompletion(task.id)}
// //             >
// //               <Text style={styles.buttonText}>{task.completed ? 'Undo' : 'Mark as Done'}</Text>
// //             </TouchableOpacity>
// //           </View>
// //         ))}
// //       </ScrollView>

// //       {/* Modal for Adding a Task */}
// //       <Modal visible={isModalVisible} transparent={true} animationType="slide">
// //         <View style={styles.modalContainer}>
// //           <View style={styles.modalContent}>
// //             <Text style={styles.modalHeader}>Add New Task</Text>
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Task Name"
// //               value={newTaskName}
// //               onChangeText={setNewTaskName}
// //             />
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Assigned to Worker ID"
// //               value={newTaskAssignedTo}
// //               onChangeText={setNewTaskAssignedTo}
// //               keyboardType="numeric"
// //             />
// //             <TextInput
// //               style={styles.input}
// //               placeholder="Deadline (YYYY-MM-DD)"
// //               value={newTaskDeadline}
// //               onChangeText={setNewTaskDeadline}
// //             />
// //             <View style={styles.modalButtons}>
// //               <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
// //               <Button title="Add Task" onPress={addTask} />
// //             </View>
// //           </View>
// //         </View>
// //       </Modal>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     backgroundColor: '#f9f9f9',
// //   },
// //   navBar: {
// //     height: 60,
// //     backgroundColor: '#007bff',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     paddingTop: 10,
// //     flexDirection: 'row',
// //   },
// //   navBarTitle: {
// //     fontSize: 20,
// //     fontWeight: 'bold',
// //     color: '#fff',
// //   },
// //   addButton: {
// //     position: 'absolute',
// //     right: 20,
// //     backgroundColor: '#fff',
// //     borderRadius: 20,
// //     width: 40,
// //     height: 40,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   addButtonText: {
// //     fontSize: 24,
// //     color: '#007bff',
// //   },
// //   content: {
// //     flexGrow: 1,
// //     padding: 20,
// //     paddingBottom: 80, // Add padding to avoid overlapping with the tab bar
// //   },
// //   progressContainer: {
// //     height: 20,
// //     backgroundColor: '#e0e0e0',
// //     borderRadius: 10,
// //     marginBottom: 20,
// //     overflow: 'hidden',
// //   },
// //   progressBar: {
// //     height: '100%',
// //     backgroundColor: '#007bff',
// //   },
// //   progressText: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     color: '#333',
// //     textAlign: 'center',
// //     marginBottom: 20,
// //   },
// //   taskCard: {
// //     marginBottom: 15,
// //     padding: 15,
// //     backgroundColor: '#fff',
// //     borderRadius: 10,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 5,
// //     elevation: 3,
// //   },
// //   completedTask: {
// //     backgroundColor: '#e0f7fa',
// //   },
// //   urgentTask: {
// //     borderColor: 'red',
// //     borderWidth: 2,
// //   },
// //   taskName: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: '#333',
// //     marginBottom: 5,
// //   },
// //   taskDone: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: '#888',
// //     textDecorationLine: 'line-through',
// //     marginBottom: 5,
// //   },
// //   taskDetails: {
// //     fontSize: 14,
// //     color: '#666',
// //     marginBottom: 5,
// //   },
// //   button: {
// //     marginTop: 10,
// //     backgroundColor: '#007bff',
// //     padding: 10,
// //     borderRadius: 5,
// //     alignItems: 'center',
// //   },
// //   undoButton: {
// //     backgroundColor: '#6c757d',
// //   },
// //   buttonText: {
// //     color: '#fff',
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //   },
// //   modalContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
// //   },
// //   modalContent: {
// //     width: '80%',
// //     backgroundColor: '#fff',
// //     borderRadius: 10,
// //     padding: 20,
// //   },
// //   modalHeader: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     marginBottom: 10,
// //     textAlign: 'center',
// //   },
// //   input: {
// //     height: 40,
// //     borderColor: '#ccc',
// //     borderWidth: 1,
// //     borderRadius: 5,
// //     paddingHorizontal: 10,
// //     marginBottom: 10,
// //   },
// //   modalButtons: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     marginTop: 10,
// //   }
// // });

// // export default Chantier;
// import React, { useState, useContext } from 'react';
// import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Button, Modal } from 'react-native';
// import { TasksContext } from '../context/TasksContext';

// const Chantier = () => {
//   const { tasks, setTasks } = useContext(TasksContext);

//   const [newTaskName, setNewTaskName] = useState('');
//   const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
//   const [newTaskDeadline, setNewTaskDeadline] = useState('');
//   const [newTaskTeam, setNewTaskTeam] = useState('');
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   const toggleTaskCompletion = (taskId) => {
//     const updatedTasks = tasks.map(task =>
//       task.id === taskId ? { ...task, completed: !task.completed } : task
//     );
//     setTasks(updatedTasks);
//   };

//   const addTask = () => {
//     if (newTaskName.trim() && newTaskAssignedTo.trim() && newTaskDeadline.trim() && newTaskTeam.trim()) {
//       const newTask = {
//         id: Date.now(), // Use timestamp for unique ID
//         title: newTaskName,
//         siteId: 101, // Default site ID - can be made dynamic
//         assignedTo: parseInt(newTaskAssignedTo),
//         team: newTaskTeam,
//         completed: false,
//         dueDate: newTaskDeadline,
//         deadline: newTaskDeadline,
//       };
//       setTasks([...tasks, newTask]);
//       setNewTaskName('');
//       setNewTaskAssignedTo('');
//       setNewTaskDeadline('');
//       setNewTaskTeam('');
//       setIsModalVisible(false);
//     }
//   };

//   const isTaskUrgent = (deadline) => {
//     const today = new Date();
//     const taskDeadline = new Date(deadline);
//     const timeDifference = taskDeadline - today;
//     const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
//     return daysDifference <= 3;
//   };

//   const completedTasks = tasks.filter(task => task.completed).length;
//   const totalTasks = tasks.length;
//   const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

//   return (
//     <View style={styles.container}>
//       <View style={styles.navBar}>
//         <Text style={styles.navBarTitle}>Construction Site - ID: 101</Text>
//         <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.addButton}>
//           <Text style={styles.addButtonText}>+</Text>
//         </TouchableOpacity>
//       </View>

//       <ScrollView contentContainerStyle={styles.content}>
//         <View style={styles.progressContainer}>
//           <View style={[styles.progressBar, { width: `${progress}%` }]} />
//         </View>
//         <Text style={styles.progressText}>{`${Math.round(progress)}% Completed`}</Text>

//         {tasks.map(task => (
//           <View
//             key={task.id}
//             style={[
//               styles.taskCard,
//               task.completed && styles.completedTask,
//               isTaskUrgent(task.deadline) && !task.completed && styles.urgentTask,
//             ]}
//           >
//             <Text style={task.completed ? styles.taskDone : styles.taskName}>{task.title}</Text>
//             <Text style={styles.taskDetails}>Assigned to Worker ID: {task.assignedTo}</Text>
//             <Text style={styles.taskDetails}>Team: {task.team}</Text>
//             <Text style={styles.taskDetails}>Deadline: {task.deadline}</Text>
//             <TouchableOpacity
//               style={[styles.button, task.completed && styles.undoButton]}
//               onPress={() => toggleTaskCompletion(task.id)}
//             >
//               <Text style={styles.buttonText}>{task.completed ? 'Undo' : 'Mark as Done'}</Text>
//             </TouchableOpacity>
//           </View>
//         ))}
//       </ScrollView>

//       <Modal visible={isModalVisible} transparent={true} animationType="slide">
//         <View style={styles.modalContainer}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalHeader}>Add New Task</Text>
//             <TextInput
//               style={styles.input}
//               placeholder="Task Name"
//               value={newTaskName}
//               onChangeText={setNewTaskName}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Assigned to Worker ID"
//               value={newTaskAssignedTo}
//               onChangeText={setNewTaskAssignedTo}
//               keyboardType="numeric"
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Team Name"
//               value={newTaskTeam}
//               onChangeText={setNewTaskTeam}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Due Date (YYYY-MM-DD)"
//               value={newTaskDeadline}
//               onChangeText={setNewTaskDeadline}
//             />
//             <View style={styles.modalButtons}>
//               <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
//               <Button title="Add Task" onPress={addTask} />
//             </View>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9f9f9',
//   },
//   navBar: {
//     height: 60,
//     backgroundColor: '#007bff',
//     justifyContent: 'center',
//     alignItems: 'center',
//     paddingTop: 10,
//     flexDirection: 'row',
//   },
//   navBarTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     color: '#fff',
//   },
//   addButton: {
//     position: 'absolute',
//     right: 20,
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     width: 40,
//     height: 40,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   addButtonText: {
//     fontSize: 24,
//     color: '#007bff',
//   },
//   content: {
//     flexGrow: 1,
//     padding: 20,
//     paddingBottom: 80,
//   },
//   progressContainer: {
//     height: 20,
//     backgroundColor: '#e0e0e0',
//     borderRadius: 10,
//     marginBottom: 20,
//     overflow: 'hidden',
//   },
//   progressBar: {
//     height: '100%',
//     backgroundColor: '#007bff',
//   },
//   progressText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   taskCard: {
//     marginBottom: 15,
//     padding: 15,
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   completedTask: {
//     backgroundColor: '#e0f7fa',
//   },
//   urgentTask: {
//     borderColor: 'red',
//     borderWidth: 2,
//   },
//   taskName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//     marginBottom: 5,
//   },
//   taskDone: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#888',
//     textDecorationLine: 'line-through',
//     marginBottom: 5,
//   },
//   taskDetails: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 5,
//   },
//   button: {
//     marginTop: 10,
//     backgroundColor: '#007bff',
//     padding: 10,
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   undoButton: {
//     backgroundColor: '#6c757d',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     width: '80%',
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 20,
//   },
//   modalHeader: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     textAlign: 'center',
//   },
//   input: {
//     height: 40,
//     borderColor: '#ccc',
//     borderWidth: 1,
//     borderRadius: 5,
//     paddingHorizontal: 10,
//     marginBottom: 10,
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 10,
//   },
// });

// export default Chantier;
import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Button, Modal, SafeAreaView } from 'react-native';
import { TasksContext } from '../context/TasksContext'; // Import the TasksContext

const Chantier = () => {
  const { tasks, setTasks } = useContext(TasksContext);

  const [newTaskName, setNewTaskName] = useState('');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [newTaskTeam, setNewTaskTeam] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleTaskCompletion = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const addTask = () => {
    if (newTaskName.trim() && newTaskAssignedTo.trim() && newTaskDeadline.trim() && newTaskTeam.trim()) {
      const newTask = {
        id: Date.now(),
        title: newTaskName,
        siteId: 101,
        assignedTo: parseInt(newTaskAssignedTo),
        team: newTaskTeam,
        completed: false,
        dueDate: newTaskDeadline,
        deadline: newTaskDeadline,
      };
      setTasks([...tasks, newTask]);
      setNewTaskName('');
      setNewTaskAssignedTo('');
      setNewTaskDeadline('');
      setNewTaskTeam('');
      setIsModalVisible(false);
    }
  };

  const isTaskUrgent = (deadline) => {
    const today = new Date();
    const taskDeadline = new Date(deadline);
    const timeDifference = taskDeadline - today;
    const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    return daysDifference <= 3;
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.navBar}>
          <Text style={styles.navBarTitle}>Construction Site - ID: 101</Text>
          <TouchableOpacity onPress={() => setIsModalVisible(true)} style={styles.addButton}>
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.progressContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{`${Math.round(progress)}% Completed`}</Text>

          {tasks.map(task => (
            <View
              key={task.id}
              style={[
                styles.taskCard,
                task.completed && styles.completedTask,
                isTaskUrgent(task.deadline) && !task.completed && styles.urgentTask,
              ]}
            >
              <Text style={task.completed ? styles.taskDone : styles.taskName}>{task.title}</Text>
              <Text style={styles.taskDetails}>Assigned to Worker ID: {task.assignedTo}</Text>
              <Text style={styles.taskDetails}>Team: {task.team}</Text>
              <Text style={styles.taskDetails}>Deadline: {task.deadline}</Text>
              <TouchableOpacity
                style={[styles.button, task.completed && styles.undoButton]}
                onPress={() => toggleTaskCompletion(task.id)}
              >
                <Text style={styles.buttonText}>{task.completed ? 'Undo' : 'Mark as Done'}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        <Modal visible={isModalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Add New Task</Text>
              <TextInput
                style={styles.input}
                placeholder="Task Name"
                value={newTaskName}
                onChangeText={setNewTaskName}
              />
              <TextInput
                style={styles.input}
                placeholder="Assigned to Worker ID"
                value={newTaskAssignedTo}
                onChangeText={setNewTaskAssignedTo}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Team Name"
                value={newTaskTeam}
                onChangeText={setNewTaskTeam}
              />
              <TextInput
                style={styles.input}
                placeholder="Due Date (YYYY-MM-DD)"
                value={newTaskDeadline}
                onChangeText={setNewTaskDeadline}
              />
              <View style={styles.modalButtons}>
                <Button title="Cancel" onPress={() => setIsModalVisible(false)} />
                <Button title="Add Task" onPress={addTask} />
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  navBar: {
    height: 60,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    flexDirection: 'row',
  },
  navBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  addButton: {
    position: 'absolute',
    right: 20,
    backgroundColor: '#fff',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 24,
    color: '#007bff',
  },
  content: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 80,
  },
  progressContainer: {
    height: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 10,
    marginBottom: 20,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#007bff',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  taskCard: {
    marginBottom: 15,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  completedTask: {
    backgroundColor: '#e0f7fa',
  },
  urgentTask: {
    borderColor: 'red',
    borderWidth: 2,
  },
  taskName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  taskDone: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#888',
    textDecorationLine: 'line-through',
    marginBottom: 5,
  },
  taskDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  undoButton: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});

export default Chantier;