import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';

import API from './../../api/axios';

export default function EditClassroomScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const { classroom } = route.params;

  const [name, setName] = useState(classroom?.name || '');
  const [description, setDescription] = useState(classroom?.description || '');
  const [loading, setLoading] = useState(false);

  const updateClassroom = async () => {
    if (!name.trim() || !description.trim()) {
      Alert.alert('Validation', 'All fields are required');
      return;
    }

    try {
      setLoading(true);

      await API.put(`/classrooms/${classroom._id}`, {
        name,
        description,
      });

      Alert.alert('Success', 'Classroom updated successfully');

      navigation.goBack();
    } catch (error) {
      console.log(error?.response?.data || error);
      Alert.alert('Error', error?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />

      {/* HEADER */}
      <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={26} color="#fff" />
          </TouchableOpacity>

          <Text style={styles.heading}>Edit Classroom</Text>

          <View style={{ width: 26 }} />
        </View>

        {/* <View style={styles.idBox}>
          <Text style={styles.idText}>ID: {classroom._id}</Text>
        </View> */}
      </LinearGradient>

      {/* FORM */}
      <View style={styles.formContainer}>
        <Text style={styles.label}>Classroom Name</Text>

        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Enter classroom name"
          style={styles.input}
        />

        <Text style={styles.label}>Description</Text>

        <TextInput
          value={description}
          onChangeText={setDescription}
          placeholder="Enter description"
          multiline
          style={[styles.input, styles.textArea]}
        />

        {/* SAVE BUTTON */}
        <TouchableOpacity
          onPress={updateClassroom}
          activeOpacity={0.8}
          disabled={loading}
        >
          <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.button}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Update Classroom</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
  },

  /* HEADER */
  header: {
    paddingTop: 55,
    paddingHorizontal: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  heading: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },

  idBox: {
    marginTop: 15,
    backgroundColor: 'rgba(255,255,255,0.15)',
    padding: 10,
    borderRadius: 10,
  },

  idText: {
    color: '#E0E7FF',
    fontSize: 12,
  },

  /* FORM */
  formContainer: {
    padding: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 10,
    color: '#334155',
  },

  input: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },

  textArea: {
    height: 110,
    textAlignVertical: 'top',
    paddingTop: 15,
  },

  button: {
    marginTop: 25,
    height: 55,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});
