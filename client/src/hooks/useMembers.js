import { useState, useEffect } from 'react';
import { memberService } from '../services/memberService';

export const useMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMembers = async (searchTerm = '', filterStatus = 'all') => {
    try {
      setLoading(true);
      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (filterStatus !== 'all') params.status = filterStatus;
      
      const data = await memberService.getMembers(params);
      setMembers(Array.isArray(data) ? data : data.data || []);
      setError('');
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to load members. Please check if the server is running.');
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (memberData) => {
    try {
      setLoading(true);
      await memberService.createMember(memberData);
      setError('');
      return true;
    } catch (err) {
      console.error('Error adding member:', err);
      setError(err.response?.data?.error || err.message || 'Failed to add member');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateMember = async (memberId, memberData) => {
    try {
      setLoading(true);
      await memberService.updateMember(memberId, memberData);
      setError('');
      return true;
    } catch (err) {
      console.error('Error updating member:', err);
      setError(err.response?.data?.error || err.message || 'Failed to update member');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteMember = async (memberId) => {
    try {
      setLoading(true);
      await memberService.deleteMember(memberId);
      setError('');
      return true;
    } catch (err) {
      console.error('Error deleting member:', err);
      setError(err.response?.data?.error || err.message || 'Failed to delete member');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    members,
    loading,
    error,
    fetchMembers,
    addMember,
    updateMember,
    deleteMember,
    setError
  };
};