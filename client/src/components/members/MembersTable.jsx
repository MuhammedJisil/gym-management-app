import React from 'react';
import { Eye, Edit, Trash2, MessageCircle } from 'lucide-react';
import { useWhatsApp } from '../../hooks/useWhatsApp';
import { helpers } from '../../utils/helpers';
import { dateUtils } from '../../utils/dateUtils';

const MembersTable = ({ members, onEdit, onDelete, onView, loading }) => {
  const { sendUnpaidMemberMessage } = useWhatsApp();

  if (members.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="px-6 py-12 text-center text-gray-500">
          No members found. Add your first member to get started.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Membership
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {members.map(member => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden">
                      {member.photo ? (
                        <img 
                          className="h-10 w-10 rounded-full object-cover" 
                          src={member.photo} 
                          alt={member.name}
                          onError={helpers.handleImageError}
                        />
                      ) : null}
                      <span className={`text-sm font-medium text-gray-700 ${member.photo ? 'hidden' : ''}`}>
                        {helpers.getInitials(member.name)}
                      </span>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{member.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{member.email}</div>
                  <div className="text-sm text-gray-500">{member.phone}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                  {member.membershipType}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    helpers.getStatusColorClass(member.paymentStatus)
                  }`}>
                    {member.paymentStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {dateUtils.formatDateForDisplay(member.endDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onView(member)}
                      className="text-green-600 hover:text-green-900"
                      disabled={loading}
                      title="View Member"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(member)}
                      className="text-blue-600 hover:text-blue-900"
                      disabled={loading}
                      title="Edit Member"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(member.id)}
                      className="text-red-600 hover:text-red-900"
                      disabled={loading}
                      title="Delete Member"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {member.paymentStatus === 'unpaid' && (
                      <button
                        onClick={() => sendUnpaidMemberMessage(member)}
                        className="text-orange-600 hover:text-orange-900"
                        title="Send Payment Reminder"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MembersTable;