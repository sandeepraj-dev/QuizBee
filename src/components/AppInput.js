import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

import colors from '../utils/colors';

export default function AppInput(props) {
  return (
    <View style={styles.container}>
      <TextInput placeholderTextColor="#999" style={styles.input} {...props} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },

  input: {
    backgroundColor: '#FFF',
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 55,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#EEE',
  },
});
