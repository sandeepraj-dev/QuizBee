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

export default function ManageExamScreen() {
  const [search, setSearch] = useState('');

  const exams = [
    {
      id: 1,
      title: 'React Basics Test',
      duration: 30,
      marks: 20,
      status: 'Published',
    },
    {
      id: 2,
      title: 'NodeJS Assessment',
      duration: 45,
      marks: 30,
      status: 'Draft',
    },
    {
      id: 3,
      title: 'MongoDB Quiz',
      duration: 20,
      marks: 15,
      status: 'Published',
    },
  ];

  const filteredExams = exams.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#F59E0B" barStyle="light-content" />

      <ScrollView>
        <LinearGradient colors={['#F59E0B', '#FBBF24']} style={styles.header}>
          <Text style={styles.title}>Manage Exams</Text>

          <Text style={styles.subtitle}>Publish, edit and manage exams</Text>
        </LinearGradient>

        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#9CA3AF" />

          <TextInput
            placeholder="Search exam..."
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        <View style={styles.content}>
          {filteredExams.map(item => (
            <TouchableOpacity key={item.id} activeOpacity={0.85}>
              <View style={styles.examCard}>
                <View style={styles.topRow}>
                  <View>
                    <Text style={styles.examTitle}>{item.title}</Text>

                    <Text style={styles.examInfo}>⏱ {item.duration} mins</Text>

                    <Text style={styles.examInfo}>📝 {item.marks} Marks</Text>
                  </View>

                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor:
                          item.status === 'Published' ? '#DCFCE7' : '#FEF3C7',
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color:
                          item.status === 'Published' ? '#16A34A' : '#D97706',
                        fontWeight: '600',
                      }}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionRow}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Icon name="create-outline" size={18} color="#4F46E5" />
                    <Text style={styles.actionText}>Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
                    <Icon name="eye-outline" size={18} color="#10B981" />
                    <Text style={styles.actionText}>View</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.actionButton}>
                    <Icon name="trash-outline" size={18} color="#EF4444" />
                    <Text style={styles.actionText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 100 }} />
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },

  subtitle: {
    color: '#FEF3C7',
    marginTop: 5,
  },

  searchContainer: {
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

  examCard: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 18,
    marginBottom: 15,
    elevation: 4,
  },

  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  examTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  examInfo: {
    color: '#6B7280',
    marginTop: 5,
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },

  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },

  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionText: {
    marginLeft: 5,
    fontWeight: '600',
    color: '#374151',
  },
});
