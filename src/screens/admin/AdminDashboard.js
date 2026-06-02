import React, { useEffect, useState } from 'react';

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import Icon from 'react-native-vector-icons/Ionicons';

import DashboardCard from '../../components/DashboardCard';

import { getDashboardAnalyticsAPI } from '../../api/analytics.api';
import { useNavigation } from '@react-navigation/native';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);
  const navigation = useNavigation();
  const loadData = async () => {
    setLoading(true);
    try {
      const response = await getDashboardAnalyticsAPI();

      setAnalytics(response.data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* HERO SECTION */}
        <LinearGradient colors={['#5B67F1', '#7B61FF']} style={styles.heroCard}>
          <View style={styles.heroTop}>
            <View>
              <Text style={styles.welcomeText}>Welcome Back 👋</Text>
              <Text style={styles.adminText}>Admin Dashboard</Text>
            </View>

            <View style={styles.profileCircle}>
              <Icon name="person" size={26} color="#2b62ed" />
            </View>
          </View>
        </LinearGradient>

        {loading ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Loading Dashboard...</Text>
          </View>
        ) : (
          <>
            {/* OVERVIEW */}
            <View style={styles.sectionRow}>
              <Text style={styles.title}>Overview</Text>

              <TouchableOpacity onPress={() => navigation.navigate('Modules')}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>

            {/* ANALYTICS GRID */}
            <View style={styles.grid}>
              <TouchableOpacity
                style={styles.cardWrapper}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('ManageStudents')}
              >
                <DashboardCard
                  title="Students"
                  value={analytics.totalStudents || 0}
                  icon="people"
                  colors={['#4F46E5', '#6366F1']}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cardWrapper}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('ManageClassroom')}
              >
                <DashboardCard
                  title="Classrooms"
                  value={analytics.totalClassrooms || 0}
                  icon="school"
                  colors={['#0EA5E9', '#38BDF8']}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cardWrapper}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('ManageExams')}
              >
                <DashboardCard
                  title="Exams"
                  value={analytics.totalExams || 0}
                  icon="document-text"
                  colors={['#10B981', '#34D399']}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.cardWrapper}
                activeOpacity={0.9}
                onPress={() => navigation.navigate('ManageAttempts')}
              >
                <DashboardCard
                  title="Attempts"
                  value={analytics.totalAttempts || 0}
                  icon="analytics"
                  colors={['#F59E0B', '#FBBF24']}
                />
              </TouchableOpacity>
            </View>

            {/* QUICK ACTIONS */}
            <View style={styles.sectionRow}>
              <Text style={styles.title}>Quick Actions</Text>

              <TouchableOpacity onPress={() => navigation.navigate('Modules')}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.quickGrid}>
              <TouchableOpacity style={styles.quickCard}>
                <Icon name="add-circle" size={30} color="#5B67F1" />
                <Text style={styles.quickText}>Create Exam</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickCard}>
                <Icon name="people" size={30} color="#5B67F1" />
                <Text style={styles.quickText}>Add Student</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickCard}>
                <Icon name="bar-chart" size={30} color="#5B67F1" />
                <Text style={styles.quickText}>Analytics</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickCard}>
                <Icon name="settings" size={30} color="#5B67F1" />
                <Text style={styles.quickText}>Settings</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FE',
  },

  heroCard: {
    margin: 20,
    borderRadius: 30,
    padding: 24,
    paddingBottom: 30,
  },

  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  welcomeText: {
    color: '#E0E7FF',
    fontSize: 15,
  },

  adminText: {
    color: '#FFF',
    fontSize: 25,
    fontWeight: '800',
    marginTop: 6,
  },

  profileCircle: {
    width: 55,
    height: 55,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  heroStats: {
    flexDirection: 'row',
    marginTop: 30,
  },

  statBox: {
    marginRight: 30,
  },

  statValue: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '800',
  },

  statLabel: {
    color: '#E0E7FF',
    marginTop: 4,
    fontSize: 15,
  },

  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 18,
  },

  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    marginHorizontal: 10,
    marginBottom: 18,
    marginTop: 10,
  },

  viewAll: {
    color: '#5B67F1',
    fontWeight: '700',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },

  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 120,
  },

  quickCard: {
    width: '47%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    paddingVertical: 28,
    alignItems: 'center',
    marginBottom: 18,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 5,
    },

    shadowOpacity: 0.08,

    shadowRadius: 10,

    elevation: 6,
  },

  quickText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  cardWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  loaderContainer: {
    flex: 1,
    marginTop: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },

  loadingText: {
    marginTop: 10,
    fontSize: 15,
    color: '#64748B',
    fontWeight: '600',
  },
});
