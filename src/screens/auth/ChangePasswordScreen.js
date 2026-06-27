import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  ScrollView,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

import API from '../../api/axios';

export default function ChangePasswordScreen() {
  const navigation = useNavigation();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!currentPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Current password is required',
      });
      return false;
    }

    if (!newPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'New password is required',
      });
      return false;
    }

    if (newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Password must be at least 6 characters',
      });
      return false;
    }

    if (currentPassword === newPassword) {
      Toast.show({
        type: 'error',
        text1: 'New password must be different',
      });
      return false;
    }

    if (!confirmPassword.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Please confirm password',
      });
      return false;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Passwords do not match',
      });
      return false;
    }

    return true;
  };

  const changePassword = async () => {
    if (!validate()) return;

    try {
      setLoading(true);

      await API.put('/auth/change-password', {
        oldPassword: currentPassword,
        newPassword,
      });

      Toast.show({
        type: 'success',
        text1: 'Password changed successfully',
      });

      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

      setTimeout(() => {
        navigation.goBack();
      }, 1000);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error?.response?.data?.message || 'Failed to change password',
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

        <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.header}>
          <View style={styles.circle1} />
          <View style={styles.circle2} />

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.iconWrapper}>
            <Icon name="lock-closed" size={45} color="#FFF" />
          </View>

          <Text style={styles.headerTitle}>Change Password</Text>

          <Text style={styles.headerSubtitle}>
            Secure your account with a new password
          </Text>
        </LinearGradient>

        {/* FORM */}

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Security Settings</Text>

          {/* Current Password */}

          <Text style={styles.label}>Current Password</Text>

          <View style={styles.inputWrapper}>
            <Icon name="lock-closed-outline" size={22} color="#6B7280" />

            <TextInput
              style={styles.input}
              secureTextEntry={!showCurrent}
              placeholder="Enter current password"
              placeholderTextColor="#9CA3AF"
              value={currentPassword}
              onChangeText={setCurrentPassword}
            />

            <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)}>
              <Icon
                name={showCurrent ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* New Password */}

          <Text style={styles.label}>New Password</Text>

          <View style={styles.inputWrapper}>
            <Icon name="key-outline" size={22} color="#6B7280" />

            <TextInput
              style={styles.input}
              secureTextEntry={!showNew}
              placeholder="Enter new password"
              placeholderTextColor="#9CA3AF"
              value={newPassword}
              onChangeText={setNewPassword}
            />

            <TouchableOpacity onPress={() => setShowNew(!showNew)}>
              <Icon
                name={showNew ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}

          <Text style={styles.label}>Confirm Password</Text>

          <View style={styles.inputWrapper}>
            <Icon name="shield-checkmark-outline" size={22} color="#6B7280" />

            <TextInput
              style={styles.input}
              secureTextEntry={!showConfirm}
              placeholder="Repeat new password"
              placeholderTextColor="#9CA3AF"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
              <Icon
                name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#6B7280"
              />
            </TouchableOpacity>
          </View>

          {/* Button */}

          <TouchableOpacity
            disabled={loading}
            activeOpacity={0.8}
            onPress={changePassword}
          >
            <LinearGradient
              colors={['#4F46E5', '#7C3AED']}
              style={styles.button}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <>
                  <Icon name="checkmark-circle" size={22} color="#FFF" />
                  <Text style={styles.buttonText}>Update Password</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
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
    paddingBottom: 40,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    overflow: 'hidden',
  },

  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  iconWrapper: {
    width: 95,
    height: 95,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
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
    marginTop: 8,
  },

  card: {
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 24,
    padding: 20,
    elevation: 5,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    color: '#111827',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 10,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 58,
    marginBottom: 10,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    color: '#111827',
  },

  button: {
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 25,
  },

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },

  circle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -40,
    right: -50,
  },

  circle2: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -20,
    left: -30,
  },
});
