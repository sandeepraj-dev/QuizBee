import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

import API from '../../api/axios';

export default function SelectClassroomScreen() {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState('');
  const [classrooms, setClassrooms] = useState([]);

  useEffect(() => {
    loadClassrooms();
  }, []);

  const loadClassrooms = async () => {
    try {
      setLoading(true);

      const response = await API.get('/student/my-classrooms');

      setClassrooms(response?.data?.data || []);
    } catch (error) {
      console.log(error);

      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Failed to load classrooms',
      });
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    await loadClassrooms();

    setRefreshing(false);
  }, []);

  const filteredClassrooms = classrooms.filter(item =>
    item?.name?.toLowerCase()?.includes(search.toLowerCase()),
  );

  const renderClassroom = ({ item }) => {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.classroomCard}
        onPress={() =>
          navigation.navigate('SelectExamScreen', {
            classroomId: item._id,
            classroomName: item.name,
          })
        }
      >
        <LinearGradient
          colors={['#EEF2FF', '#E0E7FF']}
          style={styles.iconContainer}
        >
          <Icon name="library-outline" size={30} color="#4F46E5" />
        </LinearGradient>

        <View style={styles.classroomInfo}>
          <Text style={styles.classroomName}>{item.name}</Text>

          <Text style={styles.classroomDesc}>
            {item.description || 'Learning Classroom'}
          </Text>
        </View>

        <View style={styles.arrowContainer}>
          <Icon name="chevron-forward" size={24} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />

      {/* HEADER */}

      <LinearGradient
        colors={['#4F46E5', '#7C3AED', '#9333EA']}
        style={styles.header}
      >
        <View style={styles.circle1} />
        <View style={styles.circle2} />

        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.iconBox}>
          <Icon name="school-outline" size={42} color="#FFF" />
        </View>

        <Text style={styles.headerTitle}>My Classrooms</Text>

        <Text style={styles.headerSubtitle}>
          Select a classroom to continue
        </Text>
      </LinearGradient>

      {/* SEARCH */}

      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={22} color="#9CA3AF" />

        <TextInput
          placeholder="Search classroom..."
          placeholderTextColor="#9CA3AF"
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* LIST */}

      {filteredClassrooms.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Icon name="school-outline" size={80} color="#CBD5E1" />

          <Text style={styles.emptyTitle}>No Classrooms Found</Text>

          <Text style={styles.emptySubtitle}>
            No assigned classroom available
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredClassrooms}
          keyExtractor={item => item._id}
          renderItem={renderClassroom}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 40,
          }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconBox: {
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 15,
  },

  headerTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 15,
  },

  headerSubtitle: {
    color: '#E5E7EB',
    textAlign: 'center',
    marginTop: 6,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 15,
    borderRadius: 16,
    height: 55,
    elevation: 3,
  },

  searchInput: {
    flex: 1,
    marginLeft: 10,
    color: '#111827',
  },

  classroomCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    marginBottom: 14,
    padding: 16,
    borderRadius: 20,
    elevation: 3,
  },

  iconContainer: {
    width: 65,
    height: 65,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  classroomInfo: {
    flex: 1,
    marginLeft: 15,
  },

  classroomName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#111827',
  },

  classroomDesc: {
    color: '#6B7280',
    marginTop: 4,
    fontSize: 13,
  },

  arrowContainer: {
    marginLeft: 10,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 15,
    color: '#111827',
  },

  emptySubtitle: {
    marginTop: 6,
    color: '#6B7280',
  },

  circle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -50,
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
});
