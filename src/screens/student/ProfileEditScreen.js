import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';

import API from '../../api/axios';
import { authStore } from '../../store/authStore';

export default function ProfileEditScreen({ navigation }) {
  const user = authStore(state => state.user);

  const [form, setForm] = useState({
    email: user?.email || '',
    phone: user?.phone || '',
    username: user?.username || '',
  });

  const [errors, setErrors] = useState({});

  const validate = () => {
    let temp = {};

    if (
      form.email?.trim() &&
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)
    ) {
      temp.email = 'Please enter a valid email address';
    }

    if (form.phone?.trim() && !/^\d{10}$/.test(form.phone)) {
      temp.phone = 'Please enter a valid 10 digit phone number';
    }

    if (form.username?.trim() && form.username.trim().length < 4) {
      temp.username = 'Username must be at least 4 characters';
    }

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const payload = {};

      if (form.email?.trim()) {
        payload.email = form.email.trim();
      }

      if (form.phone?.trim()) {
        payload.phone = form.phone.trim();
      }

      if (form.username?.trim()) {
        payload.username = form.username.trim();
      }

      await API.put('/auth/profile', payload);

      authStore.getState().setUser({
        ...authStore.getState().user,
        ...payload,
      });

      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: 'Success',
        text2: 'Profile updated successfully',
      });

      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: 'Update Failed',
        text2: error?.response?.data?.message || 'Something went wrong',
      });
    }
  };

  const renderInput = (label, key, placeholder, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[styles.input, errors[key] && styles.inputError]}
        placeholder={placeholder}
        placeholderTextColor="#94A3B8"
        keyboardType={keyboardType}
        value={form[key]}
        autoCapitalize="none"
        onChangeText={text =>
          setForm(prev => ({
            ...prev,
            [key]: text,
          }))
        }
      />

      {errors[key] ? <Text style={styles.error}>{errors[key]}</Text> : null}
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER */}
          <LinearGradient colors={['#4F46E5', '#6366F1']} style={styles.header}>
            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Icon name="arrow-back" size={24} color="#FFF" />
              </TouchableOpacity>

              <Text style={styles.headerTitle}>Edit Profile</Text>

              <View style={{ width: 45 }} />
            </View>
          </LinearGradient>

          {/* PROFILE CARD */}
          <View style={styles.profileCard}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.username?.charAt(0)?.toUpperCase() || 'U'}
              </Text>
            </View>

            <Text style={styles.profileName}>{user?.username || 'User'}</Text>
          </View>

          {/* FORM CARD */}
          <View style={styles.formCard}>
            <Text style={styles.sectionTitle}>Profile Information</Text>

            {renderInput(
              'Email Address',
              'email',
              'Enter email address',
              'email-address',
            )}

            {renderInput(
              'Phone Number',
              'phone',
              'Enter phone number',
              'phone-pad',
            )}

            {renderInput('Username', 'username', 'Enter username')}

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Icon name="checkmark-circle" size={20} color="#FFF" />

              <Text style={styles.saveButtonText}>Update Profile</Text>
            </TouchableOpacity>
          </View>

          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },

  header: {
    height: 180,
    paddingTop: 55,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '700',
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.20)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: -45,
    borderRadius: 24,
    alignItems: 'center',
    paddingVertical: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 5,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 34,
    fontWeight: '700',
    color: '#4F46E5',
  },

  profileName: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },

  profileEmail: {
    marginTop: 5,
    fontSize: 14,
    color: '#64748B',
  },

  formCard: {
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 20,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 10,

    elevation: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
  },

  inputContainer: {
    marginBottom: 18,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },

  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    fontSize: 15,
    color: '#1E293B',
  },

  inputError: {
    borderColor: '#EF4444',
  },

  error: {
    marginTop: 5,
    fontSize: 12,
    color: '#EF4444',
  },

  saveButton: {
    height: 56,
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    marginTop: 12,

    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,

    elevation: 5,
  },

  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
