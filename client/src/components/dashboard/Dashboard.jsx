import React, { useEffect, useRef } from 'react';
import { useStats } from '../../hooks/useStats';
import StatsCards from './StatsCards';
import ExpiringMembersAlert from './ExpiringMembersAlert';

const Dashboard = () => {
  const { stats, expiringMembers, loading, error, refreshData } = useStats();
  const expiringMembersRef = useRef(null);

  useEffect(() => {
    refreshData();
  }, []);

  const handleCardClick = (cardType) => {
    switch (cardType) {
      case 'total':
        // Navigate to members page with all filter
        window.dispatchEvent(new CustomEvent('navigate-to-members', { 
          detail: { filter: 'all', search: '' }
        }));
        break;
      case 'active':
        // Navigate to members page with paid filter
        window.dispatchEvent(new CustomEvent('navigate-to-members', { 
          detail: { filter: 'paid', search: '' }
        }));
        break;
      case 'unpaid':
        // Navigate to members page with unpaid filter
        window.dispatchEvent(new CustomEvent('navigate-to-members', { 
          detail: { filter: 'unpaid', search: '' }
        }));
        break;
      case 'expiring':
        // Scroll to expiring members section
        if (expiringMembersRef.current) {
          expiringMembersRef.current.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <StatsCards stats={stats} onCardClick={handleCardClick} />
      <div ref={expiringMembersRef}>
        <ExpiringMembersAlert expiringMembers={expiringMembers} />
      </div>
    </div>
  );
};

export default Dashboard;