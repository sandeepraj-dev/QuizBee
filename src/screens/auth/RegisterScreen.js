import React, { useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  StatusBar,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';
import { useNavigation } from '@react-navigation/native';
import { registerAPI } from '../../api/auth.api';

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('');

  const [email, setEmail] = useState('');

  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');

  const [role, setRole] = useState('ADMIN');

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const onRegister = async () => {
    if (!fullName || !email || !username || !password) {
      Alert.alert('Validation', 'Please fill all fields');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        username,
        password,
        role,
        fullName,
        email,
      };

      const response = await registerAPI(payload);

      console.log(response);

      Alert.alert('Success', 'Registration successful', [
        {
          text: 'OK',
          onPress: () => navigation.navigate('Loginscreen'),
        },
      ]);
    } catch (error) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Registration failed',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      <LinearGradient
        colors={['#4F46E5', '#7C3AED', '#9333EA']}
        style={styles.container}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 40,
            }}
          >
            {/* Header */}
            <View style={styles.topSection}>
              <View style={styles.logoContainer}>
                <Icon name="school-outline" size={55} color="#fff" />
              </View>

              <Text style={styles.title}>Create Account</Text>

              <Text style={styles.subtitle}>
                Register your LMS admin account
              </Text>
            </View>

            {/* Form Card */}
            <View style={styles.card}>
              {/* Full Name */}
              <View style={styles.inputWrapper}>
                <Icon
                  name="person-outline"
                  size={20}
                  color="#6B7280"
                  style={styles.inputIcon}
                />

                <AppInput
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  style={styles.inputBox}
                />
              </View>

              {/* Email */}
              <View style={styles.inputWrapper}>
                <Icon
                  name="mail-outline"
                  size={20}
                  color="#6B7280"
                  style={styles.inputIcon}
                />

                <AppInput
                  placeholder="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.inputBox}
                />
              </View>

              {/* Username */}
              <View style={styles.inputWrapper}>
                <Icon
                  name="at-outline"
                  size={20}
                  color="#6B7280"
                  style={styles.inputIcon}
                />

                <AppInput
                  placeholder="Username"
                  value={username}
                  onChangeText={setUsername}
                  style={styles.inputBox}
                />
              </View>

              {/* Password */}
              <View style={styles.inputWrapper}>
                <Icon
                  name="lock-closed-outline"
                  size={20}
                  color="#6B7280"
                  style={styles.inputIcon}
                />

                <AppInput
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  style={styles.inputBox}
                />

                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Icon
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#6B7280"
                  />
                </TouchableOpacity>
              </View>

              {/* Role */}
              <View style={styles.roleContainer}>
                <Text style={styles.roleLabel}>Select Role</Text>

                <View style={styles.roleRow}>
                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      role === 'ADMIN' && styles.activeRole,
                    ]}
                    onPress={() => setRole('ADMIN')}
                  >
                    <Text
                      style={[
                        styles.roleText,
                        role === 'ADMIN' && styles.activeRoleText,
                      ]}
                    >
                      ADMIN
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.roleButton,
                      role === 'STUDENT' && styles.activeRole,
                    ]}
                    onPress={() => setRole('STUDENT')}
                  >
                    <Text
                      style={[
                        styles.roleText,
                        role === 'STUDENT' && styles.activeRoleText,
                      ]}
                    >
                      STUDENT
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Register Button */}
              <View
                style={{
                  marginTop: 30,
                }}
              >
                <AppButton
                  title={loading ? 'Creating Account...' : 'Create Account'}
                  onPress={onRegister}
                />
              </View>

              {/* Footer */}
              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Already have an account?</Text>

                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.loginText}> Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topSection: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 30,
    paddingHorizontal: 20,
  },

  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,

    backgroundColor: 'rgba(255,255,255,0.15)',

    justifyContent: 'center',
    alignItems: 'center',

    marginBottom: 20,
  },
  inputBox: {
    paddingLeft: 50,
  },

  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
  },

  subtitle: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 10,
  },

  card: {
    backgroundColor: '#fff',

    marginHorizontal: 20,

    borderRadius: 30,

    padding: 25,

    elevation: 8,

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
    marginBottom: 20,
  },

  inputIcon: {
    position: 'absolute',
    left: 15,
    zIndex: 10,
  },

  eyeButton: {
    position: 'absolute',
    right: 15,
  },

  roleContainer: {
    marginTop: 10,
  },

  roleLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },

  roleRow: {
    flexDirection: 'row',
  },

  roleButton: {
    flex: 1,

    height: 50,

    borderRadius: 14,

    borderWidth: 1,
    borderColor: '#D1D5DB',

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 10,
  },

  activeRole: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },

  roleText: {
    fontWeight: '600',
    color: '#374151',
  },

  activeRoleText: {
    color: '#fff',
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },

  footerText: {
    color: '#6B7280',
  },

  loginText: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },
});
