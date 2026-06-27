import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { authStore } from '../../store/authStore';

export default function ProfileScreen({ navigation }) {
  const user = authStore(state => state.user);

  const InfoRow = ({ icon, label, value }) => (
    <View style={styles.infoRow}>
      <View style={styles.iconContainer}>
        <Icon name={icon} size={22} color="#4F46E5" />
      </View>

      <View style={{ flex: 1 }}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value || '-'}</Text>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4F46E5" />

      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <LinearGradient colors={['#4F46E5', '#6366F1']} style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Icon name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>

            <Text style={styles.headerTitle}>My Profile</Text>

            <View style={{ width: 45 }} />
          </View>
        </LinearGradient>

        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user?.fullName?.trim()?.charAt(0)?.toUpperCase() || 'U'}
            </Text>
          </View>

          <Text style={styles.name}>{user?.fullName?.trim() || '-'}</Text>
          {/* 
          <Text style={styles.username}>@{user?.username || '-'}</Text>

          <View style={styles.roleBadge}>
            <Text style={styles.roleText}>{user?.role || '-'}</Text>
          </View> */}
        </View>

        {/* DETAILS CARD */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Profile Information</Text>

          <InfoRow
            icon="person-outline"
            label="Full Name"
            value={user?.fullName?.trim()}
          />

          <InfoRow icon="at-outline" label="Username" value={user?.username} />

          <InfoRow
            icon="mail-outline"
            label="Email Address"
            value={user?.email}
          />

          <InfoRow
            icon="shield-checkmark-outline"
            label="Role"
            value={user?.role}
          />

          <InfoRow
            icon="calendar-outline"
            label="Created On"
            value={
              user?.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : '-'
            }
          />

          <InfoRow
            icon="refresh-outline"
            label="Last Updated"
            value={
              user?.updatedAt
                ? new Date(user.updatedAt).toLocaleDateString()
                : '-'
            }
          />
        </View>

        {/* ACTION BUTTON */}
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('ProfileEditScreen')}
        >
          <Icon name="create-outline" size={20} color="#FFF" />

          <Text style={styles.editText}>Edit Profile</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>
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
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
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
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  profileCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: -55,
    borderRadius: 24,
    alignItems: 'center',
    paddingVertical: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 12,

    elevation: 5,
  },

  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarText: {
    fontSize: 42,
    fontWeight: '700',
    color: '#4F46E5',
  },

  name: {
    marginTop: 15,
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
  },

  username: {
    marginTop: 6,
    fontSize: 15,
    color: '#64748B',
  },

  roleBadge: {
    marginTop: 12,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
  },

  roleText: {
    color: '#4F46E5',
    fontSize: 13,
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginTop: 20,
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

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 22,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  label: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },

  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },

  editButton: {
    marginHorizontal: 20,
    marginTop: 25,
    height: 55,
    borderRadius: 16,
    backgroundColor: '#4F46E5',
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

    elevation: 6,
  },

  editText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});
