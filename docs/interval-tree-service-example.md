# Interval Tree Service - In-Memory Database Pattern

This document explains how to use the `IntervalTreeService` for fast interval queries with data loaded from a database.

The service uses the `AugmentedIntervalTree` (an augmented BST) which stores the maximum endpoint value at each node, enabling efficient interval overlap queries.

## Architecture Overview

```
┌─────────────┐
│  Database   │  Stores intervals as flat data (start_time, end_time)
└──────┬──────┘
       │ On startup / periodic refresh
       ↓
┌──────────────────────────┐
│ IntervalTreeService      │  Wraps AugmentedIntervalTree
│  - AugmentedIntervalTree │  Builds augmented BST in-memory
└──────┬───────────────────┘
       │ Fast queries: O(log n + k)
       ↓
┌──────────────────────┐
│  Application Logic   │  Query for overlapping intervals
└──────────────────────┘
```

## Database Schema Example

```sql
-- PostgreSQL example
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  start_time BIGINT NOT NULL,  -- Unix timestamp (milliseconds)
  end_time BIGINT NOT NULL,    -- Unix timestamp (milliseconds)
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_events_start ON events(start_time);
CREATE INDEX idx_events_end ON events(end_time);
```

## Implementation Example

### 1. Database Repository

```typescript
// repositories/EventRepository.ts
import { type Interval } from '@/core/types';

export interface EventRow {
  id: number;
  title: string;
  description: string;
  start_time: string; // BigInt as string
  end_time: string;   // BigInt as string
  category: string;
}

export class EventRepository {
  constructor(private db: DatabaseConnection) {}

  async getAllIntervals(): Promise<Array<Interval>> {
    const query = 'SELECT start_time, end_time FROM events';
    const results = await this.db.query<EventRow>(query);

    return results.map(row => [
      parseInt(row.start_time, 10),
      parseInt(row.end_time, 10)
    ]);
  }

  async getEventsByIds(ids: number[]): Promise<EventRow[]> {
    const query = 'SELECT * FROM events WHERE id = ANY($1)';
    return await this.db.query<EventRow>(query, [ids]);
  }
}
```

### 2. Service Initialization on Startup

```typescript
// main.ts or app initialization
import { IntervalTreeService } from './services/IntervalTreeService';
import { EventRepository } from './repositories/EventRepository';

async function initializeApp() {
  const db = await connectToDatabase();
  const eventRepo = new EventRepository(db);

  // Create the interval tree service
  const intervalTreeService = new IntervalTreeService();

  // Load all intervals from database on startup
  console.log('Loading intervals from database...');
  const intervals = await eventRepo.getAllIntervals();

  // Build the in-memory tree
  intervalTreeService.initialize(intervals);
  console.log(\`Interval tree initialized with \${intervals.length} intervals\`);

  // Make the service available to your application
  // (could be a singleton, dependency injection, etc.)
  return { intervalTreeService, eventRepo };
}
```

### 3. Using the Service for Queries

```typescript
// services/EventQueryService.ts
import { IntervalTreeService } from './IntervalTreeService';
import { EventRepository } from '../repositories/EventRepository';
import type { Event } from '../types';

export class EventQueryService {
  constructor(
    private intervalTreeService: IntervalTreeService,
    private eventRepository: EventRepository
  ) {}

  async findEventsInRange(startTime: number, endTime: number): Promise<Event[]> {
    // Step 1: Use interval tree for fast filtering
    const matchingIntervals = this.intervalTreeService.queryRange(startTime, endTime);

    // Step 2: Map intervals back to full event data from database
    // (In practice, you'd need to maintain a mapping or query by timestamps)
    const events = await this.eventRepository.getEventsByTimeRange(startTime, endTime);

    return events;
  }
}
```

### 4. Handling Updates

When data changes in the database, you need to rebuild the tree:

```typescript
// Option 1: Periodic rebuild (e.g., every hour)
setInterval(async () => {
  const intervals = await eventRepo.getAllIntervals();
  intervalTreeService.rebuild(intervals);
  console.log('Interval tree rebuilt');
}, 3600000); // Every hour

// Option 2: Event-driven rebuild on data changes
eventEmitter.on('events:updated', async () => {
  const intervals = await eventRepo.getAllIntervals();
  intervalTreeService.rebuild(intervals);
});

// Option 3: Incremental updates (more complex)
// Rebuild only when significant changes occur
```

## Performance Considerations

### Time Complexity
- **Initialization**: O(n log n) - Building the tree
- **Query**: O(log n + k) - Where k is the number of results
- **Memory**: O(n) - Stores all intervals in memory

### Trade-offs

**Pros:**
- Very fast queries compared to database scans
- Reduces database load
- Works well for read-heavy workloads

**Cons:**
- Uses memory (100,000 intervals ≈ 1-2 MB)
- Stale data between rebuilds
- Requires rebuild on data changes

### When to Use

✅ **Use when:**
- High query volume (read-heavy)
- Infrequent data updates
- Data fits comfortably in memory
- Sub-millisecond query response needed

❌ **Don't use when:**
- Frequent data updates
- Data too large for memory
- Strong consistency required
- Write-heavy workload

## Current Implementation

The current implementation in `App.tsx` demonstrates this pattern:

```typescript
// Initialize tree on app startup
useEffect(() => {
  initializeIntervalTree(dummyIntervals);
}, []);

// Query using the tree
const filteredIntervals = queryIntervalsByTimeRange(
  startTimestamp,
  endTimestamp
);
```

## Next Steps for Production

1. **Add ID Mapping**: Map intervals to database IDs for fetching full records
2. **Implement Caching**: Use Redis to share the tree across service instances
3. **Add Monitoring**: Track tree rebuild times and query performance
4. **Implement Range Queries**: Optimize the `queryRange` method to avoid querying multiple points
5. **Handle Failures**: Graceful degradation if tree initialization fails
