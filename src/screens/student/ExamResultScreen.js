import React from 'react';

import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import { useNavigation, useRoute } from '@react-navigation/native';

export default function ExamResultScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const result = route?.params?.result || {};
  const exam = route?.params?.exam || {};

  const score = result?.score || 0;

  const totalMarks = exam?.totalMarks || 0;

  const percentage =
    totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

  const isPassed = percentage >= 40;

  const goHome = () => {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: 'StudentDashboard',
        },
      ],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#4F46E5" barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}

        <LinearGradient
          colors={['#4F46E5', '#7C3AED', '#9333EA']}
          style={styles.header}
        >
          <View style={styles.circle1} />
          <View style={styles.circle2} />

          <View style={styles.successIcon}>
            <Icon
              name={isPassed ? 'trophy' : 'document-text'}
              size={60}
              color="#FFF"
            />
          </View>

          <Text style={styles.headerTitle}>Exam Submitted</Text>

          <Text style={styles.headerSubtitle}>
            Your assessment has been completed successfully
          </Text>
        </LinearGradient>

        {/* SCORE CARD */}

        <View style={styles.scoreCard}>
          <Text style={styles.scoreTitle}>Final Score</Text>

          <Text style={styles.score}>
            {score}
            <Text style={styles.totalMarks}> / {totalMarks}</Text>
          </Text>

          <View
            style={[
              styles.resultBadge,
              {
                backgroundColor: isPassed ? '#DCFCE7' : '#FEE2E2',
              },
            ]}
          >
            <Text
              style={[
                styles.resultText,
                {
                  color: isPassed ? '#059669' : '#DC2626',
                },
              ]}
            >
              {isPassed ? 'PASSED' : 'FAILED'}
            </Text>
          </View>
        </View>

        {/* STATS */}

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Icon name="analytics" size={30} color="#4F46E5" />

            <Text style={styles.statValue}>{percentage}%</Text>

            <Text style={styles.statLabel}>Percentage</Text>
          </View>

          <View style={styles.statCard}>
            <Icon name="help-circle" size={30} color="#10B981" />

            <Text style={styles.statValue}>{result?.totalQuestions || 0}</Text>

            <Text style={styles.statLabel}>Questions</Text>
          </View>
        </View>

        {/* EXAM DETAILS */}

        <View style={styles.detailsCard}>
          <Text style={styles.sectionTitle}>Exam Details</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Title</Text>

            <Text style={styles.value}>{exam?.title}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Duration</Text>

            <Text style={styles.value}>{exam?.duration} mins</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Total Marks</Text>

            <Text style={styles.value}>{exam?.totalMarks}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Submitted At</Text>

            <Text style={styles.value}>
              {result?.submittedAt
                ? new Date(result.submittedAt).toLocaleString()
                : '-'}
            </Text>
          </View>
        </View>

        {/* PERFORMANCE */}

        <View style={styles.performanceCard}>
          <Text style={styles.sectionTitle}>Performance Summary</Text>

          <View style={styles.performanceRow}>
            <Icon name="star" size={22} color="#F59E0B" />

            <Text style={styles.performanceText}>
              You scored {score} out of {totalMarks}
            </Text>
          </View>

          <View style={styles.performanceRow}>
            <Icon name="trending-up" size={22} color="#10B981" />

            <Text style={styles.performanceText}>
              Percentage achieved: {percentage}%
            </Text>
          </View>

          <View style={styles.performanceRow}>
            <Icon
              name={isPassed ? 'checkmark-circle' : 'close-circle'}
              size={22}
              color={isPassed ? '#10B981' : '#EF4444'}
            />

            <Text style={styles.performanceText}>
              Result: {isPassed ? 'Passed' : 'Failed'}
            </Text>
          </View>
        </View>

        {/* BUTTON */}

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={goHome}
          style={styles.buttonWrapper}
        >
          <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.button}>
            <Icon name="home" size={22} color="#FFF" />

            <Text style={styles.buttonText}>Back To Dashboard</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FB',
  },

  header: {
    padding: 25,
    paddingBottom: 40,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    alignItems: 'center',
    overflow: 'hidden',
  },

  successIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  headerTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '800',
    marginTop: 20,
  },

  headerSubtitle: {
    color: '#E5E7EB',
    marginTop: 8,
    textAlign: 'center',
  },

  scoreCard: {
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    elevation: 5,
  },

  scoreTitle: {
    fontSize: 18,
    color: '#6B7280',
  },

  score: {
    fontSize: 48,
    fontWeight: '800',
    color: '#111827',
    marginVertical: 10,
  },

  totalMarks: {
    fontSize: 24,
    color: '#9CA3AF',
  },

  resultBadge: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 30,
  },

  resultText: {
    fontWeight: '800',
    fontSize: 13,
  },

  statsContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'space-between',
  },

  statCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
  },

  statValue: {
    fontSize: 28,
    fontWeight: '800',
    marginTop: 10,
    color: '#111827',
  },

  statLabel: {
    marginTop: 5,
    color: '#6B7280',
  },

  detailsCard: {
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 25,
    padding: 20,
    elevation: 4,
  },

  performanceCard: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    borderRadius: 25,
    padding: 20,
    elevation: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 20,
    color: '#111827',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },

  label: {
    color: '#6B7280',
  },

  value: {
    color: '#111827',
    fontWeight: '700',
    flex: 1,
    textAlign: 'right',
    marginLeft: 10,
  },

  performanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  performanceText: {
    marginLeft: 12,
    color: '#374151',
    fontSize: 15,
  },

  buttonWrapper: {
    margin: 20,
  },

  button: {
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },

  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 10,
  },

  circle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.08)',
    top: -40,
    right: -40,
  },

  circle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.08)',
    bottom: -30,
    left: -30,
  },
});
