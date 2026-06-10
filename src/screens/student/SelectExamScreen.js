import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useNavigation, useRoute } from '@react-navigation/native';

import API from '../../api/axios';

export default function SelectExamScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { classroomId, classroomName } = route.params;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState('');
  const [exams, setExams] = useState([]);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      setLoading(true);

      const response = await API.get(`/student/classroom/${classroomId}/exams`);

      setExams(response?.data?.data || []);
    } catch (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        text1: 'Failed to load exams',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadExams();
    setRefreshing(false);
  }, []);

  const filteredExams = exams.filter(item =>
    item?.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const renderExam = ({ item }) => {
    return (
      <TouchableOpacity activeOpacity={0.9} style={styles.examCard}>
        <View style={styles.examHeader}>
          <LinearGradient
            colors={['#EEF2FF', '#E0E7FF']}
            style={styles.examIcon}
          >
            <Icon name="document-text-outline" size={28} color="#4F46E5" />
          </LinearGradient>

          <View style={{ flex: 1 }}>
            <Text style={styles.examTitle}>{item.title}</Text>

            <Text style={styles.examDescription}>{item.description}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoBox}>
            <Icon name="time-outline" size={18} color="#6366F1" />

            <Text style={styles.infoText}>{item.duration} Min</Text>
          </View>

          <View style={styles.infoBox}>
            <Icon name="trophy-outline" size={18} color="#10B981" />

            <Text style={styles.infoText}>{item.totalMarks} Marks</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.startButton}
          onPress={() =>
            navigation.navigate('AttemptExamScreen', {
              examId: item._id,
              examTitle: item.title,
            })
          }
        >
          <LinearGradient
            colors={['#4F46E5', '#7C3AED']}
            style={styles.buttonGradient}
          >
            <Icon name="play-circle-outline" size={22} color="#FFF" />

            <Text style={styles.buttonText}>Start Exam</Text>
          </LinearGradient>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

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

      {/* HEADER */}

      <LinearGradient
        colors={['#4F46E5', '#7C3AED', '#9333EA']}
        style={styles.header}
      >
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>

        <View style={styles.headerIcon}>
          <Icon name="reader-outline" size={42} color="#FFF" />
        </View>

        <Text style={styles.headerTitle}>Available Exams</Text>

        <Text style={styles.headerSubtitle}>{classroomName}</Text>
      </LinearGradient>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={22} color="#9CA3AF" />

        <TextInput
          style={styles.searchInput}
          placeholder="Search exam..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {filteredExams.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="document-outline" size={80} color="#CBD5E1" />

          <Text style={styles.emptyTitle}>No Exams Available</Text>

          <Text style={styles.emptySubtitle}>No published exams found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredExams}
          keyExtractor={item => item._id}
          renderItem={renderExam}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 40,
          }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
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
    paddingBottom: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    overflow: 'hidden',
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerIcon: {
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 15,
  },

  headerSubtitle: {
    color: '#E5E7EB',
    textAlign: 'center',
    marginTop: 6,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    paddingHorizontal: 15,
    height: 55,
    elevation: 3,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#111827',
  },

  examCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
  },

  examHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  examIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  examTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  examDescription: {
    color: '#6B7280',
    marginTop: 4,
  },

  infoRow: {
    flexDirection: 'row',
    marginBottom: 18,
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 25,
  },

  infoText: {
    marginLeft: 6,
    color: '#374151',
    fontWeight: '600',
  },

  startButton: {
    overflow: 'hidden',
    borderRadius: 16,
  },

  buttonGradient: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
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
    color: '#111827',
  },

  emptySubtitle: {
    marginTop: 6,
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
