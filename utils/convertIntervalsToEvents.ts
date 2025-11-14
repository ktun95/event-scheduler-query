import type { Interval } from '@/core/types';
import type { Event } from '../types';
import { IntervalTreeService } from '../services/IntervalTreeService';

const eventCategories = ['Meeting', 'Workshop', 'Conference', 'Training', 'Social'];
const eventTitles = ['Team Sync', 'Project Review', 'Client Meeting', 'Code Review', 'Planning Session'];
const eventDescriptions = [
  'Discuss project progress and next steps',
  'Review deliverables and milestones',
  'Collaborative work session',
  'Knowledge sharing and learning',
  'Strategic planning and alignment'
];

// Create a singleton instance of the interval tree service
const intervalTreeService = new IntervalTreeService();

/**
 * Initializes the interval tree service with data.
 * This should be called once on application startup with data from the database.
 */
export const initializeIntervalTree = (intervals: Array<Interval>): void => {
  intervalTreeService.initialize(intervals);
};

/**
 * Queries the interval tree for overlapping intervals within the given time range.
 * Uses the in-memory interval tree for O(log n + k) performance.
 */
export const queryIntervalsByTimeRange = (
  startTime: number,
  endTime: number
): Array<Interval> => {
  return intervalTreeService.queryRange(startTime, endTime);
};

/**
 * Filters intervals using a simple linear scan.
 * Use this if the interval tree hasn't been initialized.
 */
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

export { intervalTreeService };
