import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import AuthNavigator from './AuthNavigator';
import AdminNavigator from './AdminNavigator';
import RegisterNavigator from './RegisterNavigator';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={AuthNavigator} />
      <Stack.Screen name="Register" component={RegisterNavigator} />
      <Stack.Screen name="Admin" component={AdminNavigator} />
    </Stack.Navigator>
  );
}
