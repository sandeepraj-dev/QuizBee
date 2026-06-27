import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import API from '../../api/axios';
import { useNavigation } from '@react-navigation/native';
import { authStore } from '../../store/authStore';
export default function StudentDashboard() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [student, setStudent] = useState({});
  const [classrooms, setClassrooms] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [user, setUser] = useState([]);
  useEffect(() => {
    loadDashboard();
  }, []);
  const logout = authStore(state => state.logout);
  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [classroomRes, attemptsRes, user] = await Promise.all([
        API.get('/student/my-classrooms'),
        API.get('/student/attempts'),
        API.get('/auth/me'),
      ]);

      setClassrooms(classroomRes?.data?.data || []);
      setAttempts(attemptsRes?.data?.data || []);
      setUser(user?.data?.user || []);

      // Get profile from token/user API if available
      const userData = attemptsRes?.data?.user || {
        fullName: 'Student',
      };
      setStudent(userData);
    } catch (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed to load dashboard',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await loadDashboard();

    setRefreshing(false);
  }, []);
  console.log(user?.fullName);
  const averageScore =
    attempts.length > 0
      ? Math.round(
          attempts.reduce((sum, item) => sum + (item.score || 0), 0) /
            attempts.length,
        )
      : 0;

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <LinearGradient
          colors={['#4F46E5', '#7C3AED', '#9333EA']}
          style={styles.header}
        >
          <View style={styles.circle1} />
          <View style={styles.circle2} />

          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.fullName?.charAt(0)?.toUpperCase() || 'S'}
              </Text>
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.welcomeText}>Welcome Back 👋</Text>

              <Text style={styles.nameText}>{user?.fullName || 'Student'}</Text>
            </View>

            <TouchableOpacity
              style={styles.notificationButton}
              onPress={() => logout()}
            >
              <Icon name="log-out-outline" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{classrooms.length}</Text>

              <Text style={styles.statLabel}>Classrooms</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{attempts.length}</Text>

              <Text style={styles.statLabel}>Exams</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{averageScore}</Text>

              <Text style={styles.statLabel}>Avg Score</Text>
            </View>
          </View>
        </LinearGradient>

        {/* QUICK ACTION */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>

          <TouchableOpacity
            activeOpacity={0.9}
            style={styles.actionCard}
            onPress={() => navigation.navigate('SelectClassroomScreen')}
          >
            <LinearGradient
              colors={['#4F46E5', '#6366F1']}
              style={styles.actionIcon}
            >
              <Icon name="book-outline" size={28} color="#FFF" />
            </LinearGradient>

            <View style={{ flex: 1 }}>
              <Text style={styles.actionTitle}>Attempt Exams</Text>

              <Text style={styles.actionSubTitle}>
                Choose classroom and start exam
              </Text>
            </View>

            <Icon name="chevron-forward" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* CLASSROOMS */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>My Classrooms</Text>

          {classrooms.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="school-outline" size={60} color="#CBD5E1" />

              <Text style={styles.emptyText}>No classrooms assigned</Text>
            </View>
          ) : (
            classrooms.map(item => (
              <TouchableOpacity
                key={item._id}
                style={styles.classroomCard}
                activeOpacity={0.9}
                onPress={() =>
                  navigation.navigate('SelectExamScreen', {
                    classroomId: item._id,
                    classroomName: item.name,
                  })
                }
              >
                <View style={styles.classroomIcon}>
                  <Icon name="library-outline" size={24} color="#4F46E5" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.classroomName}>{item.name}</Text>

                  <Text style={styles.classroomDesc}>
                    {item.description || 'Learning Classroom'}
                  </Text>
                </View>

                <Icon name="chevron-forward" size={22} color="#9CA3AF" />
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* RECENT ATTEMPTS */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Recent Results</Text>
          {attempts.length === 0 ? (
            <Text style={styles.noAttemptText}>No exam attempts yet</Text>
          ) : (
            attempts.slice(0, 5).map(item => (
              <TouchableOpacity
                key={item._id}
                style={styles.resultCard}
                onPress={() =>
                  navigation.navigate('ResultScreen', {
                    attemptId: item._id,
                    result: attempts || {},
                    exam: null,
                  })
                }
              >
                <View>
                  <Text style={styles.examTitle}>
                    {item?.examId?.title || 'Exam'}
                  </Text>

                  <Text style={styles.dateText}>
                    {new Date(item.createdAt).toLocaleDateString()}
                  </Text>
                </View>

                <View style={styles.scoreBadge}>
                  <Text style={styles.scoreText}>{item.score}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    padding: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    overflow: 'hidden',
  },

  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 55,
    height: 55,
    borderRadius: 27,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  avatarText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 20,
  },

  welcomeText: {
    color: '#E5E7EB',
    fontSize: 14,
  },

  nameText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
  },

  notificationButton: {
    width: 45,
    height: 45,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 25,
  },

  statCard: {
    flex: 1,
    marginHorizontal: 5,
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
  },

  statValue: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
  },

  statLabel: {
    color: '#E5E7EB',
    marginTop: 4,
    fontSize: 12,
  },

  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 24,
    padding: 18,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 15,
  },

  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionIcon: {
    width: 55,
    height: 55,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  actionSubTitle: {
    color: '#6B7280',
    marginTop: 3,
  },

  classroomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#F3F4F6',
  },

  classroomIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  classroomName: {
    fontWeight: '700',
    color: '#111827',
    fontSize: 15,
  },

  classroomDesc: {
    color: '#6B7280',
    marginTop: 3,
  },

  resultCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },

  examTitle: {
    fontWeight: '700',
    color: '#111827',
  },

  dateText: {
    color: '#6B7280',
    marginTop: 4,
  },

  scoreBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },

  scoreText: {
    color: '#15803D',
    fontWeight: '700',
  },

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  emptyText: {
    marginTop: 10,
    color: '#6B7280',
  },

  noAttemptText: {
    color: '#6B7280',
  },

  circle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -40,
    right: -40,
  },

  circle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -20,
    left: -20,
  },
});
