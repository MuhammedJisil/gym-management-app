export const MEMBERSHIP_TYPES = {
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
  YEARLY: 'yearly'
};

export const PAYMENT_STATUS = {
  PAID: 'paid',
  UNPAID: 'unpaid'
};

export const FILTER_OPTIONS = {
  ALL: 'all',
  PAID: 'paid',
  UNPAID: 'unpaid'
};

export const MEMBERSHIP_TYPE_OPTIONS = [
  { value: MEMBERSHIP_TYPES.MONTHLY, label: 'Monthly' },
  { value: MEMBERSHIP_TYPES.QUARTERLY, label: 'Quarterly' },
  { value: MEMBERSHIP_TYPES.YEARLY, label: 'Yearly' }
];

export const PAYMENT_STATUS_OPTIONS = [
  { value: PAYMENT_STATUS.UNPAID, label: 'Unpaid' },
  { value: PAYMENT_STATUS.PAID, label: 'Paid' }
];

export const FILTER_STATUS_OPTIONS = [
  { value: FILTER_OPTIONS.ALL, label: 'All Status' },
  { value: FILTER_OPTIONS.PAID, label: 'Paid' },
  { value: FILTER_OPTIONS.UNPAID, label: 'Unpaid' }
];

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
