import React from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Alert,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';

import Icon from 'react-native-vector-icons/Ionicons';

import { useNavigation, useRoute } from '@react-navigation/native';

import Toast from 'react-native-toast-message';

import API from '../../api/axios';
export default function QuestionPreviewScreen() {
  const navigation = useNavigation();

  const route = useRoute();

  const question = route.params?.question;

  const classroom = route.params?.classroom;

  const exam = route.params?.exam;
  const deleteQuestion = () => {
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
                text1: 'Question deleted successfully',
              });

              navigation.goBack();
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: error?.response?.data?.message || 'Delete Failed',
              });
            }
          },
        },
      ],
    );
  };
  const editQuestion = () => {
    navigation.navigate('CreateQuestion', {
      isEdit: true,
      editQuestion: question,
      classroom,
      exam,
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />

      <ScrollView>
        {' '}
        <LinearGradient
          colors={['#4F46E5', '#7C3AED', '#9333EA']}
          style={styles.header}
        >
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.headerIcon}>
            <Icon name="help-circle" size={45} color="#FFF" />
          </View>

          <Text style={styles.headerTitle}>Question Details</Text>

          <Text style={styles.headerSubtitle}>View Question Information</Text>
        </LinearGradient>{' '}
        <View style={styles.card}>
          <Text style={styles.label}>Classroom</Text>
          <Text style={styles.value}>{classroom?.name}</Text>
          <Text style={styles.label}>Exam</Text>
          <Text style={styles.value}>{exam?.title}</Text>
          <Text style={styles.label}>Question</Text>
          <Text style={styles.questionText}>{question.question}</Text>{' '}
          <Text style={styles.label}>Options</Text>
          {question.options?.map((option, index) => (
            <View
              key={index}
              style={[
                styles.optionBox,

                option === question.answer && styles.correctOption,
              ]}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={styles.optionLetter}>
                  {String.fromCharCode(65 + index)}.
                </Text>

                <Text style={styles.optionText}>{option}</Text>
              </View>

              {option === question.answer && (
                <Icon name="checkmark-circle" size={22} color="#10B981" />
              )}
            </View>
          ))}{' '}
          <View style={styles.marksBox}>
            <Icon name="trophy" size={22} color="#F59E0B" />

            <Text style={styles.marksText}>Marks : {question.marks}</Text>
          </View>{' '}
          <TouchableOpacity onPress={editQuestion}>
            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
              style={styles.editButton}
            >
              <Icon name="create-outline" size={20} color="#FFF" />

              <Text style={styles.btnText}>Edit Question</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={deleteQuestion}
          >
            <Icon name="trash-outline" size={20} color="#FFF" />

            <Text style={styles.btnText}>Delete Question</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  header: {
    padding: 25,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  backBtn: {
    position: 'absolute',
    left: 20,
    top: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.15)',
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
    marginTop: 30,
  },

  headerTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 15,
  },

  headerSubtitle: {
    color: '#E2E8F0',
    marginTop: 5,
  },

  card: {
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 25,
    padding: 20,
    elevation: 4,
  },

  label: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 15,
    marginBottom: 5,
  },

  value: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 16,
  },

  questionText: {
    color: '#0F172A',
    fontSize: 18,
    lineHeight: 28,
    fontWeight: '600',
  },

  optionBox: {
    backgroundColor: '#F8FAFC',
    padding: 15,
    borderRadius: 15,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  correctOption: {
    borderWidth: 1,
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },

  optionLetter: {
    fontWeight: '700',
    marginRight: 10,
  },

  optionText: {
    color: '#0F172A',
  },

  marksBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 25,
  },

  marksText: {
    marginLeft: 8,
    color: '#F59E0B',
    fontWeight: '700',
    fontSize: 16,
  },

  editButton: {
    height: 55,
    borderRadius: 15,
    marginTop: 25,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  deleteButton: {
    height: 55,
    borderRadius: 15,
    marginTop: 12,
    backgroundColor: '#EF4444',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  btnText: {
    color: '#FFF',
    fontWeight: '700',
    marginLeft: 8,
  },
});
