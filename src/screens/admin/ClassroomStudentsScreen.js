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

  const renderStudent = ({ item, index }) => (
    <View style={styles.studentCard}>
      <LinearGradient colors={['#6366F1', '#7C3AED']} style={styles.avatar}>
        <Text style={styles.avatarText}>
          {(item.fullName || 'S').charAt(0).toUpperCase()}
        </Text>
      </LinearGradient>

      <View style={{ flex: 1 }}>
        <Text style={styles.studentName}>{item.fullName}</Text>

        <View style={styles.infoRow}>
          <Icon name="mail-outline" size={15} color="#6B7280" />

          <Text style={styles.studentInfo}>{item.email}</Text>
        </View>

        <View style={styles.infoRow}>
          <Icon name="call-outline" size={15} color="#6B7280" />

          <Text style={styles.studentInfo}>{item.phone}</Text>
        </View>
      </View>

      {/* <View style={styles.numberBadge}>
        <Text style={styles.numberText}>{index + 1}</Text>
      </View> */}
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
            <View>
              <Text style={styles.countLabel}>Total Students</Text>

              <Text style={styles.countNumber}>{students.length}</Text>
            </View>

            <View style={styles.countIcon}>
              <Icon name="people" color="#4F46E5" size={26} />
            </View>
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
            style={{ flex: 1 }}
            contentContainerStyle={{
              paddingBottom: 30,
              flexGrow: 1,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            ListEmptyComponent={
              selectedClassroom ? (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIcon}>
                    <Icon name="people-outline" size={70} color="#A5B4FC" />
                  </View>

                  <Text style={styles.emptyTitle}>No Students Listed</Text>

                  <Text style={styles.emptySubtitle}>
                    There are no students enrolled in this classroom yet.
                  </Text>
                </View>
              ) : (
                <View style={styles.emptyContainer}>
                  <View style={styles.emptyIcon}>
                    <Icon name="school-outline" size={70} color="#A5B4FC" />
                  </View>

                  <Text style={styles.emptyTitle}>Select a Classroom</Text>

                  <Text style={styles.emptySubtitle}>
                    Choose a classroom to view students.
                  </Text>
                </View>
              )
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
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
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
    marginVertical: 18,
    backgroundColor: '#FFF',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },

  countLabel: {
    color: '#6B7280',
    fontSize: 13,
  },

  countNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#4F46E5',
    marginTop: 4,
  },

  countIcon: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  studentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 14,
    padding: 16,
    borderRadius: 20,
    elevation: 3,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },

  avatarText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 22,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },

  studentInfo: {
    color: '#6B7280',
    marginLeft: 8,
    fontSize: 13,
  },

  studentName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  numberBadge: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  numberText: {
    color: '#4F46E5',
    fontWeight: '800',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },

  emptyIcon: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTitle: {
    marginTop: 22,
    fontSize: 22,
    fontWeight: '700',
    color: '#374151',
  },

  emptySubtitle: {
    marginTop: 10,
    textAlign: 'center',
    color: '#9CA3AF',
    paddingHorizontal: 40,
    lineHeight: 22,
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
