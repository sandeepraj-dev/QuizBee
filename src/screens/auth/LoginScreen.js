import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import AppInput from '../../components/AppInput';
import AppButton from '../../components/AppButton';

import { loginAPI } from '../../api/auth.api';
import { authStore } from '../../store/authStore';
import Toast from 'react-native-toast-message';

export default function LoginScreen() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [showPassword, setShowPassword] = useState(false);
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(false);

  const setAuth = authStore(state => state.setAuth);
  const navigation = useNavigation();
  const onLogin = async () => {
    let valid = true;

    setUsernameError('');
    setPasswordError('');

    if (!username.trim()) {
      setUsernameError('Username is required');
      valid = false;
    }

    if (!password.trim()) {
      setPasswordError('Password is required');
      valid = false;
    }
    if (username.trim().length < 3) {
      setUsernameError('Username must be at least 3 characters');
      valid = false;
    }

    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      valid = false;
    }
    if (!valid) {
      return;
    }

    try {
      setLoading(true);

      const response = await loginAPI({
        username: username.trim(),
        password,
      });

      setAuth(response.user, response.token);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error?.response?.data?.message || error.message,
      });
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
        {/* Top Section */}
        <View style={styles.topContainer}>
          <View style={styles.logoContainer}>
            <Icon name="school-outline" size={55} color="#fff" />
          </View>

          <Text style={styles.title}>Welcome Back</Text>

          <Text style={styles.subtitle}>
            Login to continue your learning journey
          </Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign In</Text>

          <View style={styles.inputWrapper}>
            <Icon
              name="person-outline"
              size={20}
              color="#6B7280"
              style={styles.inputIcon}
            />

            <AppInput
              placeholder="Username"
              value={username}
              onChangeText={text => {
                setUsername(text);

                if (text.trim()) {
                  setUsernameError('');
                }
              }}
              style={[styles.inputBox, usernameError && styles.errorInput]}
            />
          </View>

          {usernameError ? (
            <Text style={styles.errorText}>{usernameError}</Text>
          ) : null}

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
              onChangeText={text => {
                setPassword(text);

                if (text.trim()) {
                  setPasswordError('');
                }
              }}
              style={[
                styles.inputBox,
                styles.passwordInput,
                passwordError && styles.errorInput,
              ]}
            />

            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Icon
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color="#3b3b3a"
              />
            </TouchableOpacity>
          </View>

          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}

          <TouchableOpacity style={styles.forgotContainer}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.buttonContainer}>
            <AppButton
              title={loading ? 'Signing In...' : 'Login'}
              onPress={onLogin}
              disabled={loading}
            >
              {loading ? <ActivityIndicator color="#FFF" /> : 'Login'}
            </AppButton>
          </View>

          <View style={styles.bottomRow}>
            <Text style={styles.bottomText}>Don’t have an account?</Text>

            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  topContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  logoContainer: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
  },

  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
  },

  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 10,
    textAlign: 'center',
    lineHeight: 24,
  },

  card: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 25,
    paddingTop: 35,
    minHeight: '55%',
    elevation: 10,
  },

  cardTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 25,
  },

  inputWrapper: {
    position: 'relative',
    marginBottom: 20,
    justifyContent: 'center',
  },

  inputIcon: {
    position: 'absolute',
    left: 15,
    zIndex: 1,
  },
  inputBox: {
    paddingLeft: 50,
  },

  eyeButton: {
    color: '#5e230a',
    position: 'absolute',
    right: 15,
  },

  forgotContainer: {
    alignItems: 'flex-end',
    marginBottom: 25,
  },

  forgotText: {
    color: '#4F46E5',
    fontWeight: '600',
  },

  buttonContainer: {
    marginBottom: 25,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomText: {
    color: '#6B7280',
    fontSize: 15,
  },

  signupText: {
    color: '#4F46E5',
    fontWeight: 'bold',
    fontSize: 15,
  },
  passwordInput: {
    color: '#000',
  },
  errorInput: {
    borderWidth: 1,
    borderColor: '#EF4444',
  },

  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 12,
    marginLeft: 8,
    fontWeight: '500',
  },
});
