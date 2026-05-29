import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import StudentDashboard from '../screens/student/StudentDashboard';

const Tab = createBottomTabNavigator();

export default function StudentNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={StudentDashboard} />
    </Tab.Navigator>
  );
}
