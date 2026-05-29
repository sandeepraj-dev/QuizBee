import React from 'react';

import AuthNavigator from './AuthNavigator';

import AdminNavigator from './AdminNavigator';

import StudentNavigator from './StudentNavigator';

import { authStore } from '../store/authStore';

export default function AppNavigator() {
  const user = authStore(state => state.user);

  if (!user) {
    return <AuthNavigator />;
  }

  if (user.role === 'ADMIN') {
    return <AdminNavigator />;
  }

  return <StudentNavigator />;
}
