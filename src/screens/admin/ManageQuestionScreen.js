import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Modal,
  ActivityIndicator,
  Alert,
  RefreshControl,
  StatusBar,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

import { useNavigation, useFocusEffect } from '@react-navigation/native';

import API from '../../api/axios';

export default function ManageQuestionScreen() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [classrooms, setClassrooms] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [selectedClassroom, setSelectedClassroom] = useState(null);

  const [showClassroomModal, setShowClassroomModal] = useState(false);

  useEffect(() => {
    loadClassrooms();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (selectedClassroom?._id) {
        loadQuestions(selectedClassroom._id);
      }
    }, [selectedClassroom]),
  );

  const loadClassrooms = async () => {
    try {
      setLoading(true);

      const response = await API.get('/classrooms');

      const data =
        response?.data?.data ||
        response?.data?.classrooms ||
        response?.data ||
        [];

      setClassrooms(data);

      if (data.length > 0) {
        setSelectedClassroom(data[0]);
        loadQuestions(data[0]._id);
      }
    } catch (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        text1: 'Failed to load classrooms',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadQuestions = async classroomId => {
    try {
      setLoading(true);

      const response = await API.get(`/questions/classroom/${classroomId}`);

      const data = response?.data?.data || response?.data || [];

      setQuestions(data);
    } catch (error) {
      console.log(error);

      setQuestions([]);

      Toast.show({
        type: 'error',
        text1: 'Failed to load questions',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);

    if (selectedClassroom?._id) {
      loadQuestions(selectedClassroom._id);
    }
  };
  const deleteQuestion = question => {
    Alert.alert(
      'Delete Question',
      'Are you sure you want to delete this question?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await API.delete(`/questions/${question._id}`);

              Toast.show({
                type: 'success',
                text1: 'Question Deleted',
              });

              setQuestions(prev =>
                prev.filter(item => item._id !== question._id),
              );
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: error?.response?.data?.message || 'Delete failed',
              });
            }
          },
        },
      ],
    );
  };
  const deleteAllQuestions = () => {
    if (!selectedClassroom?._id) {
      return;
    }

    Alert.alert(
      'Delete Questions',
      'Are you sure you want to delete all questions in this classroom?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);

              await API.delete(`/questions/classroom/${selectedClassroom._id}`);

              Toast.show({
                type: 'success',
                text1: 'Questions Deleted',
              });

              loadQuestions(selectedClassroom._id);
            } catch (error) {
              console.log(error);

              Toast.show({
                type: 'error',
                text1: error?.response?.data?.message || 'Delete Failed',
              });
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const navigateToCreate = () => {
    navigation.navigate('CreateQuestion', {
      classroom: selectedClassroom,
      questions,
    });
  };

  const navigateToEdit = question => {
    navigation.navigate('CreateQuestion', {
      isEdit: true,
      classroom: selectedClassroom,
      questions,
      editQuestion: question,
    });
  };

  const renderQuestion = ({ item, index }) => {
    return (
      <View style={styles.questionCard}>
        <View style={styles.questionTop}>
          <View style={styles.questionBadge}>
            <Text style={styles.questionBadgeText}>Q{index + 1}</Text>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => navigateToEdit(item)}
              style={{ marginRight: 15 }}
            >
              <Icon name="create-outline" size={24} color="#4F46E5" />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => deleteQuestion(item)}>
              <Icon name="trash-outline" size={24} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.questionTitle}>{item.question}</Text>

        <View style={styles.optionBox}>
          <Text style={styles.optionText}>A. {item.options?.[0]}</Text>
        </View>

        <View style={styles.optionBox}>
          <Text style={styles.optionText}>B. {item.options?.[1]}</Text>
        </View>

        <View style={styles.optionBox}>
          <Text style={styles.optionText}>C. {item.options?.[2]}</Text>
        </View>

        <View style={styles.optionBox}>
          <Text style={styles.optionText}>D. {item.options?.[3]}</Text>
        </View>

        <View style={styles.answerContainer}>
          <Icon name="checkmark-circle" size={18} color="#10B981" />

          <Text style={styles.answerText}>Answer: {item.answer}</Text>
        </View>
      </View>
    );
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />

      {/* HEADER */}
      <LinearGradient
        colors={['#4F46E5', '#7C3AED', '#9333EA']}
        style={styles.header}
      >
        <View style={styles.circleOne} />
        <View style={styles.circleTwo} />

        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={22} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Manage Questions</Text>

          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={deleteAllQuestions}
          >
            <Icon name="trash-outline" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.headerCenter}>
          <View style={styles.headerIcon}>
            <Icon name="help-circle" size={42} color="#FFF" />
          </View>

          <Text style={styles.screenTitle}>Question Bank</Text>

          <Text style={styles.screenSubtitle}>Manage classroom questions</Text>
        </View>
      </LinearGradient>

      {/* CLASSROOM CARD */}
      <TouchableOpacity
        style={styles.classroomCard}
        onPress={() => setShowClassroomModal(true)}
      >
        <View>
          <Text style={styles.cardLabel}>Selected Classroom</Text>

          <Text style={styles.classroomName}>
            {selectedClassroom?.name || 'Select Classroom'}
          </Text>
        </View>

        <Icon name="chevron-down" size={24} color="#4F46E5" />
      </TouchableOpacity>

      {/* STATS */}
      <View style={styles.statsCard}>
        <Text style={styles.statsCount}>{questions.length}</Text>

        <Text style={styles.statsText}>Total Questions</Text>
      </View>

      {/* CONTENT */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <FlatList
          data={questions}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={renderQuestion}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 120,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Icon name="document-text-outline" size={90} color="#CBD5E1" />

              <Text style={styles.emptyTitle}>No Questions Found</Text>

              <Text style={styles.emptySubtitle}>
                Add questions to this classroom
              </Text>
            </View>
          )}
        />
      )}

      {/* FLOATING ADD BUTTON */}
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.fab}
        onPress={navigateToCreate}
      >
        <LinearGradient
          colors={['#4F46E5', '#7C3AED']}
          style={styles.fabGradient}
        >
          <Icon name="add" size={30} color="#FFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* CLASSROOM MODAL */}
      <Modal visible={showClassroomModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Classroom</Text>

            <FlatList
              data={classrooms}
              keyExtractor={item => item._id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.classroomItem}
                  onPress={() => {
                    setSelectedClassroom(item);
                    setShowClassroomModal(false);

                    loadQuestions(item._id);
                  }}
                >
                  <Text style={styles.classroomItemText}>{item.name}</Text>

                  {selectedClassroom?._id === item._id && (
                    <Icon name="checkmark-circle" size={22} color="#10B981" />
                  )}
                </TouchableOpacity>
              )}
            />

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
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    overflow: 'hidden',
  },
  deleteItemBtn: {
    flex: 1,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  circleOne: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -40,
    right: -30,
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

  backBtn: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteBtn: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
  },

  headerCenter: {
    alignItems: 'center',
    marginTop: 20,
  },

  headerIcon: {
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  screenTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 15,
  },

  screenSubtitle: {
    color: '#E5E7EB',
    marginTop: 6,
  },

  classroomCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 20,
    padding: 18,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  cardLabel: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },

  classroomName: {
    color: '#111827',
    fontSize: 17,
    fontWeight: '800',
    marginTop: 4,
  },

  statsCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 3,
  },

  statsCount: {
    color: '#4F46E5',
    fontSize: 32,
    fontWeight: '800',
  },

  statsText: {
    color: '#64748B',
    marginTop: 4,
    fontWeight: '500',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  questionCard: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  questionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  questionBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  questionBadgeText: {
    color: '#4F46E5',
    fontWeight: '700',
  },

  questionTitle: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 15,
    lineHeight: 22,
  },

  optionBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },

  optionText: {
    color: '#475569',
    fontSize: 14,
  },

  answerContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },

  answerText: {
    color: '#10B981',
    marginLeft: 6,
    fontWeight: '700',
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

  fab: {
    position: 'absolute',
    bottom: 25,
    right: 20,
  },

  fabGradient: {
    width: 65,
    height: 65,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '75%',
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 20,
  },

  classroomItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  classroomItemText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
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
});
