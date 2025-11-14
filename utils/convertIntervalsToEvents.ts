import type { Interval } from '@/core/types';
import type { Event } from '../types';

const eventCategories = ['Meeting', 'Workshop', 'Conference', 'Training', 'Social'];
const eventTitles = ['Team Sync', 'Project Review', 'Client Meeting', 'Code Review', 'Planning Session'];
const eventDescriptions = [
  'Discuss project progress and next steps',
  'Review deliverables and milestones',
  'Collaborative work session',
  'Knowledge sharing and learning',
  'Strategic planning and alignment'
];

export const convertIntervalsToEvents = (intervals: Array<Interval>): Event[] => {
  return intervals.map(([start, end], index) => ({
    id: `event-${index}`,
    title: eventTitles[index % eventTitles.length],
    description: eventDescriptions[index % eventDescriptions.length],
    startTime: new Date(start).toISOString(),
    endTime: new Date(end).toISOString(),
    category: eventCategories[index % eventCategories.length]
  }));
};

export const filterIntervalsByTimeRange = (
  intervals: Array<Interval>,
  startTime: number,
  endTime: number
): Array<Interval> => {
  return intervals.filter(([intervalStart, intervalEnd]) => {
    // Check if there's any overlap between the interval and the selected range
    return intervalStart < endTime && intervalEnd > startTime;
  });
};
