/**
 * Background worker processors for AI doubt resolution and mock test analysis.
 *
 * These run as BullMQ workers when Redis is available. When Redis is not
 * configured, the controllers process requests synchronously (same logic,
 * just inline instead of queued).
 */

import { Job } from 'bullmq';
import { prisma } from '../config/db';
import { askClaude, buildLessonContext } from '../utils/ai';
import type { DoubtJobData, MockTestJobData } from './index';

// ─── Doubt Resolution Worker ─────────────────────────────────────────────────

export const processDoubtJob = async (job: Job<DoubtJobData>): Promise<void> => {
  const { doubtId, lessonId, courseId, subject, questionText } = job.data;

  // Build context from lesson content (RAG)
  const lessonContext = await buildLessonContext(prisma, {
    lessonId,
    courseId,
    subject,
    questionText,
  });

  // Call Claude for an answer
  const systemPrompt = `You are an expert JEE/NEET tutor helping a student with their doubt.
Use the provided lesson context to give a clear, accurate, and helpful answer.
If the question is about a specific topic, explain the concept step by step.
If you're not confident in your answer (confidence < 0.7), indicate this clearly.
Always be encouraging and educational.`;

  const result = await askClaude(systemPrompt, [
    {
      role: 'user',
      content: `Lesson context:\n${lessonContext}\n\nStudent question: ${questionText}`,
    },
  ]);

  // Estimate confidence
  const confidence = estimateConfidence(result.text, lessonContext);

  // Update the doubt with AI answer
  await prisma.doubt.update({
    where: { id: doubtId },
    data: {
      aiAnswer: result.text,
      aiConfidence: confidence,
      status: confidence >= 0.7 ? 'AI_ANSWERED' : 'FLAGGED_FOR_REVIEW',
    },
  });
};

// ─── Mock Test Analysis Worker ───────────────────────────────────────────────

export const processMockTestJob = async (job: Job<MockTestJobData>): Promise<void> => {
  const { mockTestId, courseId, title, totalQuestions, correctAnswers, subjectBreakdown } = job.data;

  const score = Math.round((correctAnswers / totalQuestions) * 100);

  // Build context for analysis
  const parts: string[] = [
    `Total questions: ${totalQuestions}`,
    `Correct answers: ${correctAnswers}`,
    `Score: ${score}%`,
    `Incorrect: ${totalQuestions - correctAnswers}`,
  ];

  if (subjectBreakdown && typeof subjectBreakdown === 'object') {
    parts.push('\nSubject-wise breakdown:');
    for (const [subject, data] of Object.entries(subjectBreakdown)) {
      const subjectScore = Math.round((data.correct / data.total) * 100);
      parts.push(`  ${subject}: ${data.correct}/${data.total} (${subjectScore}%)`);
    }
  }

  const analysisContext = parts.join('\n');

  // Fetch relevant lesson content
  const relevantLessons = courseId
    ? await prisma.lesson.findMany({
        where: { courseId, status: 'PUBLISHED' },
        select: { id: true, title: true, description: true, sortOrder: true },
        orderBy: { sortOrder: 'asc' },
      })
    : [];

  const lessonList = relevantLessons
    .map((l, i) => `${i + 1}. [${l.id}] ${l.title} — ${l.description || 'No description'}`)
    .join('\n');

  const systemPrompt = `You are an expert JEE/NEET exam analyst. Analyze the student's mock test performance and provide:
1. A detailed analysis of their performance
2. Identification of weak topics/areas
3. A suggested study plan with specific lessons to review
4. Motivation and improvement tips

Be specific and actionable. Format your response in clear sections.`;

  const result = await askClaude(systemPrompt, [
    {
      role: 'user',
      content: `Mock test results:\n${analysisContext}\n\nAvailable lessons:\n${lessonList || 'No specific lessons available'}\n\nPlease analyze the performance and provide recommendations.`,
    },
  ]);

  // Parse weak topics and suggested lessons from AI response
  const weakTopics = extractWeakTopics(result.text);
  const suggestedLessons = extractSuggestedLessons(result.text, relevantLessons);

  // Update the mock test record
  await prisma.mockTest.update({
    where: { id: mockTestId },
    data: {
      weakTopics: JSON.stringify(weakTopics),
      suggestedLessons: JSON.stringify(suggestedLessons),
      aiAnalysis: result.text,
      status: 'COMPLETED',
    },
  });
};

// ─── Helpers (same as in ai.controller.ts) ───────────────────────────────────

function estimateConfidence(answer: string, context: string): number {
  let confidence = 0.5;
  if (answer.length > 200) confidence += 0.1;
  if (answer.length > 500) confidence += 0.1;
  const contextWords = context.split(/\s+/).slice(0, 20);
  const referencedWords = contextWords.filter((w) =>
    answer.toLowerCase().includes(w.toLowerCase())
  );
  const referenceRatio = referencedWords.length / Math.min(contextWords.length, 20);
  confidence += referenceRatio * 0.15;
  const hedgePatterns = ['not sure', 'might be', 'possibly', 'could be', 'uncertain', 'not certain'];
  const hedgeCount = hedgePatterns.filter((p) => answer.toLowerCase().includes(p)).length;
  confidence -= hedgeCount * 0.1;
  return Math.max(0, Math.min(1, Math.round(confidence * 100) / 100));
}

function extractWeakTopics(analysis: string): string[] {
  const weakTopics: string[] = [];
  const patterns = [
    /(?:weak|needs?\s+(?:improvement|work)|struggling\s+with|areas?\s+(?:of\s+)?concern)[\s:]+([^\n.]+)/gi,
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(analysis)) !== null) {
      const topic = match[1].trim();
      if (topic.length > 3 && topic.length < 100 && !weakTopics.includes(topic)) {
        weakTopics.push(topic);
      }
    }
  }
  return weakTopics.slice(0, 5);
}

function extractSuggestedLessons(
  analysis: string,
  lessons: Array<{ id: string; title: string; description: string | null; sortOrder: number }>
): string[] {
  const suggested: string[] = [];
  for (const lesson of lessons) {
    if (analysis.toLowerCase().includes(lesson.title.toLowerCase())) {
      if (!suggested.includes(lesson.id)) {
        suggested.push(lesson.id);
      }
    }
  }
  return suggested.slice(0, 5);
}
