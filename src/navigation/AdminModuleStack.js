import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AdminModulesScreen from '../screens/admin/AdminModulesScreen';

import CreateClassroomScreen from '../screens/admin/CreateClassroomScreen';
import ManageClassroomScreen from '../screens/admin/ManageClassroomScreen';

import CreateExamScreen from '../screens/admin/CreateExamScreen';
import ManageExamScreen from '../screens/admin/ManageExamScreen';

import CreateQuestionScreen from '../screens/admin/CreateQuestionScreen';
import ManageQuestionScreen from '../screens/admin/ManageQuestionScreen';

import StudentsScreen from '../screens/admin/StudentsScreen';
import AttemptsScreen from '../screens/admin/AttemptsScreen';
import ReportsScreen from '../screens/admin/ReportsScreen';
import AdminDashboard from '../screens/admin/BottomNavigation';

const Stack = createNativeStackNavigator();

export default function AdminModuleStack() {
  return (
    <Stack.Navigator>
      <stack.Screen
        name="Dashboard"
        component={BottomNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ModulesHome"
        component={AdminModulesScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="CreateClassroom" component={CreateClassroomScreen} />

      <Stack.Screen name="ManageClassroom" component={ManageClassroomScreen} />

      <Stack.Screen name="CreateExam" component={CreateExamScreen} />

      <Stack.Screen name="ManageExam" component={ManageExamScreen} />

      <Stack.Screen name="CreateQuestion" component={CreateQuestionScreen} />

      <Stack.Screen name="ManageQuestion" component={ManageQuestionScreen} />

      <Stack.Screen name="Students" component={StudentsScreen} />

      <Stack.Screen name="Attempts" component={AttemptsScreen} />

      <Stack.Screen name="Reports" component={ReportsScreen} />
    </Stack.Navigator>
  );
}
