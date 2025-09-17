import React from 'react';
import { Users, DollarSign, AlertTriangle, Calendar } from 'lucide-react';

const StatsCards = ({ stats, onCardClick }) => {
  const cards = [
    {
      id: 'total',
      title: 'Total Members',
      value: stats.totalMembers,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-white'
    },
    {
      id: 'active',
      title: 'Active Members',
      value: stats.activeMembers,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-white'
    },
    {
      id: 'expiring',
      title: 'Expiring Soon',
      value: stats.expiringMembers,
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-white'
    },
    {
      id: 'unpaid',
      title: 'Unpaid',
      value: stats.unpaidMembers,
      icon: Calendar,
      color: 'text-red-600',
      bgColor: 'bg-white'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card) => {
        const IconComponent = card.icon;
        return (
          <div
            key={card.id}
            className={`${card.bgColor} p-6 rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow`}
            onClick={() => onCardClick(card.id)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className={`text-2xl font-bold ${card.id === 'total' ? 'text-gray-900' : card.color}`}>
                  {card.value}
                </p>
              </div>
              <IconComponent className={`h-8 w-8 ${card.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;