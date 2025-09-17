export const helpers = {
  // Create initial member state
  createInitialMemberState: () => ({
    name: '',
    email: '',
    phone: '',
    membershipType: 'monthly',
    startDate: '',
    endDate: '',
    paymentStatus: 'unpaid',
    photo: null
  }),

  // Validate member form data
  validateMemberData: (memberData) => {
    const errors = {};

    if (!memberData.name?.trim()) {
      errors.name = 'Name is required';
    }

    if (!memberData.email?.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(memberData.email)) {
      errors.email = 'Email is invalid';
    }

    if (!memberData.phone?.trim()) {
      errors.phone = 'Phone is required';
    }

    if (!memberData.startDate) {
      errors.startDate = 'Start date is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },

  // Clean phone number for WhatsApp
  cleanPhoneNumber: (phone) => {
    // Remove all non-digit characters
    let cleanPhone = phone.replace(/\D/g, '');
    
    // If phone doesn't start with country code, assume it's Indian (+91)
    if (!cleanPhone.startsWith('91') && cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }
    
    return cleanPhone;
  },

  // Get status color classes
  getStatusColorClass: (status) => {
    return status === 'paid' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  },

  // Get days remaining color class
  getDaysRemainingColorClass: (daysRemaining) => {
    return daysRemaining <= 7
      ? 'text-red-600'
      : 'text-green-600';
  },

  // Handle image load error
  handleImageError: (e) => {
    e.target.style.display = 'none';
    if (e.target.nextSibling) {
      e.target.nextSibling.style.display = 'flex';
    }
  },

  // Generate member initials
  getInitials: (name) => {
    return (name || 'N').charAt(0).toUpperCase();
  },

  // Debounce function for search
  debounce: (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
};