import React from 'react';
import { AlertTriangle, MessageCircle, Eye } from 'lucide-react';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { helpers } from '../../utils/helpers';
import { dateUtils } from '../../utils/dateUtils';

const ExpiringMembersAlert = ({ expiringMembers }) => {
  const { sendExpiringMemberMessage } = useWhatsApp();

  const handleViewMember = (member) => {
    // Dispatch custom event to show member modal
    window.dispatchEvent(new CustomEvent('view-member', { detail: member }));
  };

  if (expiringMembers.length === 0) {
    return null;
  }

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
          <h3 className="text-lg font-medium text-orange-800">Members Expiring Soon</h3>
        </div>
        <div className="text-sm text-orange-600">
          Click <MessageCircle className="h-4 w-4 inline mx-1" /> to send WhatsApp reminder
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {expiringMembers.map(member => (
          <div key={member.id} className="bg-white p-4 rounded-lg shadow-sm border">
            <div className="flex items-center space-x-3">
              <div className="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                {member.photo ? (
                  <img 
                    className="h-12 w-12 rounded-full object-cover" 
                    src={member.photo} 
                    alt={member.name}
                    onError={helpers.handleImageError}
                  />
                ) : null}
                <span className={`text-sm font-medium text-gray-700 ${member.photo ? 'hidden' : ''}`}>
                  {helpers.getInitials(member.name)}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{member.name}</p>
                <p className="text-sm text-gray-600 truncate">{member.email}</p>
                <p className="text-sm text-orange-600 font-medium">
                  Expires: {dateUtils.formatDateForDisplay(member.endDate)}
                </p>
              </div>
              <div className="flex flex-col space-y-1">
                <button
                  onClick={() => handleViewMember(member)}
                  className="text-blue-600 hover:text-blue-900 p-1"
                  title="View Member"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => sendExpiringMemberMessage(member)}
                  className="text-green-600 hover:text-green-900 p-1"
                  title="Send WhatsApp Reminder"
                >
                  <MessageCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpiringMembersAlert;