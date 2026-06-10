import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  ScrollView,
  Modal,
  ActivityIndicator,
  StatusBar,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

import { Dropdown } from 'react-native-element-dropdown';

import { useNavigation, useRoute } from '@react-navigation/native';

import API from '../../api/axios';

export default CreateQuestionScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  console.log('Route Params: ', route?.params);
  const editMode = route?.params?.isEdit || false;
  const classroomFromRoute = route?.params?.classroom || null;

  const questionsFromRoute = route?.params?.questions || [];

  const [loading, setLoading] = useState(false);
  const [classroomLoading, setClassroomLoading] = useState(true);

  const [classrooms, setClassrooms] = useState([]);

  const [selectedClassroom, setSelectedClassroom] =
    useState(classroomFromRoute);

  const [showClassroomModal, setShowClassroomModal] = useState(false);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);

  const [showExamModal, setShowExamModal] = useState(false);
  const [examLoading, setExamLoading] = useState(false);

  const [questionsList, setQuestionsList] = useState([]);

  const [editingIndex, setEditingIndex] = useState(null);

  const [question, setQuestion] = useState('');
  const [marks, setMarks] = useState(0);

  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');

  const [answer, setAnswer] = useState('');

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  const [selectedDeleteIndex, setSelectedDeleteIndex] = useState(null);

  useEffect(() => {
    loadClassrooms();
    if (selectedClassroom?._id) {
      loadExams(selectedClassroom._id);
    }
  }, [selectedClassroom]);

  useEffect(() => {
    if (editMode && questionsFromRoute.length > 0) {
      setQuestionsList(questionsFromRoute);
    }
  }, []);

  const loadClassrooms = async () => {
    try {
      setClassroomLoading(true);

      const response = await API.get('/classrooms');

      const data = response?.data?.data || response?.data || [];

      setClassrooms(data);

      // if (!selectedClassroom && data.length > 0) {
      //   setSelectedClassroom(data[0]);
      // }
    } catch (error) {
      console.log(error);
    } finally {
      setClassroomLoading(false);
    }
  };

  const loadExams = async classroomId => {
    try {
      setExamLoading(true);

      const response = await API.get(`/exams/classroom/${classroomId}`);

      const data = response?.data?.data || response?.data || [];

      setExams(data);
    } catch (error) {
      console.log(error);
    } finally {
      setExamLoading(false);
    }
  };
  const onSelectClassroom = async classroom => {
    setSelectedClassroom(classroom);
    setSelectedExam(null);

    await loadExams(classroom._id);
  };
  const answerOptions = [
    {
      label: 'Option A',
      value: optionA,
    },
    {
      label: 'Option B',
      value: optionB,
    },
    {
      label: 'Option C',
      value: optionC,
    },
    {
      label: 'Option D',
      value: optionD,
    },
  ];

  const validateQuestion = () => {
    if (!question.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Enter Question',
      });
      return false;
    }

    if (!marks.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Enter Marks',
      });
      return false;
    }

    if (!optionA.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Enter Option A',
      });
      return false;
    }

    if (!optionB.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Enter Option B',
      });
      return false;
    }

    if (!optionC.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Enter Option C',
      });
      return false;
    }

    if (!optionD.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Enter Option D',
      });
      return false;
    }

    if (!answer) {
      Toast.show({
        type: 'error',
        text1: 'Select Correct Answer',
      });
      return false;
    }

    return true;
  };

  const clearForm = () => {
    setQuestion('');
    setOptionA('');
    setOptionB('');
    setOptionC('');
    setOptionD('');
    setAnswer('');
    setEditingIndex(null);
  };

  const addQuestion = () => {
    if (!validateQuestion()) {
      return;
    }

    const questionObj = {
      question,
      options: [optionA, optionB, optionC, optionD],
      answer,
      marks: parseInt(marks) || 1,
    };

    if (editingIndex !== null) {
      const temp = [...questionsList];

      temp[editingIndex] = {
        ...temp[editingIndex],
        ...questionObj,
      };

      setQuestionsList(temp);

      Toast.show({
        type: 'success',
        text1: 'Question Updated',
      });
    } else {
      setQuestionsList(prev => [...prev, questionObj]);

      Toast.show({
        type: 'success',
        text1: 'Question Added',
      });
    }

    clearForm();
  };

  const editQuestion = (item, index) => {
    setQuestion(item.question);

    setOptionA(item.options?.[0] || '');
    setOptionB(item.options?.[1] || '');
    setOptionC(item.options?.[2] || '');
    setOptionD(item.options?.[3] || '');

    setAnswer(item.answer);
    setMarks(item.marks?.toString() || '1');
    setEditingIndex(index);

    setTimeout(() => {
      scrollRef?.current?.scrollToOffset?.({
        offset: 0,
        animated: true,
      });
    }, 300);
  };

  const deleteQuestion = () => {
    const temp = [...questionsList];

    temp.splice(selectedDeleteIndex, 1);

    setQuestionsList(temp);

    setDeleteModalVisible(false);

    Toast.show({
      type: 'success',
      text1: 'Question Deleted',
    });
  };

  const saveQuestions = async () => {
    if (!selectedClassroom?._id) {
      Toast.show({
        type: 'error',
        text1: 'Select Classroom',
      });

      return;
    }

    if (!selectedExam?._id) {
      Toast.show({
        type: 'error',
        text1: 'Select Exam',
      });

      return;
    }
    if (!selectedClassroom?._id) {
      Toast.show({
        type: 'error',
        text1: 'Select Classroom',
      });
      return;
    }

    if (questionsList.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Add Questions',
      });
      return;
    }

    try {
      setLoading(true);
      console.log('Saving Questions: ', selectedExam);
      if (editMode) {
        const payload = questionsList.map(item => ({
          _id: item._id,
          question: item.question,
          options: item.options,
          answer: item.answer,
          examId: selectedExam._id,
        }));

        await API.put(`/questions/classroom/${selectedClassroom._id}`, payload);

        Toast.show({
          type: 'success',
          text1: 'Questions Updated',
        });
      } else {
        const payload = questionsList.map(item => ({
          ...item,
          examId: selectedExam._id,
        }));
        await API.post(
          `/questions/classroom/${selectedClassroom._id}`,
          payload,
        );

        Toast.show({
          type: 'success',
          text1: 'Questions Created',
        });
      }

      // navigation.goBack();
    } catch (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || 'Something went wrong',
      });
    } finally {
      setLoading(false);
    }
  };
  const scrollRef = React.useRef();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />

      {/* HEADER */}
      <LinearGradient
        colors={['#4F46E5', '#7C3AED', '#9333EA']}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={22} color="#FFF" />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <Text style={styles.headerTitle}>
            {editMode ? 'Update Questions' : 'Create Questions'}
          </Text>

          <Text style={styles.headerSubtitle}>Manage Classroom Questions</Text>
        </View>
      </LinearGradient>

      <FlatList
        ref={scrollRef}
        data={questionsList}
        keyExtractor={(item, index) => index.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 150,
        }}
        ListHeaderComponent={
          <>
            {/* CLASSROOM */}
            <TouchableOpacity
              style={styles.classroomCard}
              onPress={() => setShowClassroomModal(true)}
            >
              <View>
                <Text style={styles.label}>Classroom</Text>

                <Text style={styles.classroomText}>
                  {selectedClassroom?.name || 'Select Classroom'}
                </Text>
              </View>

              <Icon name="chevron-down" size={24} color="#4F46E5" />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.classroomCard}
              onPress={() => setShowExamModal(true)}
            >
              <View>
                <Text style={styles.label}>Exam</Text>

                <Text style={styles.classroomText}>
                  {selectedExam?.title || 'Select Exam'}
                </Text>
              </View>

              <Icon name="chevron-down" size={24} color="#4F46E5" />
            </TouchableOpacity>

            {/* STATS */}
            <View style={styles.statsCard}>
              <Text style={styles.statsCount}>{questionsList.length}</Text>

              <Text style={styles.statsText}>Questions Added</Text>
            </View>

            {/* QUESTION FORM */}
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>
                {editingIndex !== null ? 'Edit Question' : 'Add Question'}
              </Text>

              <TextInput
                value={question}
                onChangeText={setQuestion}
                placeholder="Enter Question"
                multiline
                style={styles.questionInput}
                placeholderTextColor="#94A3B8"
              />

              <TextInput
                value={optionA}
                onChangeText={setOptionA}
                placeholder="Option A"
                style={styles.input}
                placeholderTextColor="#94A3B8"
              />

              <TextInput
                value={optionB}
                onChangeText={setOptionB}
                placeholder="Option B"
                style={styles.input}
                placeholderTextColor="#94A3B8"
              />

              <TextInput
                value={optionC}
                onChangeText={setOptionC}
                placeholder="Option C"
                style={styles.input}
                placeholderTextColor="#94A3B8"
              />

              <TextInput
                value={optionD}
                onChangeText={setOptionD}
                placeholder="Option D"
                style={styles.input}
                placeholderTextColor="#94A3B8"
              />

              <Dropdown
                style={styles.dropdown}
                placeholderStyle={styles.placeholderStyle}
                selectedTextStyle={styles.selectedTextStyle}
                data={answerOptions}
                labelField="label"
                valueField="value"
                value={answer}
                placeholder="Select Correct Answer"
                onChange={item => setAnswer(item.value)}
              />

              <Text style={styles.sectionTitle}>
                {editingIndex !== null ? 'Edit Marks' : 'Add Marks'}
              </Text>

              <TextInput
                value={marks}
                onChangeText={setMarks}
                placeholder="Enter Marks"
                style={styles.questionMarks}
                placeholderTextColor="#94A3B8"
              />

              <TouchableOpacity style={styles.addBtn} onPress={addQuestion}>
                <LinearGradient
                  colors={['#4F46E5', '#7C3AED']}
                  style={styles.addGradient}
                >
                  <Icon
                    name={
                      editingIndex !== null
                        ? 'create-outline'
                        : 'add-circle-outline'
                    }
                    size={20}
                    color="#FFF"
                  />

                  <Text style={styles.addText}>
                    {editingIndex !== null ? 'Update Question' : 'Add Question'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <Text style={styles.previewTitle}>Questions Preview</Text>
          </>
        }
        renderItem={({ item, index }) => (
          <View style={styles.questionCard}>
            <View style={styles.questionHeader}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>Q{index + 1}</Text>
              </View>
            </View>

            <Text style={styles.questionTitle}>{item.question}</Text>

            <View style={styles.optionBox}>
              <Text>A. {item.options?.[0]}</Text>
            </View>

            <View style={styles.optionBox}>
              <Text>B. {item.options?.[1]}</Text>
            </View>

            <View style={styles.optionBox}>
              <Text>C. {item.options?.[2]}</Text>
            </View>

            <View style={styles.optionBox}>
              <Text>D. {item.options?.[3]}</Text>
            </View>
            <View style={styles.marksRow}>
              <Text style={styles.marksText}>Marks: {item.marks}</Text>
            </View>

            <View style={styles.answerRow}>
              <Icon name="checkmark-circle" size={18} color="#10B981" />

              <Text style={styles.answerText}>{item.answer}</Text>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => editQuestion(item, index)}
              >
                <Icon name="create-outline" size={18} color="#FFF" />

                <Text style={styles.btnText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteBtnCard}
                onPress={() => {
                  setSelectedDeleteIndex(index);
                  setDeleteModalVisible(true);
                }}
              >
                <Icon name="trash-outline" size={18} color="#FFF" />

                <Text style={styles.btnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* SAVE BUTTON */}
      <TouchableOpacity style={styles.saveBtn} onPress={saveQuestions}>
        <LinearGradient
          colors={['#4F46E5', '#7C3AED']}
          style={styles.saveGradient}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Icon name="save-outline" size={22} color="#FFF" />

              <Text style={styles.saveText}>
                {editMode ? 'Update All Questions' : 'Save Questions'}
              </Text>
            </>
          )}
        </LinearGradient>
      </TouchableOpacity>
      <Modal visible={showExamModal} transparent animationType="slide">
        <TouchableOpacity onPress={() => setShowExamModal(false)}>
          <Icon name="close" size={24} color="#000" />
        </TouchableOpacity>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Exam</Text>

            {examLoading ? (
              <ActivityIndicator size="large" color="#4F46E5" />
            ) : (
              <>
                <FlatList
                  data={exams}
                  keyExtractor={item => item._id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.classroomItem}
                      onPress={() => {
                        setSelectedExam(item);
                        setShowExamModal(false);
                      }}
                    >
                      <Text style={styles.classroomItemText}>{item.title}</Text>
                    </TouchableOpacity>
                  )}
                />
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setShowExamModal(false)}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* CLASSROOM MODAL */}
      <Modal visible={showClassroomModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Classroom</Text>

            {classroomLoading ? (
              <ActivityIndicator size="large" color="#4F46E5" />
            ) : (
              <>
                <FlatList
                  data={classrooms}
                  keyExtractor={item => item._id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.classroomItem}
                      onPress={() => {
                        setSelectedClassroom(item);
                        setShowClassroomModal(false);
                      }}
                    >
                      <Text style={styles.classroomItemText}>{item.name}</Text>
                    </TouchableOpacity>
                  )}
                />{' '}
                <TouchableOpacity
                  style={styles.modalCloseBtn}
                  onPress={() => setShowClassroomModal(false)}
                >
                  <Text style={styles.modalCloseText}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* DELETE MODAL */}
      <Modal visible={deleteModalVisible} transparent animationType="fade">
        <View style={styles.deleteOverlay}>
          <View style={styles.deleteContainer}>
            <Icon name="trash" size={40} color="#EF4444" />

            <Text style={styles.deleteTitle}>Delete Question?</Text>

            <Text style={styles.deleteSubtitle}>
              This action cannot be undone.
            </Text>

            <View style={styles.deleteButtonRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={deleteQuestion}
              >
                <Text style={styles.confirmText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
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
  backBtn: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  headerTitle: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '800',
  },

  headerSubtitle: {
    color: '#E5E7EB',
    marginTop: 4,
  },

  classroomCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  label: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '700',
  },

  classroomText: {
    fontSize: 17,
    color: '#111827',
    fontWeight: '800',
    marginTop: 5,
  },

  statsCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 20,
    paddingVertical: 18,
    alignItems: 'center',
    elevation: 3,
  },

  statsCount: {
    fontSize: 30,
    color: '#4F46E5',
    fontWeight: '800',
  },

  statsText: {
    color: '#64748B',
    marginTop: 4,
  },

  formCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 20,
    padding: 18,
    elevation: 3,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 15,
  },

  questionInput: {
    minHeight: 120,
    backgroundColor: '#F8FAFC',
    borderRadius: 15,
    padding: 15,
    color: '#111827',
    textAlignVertical: 'top',
    marginBottom: 12,
  },

  questionMarks: {
    minHeight: 50,
    backgroundColor: '#F8FAFC',
    borderRadius: 15,
    padding: 15,
    color: '#111827',
    textAlignVertical: 'top',
    marginBottom: 12,
  },

  input: {
    height: 55,
    backgroundColor: '#F8FAFC',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 12,
    color: '#111827',
  },

  dropdown: {
    height: 55,
    backgroundColor: '#F8FAFC',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  placeholderStyle: {
    color: '#94A3B8',
  },

  selectedTextStyle: {
    color: '#111827',
    fontWeight: '600',
  },

  addBtn: {
    marginTop: 5,
  },

  addGradient: {
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  addText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 8,
  },

  previewTitle: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },

  questionCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 20,
    padding: 18,
    elevation: 3,
  },

  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },

  badgeText: {
    color: '#4F46E5',
    fontWeight: '700',
  },

  questionTitle: {
    marginTop: 12,
    color: '#111827',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },

  optionBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },

  answerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },

  answerText: {
    marginLeft: 6,
    color: '#10B981',
    fontWeight: '700',
  },

  actionRow: {
    flexDirection: 'row',
    marginTop: 15,
  },

  editBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 6,
  },

  deleteBtnCard: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 6,
  },

  btnText: {
    color: '#FFF',
    fontWeight: '700',
    marginLeft: 5,
  },

  saveBtn: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 20,
  },

  saveGradient: {
    height: 60,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  saveText: {
    color: '#FFF',
    fontWeight: '800',
    fontSize: 16,
    marginLeft: 8,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },

  modalContainer: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '70%',
    padding: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 20,
    color: '#111827',
  },

  classroomItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  classroomItemText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '600',
  },

  deleteOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteContainer: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
  },

  deleteTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 15,
    color: '#111827',
  },

  deleteSubtitle: {
    marginTop: 8,
    textAlign: 'center',
    color: '#6B7280',
  },

  deleteButtonRow: {
    flexDirection: 'row',
    marginTop: 25,
  },

  cancelBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  confirmBtn: {
    flex: 1,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  cancelText: {
    color: '#374151',
    fontWeight: '700',
  },

  confirmText: {
    color: '#FFF',
    fontWeight: '700',
  },
  summaryCard: {
    marginHorizontal: 20,
    marginTop: -20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    elevation: 4,
  },

  summaryItem: {
    flex: 1,
  },

  divider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 15,
  },

  summaryLabel: {
    color: '#64748B',
    fontSize: 12,
  },

  summaryValue: {
    color: '#111827',
    fontWeight: '800',
    marginTop: 4,
  },

  marksRow: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
});
