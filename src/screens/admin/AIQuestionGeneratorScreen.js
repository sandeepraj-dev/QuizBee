import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dropdown } from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';

import API from '../../api/axios';

export default function AIQuestionGeneratorScreen({ navigation }) {
  const [classrooms, setClassrooms] = useState([]);
  const [exams, setExams] = useState([]);

  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);

  const [difficulty, setDifficulty] = useState('Basic');
  const [count, setCount] = useState('20');

  const [prompt, setPrompt] = useState('');

  const [loading, setLoading] = useState(false);
  const [classroomLoading, setClassroomLoading] = useState(false);
  const [examLoading, setExamLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const difficultyOptions = [
    { label: 'Basic', value: 'Basic' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Advanced', value: 'Advanced' },
  ];

  useEffect(() => {
    loadClassrooms();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    await loadClassrooms();

    if (selectedClassroom) {
      await loadExams(selectedClassroom);
    }

    setRefreshing(false);
  };

  const loadClassrooms = async () => {
    try {
      setClassroomLoading(true);

      const response = await API.get('/classrooms');

      const data = response?.data?.data || response?.data || [];

      setClassrooms(data);
    } catch (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed to load classrooms',
      });
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

      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed to load exams',
      });
    } finally {
      setExamLoading(false);
    }
  };

  const validateQuestions = questions => {
    if (!Array.isArray(questions)) {
      return false;
    }

    return questions.every(item => {
      return (
        item.question &&
        Array.isArray(item.options) &&
        item.options.length === 4 &&
        item.answer &&
        item.marks
      );
    });
  };

  const generateQuestions = async () => {
    if (!selectedClassroom) {
      return Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Please select classroom',
      });
    }

    if (!selectedExam) {
      return Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Please select exam',
      });
    }

    if (!prompt.trim()) {
      return Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Please enter prompt',
      });
    }

    try {
      setLoading(true);

      const response = await API.post('/student/generate-questions', {
        classroomId: selectedClassroom,
        examId: selectedExam,
        prompt,
        difficulty,
        count: Number(count),
      });

      const aiText =
        response?.data?.data ||
        response?.data?.response ||
        response?.data?.text;
      console.log('Response:', response.data);
      console.log('Type:', typeof response.data.data);
      let questions;
      try {
        questions = response?.data?.data || null;
      } catch (error) {
        console.log(error, 'dshdshsdhjsdjhj');
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Invalid JSON from AI',
        });

        return;
      }

      if (!validateQuestions(questions)) {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: 'Invalid Question Structure',
        });

        return;
      }

      const formattedQuestions = questions.map(item => ({
        classroomId: selectedClassroom,
        examId: selectedExam,
        ...item,
      }));

      navigation.navigate('AIPreviewScreen', {
        questions: formattedQuestions,
      });
    } catch (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Generation Failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" />

      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <LinearGradient colors={['#4F46E5', '#6366F1']} style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={22} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>AI Question Generator</Text>

          <Text style={styles.headerSubtitle}>
            Generate MCQs instantly using AI
          </Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.label}>Classroom</Text>

          <View style={styles.inputContainer}>
            <Icon name="school-outline" size={22} color="#6366F1" />

            <Dropdown
              style={{ flex: 1, marginLeft: 12 }}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={classrooms}
              labelField="name"
              valueField="_id"
              value={selectedClassroom}
              placeholder="Select Classroom"
              onChange={item => {
                setSelectedClassroom(item._id);
                setSelectedExam(null);
                loadExams(item._id);
              }}
            />
          </View>
          <Text style={styles.label}>Exam</Text>

          <View style={styles.inputContainer}>
            <Icon name="document-text-outline" size={22} color="#6366F1" />

            <Dropdown
              style={{ flex: 1, marginLeft: 12 }}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={exams}
              labelField="title"
              valueField="_id"
              value={selectedExam}
              placeholder="Select Exam"
              onChange={item => setSelectedExam(item._id)}
            />
          </View>

          <Text style={styles.label}>Difficulty</Text>

          <View style={styles.inputContainer}>
            <Icon name="bar-chart-outline" size={22} color="#6366F1" />

            <Dropdown
              style={{ flex: 1, marginLeft: 12 }}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={difficultyOptions}
              labelField="label"
              valueField="value"
              value={difficulty}
              onChange={item => setDifficulty(item.value)}
            />
          </View>

          <Text style={styles.label}>Number of Questions</Text>
          <View style={styles.inputContainer}>
            <Icon name="list-outline" size={22} color="#6366F1" />

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={count}
              placeholder="20"
              placeholderTextColor="#94A3B8"
              onChangeText={setCount}
            />
          </View>

          <Text style={styles.label}>Prompt</Text>

          <View style={styles.promptContainer}>
            <Icon
              name="sparkles-outline"
              size={22}
              color="#6366F1"
              style={{ marginTop: 2 }}
            />

            <TextInput
              style={styles.promptInput}
              multiline
              textAlignVertical="top"
              placeholder="Generate SQL beginner MCQs..."
              placeholderTextColor="#94A3B8"
              value={prompt}
              onChangeText={setPrompt}
            />
          </View>

          <TouchableOpacity
            style={styles.generateButton}
            onPress={generateQuestions}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Icon name="sparkles" size={20} color="#FFF" />

                <Text style={styles.generateText}>Generate Questions</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  header: {
    height: 220,
    paddingTop: 50,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  headerTitle: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '700',
    marginTop: 20,
  },

  headerSubtitle: {
    color: '#E0E7FF',
    marginTop: 8,
    fontSize: 14,
  },

  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: -20,
    marginBottom: 25,
    borderRadius: 28,
    padding: 22,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
    marginTop: 5,
  },

  dropdown: {
    height: 55,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 15,
  },

  input: {
    height: 55,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 15,
    color: '#1E293B',
  },

  promptInput: {
    height: 140,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    padding: 15,
    color: '#1E293B',
  },
  generateButton: {
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#4F46E5',
    marginTop: 25,

    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  generateText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 58,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 15,
    marginBottom: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },

  input: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
  },

  promptContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 15,
    paddingTop: 15,
    minHeight: 150,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },

  promptInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    marginLeft: 12,
  },
  dropdown: {
    height: 58,
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 15,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },

  placeholderStyle: {
    color: '#94A3B8',
    fontSize: 15,
  },

  selectedTextStyle: {
    color: '#1E293B',
    fontSize: 16,
    fontWeight: '600',
  },

  iconStyle: {
    width: 20,
    height: 20,
  },
});
