import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Icon from 'react-native-vector-icons/Ionicons';

import AnalyticsScreen from '../screens/admin/AdminDashboard';
import SettingsScreen from '../screens/admin/SettingsScreen';
import AdminDashboard from '../screens/admin/AdminDashboard';

const Tab = createBottomTabNavigator();

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarShowLabel: true,

        tabBarActiveTintColor: '#4F46E5',

        tabBarInactiveTintColor: '#9CA3AF',

        tabBarStyle: {
          position: 'absolute',

          left: 15,

          right: 15,

          bottom: 15,

          height: 75,

          borderRadius: 24,

          backgroundColor: '#FFFFFF',

          borderTopWidth: 0,

          elevation: 8,

          shadowColor: '#000',

          shadowOffset: {
            width: 0,
            height: 6,
          },

          shadowOpacity: 0.1,

          shadowRadius: 10,

          paddingBottom: 8,

          paddingTop: 8,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },

        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'grid' : 'grid-outline';
          }

          if (route.name === 'Analytics') {
            iconName = focused ? 'bar-chart' : 'bar-chart-outline';
          }

          if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Icon name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboard} />

      <Tab.Screen name="Analytics" component={AnalyticsScreen} />

      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
