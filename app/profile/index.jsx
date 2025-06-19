// app/profile/index.jsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';

const ProfileDetails = () => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    if (!user) {
      setUserRequests([]);
      setLoading(false);
      return;
    }
    const fetchRequests = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/users/${user.id}/absenceRequests`);
        if (!response.ok) throw new Error('Failed to fetch absence requests');
        const data = await response.json();
        setUserRequests(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, [user]);

  const markedDates = userRequests.reduce((acc, request) => {
    if (request.status === 'Approved') {
      request.dates.split(', ').forEach(date => {
        acc[date] = { marked: true, dotColor: '#4CAF50' };
      });
    }
    return acc;
  }, {});

  const pendingRequests = userRequests.filter(req => req.status === 'Pending');
  const approvedRequests = userRequests.filter(req => req.status === 'Approved');

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1e90ff" />
      </View>
    );
  }

  const renderRequestItem = ({ item }) => (
    <TouchableOpacity onPress={() => {
      setSelectedRequest(item);
      setIsModalVisible(true);
    }}>
      <View style={[
        styles.requestCard,
        item.status === 'Approved' && styles.approvedCard,
        item.status === 'Pending' && styles.pendingCard
      ]}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>
            {item.dates.split(', ').length > 1 ? 
              `${item.dates.split(', ')[0]}...` : 
              item.dates}
          </Text>
          <View style={[
            styles.statusBadge,
            item.status === 'Approved' && styles.approvedBadge,
            item.status === 'Pending' && styles.pendingBadge
          ]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.cardText}>Reason: {item.reason}</Text>
        <Text style={styles.cardText}>
          {item.morningChecked && item.afternoonChecked ? 'Full Day' :
           item.morningChecked ? 'Morning Only' :
           item.afternoonChecked ? 'Afternoon Only' : 'No Time Selected'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1e90ff" />
        </TouchableOpacity>
        <Text style={styles.title}>My Profile</Text>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <MaterialIcons name="logout" size={24} color="#ff4444" />
        </TouchableOpacity>
      </View>

      {/* User Info */}
      <View style={styles.userInfo}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user?.firstName?.charAt(0) || 'G'}{user?.lastName?.charAt(0) || 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{user ? `${user.firstName} ${user.lastName}` : 'Guest User'}</Text>
        <Text style={styles.userEmail}>{user?.email || 'guest@example.com'}</Text>
        <Text style={styles.userId}>{user ? `Employee ID: ${user?.uid?.substring(0, 8)}` : 'No Employee ID'}</Text>
      </View>

      {/* Calendar */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Approved Absences</Text>
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
          <Text style={styles.actionButtonText}>Request Time Off</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'pending' && styles.activeTab]}
          onPress={() => setActiveTab('pending')}
        >
          <Text style={[styles.tabText, activeTab === 'pending' && styles.activeTabText]}>
            Pending ({pendingRequests.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'approved' && styles.activeTab]}
          onPress={() => setActiveTab('approved')}
        >
          <Text style={[styles.tabText, activeTab === 'approved' && styles.activeTabText]}>
            Approved ({approvedRequests.length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* Requests List */}
      <FlatList
        data={activeTab === 'pending' ? pendingRequests : approvedRequests}
        keyExtractor={(item) => item.id}
        renderItem={renderRequestItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialIcons 
              name={activeTab === 'pending' ? "hourglass-empty" : "check-circle"} 
              size={48} 
              color="#ccc" 
            />
            <Text style={styles.emptyText}>
              {activeTab === 'pending' ? 
                "No pending requests" : 
                "No approved requests"}
            </Text>
          </View>
        }
      />

      {/* Request Detail Modal */}
      <Modal visible={isModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedRequest && (
              <>
                <Text style={styles.modalTitle}>Request Details</Text>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Dates:</Text>
                  <Text style={styles.detailValue}>{selectedRequest.dates}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Reason:</Text>
                  <Text style={styles.detailValue}>{selectedRequest.reason}</Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Time:</Text>
                  <Text style={styles.detailValue}>
                    {selectedRequest.morningChecked && selectedRequest.afternoonChecked ? 'Full Day' :
                     selectedRequest.morningChecked ? 'Morning Only' :
                     selectedRequest.afternoonChecked ? 'Afternoon Only' : 'No Time Selected'}
                  </Text>
                </View>
                
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status:</Text>
                  <View style={[
                    styles.statusBadge,
                    selectedRequest.status === 'Approved' && styles.approvedBadge,
                    selectedRequest.status === 'Pending' && styles.pendingBadge
                  ]}>
                    <Text style={styles.statusText}>{selectedRequest.status}</Text>
                  </View>
                </View>

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
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  userEmail: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  userId: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
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
    justifyContent: 'center',
    marginHorizontal: 15,
    marginBottom: 15,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e90ff',
    padding: 12,
    borderRadius: 8,
    width: '100%',
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
  requestCard: {
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
  pendingCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
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
  pendingBadge: {
    backgroundColor: '#fff8e1',
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
    alignItems: 'center',
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