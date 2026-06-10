import React from 'react';

import StudentDashboard from '../screens/student/StudentDashboard';
import SelectClassroomScreen from '../screens/student/SelectClassroomScreen';
import SelectExamScreen from '../screens/student/SelectExamScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AttemptExamScreen from '../screens/student/AttemptExamScreen';
import ExamResultScreen from '../screens/student/ExamResultScreen';

const Stack = createNativeStackNavigator();

export default function StudentNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="StudentDashboard"
        component={StudentDashboard}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SelectClassroomScreen"
        component={SelectClassroomScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="SelectExamScreen"
        component={SelectExamScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AttemptExamScreen"
        component={AttemptExamScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ExamResultScreen"
        component={ExamResultScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
