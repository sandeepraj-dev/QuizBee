import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AdminModulesScreen from '../screens/admin/AdminModulesScreen';

import CreateClassroomScreen from '../screens/admin/CreateClassroomScreen';
import ManageClassroomScreen from '../screens/admin/ManageClassroomScreen';
import EditClassroomScreen from '../screens/admin/EditClassroomScreen';
import CreateExamScreen from '../screens/admin/CreateExamScreen';
import ManageExamScreen from '../screens/admin/ManageExamScreen';

import CreateQuestionScreen from '../screens/admin/CreateQuestionScreen';
import ManageQuestionScreen from '../screens/admin/ManageQuestionScreen';

import StudentsScreen from '../screens/admin/StudentsScreen';
import ReportsScreen from '../screens/admin/ReportsScreen';
import BottomNavigation from '../screens/admin/BottomNavigation';
import AddStudentToClassroomScreen from '../screens/admin/AddStudentToClassroomScreen';
import ClassroomStudentsScreen from '../screens/admin/ClassroomStudentsScreen';
import StudentListScreen from '../screens/admin/StudentListScreen';
import StudentDashboard from '../screens/student/StudentDashboard';
import ResultDetailsScreen from '../screens/student/ResultDetailsScreen';
import ChangePasswordScreen from '../screens/auth/ChangePasswordScreen';
import ProfileEditScreen from '../screens/student/ProfileEditScreen';
import ProfileScreen from '../screens/admin/ProfileScreen';
import AIQuestionGeneratorScreen from '../screens/admin/AIQuestionGeneratorScreen';
import AIPreviewScreen from '../screens/admin/AIPreviewScreen';
import QuestionPreviewScreen from '../screens/admin/QuestionPreviewScreen';

const Stack = createNativeStackNavigator();

export default function AdminNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Dashboard"
        component={BottomNavigation}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Modules"
        component={AdminModulesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateClassroom"
        component={CreateClassroomScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageClassroom"
        component={ManageClassroomScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AddStudentToClassroom"
        component={AddStudentToClassroomScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditClassroom"
        component={EditClassroomScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateExam"
        component={CreateExamScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageExam"
        component={ManageExamScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateQuestion"
        component={CreateQuestionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ManageQuestion"
        component={ManageQuestionScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Students"
        component={StudentsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Reports"
        component={ReportsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ClassroomStudents"
        component={ClassroomStudentsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StudentList"
        component={StudentListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StudentDashboard"
        component={StudentDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ResultScreen"
        component={ResultDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangePasswordScreen"
        component={ChangePasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileEditScreen"
        component={ProfileEditScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AIQuestionGeneratorScreen"
        component={AIQuestionGeneratorScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="AIPreviewScreen"
        component={AIPreviewScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QuestionPreviewScreen"
        component={QuestionPreviewScreen}
      />
    </Stack.Navigator>
  );
}
