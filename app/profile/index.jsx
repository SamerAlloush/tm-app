// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Dimensions } from 'react-native';
// import { Calendar } from 'react-native-calendars';
// import { useLocalSearchParams, useRouter } from 'expo-router';
// import { Ionicons } from '@expo/vector-icons'; // For the back button icon
// import AbsenceDeclarationForm from '../../components/AbsenceDeclarationForm'; // Import the form

// const { width } = Dimensions.get('window'); // Get screen width for responsive design

// const ProfileDetails = () => {
//   const router = useRouter();
//   const { updatedPendingDemands: updatedPendingDemandsParam } = useLocalSearchParams();

//   // State to manage pending absence demands
//   const [pendingDemands, setPendingDemands] = useState([
//     { id: 1, firstName: "John", lastName: "Doe", dates: "2023-10-15", reason: "Sick Leave", status: "Pending" },
//     { id: 2, firstName: "Jane", lastName: "Smith", dates: "2023-10-20", reason: "Personal Matter", status: "Pending" },
//     { id: 3, firstName: "Alice", lastName: "Johnson", dates: "2023-10-25", reason: "Vacation", status: "Pending" },
//     { id: 4, firstName: "Bob", lastName: "Brown", dates: "2023-10-30", reason: "Medical Leave", status: "Pending" },
//   ]);

//   // State to manage validated absence demands
//   const [validatedDemands, setValidatedDemands] = useState([]);

//   // State to manage absence declarations
//   const [absenceDeclarations, setAbsenceDeclarations] = useState([
//     { id: 1, reason: "Family Emergency", details: "Unexpected family issue", status: "Pending" },
//     { id: 2, reason: "Car Breakdown", details: "Car broke down on the way to work", status: "Approved" },
//     { id: 3, reason: "Health Issue", details: "Sudden health problem", status: "Rejected" },
//   ]);

//   // State to manage the selected demand for the modal
//   const [selectedDemand, setSelectedDemand] = useState(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);

//   // State to manage the absence declaration form visibility
//   const [isDeclarationFormVisible, setIsDeclarationFormVisible] = useState(false);

//   // Update pendingDemands when updatedPendingDemandsParam changes
//   useEffect(() => {
//     if (updatedPendingDemandsParam) {
//       const updatedDemands = JSON.parse(updatedPendingDemandsParam);
//       setPendingDemands(updatedDemands);
//     }
//   }, [updatedPendingDemandsParam]);

//   // Mark dates with validated demands on the calendar
//   const markedDates = validatedDemands.reduce((acc, demand) => {
//     demand.dates.split(', ').forEach(date => {
//       acc[date] = { marked: true, dotColor: 'red', activeOpacity: 0.5 };
//     });
//     return acc;
//   }, {});

//   // Function to handle navigation to the Absence Demand Form
//   const handleNavigateToAbsenceForm = () => {
//     router.push({
//       pathname: '/profile/DemandeAbsence',
//       params: { pendingDemands: JSON.stringify(pendingDemands) },
//     });
//   };

//   // Function to handle demand click (open modal)
//   const handleDemandClick = (demand) => {
//     setSelectedDemand(demand);
//     setIsModalVisible(true);
//   };

//   // Function to validate or reject a demand
//   const handleDemandAction = (action) => {
//     const updatedDemands = pendingDemands.map((demand) =>
//       demand.id === selectedDemand.id ? { ...demand, status: action } : demand
//     );
//     setPendingDemands(updatedDemands);

//     if (action === 'Approved') {
//       setValidatedDemands([...validatedDemands, { ...selectedDemand, status: action }]);
//     } else if (action === 'Rejected') {
//       setValidatedDemands(validatedDemands.filter((demand) => demand.id !== selectedDemand.id));
//     }

//     setIsModalVisible(false);
//   };

//   // Function to handle submission of the absence declaration
//   const handleAbsenceDeclarationSubmit = (declaration) => {
//     setAbsenceDeclarations([...absenceDeclarations, declaration]);
//     setIsDeclarationFormVisible(false);
//   };

//   // Function to navigate back to the dashboard
//   const goToDashboard = () => {
//     router.push('/'); // Navigate to the root (Dashboard)
//   };

//   // Render item for pending demands
//   const renderPendingDemandItem = ({ item }) => (
//     <TouchableOpacity onPress={() => handleDemandClick(item)}>
//       <View style={styles.demandItem}>
//         <Text style={styles.demandText}>Name: {item.firstName} {item.lastName}</Text>
//         <Text style={styles.demandText}>Dates: {item.dates}</Text>
//         <Text style={styles.demandText}>Status: {item.status}</Text>
//       </View>
//     </TouchableOpacity>
//   );

//   // Render item for absence declarations
//   const renderDeclarationItem = ({ item }) => (
//     <View style={styles.declarationItem}>
//       <Text style={styles.declarationText}>Reason: {item.reason}</Text>
//       <Text style={styles.declarationText}>Details: {item.details}</Text>
//       <Text style={styles.declarationText}>Status: {item.status}</Text>
//     </View>
//   );

//   return (
//     <FlatList
//       data={[{ key: 'content' }]} // Single item to render the main content
//       renderItem={() => (
//         <View style={styles.container}>
//           {/* Back Button */}
//           <TouchableOpacity style={styles.backButton} onPress={goToDashboard}>
//             <Ionicons name="arrow-back" size={24} color="#1e90ff" />
//           </TouchableOpacity>

//           <Text style={styles.title}>Your Profile</Text>

//           {/* Calendar to display marked absence dates */}
//           <Calendar
//             markingType={'simple'}
//             markedDates={markedDates}
//             style={styles.calendar}
//           />

//           {/* Button to navigate to the Absence Demand Form */}
//           <TouchableOpacity
//             style={styles.absenceButton}
//             onPress={handleNavigateToAbsenceForm}
//           >
//             <Text style={styles.absenceButtonText}>Request Day Off</Text>
//           </TouchableOpacity>

//           {/* Button to open the Absence Declaration Form */}
//           <TouchableOpacity
//             style={styles.absenceButton}
//             onPress={() => setIsDeclarationFormVisible(true)}
//           >
//             <Text style={styles.absenceButtonText}>Declare Sudden Absence</Text>
//           </TouchableOpacity>

//           {/* List of pending absence demands */}
//           <Text style={styles.subtitle}>Pending Absence Demands</Text>
//           <FlatList
//             data={pendingDemands}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={renderPendingDemandItem}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             snapToInterval={width * 0.8} // Snap to 80% of screen width
//             decelerationRate="fast"
//             contentContainerStyle={styles.horizontalList}
//             ListEmptyComponent={<Text style={styles.noDemandsText}>No pending demands.</Text>}
//           />

//           {/* List of absence declarations */}
//           <Text style={styles.subtitle}>Absence Declarations</Text>
//           <FlatList
//             data={absenceDeclarations}
//             keyExtractor={(item) => item.id.toString()}
//             renderItem={renderDeclarationItem}
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             snapToInterval={width * 0.8} // Snap to 80% of screen width
//             decelerationRate="fast"
//             contentContainerStyle={styles.horizontalList}
//             ListEmptyComponent={<Text style={styles.noDeclarationsText}>No absence declarations.</Text>}
//           />
//         </View>
//       )}
//       contentContainerStyle={styles.scrollContainer}
//       ListFooterComponent={
//         <>
//           {/* Modal to show demand details and actions */}
//           <Modal visible={isModalVisible} transparent={true} animationType="slide">
//             <View style={styles.modalContainer}>
//               <View style={styles.modalContent}>
//                 {selectedDemand && (
//                   <>
//                     <Text style={styles.modalTitle}>Demand Details</Text>
//                     <Text style={styles.modalText}>Name: {selectedDemand.firstName} {selectedDemand.lastName}</Text>
//                     <Text style={styles.modalText}>Dates: {selectedDemand.dates}</Text>
//                     <Text style={styles.modalText}>Reason: {selectedDemand.reason}</Text>
//                     <Text style={styles.modalText}>Status: {selectedDemand.status}</Text>
//                     <View style={styles.modalButtons}>
//                       <TouchableOpacity style={styles.validateButton} onPress={() => handleDemandAction('Approved')}>
//                         <Text style={styles.buttonText}>Validate</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity style={styles.rejectButton} onPress={() => handleDemandAction('Rejected')}>
//                         <Text style={styles.buttonText}>Reject</Text>
//                       </TouchableOpacity>
//                       <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
//                         <Text style={styles.buttonText}>Close</Text>
//                       </TouchableOpacity>
//                     </View>
//                   </>
//                 )}
//               </View>
//             </View>
//           </Modal>

//           {/* Modal for the Absence Declaration Form */}
//           <Modal visible={isDeclarationFormVisible} transparent={true} animationType="slide">
//             <View style={styles.modalContainer}>
//               <View style={styles.modalContent}>
//                 <AbsenceDeclarationForm
//                   onSubmit={handleAbsenceDeclarationSubmit}
//                   onClose={() => setIsDeclarationFormVisible(false)}
//                 />
//               </View>
//             </View>
//           </Modal>
//         </>
//       }
//     />
//   );
// };

// const styles = StyleSheet.create({
//   scrollContainer: {
//     flexGrow: 1,
//   },
//   container: {
//     flex: 1,
//     padding: 20,
//     paddingTop: 50, // Added padding for the back button
//     backgroundColor: '#f5f5f5',
//   },
//   backButton: {
//     position: 'absolute',
//     top: 40,
//     left: 20,
//     zIndex: 1,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     color: '#333',
//   },
//   subtitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 20,
//     marginBottom: 10,
//     color: '#555',
//   },
//   calendar: {
//     marginBottom: 20,
//     borderRadius: 10,
//     overflow: 'hidden',
//   },
//   absenceButton: {
//     backgroundColor: '#1e90ff',
//     padding: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginTop: 10,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 4,
//     elevation: 5,
//   },
//   absenceButtonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   horizontalList: {
//     paddingBottom: 20,
//   },
//   demandItem: {
//     width: width * 0.8 - 30, // 80% of screen width minus padding
//     padding: 15,
//     backgroundColor: '#fff',
//     marginRight: 10,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   demandText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   noDemandsText: {
//     fontSize: 14,
//     color: '#888',
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   declarationItem: {
//     width: width * 0.8 - 30, // 80% of screen width minus padding
//     padding: 15,
//     backgroundColor: '#fff',
//     marginRight: 10,
//     borderRadius: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   declarationText: {
//     fontSize: 16,
//     color: '#333',
//   },
//   noDeclarationsText: {
//     fontSize: 14,
//     color: '#888',
//     textAlign: 'center',
//     marginTop: 10,
//   },
//   modalContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: 'rgba(0, 0, 0, 0.5)',
//   },
//   modalContent: {
//     width: '90%',
//     backgroundColor: 'white',
//     borderRadius: 10,
//     padding: 20,
//   },
//   modalTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 15,
//     textAlign: 'center',
//     color: '#333',
//   },
//   modalText: {
//     fontSize: 16,
//     color: '#555',
//     marginBottom: 10,
//   },
//   modalButtons: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginTop: 20,
//   },
//   validateButton: {
//     flex: 1,
//     padding: 15,
//     backgroundColor: '#4CAF50',
//     borderRadius: 5,
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   rejectButton: {
//     flex: 1,
//     padding: 15,
//     backgroundColor: '#F44336',
//     borderRadius: 5,
//     alignItems: 'center',
//     marginRight: 10,
//   },
//   closeButton: {
//     flex: 1,
//     padding: 15,
//     backgroundColor: '#888',
//     borderRadius: 5,
//     alignItems: 'center',
//   },
//   buttonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default ProfileDetails;
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Dimensions, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import AbsenceDeclarationForm from '../../components/AbsenceDeclarationForm';
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get('window');

const ProfileDetails = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { updatedPendingDemands: updatedPendingDemandsParam } = useLocalSearchParams();

  // State management
  const [pendingDemands, setPendingDemands] = useState([]);
  const [validatedDemands, setValidatedDemands] = useState([]);
  const [absenceDeclarations, setAbsenceDeclarations] = useState([]);
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeclarationFormVisible, setIsDeclarationFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'

  // Initialize with sample data (replace with API calls in production)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPendingDemands([
        { id: 1, firstName: "John", lastName: "Doe", dates: "2023-10-15", reason: "Sick Leave", status: "Pending" },
        { id: 2, firstName: "Jane", lastName: "Smith", dates: "2023-10-20", reason: "Personal Matter", status: "Pending" },
      ]);
      
      setValidatedDemands([
        { id: 3, firstName: "Alice", lastName: "Johnson", dates: "2023-09-25", reason: "Vacation", status: "Approved" },
      ]);
      
      setAbsenceDeclarations([
        { id: 1, reason: "Family Emergency", details: "Unexpected family issue", status: "Pending", date: "2023-10-10" },
        { id: 2, reason: "Car Breakdown", details: "Car broke down on the way to work", status: "Approved", date: "2023-09-15" },
      ]);
      
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  // Update pendingDemands when updatedPendingDemandsParam changes
  useEffect(() => {
    if (updatedPendingDemandsParam) {
      const updatedDemands = JSON.parse(updatedPendingDemandsParam);
      setPendingDemands(updatedDemands);
    }
  }, [updatedPendingDemandsParam]);

  // Mark dates with validated demands on the calendar
  const markedDates = validatedDemands.reduce((acc, demand) => {
    demand.dates.split(', ').forEach(date => {
      acc[date] = { marked: true, dotColor: '#4CAF50', activeOpacity: 0.5 };
    });
    return acc;
  }, {});

  // Add today's date marker
  const today = new Date().toISOString().split('T')[0];
  markedDates[today] = { ...markedDates[today], selected: true, selectedColor: '#1e90ff' };

  // Handle demand actions
  const handleDemandAction = (action) => {
    const updatedDemands = pendingDemands.map(demand =>
      demand.id === selectedDemand.id ? { ...demand, status: action } : demand
    );
    
    setPendingDemands(updatedDemands.filter(d => d.status === 'Pending'));

    if (action === 'Approved') {
      setValidatedDemands([...validatedDemands, { ...selectedDemand, status: action }]);
    }

    setIsModalVisible(false);
  };

  // Handle absence declaration submission
  const handleAbsenceDeclarationSubmit = (declaration) => {
    const newDeclaration = {
      ...declaration,
      id: absenceDeclarations.length + 1,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0]
    };
    setAbsenceDeclarations([newDeclaration, ...absenceDeclarations]);
    setIsDeclarationFormVisible(false);
  };

  // Render demand item
  const renderDemandItem = ({ item }) => (
    <TouchableOpacity onPress={() => { setSelectedDemand(item); setIsModalVisible(true); }}>
      <View style={[
        styles.card,
        item.status === 'Approved' && styles.approvedCard,
        item.status === 'Rejected' && styles.rejectedCard
      ]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>{item.firstName} {item.lastName}</Text>
          <View style={[
            styles.statusBadge,
            item.status === 'Approved' && styles.approvedBadge,
            item.status === 'Rejected' && styles.rejectedBadge
          ]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.cardText}>Dates: {item.dates}</Text>
        <Text style={styles.cardText}>Reason: {item.reason}</Text>
        {item.status !== 'Pending' && (
          <Text style={styles.cardText}>Processed on: {new Date().toLocaleDateString()}</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  // Render declaration item
  const renderDeclarationItem = ({ item }) => (
    <View style={[
      styles.card,
      item.status === 'Approved' && styles.approvedCard,
      item.status === 'Rejected' && styles.rejectedCard
    ]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>{item.reason}</Text>
        <View style={[
          styles.statusBadge,
          item.status === 'Approved' && styles.approvedBadge,
          item.status === 'Rejected' && styles.rejectedBadge
        ]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.cardText}>Details: {item.details}</Text>
      <Text style={styles.cardText}>Date: {item.date}</Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e90ff" />
        </TouchableOpacity>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
      </View>

      {/* Calendar */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Absence Calendar</Text>
        <Calendar
          markingType={'multi-dot'}
          markedDates={markedDates}
          style={styles.calendar}
          theme={{
            calendarBackground: '#fff',
            todayTextColor: '#1e90ff',
            selectedDayBackgroundColor: '#1e90ff',
            arrowColor: '#1e90ff',
          }}
        />
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push('/profile/DemandeAbsence')}
        >
          <MaterialIcons name="event-available" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Request Day Off</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setIsDeclarationFormVisible(true)}
        >
          <MaterialIcons name="event-busy" size={20} color="#fff" />
          <Text style={styles.actionButtonText}>Declare Absence</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Pending ({pendingDemands.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'history' && styles.activeTab]}
          onPress={() => setActiveTab('history')}
        >
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History ({validatedDemands.length + absenceDeclarations.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content based on active tab */}
      {activeTab === 'pending' ? (
        <FlatList
          data={pendingDemands}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderDemandItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="event-note" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No pending requests</Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={[...validatedDemands, ...absenceDeclarations].sort((a, b) => 
            new Date(b.date || b.dates.split(', ')[0]) - new Date(a.date || a.dates.split(', ')[0])
          )}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => 
            item.reason ? renderDeclarationItem({ item }) : renderDemandItem({ item })
          }
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <MaterialIcons name="history" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No history yet</Text>
            </View>
          }
        />
      )}

      {/* Demand Detail Modal */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedDemand && (
              <>
                <Text style={styles.modalTitle}>Request Details</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Name:</Text>
                  <Text style={styles.detailValue}>{selectedDemand.firstName} {selectedDemand.lastName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Dates:</Text>
                  <Text style={styles.detailValue}>{selectedDemand.dates}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Reason:</Text>
                  <Text style={styles.detailValue}>{selectedDemand.reason}</Text>
                </View>
                
                {selectedDemand.status === 'Pending' && (
                  <View style={styles.modalButtons}>
                    <TouchableOpacity 
                      style={[styles.modalButton, styles.approveButton]}
                      onPress={() => handleDemandAction('Approved')}
                    >
                      <Text style={styles.buttonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.modalButton, styles.rejectButton]}
                      onPress={() => handleDemandAction('Rejected')}
                    >
                      <Text style={styles.buttonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={() => setIsModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Absence Declaration Modal */}
      <Modal visible={isDeclarationFormVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.formModalContainer}>
            <AbsenceDeclarationForm
              onSubmit={handleAbsenceDeclarationSubmit}
              onClose={() => setIsDeclarationFormVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    paddingTop: 50,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    padding: 5,
  },
  logoutButton: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  userInfo: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e90ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
  },
  userEmail: {
    fontSize: 16,
    color: '#555',
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 15,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  calendar: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e90ff',
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tab: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#1e90ff',
  },
  tabText: {
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1e90ff',
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  approvedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  rejectedCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#F44336',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
  },
  approvedBadge: {
    backgroundColor: '#e8f5e9',
  },
  rejectedBadge: {
    backgroundColor: '#ffebee',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  formModalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  detailLabel: {
    width: 80,
    fontWeight: 'bold',
    color: '#555',
  },
  detailValue: {
    flex: 1,
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#1e90ff',
    fontWeight: 'bold',
  },
});

export default ProfileDetails;