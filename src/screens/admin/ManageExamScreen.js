import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Alert,
  StatusBar,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

import API from '../../api/axios';

export default function ManageExamScreen() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [exams, setExams] = useState([]);

  useFocusEffect(
    useCallback(() => {
      loadExams();
    }, []),
  );

  const loadExams = async () => {
    try {
      setLoading(true);

      const response = await API.get('/exams');

      const data = response?.data?.data || response?.data || [];

      setExams(data);
    } catch (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        text1: 'Failed to load exams',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadExams();
  };

  const handleDelete = id => {
    Alert.alert('Delete Exam', 'Are you sure you want to delete this exam?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await API.delete(`/exams/${id}`);

            Toast.show({
              type: 'success',
              text1: 'Exam deleted successfully',
            });

            loadExams();
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: 'Delete failed',
            });
          }
        },
      },
    ]);
  };

  const handleEdit = item => {
    navigation.navigate('CreateExam', {
      isEdit: true,
      exam: item,
    });
  };

  const filteredExams = exams.filter(item =>
    item?.title?.toLowerCase()?.includes(search.toLowerCase()),
  );

  const totalExams = exams.length;

  const publishedCount = exams.filter(x => x.isPublished).length;

  const draftCount = exams.filter(x => !x.isPublished).length;
  const handlePublish = async (id, isPublished) => {
    try {
      await API.patch(`/exams/${id}/publish`),
        {
          isPublished: isPublished,
        };

      Toast.show({
        type: 'success',
        text1: `Exam ${isPublished ? 'published' : 'unpublished'} successfully`,
      });

      loadExams();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Publish failed',
      });
    }
  };

  const renderExam = ({ item }) => {
    const classroomName =
      item?.classroomId?.name || item?.classroomName || 'Classroom';
    return (
      <View style={styles.examCard}>
        <View style={styles.examHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.examTitle}>{item.title}</Text>

            <Text style={styles.classroomName}>{classroomName}</Text>
          </View>

          <View
            style={[
              styles.statusChip,
              {
                backgroundColor: item.isPublished ? '#DCFCE7' : '#FEF3C7',
              },
            ]}
          >
            <Text
              style={{
                color: item.isPublished ? '#16A34A' : '#D97706',
                fontWeight: '700',
                alignSelf: 'center',
                alignContent: 'center',
                marginTop: 7,
              }}
            >
              {item.isPublished ? 'Published' : 'unpublished'}
            </Text>
          </View>
        </View>

        {item.description ? (
          <Text style={styles.description}>{item.description}</Text>
        ) : null}

        <View style={styles.infoRow}>
          <View style={styles.infoChip}>
            <Icon name="time-outline" size={16} color="#4F46E5" />
            <Text style={styles.infoText}>{item.duration} mins</Text>
          </View>

          <View style={styles.infoChip}>
            <Icon name="trophy-outline" size={16} color="#F59E0B" />
            <Text style={styles.infoText}>{item.totalMarks} Marks</Text>
          </View>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => handleEdit(item)}
          >
            <Icon name="create-outline" size={18} color="#FFF" />

            <Text style={styles.btnText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.publishButton}
            onPress={() => handlePublish(item._id, !item.isPublished)}
          >
            <Icon name="cloud-upload-outline" size={18} color="#FFF" />

            <Text style={styles.btnText}>
              {item.isPublished ? 'Unpublish' : 'Publish'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDelete(item._id)}
          >
            <Icon name="trash-outline" size={18} color="#FFF" />

            <Text style={styles.btnText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Icon name="document-text-outline" size={80} color="#D1D5DB" />

      <Text style={styles.emptyTitle}>No Exams Found</Text>

      <Text style={styles.emptySubTitle}>
        Create your first exam to get started.
      </Text>

      <TouchableOpacity
        style={styles.createExamBtn}
        onPress={() => navigation.navigate('CreateExam')}
      >
        <Text style={styles.createExamText}>Create Exam</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />

      <LinearGradient
        colors={['#4F46E5', '#7C3AED', '#9333EA']}
        style={styles.header}
      >
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
          {/* 
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('CreateExam')}
          >
            <Icon name="add" size={28} color="#FFF" />
          </TouchableOpacity> */}
        </View>

        <View style={styles.iconBox}>
          <Icon name="document-text" size={42} color="#FFF" />
        </View>

        <Text style={styles.headerTitle}>Manage Exams</Text>

        <Text style={styles.headerSubtitle}>
          Create, update and manage exams
        </Text>
      </LinearGradient>

      {/* <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{totalExams}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{publishedCount}</Text>
          <Text style={styles.statLabel}>Published</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{draftCount}</Text>
          <Text style={styles.statLabel}>Draft</Text>
        </View>
      </View> */}

      <View style={styles.searchBox}>
        <Icon name="search" size={20} color="#9CA3AF" />

        <TextInput
          placeholder="Search exams..."
          placeholderTextColor="#9CA3AF"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('CreateExam')}
      >
        <LinearGradient
          colors={['#4F46E5', '#7C3AED']}
          style={styles.fabGradient}
        >
          <Icon name="add" size={20} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={filteredExams}
          keyExtractor={item => item._id}
          renderItem={renderExam}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 120,
          }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmpty}
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

  header: {
    padding: 20,
    paddingBottom: 40,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    overflow: 'hidden',
  },

  circle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.08)',
    right: -50,
    top: -50,
  },

  circle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 80,
    backgroundColor: 'rgba(255,255,255,0.08)',
    left: -20,
    bottom: -20,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  headerButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconBox: {
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
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

  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: -25,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#FFF',
    marginHorizontal: 5,
    padding: 15,
    borderRadius: 18,
    alignItems: 'center',
    elevation: 4,
  },

  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },

  statLabel: {
    color: '#6B7280',
    marginTop: 4,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    margin: 20,
    marginBottom: 10,
    borderRadius: 16,
    paddingHorizontal: 15,
    elevation: 3,
  },

  searchInput: {
    flex: 1,
    height: 55,
    marginLeft: 10,
  },

  examCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 18,
    marginBottom: 16,
    elevation: 4,
  },

  examHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  examTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  classroomName: {
    color: '#6B7280',
    marginTop: 5,
  },

  description: {
    color: '#6B7280',
    marginTop: 10,
  },

  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  infoRow: {
    flexDirection: 'row',
    marginTop: 15,
  },

  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },

  infoText: {
    marginLeft: 5,
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 20,
  },

  editButton: {
    flex: 1,
    backgroundColor: '#4F46E5',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 8,
  },

  deleteButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  btnText: {
    color: '#FFF',
    marginLeft: 6,
    fontWeight: '700',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 80,
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 20,
  },

  emptySubTitle: {
    color: '#6B7280',
    marginTop: 10,
    textAlign: 'center',
  },

  createExamBtn: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 20,
  },

  createExamText: {
    color: '#FFF',
    fontWeight: '700',
  },
  publishButton: {
    marginRight: 10,
    flex: 1,
    backgroundColor: '#10B981',
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
});
