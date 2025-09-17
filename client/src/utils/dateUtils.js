export const dateUtils = {
  // Format date for input fields
  formatDateForInput: (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  },

  // Format date for display
  formatDateForDisplay: (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  },

  // Calculate end date based on membership type and start date
  calculateEndDate: (startDate, membershipType) => {
    if (!startDate) return '';
    
    const start = new Date(startDate);
    let endDate;
    
    switch (membershipType) {
      case 'monthly':
        endDate = new Date(start);
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case 'quarterly':
        endDate = new Date(start);
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case 'yearly':
        endDate = new Date(start);
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
      default:
        endDate = new Date(start);
        endDate.setMonth(endDate.getMonth() + 1);
    }
    
    return endDate.toISOString().split('T')[0];
  },

  // Calculate days remaining until expiry
  getDaysRemaining: (endDate) => {
    if (!endDate) return 0;
    try {
      const today = new Date();
      const end = new Date(endDate);
      const timeDiff = end.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      return Math.max(0, daysDiff);
    } catch (error) {
      console.error('Error calculating days remaining:', error);
      return 0;
    }
  },

  // Determine payment status based on end date
  getAutoPaymentStatus: (endDate) => {
    if (!endDate) return 'unpaid';
    
    const today = new Date();
    const memberEndDate = new Date(endDate);
    
    // Set time to start of day for accurate comparison
    today.setHours(0, 0, 0, 0);
    memberEndDate.setHours(0, 0, 0, 0);
    
    // If end date is today or in the future, set as paid
    // If end date has passed, set as unpaid
    return memberEndDate >= today ? 'paid' : 'unpaid';
  }
};