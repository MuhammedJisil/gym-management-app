import api from './api';

export const memberService = {
  // Get all members with optional filters
  getMembers: async (params = {}) => {
    return await api.get('/members', { params });
  },

  // Get a single member by ID
  getMember: async (id) => {
    return await api.get(`/members/${id}`);
  },

  // Create a new member
  createMember: async (memberData) => {
    const formData = new FormData();
    
    // Prepare member data
    const memberFields = {
      name: memberData.name || '',
      email: memberData.email || '',
      phone: memberData.phone || '',
      membershipType: memberData.membershipType || 'monthly',
      startDate: memberData.startDate || '',
      endDate: memberData.endDate || '',
      paymentStatus: memberData.paymentStatus || 'unpaid'
    };

    // Append fields to FormData
    Object.keys(memberFields).forEach(key => {
      formData.append(key, memberFields[key]);
    });

    // Append photo if exists
    if (memberData.photo) {
      formData.append('photo', memberData.photo);
    }

    return await api.post('/members', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Update a member
  updateMember: async (id, memberData) => {
    const formData = new FormData();
    
    // Prepare member data
    const memberFields = {
      name: memberData.name || '',
      email: memberData.email || '',
      phone: memberData.phone || '',
      membershipType: memberData.membershipType || 'monthly',
      startDate: memberData.startDate || '',
      endDate: memberData.endDate || '',
      paymentStatus: memberData.paymentStatus || 'unpaid'
    };

    // Append fields to FormData
    Object.keys(memberFields).forEach(key => {
      formData.append(key, memberFields[key]);
    });

    // Append photo if exists
    if (memberData.photo) {
      formData.append('photo', memberData.photo);
    }

    return await api.put(`/members/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Delete a member
  deleteMember: async (id) => {
    return await api.delete(`/members/${id}`);
  },

  // Get dashboard statistics
  getStats: async () => {
    return await api.get('/dashboard/stats');
  },

  // Get expiring members
  getExpiringMembers: async () => {
    return await api.get('/dashboard/expiring');
  },

  // Refresh member statuses (optional utility function)
  refreshMemberStatuses: async () => {
    // Get all members
    const allMembers = await api.get('/members');
    const members = Array.isArray(allMembers) ? allMembers : allMembers.data || [];
    
    // Helper function to determine payment status based on end date
    const getAutoPaymentStatus = (endDate) => {
      if (!endDate) return 'unpaid';
      
      const today = new Date();
      const memberEndDate = new Date(endDate);
      
      today.setHours(0, 0, 0, 0);
      memberEndDate.setHours(0, 0, 0, 0);
      
      return memberEndDate >= today ? 'paid' : 'unpaid';
    };
    
    // Update each member's status if needed
    const updatePromises = members.map(member => {
      const currentStatus = member.paymentStatus;
      const calculatedStatus = getAutoPaymentStatus(member.endDate);
      
      // Only update if status has changed
      if (currentStatus !== calculatedStatus) {
        return api.put(`/members/${member.id}`, {
          ...member,
          paymentStatus: calculatedStatus
        });
      }
      return null;
    }).filter(Boolean);
    
    if (updatePromises.length > 0) {
      await Promise.all(updatePromises);
      console.log(`Updated status for ${updatePromises.length} members`);
    }
    
    return updatePromises.length;
  }
};