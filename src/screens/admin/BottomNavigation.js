import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import SettingsScreen from '../admin/SettingsScreen';
import AdminModulesScreen from '../admin/AdminModulesScreen';
import AdminDashboard from '../admin/AdminDashboard';

const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.7)',

        tabBarStyle: {
          position: 'absolute',
          alignSelf: 'center',

          bottom: 16,

          height: 65,

          margin: 20,

          width: '90%',

          backgroundColor: '#2563EB',

          borderRadius: 25,

          borderTopWidth: 0,

          elevation: 12,

          shadowColor: '#2563EB',
          shadowOffset: {
            width: 0,
            height: 5,
          },

          shadowOpacity: 0.25,
          shadowRadius: 12,
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          marginBottom: 5,
        },

        tabBarItemStyle: {
          marginVertical: 5,
          borderRadius: 18,
        },

        tabBarIcon: ({ focused, color }) => {
          let iconName;

          switch (route.name) {
            case 'Dashboard':
              iconName = focused ? 'grid' : 'grid-outline';
              break;

            case 'Modules':
              iconName = focused ? 'book' : 'book-outline';
              break;

            case 'Settings':
              iconName = focused ? 'settings' : 'settings-outline';
              break;

            default:
              iconName = 'ellipse';
          }

          return <Icon name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={AdminDashboard} />

      <Tab.Screen name="Modules" component={AdminModulesScreen} />

      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
