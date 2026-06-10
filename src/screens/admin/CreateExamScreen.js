import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { Dropdown } from 'react-native-element-dropdown';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

import API from '../../api/axios';

export default function CreateExamScreen() {
  const navigation = useNavigation();

  const route = useRoute();

  const isEdit = route?.params?.isEdit || false;
  const examData = route?.params?.exam;

  const [classrooms, setClassrooms] = useState([]);
  const [loadingClassrooms, setLoadingClassrooms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [selectedClassroom, setSelectedClassroom] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadClassrooms();
  }, []);

  useEffect(() => {
    if (isEdit && examData && classrooms.length > 0) {
      setSelectedClassroom(examData?.classroomId?._id || examData?.classroomId);

      setTitle(examData?.title || '');
      setDescription(examData?.description || '');
      setDuration(String(examData?.duration || ''));
    }
  }, [examData, classrooms]);

  const loadClassrooms = async () => {
    try {
      setLoadingClassrooms(true);

      const response = await API.get('/classrooms');

      const formatted = response.data.map(item => ({
        label: item.name,
        value: item._id,
      }));

      setClassrooms(formatted);
    } catch (error) {
      console.log(error);
      Toast.show({
        type: 'error',
        text1: 'Failed to load classrooms',
      });
    } finally {
      setLoadingClassrooms(false);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!selectedClassroom) newErrors.classroom = 'Please select classroom';

    if (!title.trim()) newErrors.title = 'Exam title is required';

    if (!description.trim()) newErrors.description = 'Description is required';

    if (!duration) newErrors.duration = 'Duration is required';

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const saveExam = async () => {
    if (!validate()) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        classroomId: selectedClassroom,
        title,
        description,
        duration: Number(duration),
      };

      if (isEdit) {
        await API.put(`/exams/${examData._id}`, payload);

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Exam updated successfully',
        });
      } else {
        await API.post('/exams', payload);

        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: 'Exam created successfully',
        });
      }

      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || 'Operation failed',
      });
    } finally {
      setLoading(false);
    }
  };

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
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.iconContainer}>
            <Icon name="document-text" size={42} color="#FFF" />
          </View>

          <Text style={styles.headerTitle}>
            {isEdit ? 'Update Exam' : 'Create Exam'}
          </Text>

          <Text style={styles.headerSubtitle}>
            Create assessments and tests for students
          </Text>
        </LinearGradient>

        {/* FORM */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Exam Information</Text>

          <Text style={styles.label}>Classroom *</Text>

          {loadingClassrooms ? (
            <ActivityIndicator size="large" color="#4F46E5" />
          ) : (
            <Dropdown
              style={[styles.dropdown, errors.classroom && styles.errorBorder]}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={classrooms}
              labelField="label"
              valueField="value"
              placeholder="Select Classroom"
              value={selectedClassroom}
              onChange={item => setSelectedClassroom(item.value)}
            />
          )}

          {errors.classroom && (
            <Text style={styles.errorText}>{errors.classroom}</Text>
          )}

          <Text style={styles.label}>Exam Title *</Text>

          <TextInput
            style={[styles.input, errors.title && styles.errorBorder]}
            placeholder="React Basics Test"
            placeholderTextColor="#9CA3AF"
            value={title}
            onChangeText={setTitle}
          />

          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

          <Text style={styles.label}>Description *</Text>

          <TextInput
            multiline
            style={[
              styles.input,
              styles.multiline,
              errors.description && styles.errorBorder,
            ]}
            placeholder="React MCQ Test"
            placeholderTextColor="#9CA3AF"
            value={description}
            onChangeText={setDescription}
          />

          {errors.description && (
            <Text style={styles.errorText}>{errors.description}</Text>
          )}

          <Text style={styles.label}>Duration (Minutes) *</Text>

          <TextInput
            keyboardType="numeric"
            style={[styles.input, errors.duration && styles.errorBorder]}
            placeholder="30"
            placeholderTextColor="#9CA3AF"
            value={duration}
            onChangeText={setDuration}
          />

          {errors.duration && (
            <Text style={styles.errorText}>{errors.duration}</Text>
          )}

          <TouchableOpacity
            disabled={loading}
            onPress={saveExam}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Icon name="add-circle-outline" size={22} color="#FFF" />

                  <Text style={styles.buttonText}>
                    {isEdit ? 'Update Exam' : 'Create Exam'}
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={{ height: 60 }} />
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
    padding: 20,
    paddingBottom: 35,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    overflow: 'hidden',
  },

  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 20,
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 18,
  },

  headerSubtitle: {
    color: '#E5E7EB',
    textAlign: 'center',
    marginTop: 6,
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
    color: '#111827',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#374151',
  },

  input: {
    height: 55,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#111827',
  },

  multiline: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },

  dropdown: {
    height: 55,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  placeholderStyle: {
    color: '#9CA3AF',
  },

  selectedTextStyle: {
    color: '#111827',
  },

  button: {
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 10,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },

  errorText: {
    color: '#EF4444',
    marginTop: -10,
    marginBottom: 10,
    marginLeft: 4,
    fontSize: 12,
  },

  errorBorder: {
    borderWidth: 1,
    borderColor: '#EF4444',
  },

  circle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -50,
    right: -50,
  },

  circle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -20,
    left: -30,
  },
});
