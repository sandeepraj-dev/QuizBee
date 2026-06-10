import React, { useEffect, useState, useRef } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  Modal,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import Toast from 'react-native-toast-message';

import { useNavigation, useRoute } from '@react-navigation/native';

import API from '../../api/axios';

export default function AttemptExamScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { examId } = route.params;

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  const [exam, setExam] = useState(null);

  const [questions, setQuestions] = useState([]);

  const [answers, setAnswers] = useState([]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const [remainingTime, setRemainingTime] = useState(0);

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const [showExitModal, setShowExitModal] = useState(false);

  const timerRef = useRef(null);

  const submittedRef = useRef(false);

  useEffect(() => {
    loadExamQuestions();
  }, []);

  /*
  =====================================
  LOAD QUESTIONS
  =====================================
  */

  const loadExamQuestions = async () => {
    try {
      setLoading(true);

      const response = await API.get(`/student/exam/${examId}/questions`);

      setExam(response.data.exam);

      setQuestions(response.data.data || []);

      setRemainingTime((response.data.exam.duration || 0) * 60);
    } catch (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || 'Failed to load exam',
      });

      navigation.goBack();
    } finally {
      setLoading(false);
    }
  };

  /*
  =====================================
  TIMER
  =====================================
  */

  useEffect(() => {
    if (!remainingTime) return;

    timerRef.current = setInterval(() => {
      setRemainingTime(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);

          autoSubmitExam();

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [remainingTime > 0]);

  /*
  =====================================
  AUTO SUBMIT
  =====================================
  */

  const autoSubmitExam = async () => {
    if (submittedRef.current) return;

    submittedRef.current = true;

    Toast.show({
      type: 'info',
      text1: 'Time Up',
      text2: 'Submitting exam...',
    });

    await submitExam();
  };

  /*
  =====================================
  FORMAT TIMER
  =====================================
  */

  const formatTime = totalSeconds => {
    const mins = Math.floor(totalSeconds / 60);

    const secs = totalSeconds % 60;

    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  /*
  =====================================
  SAVE ANSWER
  =====================================
  */

  const selectAnswer = (questionId, selectedAnswer) => {
    setAnswers(prev => {
      const filtered = prev.filter(item => item.questionId !== questionId);

      return [
        ...filtered,
        {
          questionId,
          selectedAnswer,
        },
      ];
    });
  };

  /*
  =====================================
  GET SELECTED ANSWER
  =====================================
  */

  const getSelectedAnswer = questionId => {
    const found = answers.find(item => item.questionId === questionId);

    return found?.selectedAnswer;
  };

  /*
  =====================================
  PROGRESS
  =====================================
  */

  const progress =
    questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  const currentQuestion = questions[currentIndex];

  /*
  =====================================
  SUBMIT EXAM
  (IMPLEMENTED IN PART 2)
  =====================================
  */

  const submitExam = async () => {
    try {
      if (submitting) return;

      setSubmitting(true);

      clearInterval(timerRef.current);

      const payload = {
        answers,
      };

      const response = await API.post(
        `/student/exams/${examId}/attempt`,
        payload,
      );

      submittedRef.current = true;

      Toast.show({
        type: 'success',
        text1: 'Exam Submitted Successfully',
      });

      navigation.replace('ExamResultScreen', {
        result: response?.data?.data || {},
        exam,
      });
    } catch (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || 'Failed to submit exam',
      });

      submittedRef.current = false;
    } finally {
      setSubmitting(false);
      setShowSubmitModal(false);
    }
  };

  /*
  =====================================
  LOADING UI
  =====================================
  */

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />

        <LinearGradient
          colors={['#4F46E5', '#7C3AED', '#9333EA']}
          style={styles.loadingGradient}
        >
          <ActivityIndicator size="large" color="#FFFFFF" />

          <Text style={styles.loadingText}>Preparing Exam...</Text>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}

        <LinearGradient
          colors={['#4F46E5', '#7C3AED', '#9333EA']}
          style={styles.header}
        >
          <View style={styles.circle1} />
          <View style={styles.circle2} />

          <View style={styles.headerTop}>
            <View style={styles.examIcon}>
              <Icon name="document-text" size={34} color="#FFF" />
            </View>

            <TouchableOpacity
              style={styles.exitButton}
              onPress={() => setShowExitModal(true)}
            >
              <Icon name="close-circle" size={28} color="#FFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.examTitle}>{exam?.title}</Text>

          <Text style={styles.examDescription}>{exam?.description}</Text>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{questions.length}</Text>

              <Text style={styles.statLabel}>Questions</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{exam?.totalMarks}</Text>

              <Text style={styles.statLabel}>Marks</Text>
            </View>

            <View style={styles.statCard}>
              <Text style={styles.statValue}>{exam?.duration}</Text>

              <Text style={styles.statLabel}>Minutes</Text>
            </View>
          </View>
        </LinearGradient>

        {/* PROGRESS */}

        <View style={styles.progressWrapper}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressText}>
              Question {currentIndex + 1} of {questions.length}
            </Text>

            <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progress}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* PART 2 STARTS HERE */}
        <View style={styles.navigatorContainer}>
          <Text style={styles.navigatorTitle}>Question Navigator</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingVertical: 5,
            }}
          >
            {questions.map((item, index) => {
              const answered = answers.some(
                answer => answer.questionId === item._id,
              );

              const active = index === currentIndex;

              return (
                <TouchableOpacity
                  key={item._id}
                  activeOpacity={0.8}
                  onPress={() => setCurrentIndex(index)}
                  style={[
                    styles.questionPill,

                    active && styles.activeQuestionPill,

                    answered && !active && styles.answeredQuestionPill,
                  ]}
                >
                  <Text
                    style={[
                      styles.questionPillText,

                      active && styles.activeQuestionPillText,
                    ]}
                  >
                    {index + 1}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <View style={styles.questionCard}>
          <View style={styles.questionHeader}>
            <View style={styles.questionBadge}>
              <Icon name="help-circle-outline" size={18} color="#4F46E5" />

              <Text style={styles.questionBadgeText}>
                Question {currentIndex + 1}
              </Text>
            </View>

            <View style={styles.marksBadge}>
              <Icon name="trophy-outline" size={16} color="#10B981" />

              <Text style={styles.marksText}>
                {currentQuestion?.marks || 1} Marks
              </Text>
            </View>
          </View>

          <Text style={styles.questionText}>{currentQuestion?.question}</Text>
        </View>
        <View style={styles.optionsContainer}>
          {currentQuestion?.options?.map((option, index) => {
            const selected = getSelectedAnswer(currentQuestion._id) === option;

            return (
              <TouchableOpacity
                key={index}
                activeOpacity={0.9}
                onPress={() => selectAnswer(currentQuestion._id, option)}
                style={[
                  styles.optionCard,

                  selected && styles.selectedOptionCard,
                ]}
              >
                <View
                  style={[
                    styles.optionCircle,

                    selected && styles.selectedOptionCircle,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionLetter,

                      selected && styles.selectedOptionLetter,
                    ]}
                  >
                    {String.fromCharCode(65 + index)}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.optionText,

                    selected && styles.selectedOptionText,
                  ]}
                >
                  {option}
                </Text>

                {selected && (
                  <Icon name="checkmark-circle" size={24} color="#4F46E5" />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Exam Progress</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Answered</Text>

            <Text style={styles.summaryValue}>
              {answers.length} / {questions.length}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Remaining</Text>

            <Text style={styles.summaryValue}>
              {questions.length - answers.length}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Time Left</Text>

            <Text style={styles.summaryValue}>{formatTime(remainingTime)}</Text>
          </View>
        </View>
        <View style={styles.bottomButtons}>
          <TouchableOpacity
            disabled={currentIndex === 0}
            activeOpacity={0.9}
            style={[
              styles.navButton,

              currentIndex === 0 && styles.disabledButton,
            ]}
            onPress={() => setCurrentIndex(prev => prev - 1)}
          >
            <Icon name="arrow-back" size={20} color="#4F46E5" />

            <Text style={styles.navButtonText}>Previous</Text>
          </TouchableOpacity>

          {currentIndex < questions.length - 1 ? (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.nextButton}
              onPress={() => setCurrentIndex(prev => prev + 1)}
            >
              <LinearGradient
                colors={['#4F46E5', '#7C3AED']}
                style={styles.nextGradient}
              >
                <Text style={styles.nextButtonText}>Next</Text>

                <Icon name="arrow-forward" size={20} color="#FFF" />
              </LinearGradient>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.submitButton}
              onPress={() => setShowSubmitModal(true)}
            >
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.submitGradient}
              >
                <Icon name="checkmark-done" size={22} color="#FFF" />

                <Text style={styles.submitText}>Submit Exam</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      {/* SUBMIT CONFIRMATION MODAL */}

      <Modal transparent animationType="fade" visible={showSubmitModal}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIcon}>
              <Icon name="alert-circle" size={55} color="#F59E0B" />
            </View>

            <Text style={styles.modalTitle}>Submit Exam?</Text>

            <Text style={styles.modalMessage}>
              Once submitted, you cannot attempt this exam again.
            </Text>

            <View style={styles.modalStats}>
              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatValue}>{answers.length}</Text>

                <Text style={styles.modalStatLabel}>Answered</Text>
              </View>

              <View style={styles.modalDivider} />

              <View style={styles.modalStatItem}>
                <Text style={styles.modalStatValue}>
                  {questions.length - answers.length}
                </Text>

                <Text style={styles.modalStatLabel}>Remaining</Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowSubmitModal(false)}
              >
                <Text style={styles.cancelButtonText}>Continue</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={submitExam}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.confirmGradient}
                >
                  <Text style={styles.confirmButtonText}>Submit</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {submitting && (
        <View style={styles.loaderOverlay}>
          <View style={styles.loaderCard}>
            <ActivityIndicator size="large" color="#4F46E5" />

            <Text style={styles.loaderText}>Submitting Exam...</Text>

            <Text style={styles.loaderSubText}>Please wait</Text>
          </View>
        </View>
      )}
      <Modal transparent visible={showExitModal} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.exitModal}>
            <View style={styles.exitIconWrapper}>
              <Icon name="warning" size={55} color="#F59E0B" />
            </View>

            <Text style={styles.exitTitle}>Exit Exam?</Text>

            <Text style={styles.exitMessage}>
              Your exam is currently in progress.
            </Text>

            <Text style={styles.exitSubMessage}>
              You can either continue the exam or submit it now.
            </Text>

            <View style={styles.exitStatsRow}>
              <View style={styles.exitStatCard}>
                <Text style={styles.exitStatValue}>{answers.length}</Text>

                <Text style={styles.exitStatLabel}>Answered</Text>
              </View>

              <View style={styles.exitStatCard}>
                <Text style={styles.exitStatValue}>
                  {questions.length - answers.length}
                </Text>

                <Text style={styles.exitStatLabel}>Remaining</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => setShowExitModal(false)}
            >
              <LinearGradient
                colors={['#4F46E5', '#7C3AED']}
                style={styles.continueExamButton}
              >
                <Text style={styles.continueExamText}>Continue Exam</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => {
                setShowExitModal(false);
                setShowSubmitModal(true);
              }}
              style={styles.submitNowButton}
            >
              <Text style={styles.submitNowText}>Submit & Exit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/*
=====================================
STYLES PART 1
=====================================
*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  loadingContainer: {
    flex: 1,
  },

  loadingGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    color: '#FFF',
    marginTop: 15,
    fontSize: 18,
    fontWeight: '700',
  },

  header: {
    padding: 20,
    paddingBottom: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    overflow: 'hidden',
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  examIcon: {
    width: 65,
    height: 65,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  timerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 15,
  },

  timerText: {
    color: '#FFF',
    fontWeight: '700',
    marginLeft: 6,
    fontSize: 15,
  },

  examTitle: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '800',
    marginTop: 18,
  },

  examDescription: {
    color: '#E5E7EB',
    marginTop: 8,
  },

  statsRow: {
    flexDirection: 'row',
    marginTop: 22,
    justifyContent: 'space-between',
  },

  statCard: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
  },

  statValue: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },

  statLabel: {
    color: '#E5E7EB',
    marginTop: 4,
    fontSize: 12,
  },

  progressWrapper: {
    margin: 20,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 16,
    elevation: 3,
  },

  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  progressText: {
    fontWeight: '700',
    color: '#111827',
  },

  progressPercent: {
    color: '#4F46E5',
    fontWeight: '700',
  },

  progressBar: {
    height: 10,
    backgroundColor: '#E5E7EB',
    borderRadius: 20,
    marginTop: 12,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: '#4F46E5',
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
  navigatorContainer: {
    marginHorizontal: 20,
  },

  navigatorTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 10,
  },

  questionPill: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  activeQuestionPill: {
    backgroundColor: '#4F46E5',
  },

  answeredQuestionPill: {
    backgroundColor: '#C7D2FE',
  },

  questionPillText: {
    fontWeight: '700',
    color: '#374151',
  },

  activeQuestionPillText: {
    color: '#FFF',
  },

  questionCard: {
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 25,
    padding: 20,
    elevation: 4,
  },

  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  questionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  questionBadgeText: {
    marginLeft: 5,
    color: '#4F46E5',
    fontWeight: '700',
  },

  marksBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  marksText: {
    marginLeft: 5,
    color: '#10B981',
    fontWeight: '700',
  },

  questionText: {
    marginTop: 18,
    fontSize: 20,
    color: '#111827',
    fontWeight: '700',
    lineHeight: 30,
  },

  optionsContainer: {
    marginHorizontal: 20,
  },

  optionCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },

  selectedOptionCard: {
    borderWidth: 2,
    borderColor: '#4F46E5',
    backgroundColor: '#EEF2FF',
  },

  optionCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },

  selectedOptionCircle: {
    backgroundColor: '#4F46E5',
  },

  optionLetter: {
    fontWeight: '700',
    color: '#374151',
  },

  selectedOptionLetter: {
    color: '#FFF',
  },

  optionText: {
    flex: 1,
    marginLeft: 15,
    color: '#111827',
    fontSize: 15,
  },

  selectedOptionText: {
    fontWeight: '700',
  },

  summaryCard: {
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 25,
    padding: 20,
    elevation: 4,
  },

  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  summaryLabel: {
    color: '#6B7280',
  },

  summaryValue: {
    color: '#111827',
    fontWeight: '700',
  },

  bottomButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginBottom: 30,
  },

  navButton: {
    width: '35%',
    height: 55,
    backgroundColor: '#FFF',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  disabledButton: {
    opacity: 0.4,
  },

  navButtonText: {
    marginLeft: 5,
    color: '#4F46E5',
    fontWeight: '700',
  },

  nextButton: {
    width: '60%',
  },

  nextGradient: {
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  nextButtonText: {
    color: '#FFF',
    fontWeight: '700',
    marginRight: 6,
  },

  submitButton: {
    width: '60%',
  },

  submitGradient: {
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  submitText: {
    color: '#FFF',
    fontWeight: '700',
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 25,
  },

  modalCard: {
    backgroundColor: '#FFF',
    width: '100%',
    borderRadius: 30,
    padding: 25,
  },

  modalIcon: {
    alignItems: 'center',
  },

  modalTitle: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginTop: 15,
  },

  modalMessage: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 10,
    lineHeight: 22,
  },

  modalStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 25,
  },

  modalStatItem: {
    alignItems: 'center',
    flex: 1,
  },

  modalStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4F46E5',
  },

  modalStatLabel: {
    color: '#6B7280',
    marginTop: 4,
  },

  modalDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
  },

  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  cancelButton: {
    width: '47%',
    height: 52,
    backgroundColor: '#F3F4F6',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButtonText: {
    fontWeight: '700',
    color: '#374151',
  },

  confirmButton: {
    width: '47%',
  },

  confirmGradient: {
    height: 52,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  confirmButtonText: {
    color: '#FFF',
    fontWeight: '800',
  },

  loaderOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  loaderCard: {
    backgroundColor: '#FFF',
    padding: 30,
    borderRadius: 25,
    alignItems: 'center',
    minWidth: 220,
  },

  loaderText: {
    marginTop: 15,
    fontWeight: '700',
    fontSize: 16,
    color: '#111827',
  },

  loaderSubText: {
    color: '#6B7280',
    marginTop: 5,
  },
  exitButton: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  exitModal: {
    backgroundColor: '#FFF',
    borderRadius: 30,
    padding: 25,
    width: '100%',
  },

  exitIconWrapper: {
    alignItems: 'center',
  },

  exitTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    textAlign: 'center',
    marginTop: 15,
  },

  exitMessage: {
    textAlign: 'center',
    marginTop: 10,
    color: '#374151',
    fontSize: 16,
  },

  exitSubMessage: {
    textAlign: 'center',
    color: '#6B7280',
    marginTop: 5,
    lineHeight: 22,
  },

  exitStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 25,
  },

  exitStatCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 18,
    padding: 15,
    alignItems: 'center',
  },

  exitStatValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4F46E5',
  },

  exitStatLabel: {
    marginTop: 5,
    color: '#6B7280',
  },

  continueExamButton: {
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  continueExamText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },

  submitNowButton: {
    marginTop: 15,
    height: 55,
    borderRadius: 15,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },

  submitNowText: {
    color: '#EF4444',
    fontWeight: '700',
    fontSize: 16,
  },
});
