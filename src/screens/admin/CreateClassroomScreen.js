import React, { useState } from 'react';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import API from './../../api/axios';
export default function CreateClassroomScreen() {
  const [classroomName, setClassroomName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [nameError, setNameError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');

  const navigation = useNavigation();
  const createClassroom = async () => {
    let valid = true;

    setNameError('');
    setDescriptionError('');

    if (!classroomName.trim()) {
      setNameError('Classroom name is required');
      valid = false;
    }

    if (!description.trim()) {
      setDescriptionError('Description is required');
      valid = false;
    }
    if (classroomName.trim().length < 3) {
      setNameError('Classroom name must be at least 3 characters');
      valid = false;
    }

    if (description.trim().length < 10) {
      setDescriptionError('Description must be at least 10 characters');
      valid = false;
    }

    if (!valid) {
      return;
    }

    try {
      setLoading(true);

      const response = await API.post('/classrooms', {
        name: classroomName,
        description,
      });

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Classroom created successfully',
        position: 'bottom',
      });
      setClassroomName('');
      setDescription('');

      setNameError('');
      setDescriptionError('');
    } catch (error) {
      console.log(error?.response?.data || error);
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Error',
        text2: error?.response?.data?.message || 'Registration failed',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={['#4F46E5', '#7C3AED', '#9333EA']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          {/* Background Design */}
          <View style={styles.circle1} />
          <View style={styles.circle2} />

          {/* Top Row */}
          <View style={styles.headerTop}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuButton}>
              <Icon name="ellipsis-horizontal" size={22} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Icon */}
          <View style={styles.iconWrapper}>
            <LinearGradient
              colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0.15)']}
              style={styles.iconContainer}
            >
              <Icon name="school" size={42} color="#FFF" />
            </LinearGradient>
          </View>

          <Text style={styles.title}>Create Classroom</Text>

          <Text style={styles.subtitle}>
            Create learning batches and manage students efficiently
          </Text>
        </LinearGradient>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Classroom Information</Text>

          <TextInput
            style={[styles.input, nameError ? styles.errorInput : null]}
            placeholder="Classroom Name"
            placeholderTextColor="#6b6f77"
            value={classroomName}
            onChangeText={text => {
              setClassroomName(text);

              if (text.trim()) {
                setNameError('');
              }
            }}
          />

          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}

          <TextInput
            style={[
              styles.input,
              styles.multiline,
              descriptionError ? styles.errorInput : null,
            ]}
            placeholderTextColor="#6b6f77"
            placeholder="Description"
            multiline
            value={description}
            onChangeText={text => {
              setDescription(text);

              if (text.trim()) {
                setDescriptionError('');
              }
            }}
          />

          {descriptionError ? (
            <Text style={styles.errorText}>{descriptionError}</Text>
          ) : null}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={createClassroom}
            disabled={loading}
          >
            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Create Classroom</Text>
              )}
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
    padding: 25,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    alignItems: 'center',
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
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
    color: '#E5E7EB',
    marginTop: 5,
  },

  formCard: {
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 25,
    padding: 20,
    elevation: 5,
  },

  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },

  input: {
    color: '#111827',
    height: 55,
    backgroundColor: '#F3F4F6',
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 15,
  },

  multiline: {
    height: 100,
    textAlignVertical: 'top',
    paddingTop: 15,
  },

  button: {
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  errorInput: {
    borderWidth: 1,
    borderColor: '#EF4444',
  },

  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -10,
    marginBottom: 12,
    marginLeft: 5,
    fontWeight: '500',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
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

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconWrapper: {
    alignItems: 'center',
    marginTop: 25,
  },

  iconContainer: {
    width: 95,
    height: 95,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 20,
  },

  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    marginTop: 8,
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 20,
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
    bottom: -30,
    left: -30,
  },
});
