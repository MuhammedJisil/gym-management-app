import { useState, useEffect } from 'react';
import { memberService } from '../services/memberService';

export const useStats = () => {
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeMembers: 0,
    unpaidMembers: 0,
    expiringMembers: 0
  });
  const [expiringMembers, setExpiringMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    try {
      setLoading(true);
      const statsData = await memberService.getStats();
      setStats(statsData);
      setError('');
    } catch (err) {
      console.error('Error fetching stats:', err);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const fetchExpiringMembers = async () => {
    try {
      const data = await memberService.getExpiringMembers();
      
      if (Array.isArray(data)) {
        setExpiringMembers(data);
      } else if (Array.isArray(data.members)) {
        setExpiringMembers(data.members);
      } else {
        setExpiringMembers([]);
      }
    } catch (err) {
      console.error('Error fetching expiring members:', err);
      setExpiringMembers([]);
    }
  };

  const refreshData = async () => {
    await Promise.all([fetchStats(), fetchExpiringMembers()]);
  };

  return {
    stats,
    expiringMembers,
    loading,
    error,
    fetchStats,
    fetchExpiringMembers,
    refreshData
  };
};