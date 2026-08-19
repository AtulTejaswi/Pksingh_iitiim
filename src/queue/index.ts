/**
 * Background job queue for AI processing (doubt resolution, mock test analysis).
 *
 * Uses BullMQ + Redis when REDIS_URL is configured. Falls back to synchronous
 * processing when Redis is unavailable (local dev, free-tier hosts without Redis).
 *
 * Environment variables:
 *   REDIS_URL — Redis connection string (e.g. redis://localhost:6379). Optional;
 *               without it, jobs run synchronously in the request handler.
 */

import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

// ─── Redis connection ────────────────────────────────────────────────────────

const REDIS_URL = process.env.REDIS_URL;
let connection: IORedis | null = null;

if (REDIS_URL) {
  connection = new IORedis(REDIS_URL, {
    maxRetriesPerRequest: null, // Required by BullMQ
    enableReadyCheck: false,
  });
  connection.on('error', (err) => {
    console.error('[queue] Redis connection error:', err.message);
  });
  connection.on('connect', () => {
    console.log('[queue] Connected to Redis');
  });
}

export const isQueueAvailable = (): boolean => Boolean(connection);

// ─── Job types ───────────────────────────────────────────────────────────────

export interface DoubtJobData {
  doubtId: string;
  userId: string;
  lessonId?: string;
  courseId?: string;
  subject?: string;
  questionText: string;
  questionImageUrl?: string;
}

export interface MockTestJobData {
  mockTestId: string;
  userId: string;
  courseId?: string;
  title: string;
  totalQuestions: number;
  correctAnswers: number;
  subjectBreakdown?: Record<string, { total: number; correct: number }>;
}

// ─── Queues ──────────────────────────────────────────────────────────────────

const QUEUE_NAME = 'ai-processing';

let doubtQueue: Queue | null = null;
let mockTestQueue: Queue | null = null;

if (connection) {
  const defaultOpts = {
    connection,
    defaultJobOptions: {
      attempts: 3,
      backoff: { type: 'exponential' as const, delay: 2000 },
      removeOnComplete: { age: 3600 }, // Keep completed jobs for 1 hour
      removeOnFail: { age: 86400 },    // Keep failed jobs for 24 hours
    },
  };

  doubtQueue = new Queue(`${QUEUE_NAME}:doubts`, defaultOpts);
  mockTestQueue = new Queue(`${QUEUE_NAME}:mock-tests`, defaultOpts);
}

// ─── Enqueue helpers ─────────────────────────────────────────────────────────

export const enqueueDoubtJob = async (data: DoubtJobData): Promise<string | null> => {
  if (!doubtQueue) return null;
  const job = await doubtQueue.add('resolve-doubt', data);
  return job.id?.toString() || null;
};

export const enqueueMockTestJob = async (data: MockTestJobData): Promise<string | null> => {
  if (!mockTestQueue) return null;
  const job = await mockTestQueue.add('analyze-mock-test', data);
  return job.id?.toString() || null;
};

// ─── Worker factories ────────────────────────────────────────────────────────
// These are exported so server.ts can start workers on boot.
// The actual processing logic lives in the controllers to avoid circular imports.

export type DoubtProcessor = (job: Job<DoubtJobData>) => Promise<void>;
export type MockTestProcessor = (job: Job<MockTestJobData>) => Promise<void>;

export const startDoubtWorker = (processor: DoubtProcessor): Worker | null => {
  if (!connection) return null;
  const worker = new Worker(`${QUEUE_NAME}:doubts`, processor, {
    connection,
    concurrency: 2,
  });
  worker.on('failed', (job, err) => {
    console.error(`[queue] Doubt job ${job?.id} failed:`, err.message);
  });
  worker.on('completed', (job) => {
    console.log(`[queue] Doubt job ${job.id} completed`);
  });
  return worker;
};

export const startMockTestWorker = (processor: MockTestProcessor): Worker | null => {
  if (!connection) return null;
  const worker = new Worker(`${QUEUE_NAME}:mock-tests`, processor, {
    connection,
    concurrency: 1,
  });
  worker.on('failed', (job, err) => {
    console.error(`[queue] Mock test job ${job?.id} failed:`, err.message);
  });
  worker.on('completed', (job) => {
    console.log(`[queue] Mock test job ${job.id} completed`);
  });
  return worker;
};

// ─── Graceful shutdown ──────────────────────────────────────────────────────

export const closeQueue = async (): Promise<void> => {
  if (doubtQueue) await doubtQueue.close();
  if (mockTestQueue) await mockTestQueue.close();
  if (connection) await connection.quit();
};
