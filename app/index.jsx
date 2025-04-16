// // // import React, { useContext, useState, useEffect } from 'react';
// // // import {
// // //   View,
// // //   Text,
// // //   StyleSheet,
// // //   TouchableOpacity,
// // //   Modal,
// // //   Dimensions,
// // //   SafeAreaView,
// // //   ScrollView,
// // //   Alert,
// // //   Platform
// // // } from 'react-native';
// // // import { Calendar } from 'react-native-calendars';
// // // import { AnimatedCircularProgress } from 'react-native-circular-progress';
// // // import { TasksContext } from '../context/TasksContext';
// // // import Icon from 'react-native-vector-icons/MaterialIcons';

// // // const { width } = Dimensions.get('window');

// // // const Dashboard = () => {
// // //   const context = useContext(TasksContext);
// // //   if (!context) {
// // //     console.error("TasksContext is not provided. Ensure the provider wraps this component.");
// // //     return <Text>Error: TasksContext is not available.</Text>;
// // //   }

// // //   const {
// // //     tasks = [],
// // //     sites = {},
// // //     groups = {},
// // //     updateTaskAssignment,
// // //     unassignTask
// // //   } = context;
  
// // //   const [selectedDate, setSelectedDate] = useState(null);
// // //   const [modalVisible, setModalVisible] = useState(false);
// // //   const [selectedGroup, setSelectedGroup] = useState(null);
  
// // //   // Get unassigned groups
// // //   const unassignedGroups = Object.keys(groups).filter(group => {
// // //     return !Object.values(sites).some(site =>
// // //       site.assignedGroups && site.assignedGroups.includes(group)
// // //     );
// // //   });

// // //   // Handle group selection
// // //   const handleGroupSelect = (group) => {
// // //     setSelectedGroup(group);
// // //   };

// // //   // Handle site selection to assign group
// // //   const handleSiteSelect = (siteId) => {
// // //     if (!selectedGroup) {
// // //       Alert.alert(
// // //         "No Team Selected",
// // //         "Please select a team first from the Available Teams section.",
// // //         [{ text: "OK" }]
// // //       );
// // //       return;
// // //     }

// // //     try {
// // //       // Use updateTaskAssignment directly instead of manual state manipulation
// // //       if (typeof updateTaskAssignment === 'function') {
// // //         updateTaskAssignment(selectedGroup, siteId);
        
// // //         // Reset selected group
// // //         setSelectedGroup(null);
// // //       } else {
// // //         throw new Error('updateTaskAssignment is not available');
// // //       }
// // //     } catch (error) {
// // //       console.error('Error assigning team:', error);
// // //       Alert.alert(
// // //         "Assignment Error",
// // //         "There was an error assigning the team. Please try again.",
// // //         [{ text: "OK" }]
// // //       );
// // //     }
// // //   };

// // //   // Add function to handle team unassignment
// // //   const handleUnassignTeam = (group, siteId) => {
// // //     try {
// // //       console.log(`Attempting to unassign ${group} from ${siteId}`);
      
// // //       // Validate parameters
// // //       if (!group) {
// // //         Alert.alert(
// // //           "Unassignment Error",
// // //           "No team specified for unassignment.",
// // //           [{ text: "OK" }]
// // //         );
// // //         return;
// // //       }
      
// // //       // Check if the group exists
// // //       if (!groups[group]) {
// // //         Alert.alert(
// // //           "Unassignment Error",
// // //           `Team ${group} does not exist.`,
// // //           [{ text: "OK" }]
// // //         );
// // //         return;
// // //       }
      
// // //       // Use updateTaskAssignment with null siteId to unassign the group from all sites
// // //       updateTaskAssignment(group, null);
      
// // //       Alert.alert(
// // //         "Team Unassigned",
// // //         `${group} has been removed from ${siteId} and returned to Available Teams.`,
// // //         [{ text: "OK" }]
// // //       );
// // //     } catch (error) {
// // //       console.error('Error unassigning team:', error);
// // //       Alert.alert(
// // //         "Unassignment Error",
// // //         "There was an error removing the team. Please try again.",
// // //         [{ text: "OK" }]
// // //       );
// // //     }
// // //   };

// // //   // Enhanced marked dates calculation
// // //   const getMarkedDates = () => {
// // //     const markedDates = {};
// // //     const today = new Date();
    
// // //     Object.entries(sites).forEach(([siteId, siteData]) => {
// // //       if (siteData.assignedGroups) {
// // //         siteData.assignedGroups.forEach(group => {
// // //           tasks.filter(task =>
// // //             task.siteId === siteId &&
// // //             task.assignedGroup === group
// // //           ).forEach(task => {
// // //             const dateStr = task.dueDate.split('T')[0];
// // //             if (!markedDates[dateStr]) {
// // //               markedDates[dateStr] = { dots: [] };
// // //             }
            
// // //             const dotColor = task.completed ?
// // //               `${groups[group].color}80` :
// // //               groups[group].color;
              
// // //             markedDates[dateStr].dots.push({
// // //               key: `${siteId}-${group}`,
// // //               color: dotColor
// // //             });
// // //           });
// // //         });
// // //       }
// // //     });
    
// // //     // Highlight today
// // //     const todayStr = today.toISOString().split('T')[0];
// // //     markedDates[todayStr] = {
// // //       ...markedDates[todayStr],
// // //       selected: true,
// // //       selectedColor: '#007bff'
// // //     };
    
// // //     return markedDates;
// // //   };

// // //   return (
// // //     <SafeAreaView style={styles.safeArea}>
// // //       <ScrollView contentContainerStyle={styles.scrollContainer}>
// // //         {/* Calendar with enhanced date marking */}
// // //         <Calendar
// // //           markedDates={getMarkedDates()}
// // //           markingType={'multi-dot'}
// // //           onDayPress={(day) => {
// // //             setSelectedDate(day.dateString);
// // //             setModalVisible(true);
// // //           }}
// // //           style={styles.calendar}
// // //           theme={{
// // //             calendarBackground: '#fff',
// // //             todayTextColor: '#007bff',
// // //             dayTextColor: '#333',
// // //             monthTextColor: '#333',
// // //             textDisabledColor: '#d9d9d9',
// // //             dotStyle: {
// // //               width: 8,
// // //               height: 8,
// // //               borderRadius: 4,
// // //               marginTop: 2
// // //             }
// // //           }}
// // //         />

// // //         {/* Construction Sites - Drop Zones */}
// // //         <Text style={styles.sectionTitle}>Construction Sites</Text>
        
// // //         {Object.entries(sites).map(([siteId, siteData]) => (
// // //           <TouchableOpacity
// // //             key={siteId}
// // //             style={[
// // //               styles.siteCard,
// // //               selectedGroup && styles.dropZoneActive
// // //             ]}
// // //             onPress={() => handleSiteSelect(siteId)}
// // //           >
// // //             <View style={styles.siteHeader}>
// // //               <Text style={styles.siteName}>{siteId}</Text>
// // //               <Text style={styles.siteLocation}>{siteData.location}</Text>
// // //             </View>

// // //             <View style={styles.progressContainer}>
// // //               <AnimatedCircularProgress
// // //                 size={80}
// // //                 width={8}
// // //                 fill={siteData.progress || 0}
// // //                 tintColor="#00adf5"
// // //                 backgroundColor="#e0e0e0"
// // //                 rotation={0}
// // //                 lineCap="round"
// // //               >
// // //                 {(fill) => (
// // //                   <View style={styles.progressContent}>
// // //                     <Text style={styles.progressText}>{parseInt(fill)}%</Text>
// // //                     <Text style={styles.progressSubtext}>Done</Text>
// // //                   </View>
// // //                 )}
// // //               </AnimatedCircularProgress>
// // //             </View>

// // //             <Text style={styles.assignedTitle}>Assigned Teams:</Text>
// // //             <View style={styles.assignedGroupsContainer}>
// // //               {siteData.assignedGroups && siteData.assignedGroups.map(group => (
// // //                 <View
// // //                   key={group}
// // //                   style={[
// // //                     styles.groupBadge,
// // //                     { backgroundColor: groups[group].color }
// // //                   ]}
// // //                 >
// // //                   <Text style={styles.groupBadgeText}>{group}</Text>
// // //                   <TouchableOpacity
// // //                     style={styles.unassignButton}
// // //                     onPress={() => handleUnassignTeam(group, siteId)}
// // //                   >
// // //                     <Icon name="close" size={14} color="#fff" />
// // //                   </TouchableOpacity>
// // //                 </View>
// // //               ))}
// // //               {(!siteData.assignedGroups || siteData.assignedGroups.length === 0) && (
// // //                 <View style={styles.dropHint}>
// // //                   <Icon
// // //                     name={selectedGroup ? "check-circle" : "arrow-drop-down"}
// // //                     size={24}
// // //                     color={selectedGroup ? '#00adf5' : '#ccc'}
// // //                   />
// // //                   <Text style={styles.noGroupsText}>
// // //                     {selectedGroup ? 'Tap to assign team' : 'No teams assigned'}
// // //                   </Text>
// // //                 </View>
// // //               )}
// // //             </View>
// // //           </TouchableOpacity>
// // //         ))}

// // //         {/* Available Teams */}
// // //         <Text style={styles.sectionTitle}>Available Teams</Text>
// // //         <View style={styles.unassignedContainer}>
// // //           {unassignedGroups.length > 0 ? (
// // //             unassignedGroups.map(group => (
// // //               <TouchableOpacity
// // //                 key={group}
// // //                 style={[
// // //                   styles.groupItem,
// // //                   { backgroundColor: groups[group].color },
// // //                   selectedGroup === group && styles.selectedGroupItem
// // //                 ]}
// // //                 onPress={() => handleGroupSelect(group)}
// // //               >
// // //                 <Text style={styles.groupText}>{group}</Text>
// // //                 <Text style={styles.groupLeaderText}>Leader: {groups[group].leader}</Text>
// // //                 <View style={styles.selectIndicator}>
// // //                   {selectedGroup === group && (
// // //                     <Icon name="check-circle" size={24} color="#fff" />
// // //                   )}
// // //                 </View>
// // //               </TouchableOpacity>
// // //             ))
// // //           ) : (
// // //             <Text style={styles.allAssignedText}>All teams are assigned</Text>
// // //           )}
// // //         </View>

// // //         {/* Daily Planning Modal */}
// // //         <Modal
// // //           animationType="slide"
// // //           transparent={false}
// // //           visible={modalVisible}
// // //           onRequestClose={() => setModalVisible(false)}
// // //         >
// // //           <View style={styles.modalContainer}>
// // //             <View style={styles.modalHeader}>
// // //               <TouchableOpacity
// // //                 style={styles.closeButton}
// // //                 onPress={() => setModalVisible(false)}
// // //               >
// // //                 <Icon name="arrow-back" size={24} color="#333" />
// // //               </TouchableOpacity>
// // //               <Text style={styles.modalTitle}>
// // //                 {selectedDate ? `Planning for ${selectedDate}` : 'Site Details'}
// // //               </Text>
// // //               <View style={{ width: 24 }} />
// // //             </View>

// // //             <ScrollView style={styles.modalContent}>
// // //               {Object.entries(sites).map(([siteId, siteData]) => (
// // //                 <View key={siteId} style={styles.modalSiteCard}>
// // //                   <Text style={styles.modalSiteName}>{siteId}</Text>
// // //                   <Text style={styles.modalSiteLocation}>{siteData.location}</Text>
                  
// // //                   <View style={styles.modalProgressContainer}>
// // //                     <AnimatedCircularProgress
// // //                       size={60}
// // //                       width={5}
// // //                       fill={siteData.progress || 0}
// // //                       tintColor="#00adf5"
// // //                       backgroundColor="#e0e0e0"
// // //                     >
// // //                       {(fill) => <Text style={styles.smallProgressText}>{parseInt(fill)}%</Text>}
// // //                     </AnimatedCircularProgress>
// // //                     <Text style={styles.modalProgressLabel}>Completion</Text>
// // //                   </View>

// // //                   <Text style={styles.modalSectionTitle}>Assigned Teams</Text>
// // //                   {siteData.assignedGroups && siteData.assignedGroups.map(group => (
// // //                     <View key={group} style={styles.modalGroupItem}>
// // //                       <View style={[styles.modalGroupColor, { backgroundColor: groups[group].color }]} />
// // //                       <View style={styles.modalGroupInfo}>
// // //                         <Text style={styles.modalGroupName}>{group}</Text>
// // //                         <Text style={styles.modalGroupLeader}>{groups[group].leader}</Text>
// // //                         <Text style={styles.modalGroupMembers}>
// // //                           {groups[group].members.join(', ')}
// // //                         </Text>
// // //                       </View>
// // //                     </View>
// // //                   ))}

// // //                   {(!siteData.assignedGroups || siteData.assignedGroups.length === 0) && (
// // //                     <Text style={styles.modalNoTeams}>No teams assigned to this site</Text>
// // //                   )}
// // //                 </View>
// // //               ))}
// // //             </ScrollView>
// // //           </View>
// // //         </Modal>
// // //       </ScrollView>
      
// // //       {/* Selection Instructions */}
// // //       {selectedGroup && (
// // //         <View style={styles.selectionInstructions}>
// // //           <Text style={styles.instructionsText}>
// // //             <Text style={styles.instructionsHighlight}>{selectedGroup}</Text> selected.
// // //             Tap on a site to assign this team.
// // //           </Text>
// // //           <TouchableOpacity
// // //             style={styles.cancelButton}
// // //             onPress={() => setSelectedGroup(null)}
// // //           >
// // //             <Text style={styles.cancelText}>Cancel</Text>
// // //           </TouchableOpacity>
// // //         </View>
// // //       )}
// // //     </SafeAreaView>
// // //   );
// // // };

// // // const styles = StyleSheet.create({
// // //   safeArea: {
// // //     flex: 1,
// // //     backgroundColor: '#fff',
// // //   },
// // //   scrollContainer: {
// // //     flexGrow: 1,
// // //     paddingBottom: 20,
// // //   },
// // //   calendar: {
// // //     marginBottom: 20,
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#eee',
// // //   },
// // //   sectionTitle: {
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     marginHorizontal: 15,
// // //     marginBottom: 10,
// // //     color: '#333',
// // //   },
// // //   siteCard: {
// // //     backgroundColor: '#fff',
// // //     borderRadius: 10,
// // //     padding: 15,
// // //     marginHorizontal: 15,
// // //     marginBottom: 15,
// // //     elevation: 2,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //     borderWidth: 1,
// // //     borderColor: '#eee',
// // //   },
// // //   dropZoneActive: {
// // //     borderColor: '#00adf5',
// // //     backgroundColor: '#f0f8ff',
// // //     borderWidth: 2,
// // //   },
// // //   siteHeader: {
// // //     marginBottom: 10,
// // //   },
// // //   siteName: {
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     color: '#333',
// // //   },
// // //   siteLocation: {
// // //     fontSize: 14,
// // //     color: '#666',
// // //   },
// // //   progressContainer: {
// // //     alignItems: 'center',
// // //     marginVertical: 10,
// // //   },
// // //   progressContent: {
// // //     alignItems: 'center',
// // //   },
// // //   progressText: {
// // //     fontSize: 16,
// // //     fontWeight: 'bold',
// // //     color: '#333',
// // //   },
// // //   progressSubtext: {
// // //     fontSize: 10,
// // //     color: '#666',
// // //   },
// // //   smallProgressText: {
// // //     fontSize: 12,
// // //     fontWeight: 'bold',
// // //     color: '#333',
// // //   },
// // //   assignedTitle: {
// // //     fontSize: 14,
// // //     fontWeight: 'bold',
// // //     marginTop: 10,
// // //     color: '#555',
// // //   },
// // //   assignedGroupsContainer: {
// // //     flexDirection: 'row',
// // //     flexWrap: 'wrap',
// // //     marginTop: 5,
// // //     minHeight: 40,
// // //     alignItems: 'center',
// // //   },
// // //   groupBadge: {
// // //     paddingHorizontal: 10,
// // //     paddingVertical: 5,
// // //     borderRadius: 15,
// // //     marginRight: 8,
// // //     marginBottom: 8,
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   groupBadgeText: {
// // //     color: '#fff',
// // //     fontSize: 12,
// // //     fontWeight: 'bold',
// // //     marginRight: 4,
// // //   },
// // //   unassignButton: {
// // //     width: 16,
// // //     height: 16,
// // //     borderRadius: 8,
// // //     backgroundColor: 'rgba(0,0,0,0.2)',
// // //     alignItems: 'center',
// // //     justifyContent: 'center',
// // //     marginLeft: 4,
// // //   },
// // //   noGroupsText: {
// // //     fontStyle: 'italic',
// // //     color: '#999',
// // //     marginLeft: 5,
// // //   },
// // //   dropHint: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //   },
// // //   unassignedContainer: {
// // //     backgroundColor: '#f5f5f5',
// // //     borderRadius: 10,
// // //     padding: 15,
// // //     marginHorizontal: 15,
// // //     marginBottom: 20,
// // //     minHeight: 150,
// // //     flexDirection: 'row',
// // //     flexWrap: 'wrap',
// // //     justifyContent: 'center',
// // //     borderWidth: 1,
// // //     borderColor: '#eee',
// // //   },
// // //   allAssignedText: {
// // //     color: '#666',
// // //     fontStyle: 'italic',
// // //     alignSelf: 'center',
// // //     marginVertical: 20,
// // //   },
// // //   groupItem: {
// // //     width: width * 0.4,
// // //     padding: 12,
// // //     borderRadius: 8,
// // //     margin: 8,
// // //     elevation: 2,
// // //     shadowColor: '#000',
// // //     shadowOffset: { width: 0, height: 2 },
// // //     shadowOpacity: 0.1,
// // //     shadowRadius: 4,
// // //   },
// // //   selectedGroupItem: {
// // //     borderWidth: 2,
// // //     borderColor: '#fff',
// // //     shadowOpacity: 0.3,
// // //     shadowRadius: 8,
// // //     elevation: 5,
// // //   },
// // //   groupText: {
// // //     color: '#fff',
// // //     fontWeight: 'bold',
// // //     fontSize: 16,
// // //   },
// // //   groupLeaderText: {
// // //     color: '#fff',
// // //     fontSize: 12,
// // //     opacity: 0.8,
// // //   },
// // //   selectIndicator: {
// // //     position: 'absolute',
// // //     right: 8,
// // //     top: 8,
// // //   },
// // //   selectionInstructions: {
// // //     position: 'absolute',
// // //     bottom: 0,
// // //     left: 0,
// // //     right: 0,
// // //     backgroundColor: 'rgba(0, 0, 0, 0.8)',
// // //     padding: 15,
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //   },
// // //   instructionsText: {
// // //     color: '#fff',
// // //     fontSize: 14,
// // //     flex: 1,
// // //   },
// // //   instructionsHighlight: {
// // //     fontWeight: 'bold',
// // //     color: '#00adf5',
// // //   },
// // //   cancelButton: {
// // //     paddingHorizontal: 15,
// // //     paddingVertical: 8,
// // //     backgroundColor: '#e74c3c',
// // //     borderRadius: 5,
// // //     marginLeft: 10,
// // //   },
// // //   cancelText: {
// // //     color: '#fff',
// // //     fontWeight: 'bold',
// // //   },
// // //   modalContainer: {
// // //     flex: 1,
// // //     backgroundColor: '#f9f9f9',
// // //   },
// // //   modalHeader: {
// // //     flexDirection: 'row',
// // //     justifyContent: 'space-between',
// // //     alignItems: 'center',
// // //     padding: 15,
// // //     paddingTop: Platform.OS === 'ios' ? 50 : 15,
// // //     backgroundColor: '#fff',
// // //     borderBottomWidth: 1,
// // //     borderBottomColor: '#eee',
// // //     elevation: 2,
// // //   },
// // //   modalTitle: {
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     color: '#333',
// // //   },
// // //   closeButton: {
// // //     padding: 5,
// // //   },
// // //   modalContent: {
// // //     padding: 15,
// // //   },
// // //   modalSiteCard: {
// // //     backgroundColor: '#fff',
// // //     borderRadius: 10,
// // //     padding: 15,
// // //     marginBottom: 15,
// // //     elevation: 1,
// // //   },
// // //   modalSiteName: {
// // //     fontSize: 18,
// // //     fontWeight: 'bold',
// // //     color: '#333',
// // //   },
// // //   modalSiteLocation: {
// // //     fontSize: 14,
// // //     color: '#666',
// // //     marginBottom: 10,
// // //   },
// // //   modalProgressContainer: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     marginVertical: 10,
// // //   },
// // //   modalProgressLabel: {
// // //     marginLeft: 15,
// // //     fontSize: 14,
// // //     color: '#555',
// // //   },
// // //   modalSectionTitle: {
// // //     fontSize: 16,
// // //     fontWeight: 'bold',
// // //     marginTop: 10,
// // //     marginBottom: 5,
// // //     color: '#333',
// // //   },
// // //   modalGroupItem: {
// // //     flexDirection: 'row',
// // //     alignItems: 'center',
// // //     padding: 10,
// // //     backgroundColor: '#f9f9f9',
// // //     borderRadius: 8,
// // //     marginBottom: 8,
// // //   },
// // //   modalGroupColor: {
// // //     width: 20,
// // //     height: 20,
// // //     borderRadius: 10,
// // //     marginRight: 10,
// // //   },
// // //   modalGroupInfo: {
// // //     flex: 1,
// // //   },
// // //   modalGroupName: {
// // //     fontSize: 14,
// // //     fontWeight: 'bold',
// // //     color: '#333',
// // //   },
// // //   modalGroupLeader: {
// // //     fontSize: 12,
// // //     color: '#555',
// // //   },
// // //   modalGroupMembers: {
// // //     fontSize: 12,
// // //     color: '#666',
// // //     fontStyle: 'italic',
// // //   },
// // //   modalNoTeams: {
// // //     fontSize: 14,
// // //     fontStyle: 'italic',
// // //     color: '#999',
// // //     padding: 10,
// // //     textAlign: 'center',
// // //   },
// // // });

// // // export default Dashboard;
// // import React, { useContext, useState, useEffect, useMemo } from 'react';
// // import {
// //   View,
// //   Text,
// //   StyleSheet,
// //   TouchableOpacity,
// //   Modal,
// //   Dimensions,
// //   SafeAreaView,
// //   ScrollView,
// //   Alert,
// //   Platform,
// //   ActivityIndicator,
// //   LayoutAnimation
// // } from 'react-native';
// // import { Calendar } from 'react-native-calendars';
// // import { AnimatedCircularProgress } from 'react-native-circular-progress';
// // import { TasksContext } from '../context/TasksContext';
// // import Icon from 'react-native-vector-icons/MaterialIcons';

// // const { width } = Dimensions.get('window');

// // const Dashboard = () => {
// //   const context = useContext(TasksContext);
  
// //   // Handle missing context
// //   if (!context) {
// //     return (
// //       <View style={styles.errorContainer}>
// //         <Text>Error: TasksContext is not available</Text>
// //       </View>
// //     );
// //   }

// //   const { tasks = [], sites = {}, groups = {}, updateTaskAssignment } = context;
  
// //   // State management
// //   const [selectedDate, setSelectedDate] = useState(null);
// //   const [modalVisible, setModalVisible] = useState(false);
// //   const [selectedGroup, setSelectedGroup] = useState(null);
// //   const [isProcessing, setIsProcessing] = useState(false);
// //   const [isLoading, setIsLoading] = useState(true);
// //   const [lastAction, setLastAction] = useState(null);

// //   // Configure animations for smooth transitions
// //   useEffect(() => {
// //     LayoutAnimation.configureNext(
// //       LayoutAnimation.create(
// //         300,
// //         LayoutAnimation.Types.easeInEaseOut,
// //         LayoutAnimation.Properties.opacity
// //       )
// //     );
// //   }, [lastAction]);

// //   // Check when data is loaded
// //   useEffect(() => {
// //     if (Object.keys(sites).length > 0 && Object.keys(groups).length > 0) {
// //       setIsLoading(false);
// //     }
// //   }, [sites, groups]);

// //   // Calculate unassigned groups with proper memoization
// //   const unassignedGroups = useMemo(() => {
// //     return Object.keys(groups).filter(group => {
// //       return !Object.values(sites).some(site => {
// //         const assignments = site?.assignedGroups || [];
// //         return assignments.includes(group);
// //       });
// //     });
// //   }, [groups, sites, lastAction]);

// //   // Generate marked dates for calendar
// //   const markedDates = useMemo(() => {
// //     const dates = {};
// //     const today = new Date().toISOString().split('T')[0];
    
// //     Object.entries(sites).forEach(([siteId, siteData]) => {
// //       const assignedGroups = siteData?.assignedGroups || [];
// //       assignedGroups.forEach(group => {
// //         tasks.filter(task =>
// //           task?.siteId === siteId &&
// //           task?.assignedGroup === group
// //         ).forEach(task => {
// //           const dateStr = task?.dueDate?.split('T')[0];
// //           if (dateStr) {
// //             dates[dateStr] = dates[dateStr] || { dots: [] };
// //             dates[dateStr].dots.push({
// //               key: `${siteId}-${group}`,
// //               color: task.completed ?
// //                 `${groups[group]?.color}80` :
// //                 groups[group]?.color
// //             });
// //           }
// //         });
// //       });
// //     });
    
// //     // Highlight today's date
// //     dates[today] = {
// //       ...dates[today],
// //       selected: true,
// //       selectedColor: '#007bff'
// //     };
    
// //     return dates;
// //   }, [sites, tasks, groups, lastAction]);

// //   // Handle group selection
// //   const handleGroupSelect = (group) => {
// //     if (groups[group]) {
// //       setSelectedGroup(group);
// //     }
// //   };

// //   // Handle site selection for assignment
// //   const handleSiteSelect = async (siteId) => {
// //     if (!selectedGroup) {
// //       Alert.alert("No Team Selected", "Please select a team first from the Available Teams section.");
// //       return;
// //     }

// //     if (!sites[siteId]) {
// //       Alert.alert("Invalid Site", `Site ${siteId} does not exist.`);
// //       return;
// //     }

// //     try {
// //       setIsProcessing(true);
// //       setLastAction(`assign-${selectedGroup}-${siteId}-${Date.now()}`);
// //       await updateTaskAssignment(selectedGroup, siteId);
// //       setSelectedGroup(null);
// //     } catch (error) {
// //       console.error('Assignment error:', error);
// //       Alert.alert("Assignment Error", "Failed to assign team. Please try again.");
// //     } finally {
// //       setIsProcessing(false);
// //     }
// //   };

// //   // Robust team unassignment handler
// //   const handleUnassignTeam = async (group, siteId) => {
// //     if (isProcessing) return;
    
// //     try {
// //       setIsProcessing(true);
// //       setLastAction(`unassign-${group}-${siteId}-${Date.now()}`);
      
// //       // Validate all inputs before proceeding
// //       if (!group || !groups[group]) {
// //         throw new Error(`Team ${group} does not exist`);
// //       }

// //       const site = sites[siteId];
// //       if (!siteId || !site) {
// //         throw new Error(`Site ${siteId} does not exist`);
// //       }

// //       // Safely get current assignments with empty array fallback
// //       const currentAssignments = site.assignedGroups || [];

// //       if (!currentAssignments.includes(group)) {
// //         throw new Error(`Team ${group} is not assigned to ${siteId}`);
// //       }

// //       // Perform the unassignment
// //       await updateTaskAssignment(group, null);
      
// //     } catch (error) {
// //       console.error('Unassignment failed:', {
// //         error: error.message,
// //         group,
// //         siteId,
// //         groupData: groups[group],
// //         siteData: site
// //       });

// //       Alert.alert("Unassignment Error", error.message);
// //     } finally {
// //       setIsProcessing(false);
// //     }
// //   };

// //   // Render group badge component
// //   const renderGroupBadge = (group, siteId) => {
// //     if (!group || !groups[group]) return null;

// //     return (
// //       <View
// //         key={group}
// //         style={[
// //           styles.groupBadge,
// //           {
// //             backgroundColor: groups[group].color,
// //             opacity: isProcessing ? 0.6 : 1
// //           }
// //         ]}
// //       >
// //         <Text style={styles.groupBadgeText}>{group}</Text>
// //         <TouchableOpacity
// //           style={styles.unassignButton}
// //           onPress={() => handleUnassignTeam(group, siteId)}
// //           disabled={isProcessing}
// //           accessibilityLabel={`Unassign ${group} from site`}
// //         >
// //           <Icon
// //             name="close"
// //             size={14}
// //             color="#fff"
// //             style={{ opacity: isProcessing ? 0.5 : 1 }}
// //           />
// //         </TouchableOpacity>
// //       </View>
// //     );
// //   };

// //   // Loading state
// //   if (isLoading) {
// //     return (
// //       <View style={styles.loadingContainer}>
// //         <ActivityIndicator size="large" color="#00adf5" />
// //         <Text>Loading construction data...</Text>
// //       </View>
// //     );
// //   }

// //   // Main component render
// //   return (
// //     <SafeAreaView style={styles.safeArea}>
// //       <ScrollView contentContainerStyle={styles.scrollContainer}>
// //         {/* Calendar Component */}
// //         <Calendar
// //           markedDates={markedDates}
// //           markingType={'multi-dot'}
// //           onDayPress={(day) => {
// //             setSelectedDate(day.dateString);
// //             setModalVisible(true);
// //           }}
// //           style={styles.calendar}
// //           theme={calendarTheme}
// //         />

// //         {/* Construction Sites Section */}
// //         <Text style={styles.sectionTitle}>Construction Sites</Text>
        
// //         {Object.entries(sites).map(([siteId, siteData]) => (
// //           siteData && (
// //             <TouchableOpacity
// //               key={siteId}
// //               style={[
// //                 styles.siteCard,
// //                 selectedGroup && styles.dropZoneActive,
// //                 isProcessing && styles.disabledCard
// //               ]}
// //               onPress={() => !isProcessing && handleSiteSelect(siteId)}
// //               disabled={isProcessing}
// //               activeOpacity={0.7}
// //               accessibilityLabel={`Site ${siteId}`}
// //             >
// //               <View style={styles.siteHeader}>
// //                 <Text style={styles.siteName}>{siteId}</Text>
// //                 <Text style={styles.siteLocation}>
// //                   {siteData.location || 'Location not specified'}
// //                 </Text>
// //               </View>

// //               <View style={styles.progressContainer}>
// //                 <AnimatedCircularProgress
// //                   size={80}
// //                   width={8}
// //                   fill={siteData.progress || 0}
// //                   tintColor="#00adf5"
// //                   backgroundColor="#e0e0e0"
// //                 >
// //                   {(fill) => (
// //                     <View style={styles.progressContent}>
// //                       <Text style={styles.progressText}>{parseInt(fill)}%</Text>
// //                       <Text style={styles.progressSubtext}>Done</Text>
// //                     </View>
// //                   )}
// //                 </AnimatedCircularProgress>
// //               </View>

// //               <Text style={styles.assignedTitle}>Assigned Teams:</Text>
// //               <View style={styles.assignedGroupsContainer}>
// //                 {(siteData.assignedGroups || []).map(group =>
// //                   renderGroupBadge(group, siteId)
// //                 )}
// //                 {(!siteData.assignedGroups || siteData.assignedGroups.length === 0) && (
// //                   <View style={styles.dropHint}>
// //                     <Icon
// //                       name={selectedGroup ? "check-circle" : "arrow-drop-down"}
// //                       size={24}
// //                       color={selectedGroup ? '#00adf5' : '#ccc'}
// //                     />
// //                     <Text style={styles.noGroupsText}>
// //                       {selectedGroup ? 'Tap to assign team' : 'No teams assigned'}
// //                     </Text>
// //                   </View>
// //                 )}
// //               </View>
// //             </TouchableOpacity>
// //           )
// //         ))}

// //         {/* Available Teams Section */}
// //         <Text style={styles.sectionTitle}>Available Teams</Text>
// //         <View style={[
// //           styles.unassignedContainer,
// //           isProcessing && styles.disabledContainer
// //         ]}>
// //           {unassignedGroups.length > 0 ? (
// //             unassignedGroups.map(group => (
// //               groups[group] && (
// //                 <TouchableOpacity
// //                   key={group}
// //                   style={[
// //                     styles.groupItem,
// //                     { backgroundColor: groups[group].color },
// //                     selectedGroup === group && styles.selectedGroupItem,
// //                     isProcessing && styles.disabledItem
// //                   ]}
// //                   onPress={() => !isProcessing && handleGroupSelect(group)}
// //                   disabled={isProcessing}
// //                   accessibilityLabel={`Select team ${group}`}
// //                 >
// //                   <Text style={styles.groupText}>{group}</Text>
// //                   <Text style={styles.groupLeaderText}>
// //                     Leader: {groups[group].leader || 'Not specified'}
// //                   </Text>
// //                   {selectedGroup === group && (
// //                     <Icon
// //                       name="check-circle"
// //                       size={24}
// //                       color="#fff"
// //                       style={styles.selectIndicator}
// //                     />
// //                   )}
// //                 </TouchableOpacity>
// //               )
// //             ))
// //           ) : (
// //             <Text style={styles.allAssignedText}>All teams are assigned</Text>
// //           )}
// //         </View>

// //         {/* Daily Planning Modal */}
// //         <Modal
// //           animationType="slide"
// //           transparent={false}
// //           visible={modalVisible}
// //           onRequestClose={() => setModalVisible(false)}
// //         >
// //           <View style={styles.modalContainer}>
// //             <View style={styles.modalHeader}>
// //               <TouchableOpacity
// //                 style={styles.closeButton}
// //                 onPress={() => setModalVisible(false)}
// //                 accessibilityLabel="Close modal"
// //               >
// //                 <Icon name="arrow-back" size={24} color="#333" />
// //               </TouchableOpacity>
// //               <Text style={styles.modalTitle}>
// //                 {selectedDate ? `Planning for ${selectedDate}` : 'Site Details'}
// //               </Text>
// //             </View>

// //             <ScrollView style={styles.modalContent}>
// //               {Object.entries(sites).map(([siteId, siteData]) => (
// //                 siteData && (
// //                   <View key={siteId} style={styles.modalSiteCard}>
// //                     <Text style={styles.modalSiteName}>{siteId}</Text>
// //                     <Text style={styles.modalSiteLocation}>
// //                       {siteData.location || 'Location not specified'}
// //                     </Text>
                    
// //                     <View style={styles.modalProgressContainer}>
// //                       <AnimatedCircularProgress
// //                         size={60}
// //                         width={5}
// //                         fill={siteData.progress || 0}
// //                         tintColor="#00adf5"
// //                         backgroundColor="#e0e0e0"
// //                       >
// //                         {(fill) => <Text style={styles.smallProgressText}>{parseInt(fill)}%</Text>}
// //                       </AnimatedCircularProgress>
// //                       <Text style={styles.modalProgressLabel}>Completion</Text>
// //                     </View>

// //                     <Text style={styles.modalSectionTitle}>Assigned Teams</Text>
// //                     {(siteData.assignedGroups || []).map(group => (
// //                       groups[group] && (
// //                         <View key={group} style={styles.modalGroupItem}>
// //                           <View style={[
// //                             styles.modalGroupColor,
// //                             { backgroundColor: groups[group].color }
// //                           ]} />
// //                           <View style={styles.modalGroupInfo}>
// //                             <Text style={styles.modalGroupName}>{group}</Text>
// //                             <Text style={styles.modalGroupLeader}>
// //                               {groups[group].leader || 'Not specified'}
// //                             </Text>
// //                             <Text style={styles.modalGroupMembers}>
// //                               {groups[group].members?.join(', ') || 'No members listed'}
// //                             </Text>
// //                           </View>
// //                         </View>
// //                       )
// //                     ))}

// //                     {(!siteData.assignedGroups || siteData.assignedGroups.length === 0) && (
// //                       <Text style={styles.modalNoTeams}>No teams assigned to this site</Text>
// //                     )}
// //                   </View>
// //                 )
// //               ))}
// //             </ScrollView>
// //           </View>
// //         </Modal>
// //       </ScrollView>
      
// //       {/* Selection Instructions Footer */}
// //       {selectedGroup && groups[selectedGroup] && (
// //         <View style={styles.selectionInstructions}>
// //           <Text style={styles.instructionsText}>
// //             <Text style={styles.instructionsHighlight}>{selectedGroup}</Text> selected.
// //             Tap on a site to assign this team.
// //           </Text>
// //           <TouchableOpacity
// //             style={styles.cancelButton}
// //             onPress={() => !isProcessing && setSelectedGroup(null)}
// //             disabled={isProcessing}
// //             accessibilityLabel="Cancel selection"
// //           >
// //             <Text style={styles.cancelText}>Cancel</Text>
// //           </TouchableOpacity>
// //         </View>
// //       )}

// //       {/* Processing Overlay */}
// //       {isProcessing && (
// //         <View style={styles.processingOverlay}>
// //           <View style={styles.processingSpinner}>
// //             <Icon name="autorenew" size={30} color="#00adf5" />
// //             <Text style={styles.processingText}>Processing...</Text>
// //           </View>
// //         </View>
// //       )}
// //     </SafeAreaView>
// //   );
// // };

// // // Calendar theme configuration
// // const calendarTheme = {
// //   calendarBackground: '#fff',
// //   todayTextColor: '#007bff',
// //   dayTextColor: '#333',
// //   monthTextColor: '#333',
// //   textDisabledColor: '#d9d9d9',
// //   dotStyle: {
// //     width: 8,
// //     height: 8,
// //     borderRadius: 4,
// //     marginTop: 2
// //   }
// // };

// // // Stylesheet
// // const styles = StyleSheet.create({
// //   safeArea: {
// //     flex: 1,
// //     backgroundColor: '#fff',
// //   },
// //   errorContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //     padding: 20,
// //   },
// //   loadingContainer: {
// //     flex: 1,
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   scrollContainer: {
// //     flexGrow: 1,
// //     paddingBottom: 100,
// //   },
// //   calendar: {
// //     marginBottom: 20,
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#eee',
// //   },
// //   sectionTitle: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     marginHorizontal: 15,
// //     marginBottom: 10,
// //     color: '#333',
// //   },
// //   siteCard: {
// //     backgroundColor: '#fff',
// //     borderRadius: 10,
// //     padding: 15,
// //     marginHorizontal: 15,
// //     marginBottom: 15,
// //     elevation: 2,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //     borderWidth: 1,
// //     borderColor: '#eee',
// //   },
// //   disabledCard: {
// //     opacity: 0.6,
// //   },
// //   dropZoneActive: {
// //     borderColor: '#00adf5',
// //     backgroundColor: '#f0f8ff',
// //     borderWidth: 2,
// //   },
// //   siteHeader: {
// //     marginBottom: 10,
// //   },
// //   siteName: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },
// //   siteLocation: {
// //     fontSize: 14,
// //     color: '#666',
// //   },
// //   progressContainer: {
// //     alignItems: 'center',
// //     marginVertical: 10,
// //   },
// //   progressContent: {
// //     alignItems: 'center',
// //   },
// //   progressText: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },
// //   progressSubtext: {
// //     fontSize: 10,
// //     color: '#666',
// //   },
// //   smallProgressText: {
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },
// //   assignedTitle: {
// //     fontSize: 14,
// //     fontWeight: 'bold',
// //     marginTop: 10,
// //     color: '#555',
// //   },
// //   assignedGroupsContainer: {
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     marginTop: 5,
// //     minHeight: 40,
// //     alignItems: 'center',
// //   },
// //   groupBadge: {
// //     paddingHorizontal: 10,
// //     paddingVertical: 5,
// //     borderRadius: 15,
// //     marginRight: 8,
// //     marginBottom: 8,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   groupBadgeText: {
// //     color: '#fff',
// //     fontSize: 12,
// //     fontWeight: 'bold',
// //     marginRight: 4,
// //   },
// //   unassignButton: {
// //     width: 16,
// //     height: 16,
// //     borderRadius: 8,
// //     backgroundColor: 'rgba(0,0,0,0.2)',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     marginLeft: 4,
// //   },
// //   noGroupsText: {
// //     fontStyle: 'italic',
// //     color: '#999',
// //     marginLeft: 5,
// //   },
// //   dropHint: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   unassignedContainer: {
// //     backgroundColor: '#f5f5f5',
// //     borderRadius: 10,
// //     padding: 15,
// //     marginHorizontal: 15,
// //     marginBottom: 20,
// //     minHeight: 150,
// //     flexDirection: 'row',
// //     flexWrap: 'wrap',
// //     justifyContent: 'center',
// //     borderWidth: 1,
// //     borderColor: '#eee',
// //   },
// //   disabledContainer: {
// //     opacity: 0.6,
// //   },
// //   allAssignedText: {
// //     color: '#666',
// //     fontStyle: 'italic',
// //     alignSelf: 'center',
// //     marginVertical: 20,
// //   },
// //   groupItem: {
// //     width: width * 0.4,
// //     padding: 12,
// //     borderRadius: 8,
// //     margin: 8,
// //     elevation: 2,
// //     shadowColor: '#000',
// //     shadowOffset: { width: 0, height: 2 },
// //     shadowOpacity: 0.1,
// //     shadowRadius: 4,
// //   },
// //   disabledItem: {
// //     opacity: 0.6,
// //   },
// //   selectedGroupItem: {
// //     borderWidth: 2,
// //     borderColor: '#fff',
// //     shadowOpacity: 0.3,
// //     shadowRadius: 8,
// //     elevation: 5,
// //   },
// //   groupText: {
// //     color: '#fff',
// //     fontWeight: 'bold',
// //     fontSize: 16,
// //   },
// //   groupLeaderText: {
// //     color: '#fff',
// //     fontSize: 12,
// //     opacity: 0.8,
// //   },
// //   selectIndicator: {
// //     position: 'absolute',
// //     right: 8,
// //     top: 8,
// //   },
// //   selectionInstructions: {
// //     position: 'absolute',
// //     bottom: 0,
// //     left: 0,
// //     right: 0,
// //     backgroundColor: 'rgba(0, 0, 0, 0.8)',
// //     padding: 15,
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //   },
// //   instructionsText: {
// //     color: '#fff',
// //     fontSize: 14,
// //     flex: 1,
// //   },
// //   instructionsHighlight: {
// //     fontWeight: 'bold',
// //     color: '#00adf5',
// //   },
// //   cancelButton: {
// //     paddingHorizontal: 15,
// //     paddingVertical: 8,
// //     backgroundColor: '#e74c3c',
// //     borderRadius: 5,
// //     marginLeft: 10,
// //   },
// //   cancelText: {
// //     color: '#fff',
// //     fontWeight: 'bold',
// //   },
// //   processingOverlay: {
// //     ...StyleSheet.absoluteFillObject,
// //     backgroundColor: 'rgba(0,0,0,0.2)',
// //     justifyContent: 'center',
// //     alignItems: 'center',
// //   },
// //   processingSpinner: {
// //     backgroundColor: 'white',
// //     padding: 20,
// //     borderRadius: 10,
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //   },
// //   processingText: {
// //     marginLeft: 10,
// //     fontSize: 16,
// //   },
// //   modalContainer: {
// //     flex: 1,
// //     backgroundColor: '#f9f9f9',
// //   },
// //   modalHeader: {
// //     flexDirection: 'row',
// //     justifyContent: 'space-between',
// //     alignItems: 'center',
// //     padding: 15,
// //     paddingTop: Platform.OS === 'ios' ? 50 : 15,
// //     backgroundColor: '#fff',
// //     borderBottomWidth: 1,
// //     borderBottomColor: '#eee',
// //     elevation: 2,
// //   },
// //   modalTitle: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },
// //   closeButton: {
// //     padding: 5,
// //   },
// //   modalContent: {
// //     padding: 15,
// //   },
// //   modalSiteCard: {
// //     backgroundColor: '#fff',
// //     borderRadius: 10,
// //     padding: 15,
// //     marginBottom: 15,
// //     elevation: 1,
// //   },
// //   modalSiteName: {
// //     fontSize: 18,
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },
// //   modalSiteLocation: {
// //     fontSize: 14,
// //     color: '#666',
// //     marginBottom: 10,
// //   },
// //   modalProgressContainer: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     marginVertical: 10,
// //   },
// //   modalProgressLabel: {
// //     marginLeft: 15,
// //     fontSize: 14,
// //     color: '#555',
// //   },
// //   modalSectionTitle: {
// //     fontSize: 16,
// //     fontWeight: 'bold',
// //     marginTop: 10,
// //     marginBottom: 5,
// //     color: '#333',
// //   },
// //   modalGroupItem: {
// //     flexDirection: 'row',
// //     alignItems: 'center',
// //     padding: 10,
// //     backgroundColor: '#f9f9f9',
// //     borderRadius: 8,
// //     marginBottom: 8,
// //   },
// //   modalGroupColor: {
// //     width: 20,
// //     height: 20,
// //     borderRadius: 10,
// //     marginRight: 10,
// //   },
// //   modalGroupInfo: {
// //     flex: 1,
// //   },
// //   modalGroupName: {
// //     fontSize: 14,
// //     fontWeight: 'bold',
// //     color: '#333',
// //   },
// //   modalGroupLeader: {
// //     fontSize: 12,
// //     color: '#555',
// //   },
// //   modalGroupMembers: {
// //     fontSize: 12,
// //     color: '#666',
// //     fontStyle: 'italic',
// //   },
// //   modalNoTeams: {
// //     fontSize: 14,
// //     fontStyle: 'italic',
// //     color: '#999',
// //     padding: 10,
// //     textAlign: 'center',
// //   },
// // });

// // export default Dashboard;
// import React, { useContext, useState, useEffect, useMemo } from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Modal,
//   Dimensions,
//   SafeAreaView,
//   ScrollView,
//   Alert,
//   Platform,
//   ActivityIndicator,
//   LayoutAnimation
// } from 'react-native';
// import { Calendar } from 'react-native-calendars';
// import { AnimatedCircularProgress } from 'react-native-circular-progress';
// import { TasksContext } from '../context/TasksContext';
// import Icon from 'react-native-vector-icons/MaterialIcons';

// const { width } = Dimensions.get('window');

// const Dashboard = () => {
//   const context = useContext(TasksContext);
  
//   if (!context) {
//     return (
//       <View style={styles.errorContainer}>
//         <Text>Error: TasksContext is not available</Text>
//       </View>
//     );
//   }

//   const { tasks = [], sites = {}, groups = {}, updateTaskAssignment } = context;
  
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [selectedGroup, setSelectedGroup] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [lastAction, setLastAction] = useState(null);
//   const [reassignMode, setReassignMode] = useState(false);
//   const [teamToReassign, setTeamToReassign] = useState(null);
//   const [originalSite, setOriginalSite] = useState(null);

//   useEffect(() => {
//     LayoutAnimation.configureNext(
//       LayoutAnimation.create(
//         300,
//         LayoutAnimation.Types.easeInEaseOut,
//         LayoutAnimation.Properties.opacity
//       )
//     );
//   }, [lastAction]);

//   useEffect(() => {
//     if (Object.keys(sites).length > 0 && Object.keys(groups).length > 0) {
//       setIsLoading(false);
//     }
//   }, [sites, groups]);

//   const unassignedGroups = useMemo(() =>
//     Object.keys(groups).filter(group =>
//       !Object.values(sites).some(site =>
//         site?.assignedGroups?.includes(group))
//     ),
//     [groups, sites, lastAction]
//   );

//   const markedDates = useMemo(() => {
//     const dates = {};
//     const today = new Date().toISOString().split('T')[0];
    
//     Object.entries(sites).forEach(([siteId, siteData]) => {
//       const assignedGroups = siteData?.assignedGroups || [];
//       assignedGroups.forEach(group => {
//         tasks.filter(task =>
//           task?.siteId === siteId &&
//           task?.assignedGroup === group
//         ).forEach(task => {
//           const dateStr = task?.dueDate?.split('T')[0];
//           if (dateStr) {
//             if (!dates[dateStr]) {
//               dates[dateStr] = { dots: [] };
//             }
            
//             dates[dateStr].dots.push({
//               key: `${siteId}-${group}`,
//               color: task.completed ?
//                 `${groups[group]?.color}80` :
//                 groups[group]?.color
//             });
//           }
//         });
//       });
//     });
    
//     dates[today] = {
//       ...dates[today],
//       selected: true,
//       selectedColor: '#007bff'
//     };
    
//     return dates;
//   }, [sites, tasks, groups, lastAction]);

//   const handleGroupSelect = (group) => {
//     if (groups[group]) {
//       setSelectedGroup(group);
//       setReassignMode(false);
//     }
//   };

//   const handleSiteSelect = async (siteId) => {
//     if (reassignMode && teamToReassign) {
//       // Reassigning existing team to new site
//       try {
//         setIsProcessing(true);
//         setLastAction(`reassign-${teamToReassign}-${originalSite}-${siteId}-${Date.now()}`);
        
//         // First unassign from original site
//         await updateTaskAssignment(teamToReassign, null);
        
//         // Then assign to new site
//         await updateTaskAssignment(teamToReassign, siteId);
        
//         // Reset reassign mode
//         setReassignMode(false);
//         setTeamToReassign(null);
//         setOriginalSite(null);
//       } catch (error) {
//         console.error('Reassignment error:', error);
//         Alert.alert("Reassignment Error", "Failed to move team. Please try again.");
//       } finally {
//         setIsProcessing(false);
//       }
//       return;
//     }

//     if (!selectedGroup) {
//       Alert.alert("No Team Selected", "Please select a team first from the Available Teams section.");
//       return;
//     }

//     if (!sites[siteId]) {
//       Alert.alert("Invalid Site", `Site ${siteId} does not exist.`);
//       return;
//     }

//     try {
//       setIsProcessing(true);
//       setLastAction(`assign-${selectedGroup}-${siteId}-${Date.now()}`);
//       await updateTaskAssignment(selectedGroup, siteId);
//       setSelectedGroup(null);
//     } catch (error) {
//       console.error('Assignment error:', error);
//       Alert.alert("Assignment Error", "Failed to assign team. Please try again.");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleUnassignTeam = async (group, siteId) => {
//     if (isProcessing) return;
    
//     try {
//       setIsProcessing(true);
//       setLastAction(`unassign-${group}-${siteId}-${Date.now()}`);
      
//       if (!group || !groups[group]) {
//         throw new Error(`Team ${group} does not exist`);
//       }

//       const site = sites[siteId];
//       if (!siteId || !site) {
//         throw new Error(`Site ${siteId} does not exist`);
//       }

//       const currentAssignments = site.assignedGroups || [];
//       if (!currentAssignments.includes(group)) {
//         throw new Error(`Team ${group} is not assigned to ${siteId}`);
//       }

//       await updateTaskAssignment(group, null);
      
//     } catch (error) {
//       console.error('Unassignment failed:', {
//         error: error.message,
//         group,
//         siteId,
//         groupExists: !!groups[group],
//         siteExists: !!sites[siteId]
//       });

//       Alert.alert("Unassignment Error", error.message);
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   const handleStartReassign = (group, siteId) => {
//     setReassignMode(true);
//     setTeamToReassign(group);
//     setOriginalSite(siteId);
//     setSelectedGroup(null);
//     Alert.alert(
//       "Reassign Team",
//       `Moving ${group} from ${siteId}. Tap on the destination site.`,
//       [{ text: "OK" }]
//     );
//   };

//   const cancelReassign = () => {
//     setReassignMode(false);
//     setTeamToReassign(null);
//     setOriginalSite(null);
//   };

//   const renderGroupBadge = (group, siteId) => {
//     if (!group || !groups[group]) return null;

//     return (
//       <View
//         key={group}
//         style={[
//           styles.groupBadge,
//           {
//             backgroundColor: groups[group].color,
//             opacity: isProcessing ? 0.6 : 1
//           }
//         ]}
//       >
//         <Text style={styles.groupBadgeText}>{group}</Text>
//         <View style={styles.badgeActions}>
//           <TouchableOpacity
//             style={[styles.badgeButton, styles.moveButton]}
//             onPress={() => handleStartReassign(group, siteId)}
//             disabled={isProcessing || reassignMode}
//           >
//             <Icon
//               name="open-with"
//               size={14}
//               color="#fff"
//               style={{ opacity: (isProcessing || reassignMode) ? 0.5 : 1 }}
//             />
//           </TouchableOpacity>
//           <TouchableOpacity
//             style={[styles.badgeButton, styles.unassignButton]}
//             onPress={() => handleUnassignTeam(group, siteId)}
//             disabled={isProcessing || reassignMode}
//           >
//             <Icon
//               name="close"
//               size={14}
//               color="#fff"
//               style={{ opacity: (isProcessing || reassignMode) ? 0.5 : 1 }}
//             />
//           </TouchableOpacity>
//         </View>
//       </View>
//     );
//   };

//   if (isLoading) {
//     return (
//       <View style={styles.loadingContainer}>
//         <ActivityIndicator size="large" color="#00adf5" />
//         <Text>Loading construction data...</Text>
//       </View>
//     );
//   }

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.scrollContainer}>
//         <Calendar
//           markedDates={markedDates}
//           markingType={'multi-dot'}
//           onDayPress={(day) => {
//             setSelectedDate(day.dateString);
//             setModalVisible(true);
//           }}
//           style={styles.calendar}
//           theme={calendarTheme}
//         />

//         <Text style={styles.sectionTitle}>Construction Sites</Text>
        
//         {Object.entries(sites).map(([siteId, siteData]) => (
//           siteData && (
//             <TouchableOpacity
//               key={siteId}
//               style={[
//                 styles.siteCard,
//                 (selectedGroup || reassignMode) && styles.dropZoneActive,
//                 isProcessing && styles.disabledCard,
//                 reassignMode && styles.reassignModeActive
//               ]}
//               onPress={() => !isProcessing && handleSiteSelect(siteId)}
//               disabled={isProcessing}
//               activeOpacity={0.7}
//             >
//               <View style={styles.siteHeader}>
//                 <Text style={styles.siteName}>{siteId}</Text>
//                 <Text style={styles.siteLocation}>
//                   {siteData.location || 'Location not specified'}
//                 </Text>
//               </View>

//               <View style={styles.progressContainer}>
//                 <AnimatedCircularProgress
//                   size={80}
//                   width={8}
//                   fill={siteData.progress || 0}
//                   tintColor="#00adf5"
//                   backgroundColor="#e0e0e0"
//                 >
//                   {(fill) => (
//                     <View style={styles.progressContent}>
//                       <Text style={styles.progressText}>{parseInt(fill)}%</Text>
//                       <Text style={styles.progressSubtext}>Done</Text>
//                     </View>
//                   )}
//                 </AnimatedCircularProgress>
//               </View>

//               <Text style={styles.assignedTitle}>Assigned Teams:</Text>
//               <View style={styles.assignedGroupsContainer}>
//                 {siteData.assignedGroups?.map(group =>
//                   renderGroupBadge(group, siteId)
//                 )}
//                 {(!siteData.assignedGroups || siteData.assignedGroups.length === 0) && (
//                   <View style={styles.dropHint}>
//                     <Icon
//                       name={selectedGroup ? "check-circle" : "arrow-drop-down"}
//                       size={24}
//                       color={selectedGroup ? '#00adf5' : '#ccc'}
//                     />
//                     <Text style={styles.noGroupsText}>
//                       {selectedGroup ? 'Tap to assign team' : 'No teams assigned'}
//                     </Text>
//                   </View>
//                 )}
//               </View>
//             </TouchableOpacity>
//           )
//         ))}

//         <Text style={styles.sectionTitle}>Available Teams</Text>
//         <View style={[
//           styles.unassignedContainer,
//           isProcessing && styles.disabledContainer,
//           reassignMode && styles.reassignModeDisabled
//         ]}>
//           {unassignedGroups.length > 0 ? (
//             unassignedGroups.map(group => (
//               groups[group] && (
//                 <TouchableOpacity
//                   key={group}
//                   style={[
//                     styles.groupItem,
//                     { backgroundColor: groups[group].color },
//                     selectedGroup === group && styles.selectedGroupItem,
//                     isProcessing && styles.disabledItem
//                   ]}
//                   onPress={() => !isProcessing && !reassignMode && handleGroupSelect(group)}
//                   disabled={isProcessing || reassignMode}
//                 >
//                   <Text style={styles.groupText}>{group}</Text>
//                   <Text style={styles.groupLeaderText}>
//                     Leader: {groups[group].leader || 'Not specified'}
//                   </Text>
//                   {selectedGroup === group && (
//                     <Icon
//                       name="check-circle"
//                       size={24}
//                       color="#fff"
//                       style={styles.selectIndicator}
//                     />
//                   )}
//                 </TouchableOpacity>
//               )
//             ))
//           ) : (
//             <Text style={styles.allAssignedText}>All teams are assigned</Text>
//           )}
//         </View>

//         <Modal
//           animationType="slide"
//           transparent={false}
//           visible={modalVisible}
//           onRequestClose={() => setModalVisible(false)}
//         >
//           <View style={styles.modalContainer}>
//             <View style={styles.modalHeader}>
//               <TouchableOpacity
//                 style={styles.closeButton}
//                 onPress={() => setModalVisible(false)}
//               >
//                 <Icon name="arrow-back" size={24} color="#333" />
//               </TouchableOpacity>
//               <Text style={styles.modalTitle}>
//                 {selectedDate ? `Planning for ${selectedDate}` : 'Site Details'}
//               </Text>
//             </View>

//             <ScrollView style={styles.modalContent}>
//               {Object.entries(sites).map(([siteId, siteData]) => (
//                 siteData && (
//                   <View key={siteId} style={styles.modalSiteCard}>
//                     <Text style={styles.modalSiteName}>{siteId}</Text>
//                     <Text style={styles.modalSiteLocation}>
//                       {siteData.location || 'Location not specified'}
//                     </Text>
                    
//                     <View style={styles.modalProgressContainer}>
//                       <AnimatedCircularProgress
//                         size={60}
//                         width={5}
//                         fill={siteData.progress || 0}
//                         tintColor="#00adf5"
//                         backgroundColor="#e0e0e0"
//                       >
//                         {(fill) => <Text style={styles.smallProgressText}>{parseInt(fill)}%</Text>}
//                       </AnimatedCircularProgress>
//                       <Text style={styles.modalProgressLabel}>Completion</Text>
//                     </View>

//                     <Text style={styles.modalSectionTitle}>Assigned Teams</Text>
//                     {siteData.assignedGroups?.map(group => (
//                       groups[group] && (
//                         <View key={group} style={styles.modalGroupItem}>
//                           <View style={[
//                             styles.modalGroupColor,
//                             { backgroundColor: groups[group].color }
//                           ]} />
//                           <View style={styles.modalGroupInfo}>
//                             <Text style={styles.modalGroupName}>{group}</Text>
//                             <Text style={styles.modalGroupLeader}>
//                               {groups[group].leader || 'Not specified'}
//                             </Text>
//                             <Text style={styles.modalGroupMembers}>
//                               {groups[group].members?.join(', ') || 'No members listed'}
//                             </Text>
//                           </View>
//                         </View>
//                       )
//                     ))}

//                     {(!siteData.assignedGroups || siteData.assignedGroups.length === 0) && (
//                       <Text style={styles.modalNoTeams}>No teams assigned to this site</Text>
//                     )}
//                   </View>
//                 )
//               ))}
//             </ScrollView>
//           </View>
//         </Modal>
//       </ScrollView>
      
//       {reassignMode ? (
//         <View style={styles.reassignInstructions}>
//           <Text style={styles.instructionsText}>
//             Moving <Text style={styles.instructionsHighlight}>{teamToReassign}</Text> from {originalSite}.
//             Tap on destination site or
//           </Text>
//           <TouchableOpacity
//             style={styles.cancelButton}
//             onPress={cancelReassign}
//             disabled={isProcessing}
//           >
//             <Text style={styles.cancelText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       ) : selectedGroup && groups[selectedGroup] ? (
//         <View style={styles.selectionInstructions}>
//           <Text style={styles.instructionsText}>
//             <Text style={styles.instructionsHighlight}>{selectedGroup}</Text> selected.
//             Tap on a site to assign this team.
//           </Text>
//           <TouchableOpacity
//             style={styles.cancelButton}
//             onPress={() => !isProcessing && setSelectedGroup(null)}
//             disabled={isProcessing}
//           >
//             <Text style={styles.cancelText}>Cancel</Text>
//           </TouchableOpacity>
//         </View>
//       ) : null}

//       {isProcessing && (
//         <View style={styles.processingOverlay}>
//           <View style={styles.processingSpinner}>
//             <Icon name="autorenew" size={30} color="#00adf5" />
//             <Text style={styles.processingText}>Processing...</Text>
//           </View>
//         </View>
//       )}
//     </SafeAreaView>
//   );
// };

// const calendarTheme = {
//   calendarBackground: '#fff',
//   todayTextColor: '#007bff',
//   dayTextColor: '#333',
//   monthTextColor: '#333',
//   textDisabledColor: '#d9d9d9',
//   dotStyle: {
//     width: 8,
//     height: 8,
//     borderRadius: 4,
//     marginTop: 2
//   }
// };

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   errorContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   scrollContainer: {
//     flexGrow: 1,
//     paddingBottom: 100,
//   },
//   calendar: {
//     marginBottom: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginHorizontal: 15,
//     marginBottom: 10,
//     color: '#333',
//   },
//   siteCard: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     marginHorizontal: 15,
//     marginBottom: 15,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     borderWidth: 1,
//     borderColor: '#eee',
//   },
//   disabledCard: {
//     opacity: 0.6,
//   },
//   dropZoneActive: {
//     borderColor: '#00adf5',
//     backgroundColor: '#f0f8ff',
//     borderWidth: 2,
//   },
//   reassignModeActive: {
//     borderColor: '#ff9800',
//     backgroundColor: '#fff3e0',
//   },
//   reassignModeDisabled: {
//     opacity: 0.5,
//   },
//   siteHeader: {
//     marginBottom: 10,
//   },
//   siteName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   siteLocation: {
//     fontSize: 14,
//     color: '#666',
//   },
//   progressContainer: {
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   progressContent: {
//     alignItems: 'center',
//   },
//   progressText: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   progressSubtext: {
//     fontSize: 10,
//     color: '#666',
//   },
//   smallProgressText: {
//     fontSize: 12,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   assignedTitle: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     marginTop: 10,
//     color: '#555',
//   },
//   assignedGroupsContainer: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     marginTop: 5,
//     minHeight: 40,
//     alignItems: 'center',
//   },
//   groupBadge: {
//     paddingHorizontal: 10,
//     paddingVertical: 5,
//     borderRadius: 15,
//     marginRight: 8,
//     marginBottom: 8,
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'space-between',
//   },
//   badgeActions: {
//     flexDirection: 'row',
//   },
//   badgeButton: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginLeft: 4,
//   },
//   moveButton: {
//     backgroundColor: 'rgba(255,255,255,0.3)',
//   },
//   unassignButton: {
//     backgroundColor: 'rgba(0,0,0,0.2)',
//   },
//   groupBadgeText: {
//     color: '#fff',
//     fontSize: 12,
//     fontWeight: 'bold',
//     marginRight: 4,
//   },
//   noGroupsText: {
//     fontStyle: 'italic',
//     color: '#999',
//     marginLeft: 5,
//   },
//   dropHint: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   unassignedContainer: {
//     backgroundColor: '#f5f5f5',
//     borderRadius: 10,
//     padding: 15,
//     marginHorizontal: 15,
//     marginBottom: 20,
//     minHeight: 150,
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     justifyContent: 'center',
//     borderWidth: 1,
//     borderColor: '#eee',
//   },
//   disabledContainer: {
//     opacity: 0.6,
//   },
//   allAssignedText: {
//     color: '#666',
//     fontStyle: 'italic',
//     alignSelf: 'center',
//     marginVertical: 20,
//   },
//   groupItem: {
//     width: width * 0.4,
//     padding: 12,
//     borderRadius: 8,
//     margin: 8,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//   },
//   disabledItem: {
//     opacity: 0.6,
//   },
//   selectedGroupItem: {
//     borderWidth: 2,
//     borderColor: '#fff',
//     shadowOpacity: 0.3,
//     shadowRadius: 8,
//     elevation: 5,
//   },
//   groupText: {
//     color: '#fff',
//     fontWeight: 'bold',
//     fontSize: 16,
//   },
//   groupLeaderText: {
//     color: '#fff',
//     fontSize: 12,
//     opacity: 0.8,
//   },
//   selectIndicator: {
//     position: 'absolute',
//     right: 8,
//     top: 8,
//   },
//   selectionInstructions: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(0, 0, 0, 0.8)',
//     padding: 15,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   reassignInstructions: {
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     backgroundColor: 'rgba(255, 152, 0, 0.9)',
//     padding: 15,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },
//   instructionsText: {
//     color: '#fff',
//     fontSize: 14,
//     flex: 1,
//   },
//   instructionsHighlight: {
//     fontWeight: 'bold',
//     color: '#00adf5',
//   },
//   cancelButton: {
//     paddingHorizontal: 15,
//     paddingVertical: 8,
//     backgroundColor: '#e74c3c',
//     borderRadius: 5,
//     marginLeft: 10,
//   },
//   cancelText: {
//     color: '#fff',
//     fontWeight: 'bold',
//   },
//   processingOverlay: {
//     ...StyleSheet.absoluteFillObject,
//     backgroundColor: 'rgba(0,0,0,0.2)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   processingSpinner: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   processingText: {
//     marginLeft: 10,
//     fontSize: 16,
//   },
//   modalContainer: {
//     flex: 1,
//     backgroundColor: '#f9f9f9',
//   },
//   modalHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 15,
//     paddingTop: Platform.OS === 'ios' ? 50 : 15,
//     backgroundColor: '#fff',
//     borderBottomWidth: 1,
//     borderBottomColor: '#eee',
//     elevation: 2,
//   },
//   modalTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   closeButton: {
//     padding: 5,
//   },
//   modalContent: {
//     padding: 15,
//   },
//   modalSiteCard: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     marginBottom: 15,
//     elevation: 1,
//   },
//   modalSiteName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   modalSiteLocation: {
//     fontSize: 14,
//     color: '#666',
//     marginBottom: 10,
//   },
//   modalProgressContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   modalProgressLabel: {
//     marginLeft: 15,
//     fontSize: 14,
//     color: '#555',
//   },
//   modalSectionTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     marginTop: 10,
//     marginBottom: 5,
//     color: '#333',
//   },
//   modalGroupItem: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     padding: 10,
//     backgroundColor: '#f9f9f9',
//     borderRadius: 8,
//     marginBottom: 8,
//   },
//   modalGroupColor: {
//     width: 20,
//     height: 20,
//     borderRadius: 10,
//     marginRight: 10,
//   },
//   modalGroupInfo: {
//     flex: 1,
//   },
//   modalGroupName: {
//     fontSize: 14,
//     fontWeight: 'bold',
//     color: '#333',
//   },
//   modalGroupLeader: {
//     fontSize: 12,
//     color: '#555',
//   },
//   modalGroupMembers: {
//     fontSize: 12,
//     color: '#666',
//     fontStyle: 'italic',
//   },
//   modalNoTeams: {
//     fontSize: 14,
//     fontStyle: 'italic',
//     color: '#999',
//     padding: 10,
//     textAlign: 'center',
//   },
// });

// export default Dashboard;
import React, { useContext, useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Alert,
  Platform,
  ActivityIndicator,
  LayoutAnimation
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { TasksContext } from '../context/TasksContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const Dashboard = () => {
  const context = useContext(TasksContext);
  
  if (!context) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: TasksContext is not available</Text>
      </View>
    );
  }

  const { tasks = [], sites = {}, groups = {}, updateTaskAssignment } = context;
  
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastAction, setLastAction] = useState(null);
  const [reassignMode, setReassignMode] = useState(false);
  const [teamToReassign, setTeamToReassign] = useState(null);
  const [originalSite, setOriginalSite] = useState(null);

  useEffect(() => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        300,
        LayoutAnimation.Types.easeInEaseOut,
        LayoutAnimation.Properties.opacity
      )
    );
  }, [lastAction]);

  useEffect(() => {
    if (Object.keys(sites).length > 0 && Object.keys(groups).length > 0) {
      setIsLoading(false);
    }
  }, [sites, groups]);

  const unassignedGroups = useMemo(() => 
    Object.keys(groups).filter(group => 
      !Object.values(sites).some(site => 
        site?.assignedGroups?.includes(group))
    ), 
    [groups, sites, lastAction]
  );

  const markedDates = useMemo(() => {
    const dates = {};
    const today = new Date().toISOString().split('T')[0];
    
    Object.entries(sites).forEach(([siteId, siteData]) => {
      const assignedGroups = siteData?.assignedGroups || [];
      assignedGroups.forEach(group => {
        tasks.filter(task => 
          task?.siteId === siteId && 
          task?.assignedGroup === group
        ).forEach(task => {
          const dateStr = task?.dueDate?.split('T')[0];
          if (dateStr) {
            if (!dates[dateStr]) {
              dates[dateStr] = { dots: [] };
            }
            
            dates[dateStr].dots.push({
              key: `${siteId}-${group}`,
              color: task.completed ? 
                `${groups[group]?.color}80` :
                groups[group]?.color
            });
          }
        });
      });
    });
    
    dates[today] = {
      ...dates[today],
      selected: true,
      selectedColor: '#007bff'
    };
    
    return dates;
  }, [sites, tasks, groups, lastAction]);

  const handleGroupSelect = (group) => {
    if (groups[group]) {
      setSelectedGroup(group);
      setReassignMode(false);
    }
  };

  const handleSiteSelect = async (siteId) => {
    if (!sites[siteId]) {
      Alert.alert("Invalid Site", `Site ${siteId} does not exist.`);
      return;
    }

    if (reassignMode && teamToReassign) {
      try {
        setIsProcessing(true);
        setLastAction(`reassign-${teamToReassign}-${originalSite}-${siteId}-${Date.now()}`);
        
        const originalSiteData = sites[originalSite];
        if (!originalSiteData?.assignedGroups?.includes(teamToReassign)) {
          throw new Error(`Team ${teamToReassign} is not assigned to ${originalSite}`);
        }

        const destinationSiteData = sites[siteId];
        if (!destinationSiteData) {
          throw new Error(`Destination site ${siteId} does not exist`);
        }

        await updateTaskAssignment(teamToReassign, siteId, originalSite);
        
        setReassignMode(false);
        setTeamToReassign(null);
        setOriginalSite(null);
      } catch (error) {
        console.error('Reassignment error:', error);
        Alert.alert("Reassignment Error", error.message);
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    if (!selectedGroup) {
      Alert.alert("No Team Selected", "Please select a team first from the Available Teams section.");
      return;
    }

    try {
      setIsProcessing(true);
      setLastAction(`assign-${selectedGroup}-${siteId}-${Date.now()}`);
      await updateTaskAssignment(selectedGroup, siteId);
      setSelectedGroup(null);
    } catch (error) {
      console.error('Assignment error:', error);
      Alert.alert("Assignment Error", "Failed to assign team. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUnassignTeam = async (group, siteId) => {
    if (isProcessing) return;
    
    try {
      setIsProcessing(true);
      setLastAction(`unassign-${group}-${siteId}-${Date.now()}`);
      
      if (!group || !groups[group]) {
        throw new Error(`Team ${group} does not exist`);
      }

      const site = sites[siteId];
      if (!siteId || !site) {
        throw new Error(`Site ${siteId} does not exist`);
      }

      // Initialize assignedGroups if it doesn't exist
      if (!site.assignedGroups) {
        site.assignedGroups = [];
      }

      if (!Array.isArray(site.assignedGroups)) {
        throw new Error(`Invalid team assignments data for site ${siteId}`);
      }

      if (!site.assignedGroups.includes(group)) {
        throw new Error(`Team ${group} is not assigned to ${siteId}`);
      }

      await updateTaskAssignment(group, null, siteId);
      
    } catch (error) {
      console.error('Unassignment failed:', {
        error: error.message,
        group,
        siteId,
        groupExists: !!groups[group],
        siteExists: !!sites[siteId],
        siteHasAssignedGroups: !!sites[siteId]?.assignedGroups
      });

      Alert.alert("Unassignment Error", error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleStartReassign = (group, siteId) => {
    const siteData = sites[siteId];
    if (!siteData) {
      Alert.alert("Error", `Site ${siteId} does not exist`);
      return;
    }

    // Initialize assignedGroups if it doesn't exist
    if (!siteData.assignedGroups) {
      siteData.assignedGroups = [];
    }

    if (!siteData.assignedGroups.includes(group)) {
      Alert.alert("Error", `Team ${group} is not assigned to ${siteId}`);
      return;
    }

    setReassignMode(true);
    setTeamToReassign(group);
    setOriginalSite(siteId);
    setSelectedGroup(null);
    Alert.alert(
      "Reassign Team",
      `Moving ${group} from ${siteId}. Tap on the destination site.`,
      [{ text: "OK" }]
    );
  };

  const cancelReassign = () => {
    setReassignMode(false);
    setTeamToReassign(null);
    setOriginalSite(null);
  };

  const renderGroupBadge = (group, siteId) => {
    if (!group || !groups[group]) return null;

    const siteData = sites[siteId];
    if (!siteData) {
      return null;
    }

    // Initialize assignedGroups if it doesn't exist
    if (!siteData.assignedGroups) {
      siteData.assignedGroups = [];
    }

    if (!siteData.assignedGroups.includes(group)) {
      return null;
    }

    return (
      <View
        key={group}
        style={[
          styles.groupBadge, 
          { 
            backgroundColor: groups[group].color,
            opacity: isProcessing ? 0.6 : 1
          }
        ]}
      >
        <Text style={styles.groupBadgeText}>{group}</Text>
        <View style={styles.badgeActions}>
          <TouchableOpacity
            style={[styles.badgeButton, styles.moveButton]}
            onPress={() => handleStartReassign(group, siteId)}
            disabled={isProcessing || reassignMode}
          >
            <Icon 
              name="open-with" 
              size={14} 
              color="#fff" 
              style={{ opacity: (isProcessing || reassignMode) ? 0.5 : 1 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.badgeButton, styles.unassignButton]}
            onPress={() => handleUnassignTeam(group, siteId)}
            disabled={isProcessing || reassignMode}
          >
            <Icon 
              name="close" 
              size={14} 
              color="#fff" 
              style={{ opacity: (isProcessing || reassignMode) ? 0.5 : 1 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00adf5" />
        <Text>Loading construction data...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Calendar
          markedDates={markedDates}
          markingType={'multi-dot'}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            setModalVisible(true);
          }}
          style={styles.calendar}
          theme={calendarTheme}
        />

        <Text style={styles.sectionTitle}>Construction Sites</Text>
        
        {Object.entries(sites).map(([siteId, siteData]) => (
          siteData && (
            <TouchableOpacity
              key={siteId}
              style={[
                styles.siteCard,
                (selectedGroup || reassignMode) && styles.dropZoneActive,
                isProcessing && styles.disabledCard,
                reassignMode && styles.reassignModeActive
              ]}
              onPress={() => !isProcessing && handleSiteSelect(siteId)}
              disabled={isProcessing}
              activeOpacity={0.7}
            >
              <View style={styles.siteHeader}>
                <Text style={styles.siteName}>{siteId}</Text>
                <Text style={styles.siteLocation}>
                  {siteData.location || 'Location not specified'}
                </Text>
              </View>

              <View style={styles.progressContainer}>
                <AnimatedCircularProgress
                  size={80}
                  width={8}
                  fill={siteData.progress || 0}
                  tintColor="#00adf5"
                  backgroundColor="#e0e0e0"
                >
                  {(fill) => (
                    <View style={styles.progressContent}>
                      <Text style={styles.progressText}>{parseInt(fill)}%</Text>
                      <Text style={styles.progressSubtext}>Done</Text>
                    </View>
                  )}
                </AnimatedCircularProgress>
              </View>

              <Text style={styles.assignedTitle}>Assigned Teams:</Text>
              <View style={styles.assignedGroupsContainer}>
                {(siteData.assignedGroups || []).map(group => 
                  renderGroupBadge(group, siteId)
                )}
                {(!siteData.assignedGroups || siteData.assignedGroups.length === 0) && (
                  <View style={styles.dropHint}>
                    <Icon 
                      name={selectedGroup ? "check-circle" : "arrow-drop-down"} 
                      size={24} 
                      color={selectedGroup ? '#00adf5' : '#ccc'} 
                    />
                    <Text style={styles.noGroupsText}>
                      {selectedGroup ? 'Tap to assign team' : 'No teams assigned'}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )
        ))}

        <Text style={styles.sectionTitle}>Available Teams</Text>
        <View style={[
          styles.unassignedContainer,
          isProcessing && styles.disabledContainer,
          reassignMode && styles.reassignModeDisabled
        ]}>
          {unassignedGroups.length > 0 ? (
            unassignedGroups.map(group => (
              groups[group] && (
                <TouchableOpacity
                  key={group}
                  style={[
                    styles.groupItem,
                    { backgroundColor: groups[group].color },
                    selectedGroup === group && styles.selectedGroupItem,
                    isProcessing && styles.disabledItem
                  ]}
                  onPress={() => !isProcessing && !reassignMode && handleGroupSelect(group)}
                  disabled={isProcessing || reassignMode}
                >
                  <Text style={styles.groupText}>{group}</Text>
                  <Text style={styles.groupLeaderText}>
                    Leader: {groups[group].leader || 'Not specified'}
                  </Text>
                  {selectedGroup === group && (
                    <Icon 
                      name="check-circle" 
                      size={24} 
                      color="#fff" 
                      style={styles.selectIndicator}
                    />
                  )}
                </TouchableOpacity>
              )
            ))
          ) : (
            <Text style={styles.allAssignedText}>All teams are assigned</Text>
          )}
        </View>

        <Modal
          animationType="slide"
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Icon name="arrow-back" size={24} color="#333" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>
                {selectedDate ? `Planning for ${selectedDate}` : 'Site Details'}
              </Text>
            </View>

            <ScrollView style={styles.modalContent}>
              {Object.entries(sites).map(([siteId, siteData]) => (
                siteData && (
                  <View key={siteId} style={styles.modalSiteCard}>
                    <Text style={styles.modalSiteName}>{siteId}</Text>
                    <Text style={styles.modalSiteLocation}>
                      {siteData.location || 'Location not specified'}
                    </Text>
                    
                    <View style={styles.modalProgressContainer}>
                      <AnimatedCircularProgress
                        size={60}
                        width={5}
                        fill={siteData.progress || 0}
                        tintColor="#00adf5"
                        backgroundColor="#e0e0e0"
                      >
                        {(fill) => <Text style={styles.smallProgressText}>{parseInt(fill)}%</Text>}
                      </AnimatedCircularProgress>
                      <Text style={styles.modalProgressLabel}>Completion</Text>
                    </View>

                    <Text style={styles.modalSectionTitle}>Assigned Teams</Text>
                    {(siteData.assignedGroups || []).map(group => (
                      groups[group] && (
                        <View key={group} style={styles.modalGroupItem}>
                          <View style={[
                            styles.modalGroupColor, 
                            { backgroundColor: groups[group].color }
                          ]} />
                          <View style={styles.modalGroupInfo}>
                            <Text style={styles.modalGroupName}>{group}</Text>
                            <Text style={styles.modalGroupLeader}>
                              {groups[group].leader || 'Not specified'}
                            </Text>
                            <Text style={styles.modalGroupMembers}>
                              {groups[group].members?.join(', ') || 'No members listed'}
                            </Text>
                          </View>
                        </View>
                      )
                    ))}

                    {(!siteData.assignedGroups || siteData.assignedGroups.length === 0) && (
                      <Text style={styles.modalNoTeams}>No teams assigned to this site</Text>
                    )}
                  </View>
                )
              ))}
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
      
      {reassignMode ? (
        <View style={styles.reassignInstructions}>
          <Text style={styles.instructionsText}>
            Moving <Text style={styles.instructionsHighlight}>{teamToReassign}</Text> from {originalSite}.
            Tap on destination site or
          </Text>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={cancelReassign}
            disabled={isProcessing}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : selectedGroup && groups[selectedGroup] ? (
        <View style={styles.selectionInstructions}>
          <Text style={styles.instructionsText}>
            <Text style={styles.instructionsHighlight}>{selectedGroup}</Text> selected. 
            Tap on a site to assign this team.
          </Text>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={() => !isProcessing && setSelectedGroup(null)}
            disabled={isProcessing}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {isProcessing && (
        <View style={styles.processingOverlay}>
          <View style={styles.processingSpinner}>
            <Icon name="autorenew" size={30} color="#00adf5" />
            <Text style={styles.processingText}>Processing...</Text>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const calendarTheme = {
  calendarBackground: '#fff',
  todayTextColor: '#007bff',
  dayTextColor: '#333',
  monthTextColor: '#333',
  textDisabledColor: '#d9d9d9',
  dotStyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 2
  }
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 100,
  },
  calendar: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginHorizontal: 15,
    marginBottom: 10,
    color: '#333',
  },
  siteCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 1,
    borderColor: '#eee',
  },
  disabledCard: {
    opacity: 0.6,
  },
  dropZoneActive: {
    borderColor: '#00adf5',
    backgroundColor: '#f0f8ff',
    borderWidth: 2,
  },
  reassignModeActive: {
    borderColor: '#ff9800',
    backgroundColor: '#fff3e0',
  },
  reassignModeDisabled: {
    opacity: 0.5,
  },
  siteHeader: {
    marginBottom: 10,
  },
  siteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  siteLocation: {
    fontSize: 14,
    color: '#666',
  },
  progressContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  progressContent: {
    alignItems: 'center',
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  progressSubtext: {
    fontSize: 10,
    color: '#666',
  },
  smallProgressText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  assignedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#555',
  },
  assignedGroupsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 5,
    minHeight: 40,
    alignItems: 'center',
  },
  groupBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeActions: {
    flexDirection: 'row',
  },
  badgeButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 4,
  },
  moveButton: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  unassignButton: {
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  groupBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 4,
  },
  noGroupsText: {
    fontStyle: 'italic',
    color: '#999',
    marginLeft: 5,
  },
  dropHint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  unassignedContainer: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 15,
    marginBottom: 20,
    minHeight: 150,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  disabledContainer: {
    opacity: 0.6,
  },
  allAssignedText: {
    color: '#666',
    fontStyle: 'italic',
    alignSelf: 'center',
    marginVertical: 20,
  },
  groupItem: {
    width: width * 0.4,
    padding: 12,
    borderRadius: 8,
    margin: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  disabledItem: {
    opacity: 0.6,
  },
  selectedGroupItem: {
    borderWidth: 2,
    borderColor: '#fff',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  groupText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  groupLeaderText: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  selectIndicator: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  selectionInstructions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reassignInstructions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 152, 0, 0.9)',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  instructionsText: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  instructionsHighlight: {
    fontWeight: 'bold',
    color: '#00adf5',
  },
  cancelButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#e74c3c',
    borderRadius: 5,
    marginLeft: 10,
  },
  cancelText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  processingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingSpinner: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  processingText: {
    marginLeft: 10,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: Platform.OS === 'ios' ? 50 : 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    elevation: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 5,
  },
  modalContent: {
    padding: 15,
  },
  modalSiteCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 1,
  },
  modalSiteName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalSiteLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  modalProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  modalProgressLabel: {
    marginLeft: 15,
    fontSize: 14,
    color: '#555',
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#333',
  },
  modalGroupItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  modalGroupColor: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 10,
  },
  modalGroupInfo: {
    flex: 1,
  },
  modalGroupName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  modalGroupLeader: {
    fontSize: 12,
    color: '#555',
  },
  modalGroupMembers: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  modalNoTeams: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#999',
    padding: 10,
    textAlign: 'center',
  },
});

export default Dashboard;