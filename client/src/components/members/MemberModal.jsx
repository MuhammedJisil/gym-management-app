import React from 'react';
import { X, Edit, Trash2, Mail, Phone, MessageCircle } from 'lucide-react';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { helpers } from '../../utils/helpers';
import { dateUtils } from '../../utils/dateUtils';

const MemberModal = ({ member, onEdit, onDelete, onClose }) => {
  const { sendExpiringMemberMessage, sendUnpaidMemberMessage } = useWhatsApp();

  if (!member) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">Member Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Photo */}
          <div className="flex justify-center">
            <div className="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
              {member.photo ? (
                <img 
                  className="h-24 w-24 rounded-full object-cover" 
                  src={member.photo} 
                  alt={member.name || 'Member'}
                  onError={helpers.handleImageError}
                />
              ) : null}
              <span className={`text-2xl font-medium text-gray-700 ${member.photo ? 'hidden' : ''}`}>
                {helpers.getInitials(member.name)}
              </span>
            </div>
          </div>

          {/* Basic Info */}
          <div className="text-center">
            <h4 className="text-xl font-semibold text-gray-900">{member.name || 'No Name'}</h4>
            <p className="text-sm text-gray-500 capitalize">
              {member.membershipType || 'N/A'} Membership
            </p>
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-900">{member.email || 'No email'}</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-900">{member.phone || 'No phone'}</span>
            </div>
          </div>

          {/* Membership Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Payment Status</span>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                helpers.getStatusColorClass(member.paymentStatus || 'unpaid')
              }`}>
                {member.paymentStatus || 'unpaid'}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Start Date</span>
              <span className="text-sm text-gray-900">
                {dateUtils.formatDateForDisplay(member.startDate)}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">End Date</span>
              <span className="text-sm text-gray-900">
                {dateUtils.formatDateForDisplay(member.endDate)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Days Remaining</span>
              <span className={`text-sm font-medium ${
                helpers.getDaysRemainingColorClass(dateUtils.getDaysRemaining(member.endDate))
              }`}>
                {dateUtils.getDaysRemaining(member.endDate)} days
              </span>
            </div>
          </div>

          {/* WhatsApp Message Section */}
          {member.phone && (
            <div className="bg-green-50 rounded-lg p-4">
              <h5 className="text-sm font-medium text-gray-700 mb-3">Quick Messages</h5>
              <div className="space-y-2">
                {member.paymentStatus === 'unpaid' && (
                  <button
                    onClick={() => sendUnpaidMemberMessage(member)}
                    className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 flex items-center justify-center gap-2 text-sm"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Send Payment Reminder
                  </button>
                )}
                {dateUtils.getDaysRemaining(member.endDate) <= 30 && dateUtils.getDaysRemaining(member.endDate) > 0 && (
                  <button
                    onClick={() => sendExpiringMemberMessage(member)}
                    className="w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 flex items-center justify-center gap-2 text-sm"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Send Expiry Reminder
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={onEdit}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit Member
            </button>
            <button
              onClick={onDelete}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center justify-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberModal;