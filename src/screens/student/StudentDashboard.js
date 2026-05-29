import React, { useEffect, useState } from 'react';

import { ScrollView, StyleSheet } from 'react-native';

import DashboardCard from '../../components/DashboardCard';

import { getStudentAnalyticsAPI } from '../../api/analytics.api';

export default function StudentDashboard() {
  const [analytics, setAnalytics] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const response = await getStudentAnalyticsAPI();

    setAnalytics(response.data);
  };

  return (
    <ScrollView style={styles.container}>
      <DashboardCard
        title="Exams Attempted"
        value={analytics.totalExamsAttempted}
      />

      <DashboardCard title="Average Score" value={analytics.averageScore} />

      <DashboardCard title="Highest Score" value={analytics.highestScore} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F7FB',
  },
});
