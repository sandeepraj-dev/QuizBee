import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

export default function AdminModulesScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');

  const academicModules = [
    {
      title: 'Create Classroom',
      description: 'Create new classrooms',
      icon: 'school',
      route: 'CreateClassroom',
      colors: ['#4F46E5', '#6366F1'],
    },
    {
      title: 'Manage Classroom',
      description: 'Manage all classrooms',
      icon: 'business',
      route: 'ManageClassroom',
      colors: ['#06B6D4', '#0EA5E9'],
    },
    {
      title: 'Create Exam',
      description: 'Create online exams',
      icon: 'document-text',
      route: 'CreateExam',
      colors: ['#10B981', '#34D399'],
    },
    {
      title: 'Manage Exam',
      description: 'Publish and manage exams',
      icon: 'clipboard',
      route: 'ManageExam',
      colors: ['#F59E0B', '#FBBF24'],
    },
    {
      title: 'Create Question',
      description: 'Add exam questions',
      icon: 'create',
      route: 'CreateQuestion',
      colors: ['#EC4899', '#F472B6'],
    },
    {
      title: 'Manage Question',
      description: 'Question bank management',
      icon: 'reader',
      route: 'ManageQuestion',
      colors: ['#8B5CF6', '#A78BFA'],
    },
  ];

  const adminModules = [
    {
      title: 'Students',
      description: 'Manage students',
      icon: 'people',
      route: 'Students',
      colors: ['#14B8A6', '#2DD4BF'],
    },
    {
      title: 'Faculty',
      description: 'Manage faculty',
      icon: 'person',
      route: 'Faculty',
      colors: ['#EF4444', '#F87171'],
    },
    {
      title: 'Attempts',
      description: 'Exam attempts',
      icon: 'analytics',
      route: 'Attempts',
      colors: ['#0891B2', '#06B6D4'],
    },
    {
      title: 'Reports',
      description: 'Analytics & reports',
      icon: 'bar-chart',
      route: 'Reports',
      colors: ['#7C3AED', '#A855F7'],
    },
    {
      title: 'Settings',
      description: 'Application settings',
      route: 'Settings',
      icon: 'settings',
      colors: ['#374151', '#6B7280'],
    },
  ];
  const filteredAcademicModules = academicModules.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );

  const filteredAdminModules = adminModules.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase()),
  );
  const handleNavigation = item => {
    try {
      console.log(navigation.getState());
      navigation.navigate(item.route);
    } catch (error) {
      console.log('Navigation Error:', error);
    }
  };

  const renderCard = item => (
    <TouchableOpacity
      key={item.title}
      activeOpacity={0.85}
      style={styles.cardWrapper}
      onPress={() => handleNavigation(item)}
    >
      <LinearGradient colors={item.colors} style={styles.card}>
        <View style={styles.iconCircle}>
          <Icon name={item.icon} size={28} color="#FFF" />
        </View>

        <View>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDescription}>{item.description}</Text>
        </View>

        <View style={styles.arrowContainer}>
          <Icon name="arrow-forward" size={20} color="#FFF" />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <LinearGradient colors={['#4338CA', '#7C3AED']} style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>LMS Control Center</Text>
          </View>

          <Text style={styles.headerSubtitle}>
            Manage classrooms, exams, students, faculty and reports
          </Text>
        </LinearGradient>

        {/* SEARCH */}
        <View style={styles.searchContainer}>
          <Icon name="search" size={20} color="#9CA3AF" />

          <TextInput
            placeholder="Search modules..."
            placeholderTextColor="#9CA3AF"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
        </View>

        {/* ACADEMIC */}
        {filteredAcademicModules.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Academic Management</Text>

            <View style={styles.grid}>
              {filteredAcademicModules.map(renderCard)}
            </View>
          </>
        )}
        {/* ADMIN */}

        {filteredAdminModules.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Administration</Text>

            <View style={styles.grid}>
              {filteredAdminModules.map(renderCard)}
            </View>
          </>
        )}
        <View style={{ height: 120 }} />
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
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 70,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  headerTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFF',
  },

  headerSubtitle: {
    marginTop: 8,
    color: '#E0E7FF',
    fontSize: 14,
    lineHeight: 22,
  },

  searchContainer: {
    marginHorizontal: 20,
    marginTop: -25,

    backgroundColor: '#FFF',

    height: 60,

    borderRadius: 18,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: 18,

    elevation: 6,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#111827',
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',

    marginTop: 25,
    marginBottom: 15,

    paddingHorizontal: 20,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',

    paddingHorizontal: 15,
  },

  cardWrapper: {
    width: '48%',
    marginBottom: 15,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  card: {
    height: 190,

    borderRadius: 28,

    padding: 18,

    justifyContent: 'space-between',

    elevation: 8,

    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,

    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  iconCircle: {
    width: 55,
    height: 55,

    borderRadius: 30,

    backgroundColor: 'rgba(255,255,255,0.20)',

    justifyContent: 'center',
    alignItems: 'center',
  },

  cardTitle: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
  },

  cardDescription: {
    color: 'rgba(255,255,255,0.85)',
    marginTop: 6,
    fontSize: 12,
  },

  arrowContainer: {
    alignSelf: 'flex-end',
  },
});
