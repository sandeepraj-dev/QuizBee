import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

export default function DashboardCard({ title, value, icon, colors }) {
  return (
    <LinearGradient
      colors={colors}
      style={styles.card}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.iconContainer}>
        <Icon name={icon} size={28} color="#FFF" />
      </View>

      <Text style={styles.value}>{value}</Text>

      <Text style={styles.title}>{title}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',
    height: 150,

    borderRadius: 22,
    padding: 16,

    marginBottom: 14,

    elevation: 6,

    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,

    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  iconContainer: {
    width: 55,
    height: 55,

    borderRadius: 18,

    backgroundColor: 'rgba(255,255,255,0.25)',

    justifyContent: 'center',
    alignItems: 'center',
  },

  value: {
    color: '#FFF',

    fontSize: 32,

    fontWeight: 'bold',
  },

  title: {
    color: '#FFF',

    fontSize: 15,

    fontWeight: '600',

    opacity: 0.95,
  },
});
