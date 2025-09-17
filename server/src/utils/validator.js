const validateMemberData = (data) => {
  const validMembershipTypes = ['monthly', 'quarterly', 'yearly'];
  const validPaymentStatuses = ['paid', 'unpaid'];

  if (!data.name || data.name.trim() === '') {
    throw new Error('Name is required');
  }
  
  if (!data.email || data.email.trim() === '') {
    throw new Error('Email is required');
  }
  
  if (!data.phone || data.phone.trim() === '') {
    throw new Error('Phone is required');
  }
  
  if (!data.membershipType || !validMembershipTypes.includes(data.membershipType)) {
    throw new Error('Invalid membership type');
  }
  
  if (!data.paymentStatus || !validPaymentStatuses.includes(data.paymentStatus)) {
    throw new Error('Invalid payment status');
  }
  
  if (!data.startDate) {
    throw new Error('Start date is required');
  }
  
  if (!data.endDate) {
    throw new Error('End date is required');
  }

  return {
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone.trim(),
    membershipType: data.membershipType,
    paymentStatus: data.paymentStatus,
    startDate: data.startDate,
    endDate: data.endDate
  };
};

module.exports = { validateMemberData };