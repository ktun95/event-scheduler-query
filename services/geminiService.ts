
import { GoogleGenAI, Type } from "@google/genai";
import type { Event } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const eventSchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING, description: 'A unique identifier for the event.' },
    title: { type: Type.STRING, description: 'The title of the event.' },
    description: { type: Type.STRING, description: 'A brief description of the event.' },
    startTime: { type: Type.STRING, description: 'The start time of the event in ISO 8601 format.' },
    endTime: { type: Type.STRING, description: 'The end time of the event in ISO 8601 format.' },
    category: { type: Type.STRING, description: 'The category of the event (e.g., Work, Personal, Social).' }
  },
  required: ['id', 'title', 'description', 'startTime', 'endTime', 'category'],
};


export const fetchScheduledEvents = async (startTime: string, endTime: string): Promise<Event[]> => {
  const prompt = `
    Generate a list of fictional scheduled events that fall completely within the following time frame.
    Start Time: ${startTime}
    End Time: ${endTime}
    Ensure the events are diverse and realistic. Do not include any events that start before the start time or end after the end time.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: eventSchema,
        },
      },
    });

    const jsonText = response.text.trim();
    const events = JSON.parse(jsonText) as Event[];
    
    // Sort events by start time
    return events.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  } catch (error) {
    console.error("Error fetching or parsing events:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch events from AI: ${error.message}`);
    }
    throw new Error("An unknown error occurred while fetching events.");
  }
};
