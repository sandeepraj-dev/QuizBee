import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  StatusBar,
  SafeAreaView,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

import API from './../../api/axios';

export default function ManageClassroomScreen() {
  const navigation = useNavigation();

  const [classrooms, setClassrooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [selectedClassroom, setSelectedClassroom] = useState(null);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);

      const response = await API.get('/classrooms');

      setClassrooms(response.data || []);
    } catch (error) {
      console.log('Fetch Classrooms Error:', error?.response?.data || error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchClassrooms();
    }, []),
  );

  const openDeleteDialog = classroom => {
    setSelectedClassroom(classroom);
    setDeleteModalVisible(true);
  };

  const closeDeleteDialog = () => {
    if (deleteLoading) return;

    setDeleteModalVisible(false);
    setSelectedClassroom(null);
  };

  const deleteClassroom = async () => {
    try {
      setDeleteLoading(true);

      await API.delete(`/classrooms/${selectedClassroom._id}`);

      setClassrooms(prev =>
        prev.filter(item => item._id !== selectedClassroom._id),
      );

      setDeleteModalVisible(false);
      setSelectedClassroom(null);
    } catch (error) {
      console.log('Delete Error:', error?.response?.data || error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardTopRow}>
          <View style={styles.avatar}>
            <Icon name="school" size={22} color="#FFF" />
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate('EditClassroom', {
                  classroom: item,
                })
              }
            >
              <Icon name="create-outline" size={20} color="#4F46E5" />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => openDeleteDialog(item)}
            >
              <Icon name="trash-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.title}>{item.name}</Text>

        <Text style={styles.description}>{item.description}</Text>

        <View style={styles.bottomRow}>
          <Text style={styles.idText}>ID: {item._id.slice(-6)}</Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      {/* HEADER */}
      <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerSubtitle}>Management</Text>
            <Text style={styles.headerTitle}>Classrooms</Text>
          </View>

          {/* s */}
        </View>

        <View style={styles.statsCard}>
          <Text style={styles.statsNumber}>{classrooms.length}</Text>

          <Text style={styles.statsLabel}>Total Classrooms</Text>
        </View>
      </LinearGradient>

      {/* BODY */}
      <View style={styles.body}>
        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />

            <Text style={styles.loadingText}>Loading Classrooms...</Text>
          </View>
        ) : classrooms.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Icon name="school-outline" size={80} color="#CBD5E1" />

            <Text style={styles.emptyTitle}>No Classrooms Found</Text>

            <Text style={styles.emptySubtitle}>
              Tap + to create your first classroom
            </Text>
          </View>
        ) : (
          <FlatList
            data={classrooms}
            keyExtractor={item => item._id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: 16,
              paddingBottom: 120,
            }}
          />
        )}
      </View>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateClassroom')}
      >
        <LinearGradient
          colors={['#4F46E5', '#7C3AED']}
          style={styles.fabGradient}
        >
          <Icon name="add" size={20} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* DELETE MODAL */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.warningCircle}>
              <Icon name="trash" size={30} color="#EF4444" />
            </View>

            <Text style={styles.modalTitle}>Delete Classroom</Text>

            <Text style={styles.modalMessage}>
              Are you sure you want to delete
              {'\n'}"{selectedClassroom?.name}" ?
            </Text>

            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={closeDeleteDialog}
                disabled={deleteLoading}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={deleteClassroom}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={styles.deleteText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '700',
  },

  statsCard: {
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
  },

  statsNumber: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: 'bold',
  },

  statsLabel: {
    color: '#E5E7EB',
    marginTop: 4,
  },

  body: {
    flex: 1,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#64748B',
  },

  card: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 15,
    elevation: 4,
  },

  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },

  actionRow: {
    flexDirection: 'row',
  },

  editButton: {
    marginRight: 10,
  },

  deleteButton: {},

  title: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 15,
  },

  description: {
    color: '#64748B',
    marginTop: 6,
  },

  bottomRow: {
    marginTop: 12,
  },

  idText: {
    color: '#94A3B8',
  },

  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
  },

  fabGradient: {
    width: 60,
    height: 60,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 15,
  },

  emptySubtitle: {
    color: '#64748B',
    marginTop: 5,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalContainer: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 24,
  },

  warningCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },

  modalTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 15,
  },

  modalMessage: {
    textAlign: 'center',
    color: '#64748B',
    marginTop: 10,
    lineHeight: 22,
  },

  modalButtonRow: {
    flexDirection: 'row',
    marginTop: 25,
  },

  cancelButton: {
    flex: 1,
    padding: 14,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },

  confirmDeleteButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    alignItems: 'center',
  },

  cancelText: {
    fontWeight: '600',
  },

  deleteText: {
    color: '#FFF',
    fontWeight: '700',
  },
  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },

  headerSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  headerTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 2,
  },
});
