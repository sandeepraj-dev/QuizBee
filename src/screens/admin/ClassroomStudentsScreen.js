import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import { Dropdown } from 'react-native-element-dropdown';
import Icon from 'react-native-vector-icons/Ionicons';

import API from '../../api/axios';

export default function ClassroomStudentsScreen() {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassroom, setSelectedClassroom] = useState(null);

  const [students, setStudents] = useState([]);

  const [loadingClassrooms, setLoadingClassrooms] = useState(false);

  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    loadClassrooms();
  }, []);

  const loadClassrooms = async () => {
    try {
      setLoadingClassrooms(true);

      const response = await API.get('/classrooms');

      const formatted =
        response.data.data?.map(item => ({
          label: item.name,
          value: item._id,
        })) ||
        response.data?.map(item => ({
          label: item.name,
          value: item._id,
        }));

      setClassrooms(formatted);
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingClassrooms(false);
    }
  };

  const loadStudents = async classroomId => {
    try {
      setLoadingStudents(true);

      const response = await API.get(`/classrooms/${classroomId}/students`);

      setStudents(response.data.students || []);
    } catch (error) {
      console.log(error);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const renderStudent = ({ item }) => (
    <View style={styles.studentCard}>
      <View style={styles.avatar}>
        <Icon name="person" size={24} color="#FFF" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.studentName}>{item.name}</Text>

        <Text style={styles.studentInfo}>{item.email}</Text>

        <Text style={styles.studentInfo}>{item.phone || 'No Phone'}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#4F46E5', '#7C3AED', '#9333EA']}
        style={styles.header}
      >
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        {/* Top Bar */}
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.8}
          >
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.headerTopTitle}>Student List</Text>

          {/* Empty View for alignment */}
          <View style={styles.rightPlaceholder} />
        </View>

        {/* Center Icon */}
        <View style={styles.iconContainer}>
          <Icon name="people" size={42} color="#FFF" />
        </View>

        <Text style={styles.headerTitle}>Students</Text>

        <Text style={styles.headerSubtitle}>
          Manage and view enrolled students
        </Text>
      </LinearGradient>

      <View style={styles.content}>
        <Text style={styles.label}>Select Classroom</Text>

        {loadingClassrooms ? (
          <ActivityIndicator size="large" color="#4F46E5" />
        ) : (
          <Dropdown
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            data={classrooms}
            labelField="label"
            valueField="value"
            placeholder="Choose Classroom"
            value={selectedClassroom}
            search
            searchPlaceholder="Search classroom..."
            onChange={item => {
              setSelectedClassroom(item.value);

              loadStudents(item.value);
            }}
          />
        )}

        {selectedClassroom && (
          <View style={styles.countCard}>
            <Text style={styles.countText}>Students: {students.length}</Text>
          </View>
        )}

        {loadingStudents ? (
          <ActivityIndicator
            size="large"
            color="#4F46E5"
            style={{ marginTop: 40 }}
          />
        ) : (
          <FlatList
            data={students}
            keyExtractor={item => item._id}
            renderItem={renderStudent}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 120,
            }}
            ListEmptyComponent={
              selectedClassroom ? (
                <View style={styles.emptyContainer}>
                  <Icon name="people-outline" size={80} color="#D1D5DB" />

                  <Text style={styles.emptyTitle}>No Students Found</Text>
                </View>
              ) : null
            }
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  headerTopTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },

  rightPlaceholder: {
    width: 46,
  },

  iconContainer: {
    width: 95,
    height: 95,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 25,
  },

  headerTitle: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 15,
  },

  headerSubtitle: {
    color: '#E5E7EB',
    textAlign: 'center',
    marginTop: 6,
    fontSize: 14,
  },

  header: {
    padding: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  title: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '800',
  },

  subtitle: {
    color: '#E5E7EB',
    marginTop: 5,
  },

  content: {
    padding: 20,
  },

  label: {
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 10,
    color: '#374151',
  },

  dropdown: {
    height: 55,
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingHorizontal: 15,
    elevation: 3,
  },

  placeholderStyle: {
    color: '#9CA3AF',
  },

  selectedTextStyle: {
    color: '#111827',
    fontWeight: '600',
  },

  countCard: {
    backgroundColor: '#EEF2FF',
    marginTop: 20,
    borderRadius: 14,
    padding: 15,
  },

  countText: {
    color: '#4F46E5',
    fontWeight: '700',
  },

  studentCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    marginTop: 15,
    borderRadius: 20,
    padding: 15,
    elevation: 3,
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  studentInfo: {
    color: '#6B7280',
    marginTop: 3,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },

  emptyTitle: {
    marginTop: 15,
    fontSize: 18,
    fontWeight: '700',
    color: '#6B7280',
  },
});
