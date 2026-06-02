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
        <Icon name={icon} size={26} color="#FFF" />
      </View>

      <View style={styles.content}>
        <Text numberOfLines={1} style={styles.value}>
          {value}
        </Text>

        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 155,
    borderRadius: 24,
    padding: 18,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.12,
    shadowRadius: 12,

    elevation: 8,
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.22)',

    justifyContent: 'center',
    alignItems: 'center',
  },

  content: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  value: {
    color: '#FFF',
    fontSize: 30,
    fontWeight: '800',
  },

  title: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    marginTop: 4,
    opacity: 0.95,
  },
});
