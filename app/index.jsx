import React, { useContext, useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Animated,
  PanResponder,
  Platform
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { TasksContext } from '../context/TasksContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const Dashboard = () => {
  const context = useContext(TasksContext);
  if (!context) {
    console.error("TasksContext is not provided. Ensure the provider wraps this component.");
    return <Text>Error: TasksContext is not available.</Text>;
  }

  const { tasks = [], sites = {}, groups = {}, updateTaskAssignment } = context;
  const [selectedDate, setSelectedDate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [dragItem, setDragItem] = useState(null);
  const [dropZone, setDropZone] = useState(null);
  const [dragPreview, setDragPreview] = useState(null);
  const [dropZoneLayouts, setDropZoneLayouts] = useState({});
  
  const dropZoneRefs = useRef({});
  const pan = useRef(new Animated.ValueXY()).current;

  // Measure drop zones when layout changes
  useEffect(() => {
    const measureDropZones = () => {
      const layouts = {};
      Object.keys(dropZoneRefs.current).forEach(siteId => {
        if (dropZoneRefs.current[siteId]) {
          dropZoneRefs.current[siteId].measure((fx, fy, w, h, px, py) => {
            layouts[siteId] = { x: px, y: py, width: w, height: h };
          });
        }
      });
      setDropZoneLayouts(layouts);
    };
    
    const timeout = setTimeout(measureDropZones, 100);
    return () => clearTimeout(timeout);
  }, [sites]);

  // PanResponder for drag and drop functionality
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e, gestureState) => {
        const groupName = e._targetInst.memoizedProps.children[0].props.children;
        setDragItem(groupName);
        setDragPreview({
          name: groupName,
          color: groups[groupName].color,
          leader: groups[groupName].leader
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (e, gestureState) => {
        Animated.event(
          [null, { dx: pan.x, dy: pan.y }],
          { useNativeDriver: false }
        )(e, gestureState);
        
        // Check if we're over a drop zone
        const pageX = e.nativeEvent.pageX;
        const pageY = e.nativeEvent.pageY;
        
        let newDropZone = null;
        Object.entries(dropZoneLayouts).forEach(([siteId, layout]) => {
          if (pageX >= layout.x && 
              pageX <= layout.x + layout.width &&
              pageY >= layout.y && 
              pageY <= layout.y + layout.height) {
            newDropZone = siteId;
          }
        });
        
        if (newDropZone !== dropZone) {
          setDropZone(newDropZone);
        }
      },
      onPanResponderRelease: (e, gestureState) => {
        if (dropZone && dragItem) {
          // Update the task assignment in context
          updateTaskAssignment(dragItem, dropZone);
          
          // Visual feedback
          setTimeout(() => {
            setDropZone(null);
          }, 300);
        }
        resetDragState();
      },
      onPanResponderTerminate: resetDragState
    })
  ).current;

  const resetDragState = () => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false
    }).start(() => {
      setDragItem(null);
      setDragPreview(null);
      setDropZone(null);
    });
  };

  const registerDropZone = (siteId, ref) => {
    if (ref) {
      dropZoneRefs.current[siteId] = ref;
    }
  };

  // Get unassigned groups
  const unassignedGroups = Object.keys(groups).filter(group => {
    return !Object.values(sites).some(site => 
      site.assignedGroups.includes(group)
    );
  });

  // Enhanced marked dates calculation
  const getMarkedDates = () => {
    const markedDates = {};
    const today = new Date();
    
    Object.entries(sites).forEach(([siteId, siteData]) => {
      siteData.assignedGroups.forEach(group => {
        tasks.filter(task => 
          task.siteId === siteId && 
          task.assignedGroup === group
        ).forEach(task => {
          const dateStr = task.dueDate.split('T')[0];
          if (!markedDates[dateStr]) {
            markedDates[dateStr] = { dots: [] };
          }
          
          const dotColor = task.completed ? 
            `${groups[group].color}80` :
            groups[group].color;
            
          markedDates[dateStr].dots.push({
            key: `${siteId}-${group}`,
            color: dotColor
          });
        });
      });
    });
    
    // Highlight today
    const todayStr = today.toISOString().split('T')[0];
    markedDates[todayStr] = {
      ...markedDates[todayStr],
      selected: true,
      selectedColor: '#007bff'
    };
    
    return markedDates;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        scrollEnabled={!dragItem}
      >
        {/* Calendar with enhanced date marking */}
        <Calendar
          markedDates={getMarkedDates()}
          markingType={'multi-dot'}
          onDayPress={(day) => {
            setSelectedDate(day.dateString);
            setModalVisible(true);
          }}
          style={styles.calendar}
          theme={{
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
          }}
        />

        {/* Construction Sites - Drop Zones */}
        <Text style={styles.sectionTitle}>Construction Sites</Text>
        
        {Object.entries(sites).map(([siteId, siteData]) => (
          <View
            key={siteId}
            ref={ref => registerDropZone(siteId, ref)}
            style={[
              styles.siteCard,
              dropZone === siteId && styles.dropZoneActive,
              dragItem && styles.draggingActive
            ]}
          >
            <View style={styles.siteHeader}>
              <Text style={styles.siteName}>{siteId}</Text>
              <Text style={styles.siteLocation}>{siteData.location}</Text>
            </View>

            <View style={styles.progressContainer}>
              <AnimatedCircularProgress
                size={80}
                width={8}
                fill={siteData.progress || 0}
                tintColor="#00adf5"
                backgroundColor="#e0e0e0"
                rotation={0}
                lineCap="round"
              >
                {(fill) => (
                  <View style={styles.progressContent}>
                    <Text style={styles.progressText}>{fill}%</Text>
                    <Text style={styles.progressSubtext}>Done</Text>
                  </View>
                )}
              </AnimatedCircularProgress>
            </View>

            <Text style={styles.assignedTitle}>Assigned Teams:</Text>
            <View style={styles.assignedGroupsContainer}>
              {siteData.assignedGroups.map(group => (
                <View
                  key={group}
                  style={[
                    styles.groupBadge, 
                    { 
                      backgroundColor: groups[group].color,
                      opacity: dragItem === group ? 0.5 : 1
                    }
                  ]}
                >
                  <Text style={styles.groupBadgeText}>{group}</Text>
                </View>
              ))}
              {siteData.assignedGroups.length === 0 && (
                <View style={styles.dropHint}>
                  <Icon 
                    name={dropZone === siteId ? "check-circle" : "arrow-drop-down"} 
                    size={24} 
                    color={dropZone === siteId ? '#00adf5' : '#ccc'} 
                  />
                  <Text style={styles.noGroupsText}>Drop team here</Text>
                </View>
              )}
            </View>
          </View>
        ))}

        {/* Available Teams - Draggable Items */}
        <Text style={styles.sectionTitle}>Available Teams</Text>
        <View style={styles.unassignedContainer}>
          {unassignedGroups.length > 0 ? (
            unassignedGroups.map(group => (
              <Animated.View
                key={group}
                style={[
                  styles.groupItem,
                  { 
                    backgroundColor: groups[group].color,
                    transform: dragItem === group ? 
                      [{ translateX: pan.x }, { translateY: pan.y }] : 
                      []
                  },
                ]}
                {...(dragItem === group ? panResponder.panHandlers : {})}
              >
                <Text style={styles.groupText}>{group}</Text>
                <Text style={styles.groupLeaderText}>Leader: {groups[group].leader}</Text>
                <View style={styles.dragHandle} {...panResponder.panHandlers}>
                  <Icon name="drag-handle" size={20} color="#fff" />
                </View>
              </Animated.View>
            ))
          ) : (
            <Text style={styles.allAssignedText}>All teams are assigned</Text>
          )}
        </View>

        {/* Daily Planning Modal */}
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
              <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.modalContent}>
              {Object.entries(sites).map(([siteId, siteData]) => (
                <View key={siteId} style={styles.modalSiteCard}>
                  <Text style={styles.modalSiteName}>{siteId}</Text>
                  <Text style={styles.modalSiteLocation}>{siteData.location}</Text>
                  
                  <View style={styles.modalProgressContainer}>
                    <AnimatedCircularProgress
                      size={60}
                      width={5}
                      fill={siteData.progress || 0}
                      tintColor="#00adf5"
                      backgroundColor="#e0e0e0"
                    >
                      {(fill) => <Text style={styles.smallProgressText}>{fill}%</Text>}
                    </AnimatedCircularProgress>
                    <Text style={styles.modalProgressLabel}>Completion</Text>
                  </View>

                  <Text style={styles.modalSectionTitle}>Assigned Teams</Text>
                  {siteData.assignedGroups.map(group => (
                    <View key={group} style={styles.modalGroupItem}>
                      <View style={[styles.modalGroupColor, { backgroundColor: groups[group].color }]} />
                      <View style={styles.modalGroupInfo}>
                        <Text style={styles.modalGroupName}>{group}</Text>
                        <Text style={styles.modalGroupLeader}>{groups[group].leader}</Text>
                        <Text style={styles.modalGroupMembers}>
                          {groups[group].members.join(', ')}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </Modal>
      </ScrollView>
      
      {/* Drag Preview */}
      {dragPreview && (
        <Animated.View 
          style={[
            styles.dragPreview,
            {
              transform: [
                { translateX: pan.x },
                { translateY: pan.y }
              ],
              backgroundColor: dragPreview.color,
              opacity: 0.9,
              shadowOpacity: 0.3
            }
          ]}
          pointerEvents="none"
        >
          <Text style={styles.dragPreviewText}>{dragPreview.name}</Text>
          <Text style={styles.dragPreviewSubtext}>Leader: {dragPreview.leader}</Text>
          <View style={styles.dragPreviewArrow}>
            <Icon 
              name={dropZone ? "check-circle" : "arrow-forward"} 
              size={24} 
              color="#fff" 
            />
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
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
  dropZoneActive: {
    borderColor: '#00adf5',
    backgroundColor: '#f0f8ff',
    borderWidth: 2,
  },
  draggingActive: {
    opacity: 0.8,
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
  },
  groupBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
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
  dragHandle: {
    position: 'absolute',
    right: 8,
    top: 8,
  },
  dragPreview: {
    position: 'absolute',
    width: width * 0.4,
    padding: 12,
    borderRadius: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    zIndex: 100,
    transform: [{ scale: 1.05 }],
  },
  dragPreviewText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dragPreviewSubtext: {
    color: '#fff',
    fontSize: 12,
    opacity: 0.8,
  },
  dragPreviewArrow: {
    position: 'absolute',
    right: 10,
    top: 10,
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
    paddingTop: 50,
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
});

export default Dashboard;