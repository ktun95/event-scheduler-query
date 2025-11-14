import { type Interval } from "@/core/types"

/**
 * Generates dummy intervals for testing interval tree performance.
 * Creates intervals with varying durations and overlaps to simulate real-world event data.
 */
function generateDummyIntervals(count: number): Array<Interval> {
  const intervals: Array<Interval> = []

  // Start from Jan 1, 2024
  const baseTime = 1704067200000

  // Various interval durations in milliseconds
  const durations = [
    1 * 60 * 60 * 1000,      // 1 hour
    2 * 60 * 60 * 1000,      // 2 hours
    4 * 60 * 60 * 1000,      // 4 hours
    8 * 60 * 60 * 1000,      // 8 hours
    24 * 60 * 60 * 1000,     // 1 day
    3 * 24 * 60 * 60 * 1000, // 3 days
    7 * 24 * 60 * 60 * 1000, // 1 week
  ]

  // Time span: 2 years in milliseconds
  const timeSpan = 2 * 365 * 24 * 60 * 60 * 1000

  for (let i = 0; i < count; i++) {
    // Random start time within the 2-year span
    const startOffset = Math.floor(Math.random() * timeSpan)
    const start = baseTime + startOffset

    // Random duration from the durations array
    const duration = durations[Math.floor(Math.random() * durations.length)]
    const end = start + duration

    intervals.push([start, end])
  }

  // Sort by start time for better tree balance
  intervals.sort((a, b) => a[0] - b[0])

  return intervals
}

// Generate 10,000 intervals for realistic performance testing
export const dummyIntervals: Array<Interval> = generateDummyIntervals(10000)
