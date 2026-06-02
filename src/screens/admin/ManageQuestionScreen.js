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

export default function ManageQuestionScreen() {
  const [search, setSearch] = useState('');

  const questions = [
    {
      id: 1,
      question: 'What is React?',
      answer: 'Library',
      marks: 5,
    },
    {
      id: 2,
      question: 'Who developed React?',
      answer: 'Facebook',
      marks: 5,
    },
    {
      id: 3,
      question: 'What is NodeJS?',
      answer: 'Runtime Environment',
      marks: 10,
    },
  ];

  const filteredQuestions = questions.filter(item =>
    item.question.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#6366F1" barStyle="light-content" />

      <ScrollView>
        <LinearGradient colors={['#6366F1', '#A855F7']} style={styles.header}>
          <Text style={styles.title}>Question Bank</Text>

          <Text style={styles.subtitle}>Manage all exam questions</Text>
        </LinearGradient>

        <View style={styles.searchBox}>
          <Icon name="search" size={20} color="#9CA3AF" />

          <TextInput
            placeholder="Search question..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.content}>
          {filteredQuestions.map(item => (
            <View key={item.id} style={styles.questionCard}>
              <View style={styles.questionTop}>
                <View style={styles.questionIcon}>
                  <Icon name="help" size={22} color="#6366F1" />
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.questionText}>{item.question}</Text>

                  <Text style={styles.answer}>Answer: {item.answer}</Text>

                  <Text style={styles.marks}>{item.marks} Marks</Text>
                </View>
              </View>

              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionBtn}>
                  <Icon name="create-outline" size={18} color="#4F46E5" />

                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn}>
                  <Icon name="trash-outline" size={18} color="#EF4444" />

                  <Text style={styles.actionText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
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
    padding: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  title: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },

  subtitle: {
    color: '#EDE9FE',
    marginTop: 5,
  },

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: -20,
    borderRadius: 18,
    paddingHorizontal: 15,
    elevation: 5,
  },

  searchInput: {
    flex: 1,
    height: 55,
    marginLeft: 10,
  },

  content: {
    padding: 20,
  },

  questionCard: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 15,
    elevation: 4,
  },

  questionTop: {
    flexDirection: 'row',
  },

  questionIcon: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  questionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },

  answer: {
    marginTop: 8,
    color: '#10B981',
    fontWeight: '600',
  },

  marks: {
    marginTop: 5,
    color: '#6B7280',
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 15,
  },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 20,
  },

  actionText: {
    marginLeft: 5,
    fontWeight: '600',
  },
});
