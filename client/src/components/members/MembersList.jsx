import React, { useState, useEffect } from 'react';
import { useMembers } from '../../hooks/useMembers';
import { helpers } from '../../utils/helpers';
import SearchAndFilter from './SearchAndFilter';
import MembersTable from './MembersTable';
import MemberForm from './MemberForm';
import MemberModal from './MemberModal';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorMessage from '../ui/ErrorMessage';

const MembersList = () => {
  const { 
    members, 
    loading, 
    error, 
    fetchMembers, 
    addMember, 
    updateMember, 
    deleteMember,
    setError
  } = useMembers();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showEditMember, setShowEditMember] = useState(false);
  const [showViewMember, setShowViewMember] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // Listen for navigation events from dashboard
  useEffect(() => {
    const handleNavigateToMembers = (event) => {
      setFilterStatus(event.detail.filter);
      setSearchTerm(event.detail.search);
    };

    const handleViewMember = (event) => {
      setSelectedMember(event.detail);
      setShowViewMember(true);
    };

    window.addEventListener('navigate-to-members', handleNavigateToMembers);
    window.addEventListener('view-member', handleViewMember);

    return () => {
      window.removeEventListener('navigate-to-members', handleNavigateToMembers);
      window.removeEventListener('view-member', handleViewMember);
    };
  }, []);

  useEffect(() => {
    const debouncedFetch = helpers.debounce(() => {
      fetchMembers(searchTerm, filterStatus);
    }, 300);

    debouncedFetch();
  }, [searchTerm, filterStatus]);

  const handleAddMember = async (memberData) => {
    const success = await addMember(memberData);
    if (success) {
      setShowAddMember(false);
      fetchMembers(searchTerm, filterStatus);
    }
  };

  const handleEditMember = (member) => {
    setSelectedMember(member);
    setShowEditMember(true);
  };

  const handleUpdateMember = async (memberData) => {
    const success = await updateMember(selectedMember.id, memberData);
    if (success) {
      setShowEditMember(false);
      setSelectedMember(null);
      fetchMembers(searchTerm, filterStatus);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      const success = await deleteMember(memberId);
      if (success) {
        fetchMembers(searchTerm, filterStatus);
      }
    }
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setShowViewMember(true);
  };

  const closeModals = () => {
    setShowAddMember(false);
    setShowEditMember(false);
    setShowViewMember(false);
    setSelectedMember(null);
    setError('');
  };

  return (
    <div className="space-y-6">
      {error && <ErrorMessage message={error} />}
      
      <SearchAndFilter
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        onAddMember={() => setShowAddMember(true)}
        loading={loading}
      />

      {loading && <LoadingSpinner />}
      
      {!loading && (
        <MembersTable
          members={members}
          onEdit={handleEditMember}
          onDelete={handleDeleteMember}
          onView={handleViewMember}
          loading={loading}
        />
      )}

      {/* Modals */}
      {showAddMember && (
        <MemberForm
          onSubmit={handleAddMember}
          onClose={closeModals}
          loading={loading}
          error={error}
        />
      )}

      {showEditMember && selectedMember && (
        <MemberForm
          isEdit={true}
          initialData={selectedMember}
          onSubmit={handleUpdateMember}
          onClose={closeModals}
          loading={loading}
          error={error}
        />
      )}

      {showViewMember && selectedMember && (
        <MemberModal
          member={selectedMember}
          onEdit={() => {
            setShowViewMember(false);
            handleEditMember(selectedMember);
          }}
          onDelete={() => {
            setShowViewMember(false);
            handleDeleteMember(selectedMember.id);
          }}
          onClose={closeModals}
        />
      )}
    </div>
  );
};

export default MembersList;