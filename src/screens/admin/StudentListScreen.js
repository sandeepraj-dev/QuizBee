// StudentListScreen.js

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  StatusBar,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

import API from '../../api/axios';

const StudentListScreen = () => {
  const navigation = useNavigation();

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (!search.trim()) {
      setFilteredStudents(students);
      return;
    }

    const filtered = students.filter(
      item =>
        item?.name?.toLowerCase()?.includes(search.toLowerCase()) ||
        item?.email?.toLowerCase()?.includes(search.toLowerCase()),
    );

    setFilteredStudents(filtered);
  }, [search, students]);

  const loadStudents = async () => {
    try {
      setLoading(true);

      const response = await API.get('/student');

      const studentsData =
        response?.data?.students ||
        response?.data?.data ||
        response?.data ||
        [];

      // Fetch classroom details for each student
      const studentsWithClassrooms = await Promise.all(
        studentsData.map(async student => {
          try {
            if (!student.classroomIds || student.classroomIds.length === 0) {
              return {
                ...student,
                classrooms: [],
              };
            }

            const classroomResponses = await Promise.all(
              student.classroomIds.map(id => API.get(`/classrooms/${id}`)),
            );

            const classrooms = classroomResponses.map(
              res => res?.data?.data || res?.data?.classroom || res?.data,
            );

            return {
              ...student,
              classrooms,
            };
          } catch (error) {
            console.log('Classroom Fetch Error:', student._id, error);

            return {
              ...student,
              classrooms: [],
            };
          }
        }),
      );

      setStudents(studentsWithClassrooms);
      setFilteredStudents(studentsWithClassrooms);
    } catch (error) {
      console.log('Students Error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadStudents();
  };

  const renderStudent = ({ item }) => (
    <TouchableOpacity activeOpacity={0.9} style={styles.studentCard}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {item?.name?.charAt(0)?.toUpperCase() || 'S'}
        </Text>
      </View>

      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item?.fullName || 'Student'}</Text>

        <View style={styles.infoRow}>
          <Icon name="mail-outline" size={14} color="#6B7280" />
          <Text style={styles.infoText}>{item?.email || 'No Email'}</Text>
        </View>

        {/* <View style={styles.infoRow}>
          <Icon name="call-outline" size={14} color="#6B7280" />
          <Text style={styles.infoText}>{item?.phone || 'No Phone'}</Text>
        </View> */}

        <View style={styles.infoRow}>
          <Icon name="school-outline" size={14} color="#6B7280" />

          <Text style={styles.infoText}>
            {item?.classrooms?.length > 0
              ? item.classrooms.map(c => c.name).join(', ')
              : 'No Classroom Assigned'}
          </Text>
        </View>
      </View>

      <Icon name="chevron-forward" size={22} color="#9CA3AF" />
    </TouchableOpacity>
  );

  const EmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon name="people-outline" size={90} color="#D1D5DB" />

      <Text style={styles.emptyTitle}>No Students Found</Text>

      <Text style={styles.emptySubtitle}>
        Students will appear here once added
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />

      {/* Header */}
      <LinearGradient
        colors={['#4F46E5', '#7C3AED', '#9333EA']}
        style={styles.header}
      >
        <View style={styles.circleOne} />
        <View style={styles.circleTwo} />

        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.headerTopTitle}>Students</Text>

          <View style={styles.placeholder} />
        </View>

        <View style={styles.iconWrapper}>
          <Icon name="people" size={42} color="#FFF" />
        </View>

        <Text style={styles.headerTitle}>Student Directory</Text>

        <Text style={styles.headerSubtitle}>View and manage all students</Text>
      </LinearGradient>

      {/* Stats Card */}
      <View style={styles.statsCard}>
        <Text style={styles.statsNumber}>{filteredStudents.length}</Text>

        <Text style={styles.statsLabel}>Total Students</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Icon name="search" size={20} color="#9CA3AF" />

        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search students..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
        />
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={filteredStudents}
          keyExtractor={item => item._id?.toString()}
          renderItem={renderStudent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={EmptyComponent}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 120,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default StudentListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  header: {
    padding: 20,
    paddingBottom: 45,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    overflow: 'hidden',
  },

  circleOne: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -50,
    right: -40,
  },

  circleTwo: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -30,
    left: -20,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTopTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },

  placeholder: {
    width: 45,
  },

  iconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },

  headerTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 15,
  },

  headerSubtitle: {
    color: '#E5E7EB',
    textAlign: 'center',
    marginTop: 5,
  },

  statsCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: -25,
    borderRadius: 20,
    padding: 18,
    alignItems: 'center',
    elevation: 6,
  },

  statsNumber: {
    fontSize: 30,
    fontWeight: '800',
    color: '#4F46E5',
  },

  statsLabel: {
    color: '#6B7280',
    marginTop: 4,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 16,
    paddingHorizontal: 15,
    elevation: 3,
  },

  searchInput: {
    flex: 1,
    height: 55,
    marginLeft: 10,
    color: '#111827',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    elevation: 4,
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

  avatarText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 20,
  },

  studentInfo: {
    flex: 1,
  },

  studentName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },

  infoText: {
    marginLeft: 6,
    color: '#6B7280',
    fontSize: 13,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#374151',
    marginTop: 15,
  },

  emptySubtitle: {
    color: '#6B7280',
    marginTop: 8,
  },
});
