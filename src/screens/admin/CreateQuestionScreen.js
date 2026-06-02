import React, { useState } from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function CreateQuestionScreen() {
  const [question, setQuestion] = useState('');
  const [optionA, setOptionA] = useState('');
  const [optionB, setOptionB] = useState('');
  const [optionC, setOptionC] = useState('');
  const [optionD, setOptionD] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('A');
  const [marks, setMarks] = useState('');

  const options = ['A', 'B', 'C', 'D'];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#8B5CF6" barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#8B5CF6', '#EC4899']} style={styles.header}>
          <View style={styles.headerIcon}>
            <Icon name="help-circle" size={42} color="#FFF" />
          </View>

          <Text style={styles.title}>Create Question</Text>

          <Text style={styles.subtitle}>Add questions to your exam</Text>
        </LinearGradient>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Question Details</Text>

          <TextInput
            placeholder="Enter Question"
            value={question}
            onChangeText={setQuestion}
            multiline
            style={[styles.input, styles.questionInput]}
          />

          <TextInput
            placeholder="Option A"
            value={optionA}
            onChangeText={setOptionA}
            style={styles.input}
          />

          <TextInput
            placeholder="Option B"
            value={optionB}
            onChangeText={setOptionB}
            style={styles.input}
          />

          <TextInput
            placeholder="Option C"
            value={optionC}
            onChangeText={setOptionC}
            style={styles.input}
          />

          <TextInput
            placeholder="Option D"
            value={optionD}
            onChangeText={setOptionD}
            style={styles.input}
          />

          <Text style={styles.label}>Correct Answer</Text>

          <View style={styles.answerRow}>
            {options.map(item => (
              <TouchableOpacity
                key={item}
                onPress={() => setCorrectAnswer(item)}
                style={[
                  styles.answerBtn,
                  correctAnswer === item && styles.activeAnswer,
                ]}
              >
                <Text
                  style={[
                    styles.answerText,
                    correctAnswer === item && styles.activeAnswerText,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            placeholder="Marks"
            keyboardType="numeric"
            value={marks}
            onChangeText={setMarks}
            style={styles.input}
          />

          <TouchableOpacity>
            <LinearGradient
              colors={['#8B5CF6', '#EC4899']}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Create Question</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  header: {
    alignItems: 'center',
    padding: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  headerIcon: {
    width: 85,
    height: 85,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginTop: 15,
  },

  subtitle: {
    color: '#FBCFE8',
    marginTop: 5,
  },

  card: {
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 25,
    padding: 20,
    elevation: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },

  input: {
    backgroundColor: '#F3F4F6',
    borderRadius: 15,
    height: 55,
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  questionInput: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 15,
  },

  label: {
    fontWeight: '700',
    marginBottom: 10,
  },

  answerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  answerBtn: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  activeAnswer: {
    backgroundColor: '#8B5CF6',
  },

  answerText: {
    fontWeight: '700',
    color: '#374151',
  },

  activeAnswerText: {
    color: '#FFF',
  },

  button: {
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
});
