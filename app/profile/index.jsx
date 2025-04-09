import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // For the back button icon
import AbsenceDeclarationForm from '../../components/AbsenceDeclarationForm'; // Import the form

const { width } = Dimensions.get('window'); // Get screen width for responsive design

const ProfileDetails = () => {
  const router = useRouter();
  const { updatedPendingDemands: updatedPendingDemandsParam } = useLocalSearchParams();

  // State to manage pending absence demands
  const [pendingDemands, setPendingDemands] = useState([
    { id: 1, firstName: "John", lastName: "Doe", dates: "2023-10-15", reason: "Sick Leave", status: "Pending" },
    { id: 2, firstName: "Jane", lastName: "Smith", dates: "2023-10-20", reason: "Personal Matter", status: "Pending" },
    { id: 3, firstName: "Alice", lastName: "Johnson", dates: "2023-10-25", reason: "Vacation", status: "Pending" },
    { id: 4, firstName: "Bob", lastName: "Brown", dates: "2023-10-30", reason: "Medical Leave", status: "Pending" },
  ]);

  // State to manage validated absence demands
  const [validatedDemands, setValidatedDemands] = useState([]);

  // State to manage absence declarations
  const [absenceDeclarations, setAbsenceDeclarations] = useState([
    { id: 1, reason: "Family Emergency", details: "Unexpected family issue", status: "Pending" },
    { id: 2, reason: "Car Breakdown", details: "Car broke down on the way to work", status: "Approved" },
    { id: 3, reason: "Health Issue", details: "Sudden health problem", status: "Rejected" },
  ]);

  // State to manage the selected demand for the modal
  const [selectedDemand, setSelectedDemand] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // State to manage the absence declaration form visibility
  const [isDeclarationFormVisible, setIsDeclarationFormVisible] = useState(false);

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
      acc[date] = { marked: true, dotColor: 'red', activeOpacity: 0.5 };
    });
    return acc;
  }, {});

  // Function to handle navigation to the Absence Demand Form
  const handleNavigateToAbsenceForm = () => {
    router.push({
      pathname: '/profile/DemandeAbsence',
      params: { pendingDemands: JSON.stringify(pendingDemands) },
    });
  };

  // Function to handle demand click (open modal)
  const handleDemandClick = (demand) => {
    setSelectedDemand(demand);
    setIsModalVisible(true);
  };

  // Function to validate or reject a demand
  const handleDemandAction = (action) => {
    const updatedDemands = pendingDemands.map((demand) =>
      demand.id === selectedDemand.id ? { ...demand, status: action } : demand
    );
    setPendingDemands(updatedDemands);

    if (action === 'Approved') {
      setValidatedDemands([...validatedDemands, { ...selectedDemand, status: action }]);
    } else if (action === 'Rejected') {
      setValidatedDemands(validatedDemands.filter((demand) => demand.id !== selectedDemand.id));
    }

    setIsModalVisible(false);
  };

  // Function to handle submission of the absence declaration
  const handleAbsenceDeclarationSubmit = (declaration) => {
    setAbsenceDeclarations([...absenceDeclarations, declaration]);
    setIsDeclarationFormVisible(false);
  };

  // Function to navigate back to the dashboard
  const goToDashboard = () => {
    router.push('/'); // Navigate to the root (Dashboard)
  };

  // Render item for pending demands
  const renderPendingDemandItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleDemandClick(item)}>
      <View style={styles.demandItem}>
        <Text style={styles.demandText}>Name: {item.firstName} {item.lastName}</Text>
        <Text style={styles.demandText}>Dates: {item.dates}</Text>
        <Text style={styles.demandText}>Status: {item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  // Render item for absence declarations
  const renderDeclarationItem = ({ item }) => (
    <View style={styles.declarationItem}>
      <Text style={styles.declarationText}>Reason: {item.reason}</Text>
      <Text style={styles.declarationText}>Details: {item.details}</Text>
      <Text style={styles.declarationText}>Status: {item.status}</Text>
    </View>
  );

  return (
    <FlatList
      data={[{ key: 'content' }]} // Single item to render the main content
      renderItem={() => (
        <View style={styles.container}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={goToDashboard}>
            <Ionicons name="arrow-back" size={24} color="#1e90ff" />
          </TouchableOpacity>

          <Text style={styles.title}>Your Profile</Text>

          {/* Calendar to display marked absence dates */}
          <Calendar
            markingType={'simple'}
            markedDates={markedDates}
            style={styles.calendar}
          />

          {/* Button to navigate to the Absence Demand Form */}
          <TouchableOpacity
            style={styles.absenceButton}
            onPress={handleNavigateToAbsenceForm}
          >
            <Text style={styles.absenceButtonText}>Request Day Off</Text>
          </TouchableOpacity>

          {/* Button to open the Absence Declaration Form */}
          <TouchableOpacity
            style={styles.absenceButton}
            onPress={() => setIsDeclarationFormVisible(true)}
          >
            <Text style={styles.absenceButtonText}>Declare Sudden Absence</Text>
          </TouchableOpacity>

          {/* List of pending absence demands */}
          <Text style={styles.subtitle}>Pending Absence Demands</Text>
          <FlatList
            data={pendingDemands}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderPendingDemandItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={width * 0.8} // Snap to 80% of screen width
            decelerationRate="fast"
            contentContainerStyle={styles.horizontalList}
            ListEmptyComponent={<Text style={styles.noDemandsText}>No pending demands.</Text>}
          />

          {/* List of absence declarations */}
          <Text style={styles.subtitle}>Absence Declarations</Text>
          <FlatList
            data={absenceDeclarations}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderDeclarationItem}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={width * 0.8} // Snap to 80% of screen width
            decelerationRate="fast"
            contentContainerStyle={styles.horizontalList}
            ListEmptyComponent={<Text style={styles.noDeclarationsText}>No absence declarations.</Text>}
          />
        </View>
      )}
      contentContainerStyle={styles.scrollContainer}
      ListFooterComponent={
        <>
          {/* Modal to show demand details and actions */}
          <Modal visible={isModalVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                {selectedDemand && (
                  <>
                    <Text style={styles.modalTitle}>Demand Details</Text>
                    <Text style={styles.modalText}>Name: {selectedDemand.firstName} {selectedDemand.lastName}</Text>
                    <Text style={styles.modalText}>Dates: {selectedDemand.dates}</Text>
                    <Text style={styles.modalText}>Reason: {selectedDemand.reason}</Text>
                    <Text style={styles.modalText}>Status: {selectedDemand.status}</Text>
                    <View style={styles.modalButtons}>
                      <TouchableOpacity style={styles.validateButton} onPress={() => handleDemandAction('Approved')}>
                        <Text style={styles.buttonText}>Validate</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rejectButton} onPress={() => handleDemandAction('Rejected')}>
                        <Text style={styles.buttonText}>Reject</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                        <Text style={styles.buttonText}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </View>
            </View>
          </Modal>

          {/* Modal for the Absence Declaration Form */}
          <Modal visible={isDeclarationFormVisible} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <AbsenceDeclarationForm
                  onSubmit={handleAbsenceDeclarationSubmit}
                  onClose={() => setIsDeclarationFormVisible(false)}
                />
              </View>
            </View>
          </Modal>
        </>
      }
    />
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 50, // Added padding for the back button
    backgroundColor: '#f5f5f5',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#555',
  },
  calendar: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
  },
  absenceButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  absenceButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  horizontalList: {
    paddingBottom: 20,
  },
  demandItem: {
    width: width * 0.8 - 30, // 80% of screen width minus padding
    padding: 15,
    backgroundColor: '#fff',
    marginRight: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  demandText: {
    fontSize: 16,
    color: '#333',
  },
  noDemandsText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  declarationItem: {
    width: width * 0.8 - 30, // 80% of screen width minus padding
    padding: 15,
    backgroundColor: '#fff',
    marginRight: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  declarationText: {
    fontSize: 16,
    color: '#333',
  },
  noDeclarationsText: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#333',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  validateButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 10,
  },
  rejectButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#F44336',
    borderRadius: 5,
    alignItems: 'center',
    marginRight: 10,
  },
  closeButton: {
    flex: 1,
    padding: 15,
    backgroundColor: '#888',
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ProfileDetails;