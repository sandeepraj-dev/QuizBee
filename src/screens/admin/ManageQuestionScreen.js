import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Modal,
  StatusBar,
  Alert,
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
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);

  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);

  const [showClassroomModal, setShowClassroomModal] = useState(false);
  const [showExamModal, setShowExamModal] = useState(false);

  const [loadingExams, setLoadingExams] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  useEffect(() => {
    loadClassrooms();
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (selectedExam?._id) {
        loadQuestions(selectedExam._id);
      }
    }, [selectedExam]),
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

        await loadExams(data[0]._id);
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

  const loadExams = async classroomId => {
    try {
      setLoadingExams(true);

      setSelectedExam(null);
      setQuestions([]);

      const response = await API.get(`/exams/classroom/${classroomId}`);

      const data = response?.data?.data || response?.data || [];

      setExams(data);
    } catch (error) {
      console.log(error);

      setExams([]);

      Toast.show({
        type: 'error',
        text1: 'Failed to load exams',
      });
    } finally {
      setLoadingExams(false);
    }
  };

  const loadQuestions = async examId => {
    try {
      setLoading(true);

      const response = await API.get(`/questions/exam/${examId}`);

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

    if (selectedExam?._id) {
      loadQuestions(selectedExam._id);
    } else {
      setRefreshing(false);
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
    if (!selectedExam?._id) {
      return;
    }

    Alert.alert('Delete Questions', 'Delete all questions from this exam?', [
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

            await API.delete(`/questions/exam/${selectedExam._id}`);

            Toast.show({
              type: 'success',
              text1: 'Questions Deleted',
            });

            loadQuestions(selectedExam._id);
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: error?.response?.data?.message || 'Delete failed',
            });
          } finally {
            setLoading(false);
          }
        },
      },
    ]);
  };

  const navigateToCreate = () => {
    navigation.navigate('CreateQuestion', {
      classroom: selectedClassroom,
      exam: selectedExam,
      questions,
    });
  };

  const navigateToEdit = question => {
    navigation.navigate('CreateQuestion', {
      isEdit: true,
      classroom: selectedClassroom,
      exam: selectedExam,
      questions,
      editQuestion: question,
    });
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

          <View style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              style={[styles.deleteBtn, { marginRight: 10 }]}
              onPress={() => setShowFilters(!showFilters)}
            >
              <Icon
                name={showFilters ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#FFF"
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.deleteBtn}
              onPress={deleteAllQuestions}
            >
              <Icon name="trash-outline" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headerCenter}>
          {/* <View style={styles.headerIcon}>
            <Icon name="help-circle" size={42} color="#FFF" />
          </View> */}

          <Text style={styles.screenTitle}>Question Bank</Text>

          <Text style={styles.screenSubtitle}>
            Manage exam questions efficiently
          </Text>
        </View>
      </LinearGradient>
      {showFilters && (
        <>
          {/* CLASSROOM SELECTOR */}
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

          {/* EXAM SELECTOR */}
          <TouchableOpacity
            style={styles.classroomCard}
            disabled={loadingExams}
            onPress={() => {
              if (exams.length > 0) {
                setShowExamModal(true);
              }
            }}
          >
            <View>
              <Text style={styles.cardLabel}>Selected Exam</Text>

              <Text style={styles.classroomName}>
                {selectedExam?.title || 'Select Exam'}
              </Text>
            </View>

            {loadingExams ? (
              <ActivityIndicator color="#4F46E5" />
            ) : (
              <Icon name="chevron-down" size={24} color="#4F46E5" />
            )}
          </TouchableOpacity>
        </>
      )}
      {/* STATS CARD */}
      {/* <View style={styles.statsCard}>
        <Text style={styles.statsCount}>{questions.length}</Text>

        <Text style={styles.statsText}>Total Questions</Text>
      </View>{' '} */}
      {/* QUESTIONS LIST */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />

          <Text style={styles.loadingText}>Loading Questions...</Text>
        </View>
      ) : (
        <FlatList
          data={questions}
          keyExtractor={(item, index) => item._id || index.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.questionCard}>
              <View style={styles.questionTop}>
                <View style={styles.questionBadge}>
                  <Text style={styles.questionBadgeText}>Q{index + 1}</Text>
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => navigateToEdit(item)}
                    style={{
                      marginRight: 15,
                    }}
                  >
                    <Icon name="create-outline" size={24} color="#4F46E5" />
                  </TouchableOpacity>

                  <TouchableOpacity onPress={() => deleteQuestion(item)}>
                    <Icon name="trash-outline" size={24} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.questionTitle}>{item.question}</Text>

              {item.options?.map((option, optionIndex) => (
                <View key={optionIndex} style={styles.optionBox}>
                  <Text style={styles.optionText}>
                    {String.fromCharCode(65 + optionIndex)}. {option}
                  </Text>
                </View>
              ))}

              <View style={styles.answerContainer}>
                <Icon name="checkmark-circle" size={18} color="#10B981" />

                <Text style={styles.answerText}>Answer: {item.answer}</Text>
              </View>

              <View style={styles.marksContainer}>
                <Icon name="trophy" size={16} color="#F59E0B" />

                <Text style={styles.marksText}>Marks: {item.marks}</Text>
              </View>
            </View>
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 140,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Icon name="document-text-outline" size={100} color="#CBD5E1" />

              <Text style={styles.emptyTitle}>No Questions Found</Text>

              <Text style={styles.emptySubtitle}>
                Select an exam and add questions
              </Text>
            </View>
          )}
        />
      )}
      {/* FLOATING BUTTON */}
      {selectedExam && (
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
      )}
      {/* CLASSROOM MODAL */}
      <Modal visible={showClassroomModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Classroom</Text>

            <FlatList
              data={classrooms}
              keyExtractor={item => item._id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 20,
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.classroomItem}
                  onPress={() => {
                    setSelectedClassroom(item);

                    setSelectedExam(null);

                    setQuestions([]);

                    setShowClassroomModal(false);

                    loadExams(item._id);
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
      {/* EXAM MODAL */}
      <Modal visible={showExamModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Exam</Text>

            <FlatList
              data={exams}
              keyExtractor={item => item._id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                paddingBottom: 20,
              }}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.classroomItem}
                  onPress={() => {
                    setSelectedExam(item);

                    setShowExamModal(false);

                    loadQuestions(item._id);
                  }}
                >
                  <View>
                    <Text style={styles.classroomItemText}>{item.title}</Text>

                    <Text
                      style={{
                        fontSize: 12,
                        color: '#64748B',
                        marginTop: 3,
                      }}
                    >
                      Duration: {item.duration} mins
                    </Text>
                  </View>

                  {selectedExam?._id === item._id && (
                    <Icon name="checkmark-circle" size={22} color="#10B981" />
                  )}
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <View
                  style={{
                    alignItems: 'center',
                    paddingVertical: 30,
                  }}
                >
                  <Text>No Exams Found</Text>
                </View>
              )}
            />

            <TouchableOpacity
              style={styles.modalCloseBtn}
              onPress={() => setShowExamModal(false)}
            >
              <Text style={styles.modalCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.9}
        onPress={() => navigation.navigate('CreateQuestion')}
      >
        <Icon name="add" size={30} color="#FFF" />
      </TouchableOpacity>
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
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    overflow: 'hidden',
  },

  circleOne: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -50,
    right: -50,
  },

  circleTwo: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -20,
    left: -20,
  },

  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  backBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
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
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  screenTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 12,
  },

  screenSubtitle: {
    color: '#E2E8F0',
    marginTop: 5,
    fontSize: 14,
  },

  selectorContainer: {
    paddingHorizontal: 20,
    marginTop: 15,
  },

  classroomCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },

  examCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 12,
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 4,
  },

  cardLabel: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },

  classroomName: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '700',
  },

  examName: {
    color: '#0F172A',
    fontSize: 17,
    fontWeight: '700',
  },

  statsCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    elevation: 4,
  },

  statsCount: {
    fontSize: 34,
    fontWeight: '800',
    color: '#4F46E5',
  },

  statsText: {
    color: '#64748B',
    marginTop: 4,
    fontSize: 14,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 80,
  },

  loadingText: {
    marginTop: 10,
    color: '#64748B',
    fontSize: 14,
  },

  questionCard: {
    marginTop: 15,
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 15,
    elevation: 3,
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
    borderRadius: 12,
  },

  questionBadgeText: {
    color: '#4F46E5',
    fontWeight: '700',
    fontSize: 12,
  },

  questionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 15,
    lineHeight: 24,
  },

  optionBox: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  optionText: {
    color: '#334155',
    fontSize: 14,
  },

  answerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },

  answerText: {
    marginLeft: 8,
    color: '#10B981',
    fontWeight: '700',
    fontSize: 14,
  },

  marksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  marksText: {
    marginLeft: 6,
    color: '#F59E0B',
    fontWeight: '700',
    fontSize: 14,
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 100,
  },

  emptyTitle: {
    marginTop: 15,
    fontSize: 22,
    fontWeight: '700',
    color: '#334155',
  },

  emptySubtitle: {
    marginTop: 8,
    color: '#94A3B8',
    textAlign: 'center',
    paddingHorizontal: 40,
  },

  fab: {
    position: 'absolute',
    bottom: 25,
    right: 25,
  },

  fabGradient: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 20,
    maxHeight: '85%',
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 20,
    textAlign: 'center',
  },

  classroomItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  classroomItemText: {
    fontSize: 16,
    color: '#0F172A',
    fontWeight: '600',
  },

  modalCloseBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 14,
    borderRadius: 16,
    marginTop: 20,
  },

  modalCloseText: {
    color: '#FFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10, // Android
    shadowColor: '#000', // iOS
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
