import React from 'react';
import { View, ActivityIndicator } from 'react-native';

import colors from '../utils/colors';

export default function Loading() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
