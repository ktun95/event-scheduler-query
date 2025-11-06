
import React from 'react';
import type { Event } from '../types';

interface EventCardProps {
  event: Event;
}

const CategoryBadge: React.FC<{ category: string }> = ({ category }) => {
  const categoryColors: { [key: string]: string } = {
    'Work': 'bg-blue-600 text-blue-100',
    'Personal': 'bg-green-600 text-green-100',
    'Social': 'bg-purple-600 text-purple-100',
    'Health': 'bg-red-600 text-red-100',
    'Finance': 'bg-yellow-600 text-yellow-100',
    'Default': 'bg-gray-600 text-gray-100',
  };
  const colorClass = categoryColors[category] || categoryColors['Default'];
  return (
    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${colorClass}`}>
      {category}
    </span>
  );
};

const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 shadow-lg transition-transform hover:scale-105 hover:border-indigo-500 duration-300 ease-in-out">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-indigo-400">{event.title}</h3>
        <CategoryBadge category={event.category} />
      </div>
      <p className="text-gray-400 mb-4 text-sm">{event.description}</p>
      <div className="flex flex-col sm:flex-row justify-between text-xs text-gray-500 border-t border-gray-700 pt-3">
        <span><strong>Starts:</strong> {formatDate(event.startTime)}</span>
        <span><strong>Ends:</strong> {formatDate(event.endTime)}</span>
      </div>
    </div>
  );
};

export default EventCard;
