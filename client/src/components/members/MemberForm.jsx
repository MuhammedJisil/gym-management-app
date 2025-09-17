import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { dateUtils } from '../../utils/dateUtils';
import { helpers } from '../../utils/helpers';
import { MEMBERSHIP_TYPE_OPTIONS, PAYMENT_STATUS_OPTIONS } from '../../utils/constants';

const MemberForm = ({ isEdit = false, initialData = null, onSubmit, onClose, loading, error }) => {
  const [formData, setFormData] = useState(helpers.createInitialMemberState());

  useEffect(() => {
    if (isEdit && initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        membershipType: initialData.membershipType || 'monthly',
        startDate: dateUtils.formatDateForInput(initialData.startDate),
        endDate: dateUtils.formatDateForInput(initialData.endDate),
        paymentStatus: initialData.paymentStatus || 'unpaid',
        photo: null
      });
    }
  }, [isEdit, initialData]);

  // Auto-calculate end date and payment status when membership type or start date changes
  useEffect(() => {
    if (formData.startDate && formData.membershipType) {
      const calculatedEndDate = dateUtils.calculateEndDate(formData.startDate, formData.membershipType);
      if (calculatedEndDate !== formData.endDate) {
        const autoStatus = dateUtils.getAutoPaymentStatus(calculatedEndDate);
        setFormData(prev => ({ 
          ...prev, 
          endDate: calculatedEndDate,
          paymentStatus: autoStatus
        }));
      }
    }
  }, [formData.startDate, formData.membershipType]);

  // Auto-calculate payment status when end date changes manually
  useEffect(() => {
    if (formData.endDate) {
      const autoStatus = dateUtils.getAutoPaymentStatus(formData.endDate);
      if (autoStatus !== formData.paymentStatus) {
        setFormData(prev => ({ 
          ...prev, 
          paymentStatus: autoStatus
        }));
      }
    }
  }, [formData.endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const validation = helpers.validateMemberData(formData);
    if (!validation.isValid) {
      return;
    }

    await onSubmit(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleInputChange('photo', file);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {isEdit ? 'Edit Member' : 'Add New Member'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
              <span className="text-xs text-gray-500 ml-1">(Include country code for WhatsApp)</span>
            </label>
            <input
              type="tel"
              required
              placeholder="e.g., +919876543210 or 9876543210"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Membership Type</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={formData.membershipType}
              onChange={(e) => handleInputChange('membershipType', e.target.value)}
              disabled={loading}
            >
              {MEMBERSHIP_TYPE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              value={formData.startDate}
              onChange={(e) => handleInputChange('startDate', e.target.value)}
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
              <span className="text-xs text-gray-500 ml-1">(Auto-calculated based on membership type)</span>
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-50"
              value={formData.endDate}
              onChange={(e) => handleInputChange('endDate', e.target.value)}
              disabled={loading}
              readOnly
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
              <span className="text-xs text-gray-500 ml-1">(Auto-calculated based on end date)</span>
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 bg-gray-50"
              value={formData.paymentStatus}
              onChange={(e) => handleInputChange('paymentStatus', e.target.value)}
              disabled={loading}
              readOnly
            >
              {PAYMENT_STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {formData.endDate && new Date(formData.endDate) >= new Date() 
                ? "✅ Membership is active - Status: Paid" 
                : "❌ Membership expired - Status: Unpaid"
              }
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
            <input
              type="file"
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              onChange={handlePhotoUpload}
              disabled={loading}
            />
            {isEdit && initialData?.photo && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Current photo:</p>
                <img 
                  src={initialData.photo} 
                  alt="Current photo" 
                  className="h-16 w-16 rounded-lg object-cover border"
                />
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 flex items-center gap-2"
              disabled={loading}
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {isEdit ? 'Update' : 'Add'} Member
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MemberForm;