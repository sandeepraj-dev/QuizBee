import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import colors from '../utils/colors';

export default function DashboardCard({ title, value }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 18,
    marginBottom: 15,
    elevation: 4,
  },

  title: {
    color: colors.gray,
    fontSize: 14,
  },

  value: {
    color: colors.black,
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 8,
  },
});
