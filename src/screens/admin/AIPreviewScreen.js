import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

import API from '../../api/axios';

export default function AIPreviewScreen({ navigation, route }) {
  const [questions, setQuestions] = useState(route.params?.questions || []);
  console.log(route?.params);

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const classroomId = route.params?.questions[0]?.classroomId || null;
  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const deleteQuestion = index => {
    const updated = [...questions];

    updated.splice(index, 1);

    setQuestions(updated);

    Toast.show({
      type: 'success',
      position: 'bottom',
      text1: 'Question Removed',
    });
  };

  const saveQuestions = async () => {
    if (questions.length === 0) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'No Questions Available',
      });

      return;
    }

    try {
      setLoading(true);

      await API.post(`/questions/classroom/${classroomId}`, questions);

      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Questions Saved Successfully',
      });

      navigation.goBack();
    } catch (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Save Failed',
      });
    } finally {
      setLoading(false);
    }
  };

  const renderQuestionCard = (question, index) => {
    return (
      <View key={index} style={styles.questionCard}>
        <View style={styles.questionHeader}>
          <View style={styles.questionBadge}>
            <Text style={styles.questionBadgeText}>Q{index + 1}</Text>
          </View>

          <TouchableOpacity onPress={() => deleteQuestion(index)}>
            <Icon name="trash-outline" size={22} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <Text style={styles.questionText}>{question.question}</Text>

        <View style={styles.optionsContainer}>
          {question.options?.map((option, optionIndex) => (
            <View
              key={optionIndex}
              style={[
                styles.optionCard,
                option === question.answer && styles.correctOption,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  option === question.answer && styles.correctOptionText,
                ]}
              >
                {String.fromCharCode(65 + optionIndex)}. {option}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.answerBox}>
            <Icon name="checkmark-circle" size={18} color="#10B981" />

            <Text style={styles.answerText}>{question.answer}</Text>
          </View>

          <View style={styles.marksBadge}>
            <Text style={styles.marksText}>{question.marks} Marks</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <>
      <StatusBar barStyle="light-content" />

      <View style={styles.container}>
        <LinearGradient colors={['#4F46E5', '#6366F1']} style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={22} color="#FFF" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>AI Generated Questions</Text>

          <Text style={styles.headerSubtitle}>
            {questions.length} Questions Ready
          </Text>
        </LinearGradient>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {questions.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Icon name="document-text-outline" size={70} color="#CBD5E1" />

              <Text style={styles.emptyText}>No Questions Available</Text>
            </View>
          ) : (
            questions.map(renderQuestionCard)
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        {questions.length > 0 && (
          <TouchableOpacity
            style={styles.saveButton}
            onPress={saveQuestions}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Icon name="save-outline" size={22} color="#FFF" />

                <Text style={styles.saveButtonText}>Save All Questions</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  header: {
    height: 180,
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
    fontSize: 24,
    fontWeight: '700',
    marginTop: 15,
  },

  headerSubtitle: {
    color: '#E0E7FF',
    marginTop: 6,
  },

  content: {
    flex: 1,
    marginTop: -25,
    paddingHorizontal: 15,
  },

  questionCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 15,
    elevation: 4,
  },

  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  questionBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  questionBadgeText: {
    color: '#4F46E5',
    fontWeight: '700',
  },

  questionText: {
    marginTop: 15,
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    lineHeight: 24,
  },

  optionsContainer: {
    marginTop: 15,
  },

  optionCard: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
  },

  correctOption: {
    backgroundColor: '#DCFCE7',
  },

  optionText: {
    color: '#334155',
    fontSize: 14,
  },

  correctOptionText: {
    color: '#166534',
    fontWeight: '700',
  },

  footer: {
    marginTop: 15,
  },

  answerBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  answerText: {
    marginLeft: 8,
    color: '#10B981',
    fontWeight: '700',
  },

  marksBadge: {
    marginTop: 10,
    alignSelf: 'flex-start',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },

  marksText: {
    color: '#92400E',
    fontWeight: '600',
  },

  saveButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 58,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  saveButtonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 10,
  },

  emptyContainer: {
    marginTop: 100,
    alignItems: 'center',
  },

  emptyText: {
    marginTop: 15,
    fontSize: 16,
    color: '#64748B',
  },
});
