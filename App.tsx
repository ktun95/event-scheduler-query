
import React, { useState, useCallback } from 'react';
import DateTimePicker from './components/DateTimePicker';
import EventCard from './components/EventCard';
import Spinner from './components/Spinner';
import { fetchScheduledEvents } from './services/geminiService';
import type { Event } from './types';

// Helper to format date for datetime-local input
const getFormattedDateTime = (date: Date): string => {
  // Pad with leading zero if needed
  const pad = (num: number) => num.toString().padStart(2, '0');
  
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};


const App: React.FC = () => {
  const now = new Date();
  const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [startTime, setStartTime] = useState<string>(getFormattedDateTime(now));
  const [endTime, setEndTime] = useState<string>(getFormattedDateTime(sevenDaysFromNow));
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchEvents = useCallback(async () => {
    if (!startTime || !endTime) {
      setError("Please select both a start and end date.");
      return;
    }
    if (new Date(startTime) >= new Date(endTime)) {
      setError("End date must be after the start date.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setEvents([]);

    try {
      const fetchedEvents = await fetchScheduledEvents(
        new Date(startTime).toISOString(),
        new Date(endTime).toISOString()
      );
      setEvents(fetchedEvents);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [startTime, endTime]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center text-center p-8">
          <Spinner />
          <p className="mt-4 text-lg text-gray-400">Searching for events...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      );
    }
    
    if (events.length > 0) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      );
    }

    return (
      <div className="text-center p-8 bg-gray-800/30 rounded-lg border-2 border-dashed border-gray-700">
        <p className="text-gray-400">Select a date range and click "Find Events" to see the schedule.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Event Scheduler Query
          </h1>
          <p className="mt-2 text-gray-400">Find AI-generated events within a specific time frame.</p>
        </header>

        <main>
          <div className="bg-gray-800/50 p-6 rounded-lg shadow-2xl border border-gray-700 mb-8">
            <div className="flex flex-col md:flex-row gap-4 items-end mb-4">
              <DateTimePicker
                id="start-time"
                label="Start Date and Time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
              />
              <DateTimePicker
                id="end-time"
                label="End Date and Time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
              <button
                onClick={handleFetchEvents}
                disabled={isLoading}
                className="w-full md:w-auto bg-indigo-600 text-white font-bold py-2 px-6 rounded-md hover:bg-indigo-700 disabled:bg-indigo-900 disabled:cursor-not-allowed disabled:text-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
              >
                {isLoading ? 'Searching...' : 'Find Events'}
              </button>
            </div>
          </div>
          
          <div className="mt-6">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
