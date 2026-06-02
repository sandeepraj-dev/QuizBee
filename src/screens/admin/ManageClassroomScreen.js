import React, { useState } from 'react';

import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function ManageClassroomScreen() {
  const [search, setSearch] = useState('');

  const classrooms = [
    {
      id: 1,
      name: 'MERN Stack Batch',
      students: 45,
      faculty: 'John Doe',
    },
    {
      id: 2,
      name: 'React Native Batch',
      students: 30,
      faculty: 'David',
    },
    {
      id: 3,
      name: 'Python Full Stack',
      students: 52,
      faculty: 'Alex',
    },
  ];

  const filteredClassrooms = classrooms.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#06B6D4" barStyle="light-content" />

      <ScrollView>
        <LinearGradient colors={['#06B6D4', '#0EA5E9']} style={styles.header}>
          <Text style={styles.title}>Manage Classrooms</Text>

          <Text style={styles.subtitle}>View and manage classroom batches</Text>
        </LinearGradient>

        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#9CA3AF" />

          <TextInput
            style={styles.searchInput}
            placeholder="Search classroom..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <View style={styles.content}>
          {filteredClassrooms.map(item => (
            <TouchableOpacity key={item.id} activeOpacity={0.85}>
              <View style={styles.classroomCard}>
                <View style={styles.topRow}>
                  <View>
                    <Text style={styles.classroomName}>{item.name}</Text>

                    <Text style={styles.faculty}>Faculty: {item.faculty}</Text>
                  </View>

                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>Active</Text>
                  </View>
                </View>

                <View style={styles.bottomRow}>
                  <View>
                    <Text style={styles.students}>
                      👨‍🎓 {item.students} Students
                    </Text>
                  </View>

                  <Icon name="chevron-forward" size={22} color="#6B7280" />
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
    color: '#E0F2FE',
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

  classroomCard: {
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

  classroomName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },

  faculty: {
    marginTop: 5,
    color: '#6B7280',
  },

  badge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  badgeText: {
    color: '#16A34A',
    fontWeight: '600',
  },

  bottomRow: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  students: {
    color: '#374151',
    fontWeight: '600',
  },
});
