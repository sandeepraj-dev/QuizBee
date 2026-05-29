import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

import colors from '../utils/colors';

export default function AppButton({ title, onPress }) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginVertical: 10,
  },

  text: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
