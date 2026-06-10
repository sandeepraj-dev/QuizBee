import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { authStore } from '../../store/authStore';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Image,
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';

export default function SettingsScreen() {
  const navigation = useNavigation();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const settingsSections = [
    {
      title: 'Management',
      items: [
        {
          icon: 'people-outline',
          label: 'Manage Users',
          color: '#4F46E5',
        },
        {
          icon: 'book-outline',
          label: 'Course Management',
          color: '#0EA5E9',
        },
        {
          icon: 'school-outline',
          label: 'Faculty Management',
          color: '#10B981',
        },
      ],
    },

    {
      title: 'System',
      items: [
        {
          icon: 'notifications-outline',
          label: 'Notifications',
          type: 'switch',
          value: notifications,
          onChange: setNotifications,
          color: '#F59E0B',
        },

        {
          icon: 'moon-outline',
          label: 'Dark Mode',
          type: 'switch',
          value: darkMode,
          onChange: setDarkMode,
          color: '#6366F1',
        },
      ],
    },

    {
      title: 'Account',
      items: [
        {
          icon: 'person-circle-outline',
          label: 'Profile Settings',
          color: '#EC4899',
        },

        {
          icon: 'lock-closed-outline',
          label: 'Change Password',
          color: '#EF4444',
        },

        {
          icon: 'log-out-outline',
          label: 'Logout',
          color: '#DC2626',
        },
      ],
    },
  ];
  const logout = authStore(state => state.logout);
  const handlePress = item => {
    if (item.label === 'Logout') {
      logout();
      navigation.navigate('Login');
    }
    if (item.label === 'Profile Settings') {
      navigation.navigate('StudentDashboard');
    }
  };

  const renderItem = item => {
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.settingItem}
        onPress={() => handlePress(item)}
      >
        <View style={styles.leftSection}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: item.color + '15',
              },
            ]}
          >
            <Icon name={item.icon} size={22} color={item.color} />
          </View>

          <Text style={styles.settingText}>{item.label}</Text>
        </View>

        {item.type === 'switch' ? (
          <Switch
            value={item.value}
            onValueChange={item.onChange}
            trackColor={{
              false: '#D1D5DB',
              true: '#818CF8',
            }}
            thumbColor="#fff"
          />
        ) : (
          <Icon name="chevron-forward" size={20} color="#9CA3AF" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.heading}>Settings</Text>

          <Text style={styles.subHeading}>LMS Admin Control Panel</Text>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{
              uri: 'https://i.pravatar.cc/150?img=12',
            }}
            style={styles.avatar}
          />

          <View style={{ flex: 1 }}>
            <Text style={styles.adminName}>Admin User</Text>

            <Text style={styles.adminEmail}>admin@lms.com</Text>
          </View>

          <TouchableOpacity>
            <Icon name="create-outline" size={22} color="#4F46E5" />
          </TouchableOpacity>
        </View>

        {/* Sections */}
        {settingsSections.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            <View style={styles.sectionCard}>
              {section.items.map(item => (
                <View key={item.label}>{renderItem(item)}</View>
              ))}
            </View>
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>LMS Admin Panel</Text>

          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 25,
  },

  heading: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#111827',
  },

  subHeading: {
    fontSize: 15,
    color: '#6B7280',
    marginTop: 5,
  },

  profileCard: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',

    elevation: 5,

    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },

  adminName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },

  adminEmail: {
    marginTop: 5,
    color: '#6B7280',
    fontSize: 14,
  },

  section: {
    marginTop: 28,
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6B7280',
    marginBottom: 12,
  },

  sectionCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    overflow: 'hidden',

    elevation: 4,

    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,

    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',

    paddingHorizontal: 18,
    paddingVertical: 18,

    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 14,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 15,
  },

  settingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },

  footer: {
    alignItems: 'center',
    marginTop: 35,
    marginBottom: 120,
  },

  footerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5',
  },

  versionText: {
    marginTop: 5,
    color: '#9CA3AF',
  },
});
