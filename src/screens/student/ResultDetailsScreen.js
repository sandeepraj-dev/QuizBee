import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import API from '../../api/axios';

export default function ResultDetailsScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const attemptId = route?.params?.attemptId;

  // const attemptId = '6a29801bfc44c155a353d52f';

  const [loading, setLoading] = useState(true);
  const [attempt, setAttempt] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [expandedQuestions, setExpandedQuestions] = useState({});

  useEffect(() => {
    loadAttempt();
  }, []);

  const loadAttempt = async () => {
    try {
      setLoading(true);

      const response = await API.get(`/student/attempts/${attemptId}`);

      setAttempt(response?.data?.data || null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const totalQuestions = attempt?.answers?.length || 0;

  const correctCount =
    attempt?.answers?.filter(item => item?.isCorrect)?.length || 0;

  const wrongCount = Math.max(0, totalQuestions - correctCount);

  const percentage =
    attempt?.score && attempt?.exam?.totalMarks
      ? Math.round((attempt.score / attempt.exam.totalMarks) * 100)
      : 0;

  const accuracy =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const filteredQuestions = useMemo(() => {
    const answers = attempt?.answers || [];

    if (filter === 'CORRECT') {
      return answers.filter(item => item?.isCorrect);
    }

    if (filter === 'WRONG') {
      return answers.filter(item => !item?.isCorrect);
    }

    return answers;
  }, [filter, attempt]);

  const toggleQuestion = id => {
    setExpandedQuestions(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const performanceText = () => {
    if (percentage >= 80) return '🏆 Excellent';
    if (percentage >= 60) return '🎉 Good Job';
    return '📚 Keep Practicing';
  };
  const renderQuestion = ({ item, index }) => {
    const expanded = expandedQuestions?.[index] || false;

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => toggleQuestion(index)}
        style={[
          styles.questionCard,
          {
            borderLeftColor: item?.isCorrect ? '#10B981' : '#EF4444',
          },
        ]}
      >
        <View style={styles.questionHeader}>
          <Text style={styles.questionNumber}>Question {index + 1}</Text>

          <Icon
            name={item?.isCorrect ? 'checkmark-circle' : 'close-circle'}
            size={24}
            color={item?.isCorrect ? '#10B981' : '#EF4444'}
          />
        </View>

        <Text style={styles.questionText}>
          {item?.question || 'Question unavailable'}
        </Text>

        {expanded && (
          <>
            <View style={styles.optionsContainer}>
              {(item?.options || []).map((option, idx) => {
                const isSelected = option === item?.selectedAnswer;

                const isCorrect = option === item?.correctAnswer;

                return (
                  <View
                    key={idx}
                    style={[
                      styles.optionCard,
                      isCorrect && styles.correctOption,
                      isSelected && !isCorrect && styles.wrongOption,
                    ]}
                  >
                    <Text style={styles.optionText}>{option}</Text>
                  </View>
                );
              })}
            </View>

            <View style={styles.answerBox}>
              <Text style={styles.answerTitle}>Your Answer</Text>

              <Text
                style={[
                  styles.answerValue,
                  {
                    color: item?.isCorrect ? '#10B981' : '#EF4444',
                  },
                ]}
              >
                {item?.selectedAnswer || 'Not Answered'}
              </Text>
            </View>

            {!item?.isCorrect && (
              <View style={styles.answerBox}>
                <Text style={styles.answerTitle}>Correct Answer</Text>

                <Text style={[styles.answerValue, { color: '#10B981' }]}>
                  {item?.correctAnswer || 'N/A'}
                </Text>
              </View>
            )}

            <View style={styles.marksRow}>
              <Text style={styles.marksText}>Marks Awarded</Text>

              <Text style={styles.marksValue}>
                {item?.marksAwarded || 0}/{item?.marks || 0}
              </Text>
            </View>
          </>
        )}
      </TouchableOpacity>
    );
  };
  if (loading) {
    return (
      <SafeAreaView style={styles.loader}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />

      <FlatList
        data={filteredQuestions}
        renderItem={renderQuestion}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <>
            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
              style={styles.header}
            >
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
              >
                <Icon name="arrow-back" color="#fff" size={24} />
              </TouchableOpacity>

              <Text style={styles.examTitle}>
                {attempt?.exam?.title || 'Exam Result'}
              </Text>

              <Text style={styles.date}>
                Submitted On{' '}
                {attempt?.submittedAt
                  ? new Date(attempt.submittedAt).toLocaleDateString()
                  : 'N/A'}
              </Text>

              <View style={styles.scoreCircle}>
                <Text style={styles.scorePercent}>{percentage}%</Text>
              </View>

              <Text style={styles.performance}>{performanceText()}</Text>
            </LinearGradient>

            <View style={styles.summaryCard}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{correctCount}</Text>
                <Text style={styles.statLabel}>Correct</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValue}>{wrongCount}</Text>
                <Text style={styles.statLabel}>Wrong</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statValue}>{accuracy}%</Text>
                <Text style={styles.statLabel}>Accuracy</Text>
              </View>
            </View>

            <View style={styles.scoreCard}>
              <Text style={styles.scoreLabel}>Final Score</Text>

              <Text style={styles.scoreValue}>
                {attempt?.score || 0}/{attempt?.exam?.totalMarks || 0}
              </Text>

              <Text style={styles.duration}>
                Duration : {attempt?.exam?.duration || 0} mins
              </Text>
            </View>

            <View style={styles.filterContainer}>
              {['ALL', 'CORRECT', 'WRONG'].map(item => (
                <TouchableOpacity
                  key={item}
                  onPress={() => setFilter(item)}
                  style={[
                    styles.filterBtn,
                    filter === item && styles.activeFilter,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      filter === item && {
                        color: '#fff',
                      },
                    ]}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.sectionTitle}>Question Review</Text>
          </>
        }
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  header: {
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  backBtn: {
    position: 'absolute',
    top: 20,
    left: 20,
  },

  examTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginTop: 20,
  },

  date: {
    color: '#E5E7EB',
    marginTop: 8,
  },

  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scorePercent: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#4F46E5',
  },

  performance: {
    marginTop: 15,
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  summaryCard: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginTop: -25,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    marginHorizontal: 5,
    padding: 18,
    borderRadius: 18,
    alignItems: 'center',
    elevation: 4,
  },

  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },

  statLabel: {
    color: '#6B7280',
    marginTop: 5,
  },

  scoreCard: {
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },

  scoreLabel: {
    color: '#6B7280',
  },

  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 5,
  },

  duration: {
    color: '#6B7280',
    marginTop: 10,
  },

  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 15,
  },

  filterBtn: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
    marginHorizontal: 5,
  },

  activeFilter: {
    backgroundColor: '#4F46E5',
  },

  filterText: {
    color: '#374151',
    fontWeight: '600',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginHorizontal: 15,
    marginBottom: 10,
  },

  questionCard: {
    backgroundColor: '#fff',
    marginHorizontal: 15,
    marginBottom: 12,
    borderRadius: 16,
    borderLeftWidth: 5,
    padding: 15,
  },

  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  questionNumber: {
    fontWeight: '700',
    color: '#6B7280',
  },

  questionText: {
    marginTop: 8,
    fontSize: 16,
    color: '#111827',
    fontWeight: '600',
  },

  optionsContainer: {
    marginTop: 15,
  },

  optionCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },

  correctOption: {
    backgroundColor: '#DCFCE7',
  },

  wrongOption: {
    backgroundColor: '#FEE2E2',
  },

  optionText: {
    color: '#111827',
  },

  answerBox: {
    marginTop: 10,
  },

  answerTitle: {
    color: '#6B7280',
    fontSize: 13,
  },

  answerValue: {
    fontWeight: '700',
    marginTop: 3,
    fontSize: 15,
  },

  marksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },

  marksText: {
    color: '#374151',
    fontWeight: '600',
  },

  marksValue: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },
});
