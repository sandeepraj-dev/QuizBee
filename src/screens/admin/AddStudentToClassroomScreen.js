import React, { useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  ActivityIndicator,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import { useNavigation } from '@react-navigation/native';

import Toast from 'react-native-toast-message';
import API from '../../api/axios';

export default function AddStudentToClassroomScreen() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [classrooms, setClassrooms] = useState([]);
  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState('');

  const [selectedClassroom, setSelectedClassroom] = useState(null);

  const [selectedStudents, setSelectedStudents] = useState([]);

  const [showClassroomModal, setShowClassroomModal] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const classroomResponse = await API.get('/classrooms');
      const studentResponse = await API.get('/student');

      setClassrooms(classroomResponse.data || []);
      setStudents(studentResponse.data.data || []);
    } catch (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed to load data',
      });
    } finally {
      setLoading(false);
    }
  };
  const isStudentAlreadyAdded = studentId => {
    return selectedClassroom?.students?.some(
      student => student._id === studentId,
    );
  };

  const toggleStudent = studentId => {
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      }

      return [...prev, studentId];
    });
  };

  const submit = async () => {
    if (!selectedClassroom) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Please select classroom',
      });
      return;
    }

    if (selectedStudents.length === 0) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Please select students',
      });
      return;
    }

    try {
      setSaving(true);

      await API.post(`/classrooms/${selectedClassroom._id}/students`, {
        studentIds: selectedStudents,
      });

      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Students added successfully',
      });

      // navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed to add students',
      });
    } finally {
      setSaving(false);
    }
  };

  const filteredStudents =
    students.length > 0
      ? students.filter(item =>
          item?.fullName?.toLowerCase().includes(search.toLowerCase()),
        )
      : [];

  const renderStudent = ({ item }) => {
    const alreadyAdded = isStudentAlreadyAdded(item._id);
    const isSelected = selectedStudents.includes(item._id);
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={alreadyAdded}
        onPress={() => toggleStudent(item._id)}
        style={[
          styles.studentCard,
          isSelected && styles.selectedCard,
          alreadyAdded && styles.addedCard,
        ]}
      >
        <View style={styles.studentLeft}>
          <View
            style={[
              styles.avatar,
              alreadyAdded && styles.avatarAdded,
              isSelected && styles.avatarSelected,
            ]}
          >
            <Text style={styles.avatarText}>
              {item.fullName?.charAt(0)?.toUpperCase()}
            </Text>
          </View>

          <View style={styles.studentInfo}>
            <Text style={styles.studentName}>{item.fullName}</Text>

            <Text style={styles.studentUsername}>@{item.username}</Text>

            <Text style={styles.studentEmail}>{item.email}</Text>
          </View>
        </View>

        <View>
          {alreadyAdded ? (
            <View style={styles.statusBadge}>
              <Icon name="checkmark-circle" size={24} color="#10B981" />
              <Text style={styles.statusText}>Added</Text>
            </View>
          ) : isSelected ? (
            <Icon name="checkmark-circle" size={30} color="#4F46E5" />
          ) : (
            <Icon name="ellipse-outline" size={28} color="#CBD5E1" />
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Add Students</Text>

        <Text style={styles.headerSubtitle}>Assign students to classroom</Text>
      </LinearGradient>

      <TouchableOpacity
        style={styles.classroomCard}
        onPress={() => setShowClassroomModal(true)}
      >
        <View>
          <Text style={styles.label}>Selected Classroom</Text>

          <Text style={styles.classroomName}>
            {selectedClassroom?.name || 'Select Classroom'}
          </Text>
        </View>

        <Icon name="chevron-down" size={22} color="#4F46E5" />
      </TouchableOpacity>
      {/* 
      <View style={styles.countCard}>
        <Text style={styles.countNumber}>{selectedStudents.length}</Text>

        <Text style={styles.countText}>Students Selected</Text>
      </View> */}

      <View style={styles.searchBox}>
        <Icon name="search" size={20} color="#94A3B8" />

        <TextInput
          placeholder="Search students..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
          style={{ flex: 1 }}
        />
      </View>
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={styles.listLoader}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Loading Students...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredStudents}
            renderItem={renderStudent}
            keyExtractor={item => item._id}
            contentContainerStyle={{
              paddingBottom: 100,
            }}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Icon name="people-outline" size={70} color="#CBD5E1" />
                <Text style={styles.emptyText}>No Students Found</Text>
              </View>
            )}
          />
        )}
      </View>

      <TouchableOpacity style={styles.submitBtn} onPress={submit}>
        <LinearGradient
          colors={['#4F46E5', '#7C3AED']}
          style={styles.submitGradient}
        >
          {saving ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.submitText}>Add Students</Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <Modal visible={showClassroomModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Classroom</Text>
            <FlatList
              data={classrooms}
              keyExtractor={item => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setSelectedClassroom(item);
                    setShowClassroomModal(false);
                  }}
                >
                  <Text>{item.name}</Text>
                </TouchableOpacity>
              )}
            />{' '}
            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowClassroomModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  modalCloseBtn: {
    marginTop: 20,
    backgroundColor: '#EF4444',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCloseText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  modalCloseBtn: {
    marginTop: 20,
    backgroundColor: '#EF4444',
    height: 52,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalCloseText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
  },
  listLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#64748B',
    fontSize: 15,
  },

  emptyContainer: {
    marginTop: 60,
    alignItems: 'center',
  },

  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#64748B',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },

  /* Header */

  header: {
    paddingTop: 20,
    paddingBottom: 35,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    elevation: 10,
  },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.20)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    marginTop: 15,
  },

  headerSubtitle: {
    fontSize: 14,
    color: '#E5E7EB',
    marginTop: 6,
  },

  /* Classroom Card */

  classroomCard: {
    marginHorizontal: 16,
    marginTop: -20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 5,
  },

  label: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 4,
  },

  classroomName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },

  /* Stats Card */

  countCard: {
    marginHorizontal: 16,
    marginTop: 15,
    borderRadius: 20,
    paddingVertical: 18,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
  },

  countNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#4F46E5',
  },

  countText: {
    marginTop: 4,
    color: '#64748B',
    fontWeight: '600',
  },

  /* Search */

  searchBox: {
    marginHorizontal: 16,
    marginVertical: 15,
    backgroundColor: '#FFF',
    borderRadius: 18,
    paddingHorizontal: 15,
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 3,
  },

  /* Student Card */

  studentCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 15,

    flexDirection: 'row',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 3,
  },

  selectedStudentCard: {
    borderWidth: 2,
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },

  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },

  studentEmail: {
    marginTop: 4,
    fontSize: 13,
    color: '#64748B',
  },

  /* Submit Button */

  submitBtn: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },

  submitGradient: {
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#4F46E5',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 6,
    },

    elevation: 8,
  },

  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  /* Modal */

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.50)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '70%',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 20,
  },

  modalItem: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },

  modalItemText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },

  /* Empty State */

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },

  emptyTitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '700',
    color: '#475569',
  },

  emptySubtitle: {
    marginTop: 6,
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  studentCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,

    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },

    elevation: 4,
  },

  selectedCard: {
    borderWidth: 2,
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },

  addedCard: {
    backgroundColor: '#F8FAFC',
    opacity: 0.85,
  },

  studentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,

    backgroundColor: '#4F46E5',

    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarSelected: {
    backgroundColor: '#6366F1',
  },

  avatarAdded: {
    backgroundColor: '#10B981',
  },

  avatarText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
  },

  studentInfo: {
    marginLeft: 14,
    flex: 1,
  },

  studentName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  studentUsername: {
    color: '#6366F1',
    marginTop: 2,
    fontWeight: '600',
  },

  studentEmail: {
    color: '#64748B',
    marginTop: 4,
    fontSize: 13,
  },

  statusBadge: {
    alignItems: 'center',
  },

  statusText: {
    marginTop: 4,
    color: '#10B981',
    fontWeight: '700',
    fontSize: 12,
  },
});
