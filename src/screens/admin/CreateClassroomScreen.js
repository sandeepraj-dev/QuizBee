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

export default function CreateClassroomScreen() {
  const [classroomName, setClassroomName] = useState('');
  const [description, setDescription] = useState('');
  const [capacity, setCapacity] = useState('');
  const [faculty, setFaculty] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.header}>
          <View style={styles.iconContainer}>
            <Icon name="school" size={40} color="#FFF" />
          </View>

          <Text style={styles.title}>Create Classroom</Text>

          <Text style={styles.subtitle}>
            Create and manage learning batches
          </Text>
        </LinearGradient>

        <View style={styles.statsRow}>
          <View style={styles.statsCard}>
            <Text style={styles.statsValue}>48</Text>
            <Text style={styles.statsLabel}>Classrooms</Text>
          </View>

          <View style={styles.statsCard}>
            <Text style={styles.statsValue}>1200</Text>
            <Text style={styles.statsLabel}>Students</Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Classroom Information</Text>

          <TextInput
            style={styles.input}
            placeholder="Classroom Name"
            value={classroomName}
            onChangeText={setClassroomName}
          />

          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Description"
            multiline
            value={description}
            onChangeText={setDescription}
          />

          <TextInput
            style={styles.input}
            placeholder="Capacity"
            keyboardType="numeric"
            value={capacity}
            onChangeText={setCapacity}
          />

          <TextInput
            style={styles.input}
            placeholder="Faculty Name"
            value={faculty}
            onChangeText={setFaculty}
          />

          <TouchableOpacity activeOpacity={0.8}>
            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Create Classroom</Text>
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

  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },

  statsCard: {
    width: '48%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 20,
    elevation: 5,
  },

  statsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4F46E5',
  },

  statsLabel: {
    color: '#6B7280',
    marginTop: 5,
  },

  formCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
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
});
