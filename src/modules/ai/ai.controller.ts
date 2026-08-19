import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { prisma } from '../../config/db';
import { askClaude, buildLessonContext, isAIConfigured } from '../../utils/ai';

// ─── DOUBT RESOLUTION ──────────────────────────────────────────────────────

/**
 * POST /api/ai/ask — Submit a doubt question for AI resolution.
 *
 * Creates a Doubt record, fetches relevant lesson context (RAG),
 * sends to Claude for an answer, and flags low-confidence answers for review.
 */
export const askDoubt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { lessonId, courseId, subject, questionText, questionImageUrl } = req.body;

    if (!questionText || typeof questionText !== 'string' || questionText.trim().length < 10) {
      res.status(400).json({
        error: 'Please enter a clear question (at least 10 characters).',
      });
      return;
    }

    if (!isAIConfigured()) {
      res.status(503).json({
        error:
          'AI doubt resolution is not configured yet. The site owner needs to set up the CLAUDE_API_KEY environment variable.',
      });
      return;
    }

    // Create the doubt record (PENDING while AI processes)
    const doubt = await prisma.doubt.create({
      data: {
        userId: req.user.id,
        lessonId: lessonId || null,
        courseId: courseId || null,
        subject: subject || null,
        questionText: questionText.trim(),
        questionImageUrl: questionImageUrl || null,
        status: 'PENDING',
      },
    });

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
        content: `Lesson context:\n${lessonContext}\n\nStudent question: ${questionText.trim()}`,
      },
    ]);

    // Estimate confidence based on answer quality heuristics
    const confidence = estimateConfidence(result.text, lessonContext);

    // Update the doubt with AI answer
    const updatedDoubt = await prisma.doubt.update({
      where: { id: doubt.id },
      data: {
        aiAnswer: result.text,
        aiConfidence: confidence,
        status: confidence >= 0.7 ? 'AI_ANSWERED' : 'FLAGGED_FOR_REVIEW',
      },
    });

    res.json({
      doubt: updatedDoubt,
      confidence,
      flaggedForReview: confidence < 0.7,
      message:
        confidence < 0.7
          ? 'Your question has been answered, but it has been flagged for a tutor review. A mentor will follow up soon.'
          : 'Your doubt has been resolved!',
    });
  } catch (err: any) {
    console.error('[ai/askDoubt]', err);
    res.status(500).json({
      error: err.message || 'Failed to process your question. Please try again.',
    });
  }
};

/**
 * GET /api/ai/doubts — List the current user's doubts (with status).
 */
export const listMyDoubts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const doubts = await prisma.doubt.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    res.json({ doubts });
  } catch (err: any) {
    console.error('[ai/listMyDoubts]', err);
    res.status(500).json({ error: 'Failed to load your doubts.' });
  }
};

/**
 * GET /api/ai/doubts/pending — (TUTOR/ADMIN) List doubts awaiting human review.
 */
export const listPendingDoubts = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    // Only TUTOR, MENTOR, INSTRUCTOR, or SUPER_ADMIN can see pending doubts
    const allowedRoles = ['SUPER_ADMIN', 'TUTOR', 'MENTOR', 'INSTRUCTOR'];
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    const doubts = await prisma.doubt.findMany({
      where: {
        status: { in: ['PENDING', 'FLAGGED_FOR_REVIEW'] },
      },
      include: {
        user: { select: { fullName: true, email: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    res.json({ doubts });
  } catch (err: any) {
    console.error('[ai/listPendingDoubts]', err);
    res.status(500).json({ error: 'Failed to load pending doubts.' });
  }
};

/**
 * PATCH /api/ai/doubts/:id/resolve — (TUTOR/ADMIN) Manually resolve a doubt.
 */
export const resolveDoubt = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const allowedRoles = ['SUPER_ADMIN', 'TUTOR', 'MENTOR', 'INSTRUCTOR'];
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    const id = req.params.id as string;
    const { resolutionNote } = req.body;

    if (!resolutionNote || typeof resolutionNote !== 'string') {
      res.status(400).json({ error: 'Please provide a resolution note.' });
      return;
    }

    const doubt = await prisma.doubt.findUnique({ where: { id } });
    if (!doubt) {
      res.status(404).json({ error: 'Doubt not found.' });
      return;
    }

    const updated = await prisma.doubt.update({
      where: { id },
      data: {
        status: 'RESOLVED',
        assignedToId: req.user.id,
        resolutionNote: resolutionNote.trim(),
      },
    });

    res.json({ doubt: updated });
  } catch (err: any) {
    console.error('[ai/resolveDoubt]', err);
    res.status(500).json({ error: 'Failed to resolve doubt.' });
  }
};

// ─── MOCK TEST ANALYSIS ────────────────────────────────────────────────────

/**
 * POST /api/ai/mock-test — Submit a mock test answer sheet for AI analysis.
 *
 * Accepts total/correct counts and optional subject details.
 * Generates a weak-topic breakdown and suggested next-lesson sequence.
 */
export const analyzeMockTest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { courseId, title, totalQuestions, correctAnswers, subjectBreakdown } = req.body;

    if (!title || typeof title !== 'string') {
      res.status(400).json({ error: 'Please provide a test title.' });
      return;
    }

    if (!totalQuestions || totalQuestions < 1 || totalQuestions > 500) {
      res.status(400).json({ error: 'Total questions must be between 1 and 500.' });
      return;
    }

    if (correctAnswers === undefined || correctAnswers < 0 || correctAnswers > totalQuestions) {
      res.status(400).json({
        error: `Correct answers must be between 0 and ${totalQuestions}.`,
      });
      return;
    }

    if (!isAIConfigured()) {
      // Without AI, still record the test but skip analysis
      const mockTest = await prisma.mockTest.create({
        data: {
          userId: req.user.id,
          courseId: courseId || null,
          title,
          totalQuestions,
          correctAnswers,
          score: Math.round((correctAnswers / totalQuestions) * 100),
          status: 'PENDING',
        },
      });

      res.json({
        mockTest,
        aiAnalysis: null,
        message: 'Test recorded. AI analysis is not configured yet.',
      });
      return;
    }

    // Build context for analysis
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const analysisContext = buildMockTestContext(totalQuestions, correctAnswers, subjectBreakdown);

    // Fetch relevant lesson content for suggested lessons
    const relevantLessons = courseId
      ? await prisma.lesson.findMany({
          where: { courseId, status: 'PUBLISHED' },
          select: { id: true, title: true, description: true, sortOrder: true },
          orderBy: { sortOrder: 'asc' },
        })
      : [];

    const lessonList = relevantLessons
      .map((l: any, i: number) => `${i + 1}. [${l.id}] ${l.title} — ${l.description || 'No description'}`)
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

    // Create the mock test record
    const mockTest = await prisma.mockTest.create({
      data: {
        userId: req.user.id,
        courseId: courseId || null,
        title,
        totalQuestions,
        correctAnswers,
        score,
        weakTopics: JSON.stringify(weakTopics),
        suggestedLessons: JSON.stringify(suggestedLessons),
        aiAnalysis: result.text,
        status: 'COMPLETED',
      },
    });

    res.json({
      mockTest,
      weakTopics,
      suggestedLessons,
      score,
      message:
        score >= 70
          ? 'Great performance! Keep up the good work.'
          : 'Analysis complete. Check the detailed breakdown and suggested lessons.',
    });
  } catch (err: any) {
    console.error('[ai/analyzeMockTest]', err);
    res.status(500).json({
      error: err.message || 'Failed to analyze your mock test. Please try again.',
    });
  }
};

/**
 * GET /api/ai/mock-tests — List the current user's mock tests.
 */
export const listMyMockTests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const mockTests = await prisma.mockTest.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    res.json({ mockTests });
  } catch (err: any) {
    console.error('[ai/listMyMockTests]', err);
    res.status(500).json({ error: 'Failed to load your mock tests.' });
  }
};

// ─── HELPERS ────────────────────────────────────────────────────────────────

function estimateConfidence(answer: string, context: string): number {
  let confidence = 0.5;

  // Longer, more detailed answers are usually better
  if (answer.length > 200) confidence += 0.1;
  if (answer.length > 500) confidence += 0.1;

  // If the answer references the context, it's likely grounded
  const contextWords = context.split(/\s+/).slice(0, 20);
  const referencedWords = contextWords.filter((w) =>
    answer.toLowerCase().includes(w.toLowerCase())
  );
  const referenceRatio = referencedWords.length / Math.min(contextWords.length, 20);
  confidence += referenceRatio * 0.15;

  // Hedging language suggests low confidence
  const hedgePatterns = ['not sure', 'might be', 'possibly', 'could be', 'uncertain', 'not certain'];
  const hedgeCount = hedgePatterns.filter((p) => answer.toLowerCase().includes(p)).length;
  confidence -= hedgeCount * 0.1;

  return Math.max(0, Math.min(1, Math.round(confidence * 100) / 100));
}

function buildMockTestContext(
  totalQuestions: number,
  correctAnswers: number,
  subjectBreakdown?: Record<string, { total: number; correct: number }>
): string {
  const score = Math.round((correctAnswers / totalQuestions) * 100);
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

  return parts.join('\n');
}

function extractWeakTopics(analysis: string): string[] {
  // Simple heuristic: look for "weak" or "needs improvement" followed by topic names
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

  return weakTopics.slice(0, 5); // Limit to top 5
}

function extractSuggestedLessons(
  analysis: string,
  lessons: Array<{ id: string; title: string; description: string | null; sortOrder: number }>
): string[] {
  const suggested: string[] = [];

  for (const lesson of lessons) {
    // Check if the AI mentioned this lesson's title
    if (analysis.toLowerCase().includes(lesson.title.toLowerCase())) {
      if (!suggested.includes(lesson.id)) {
        suggested.push(lesson.id);
      }
    }
  }

  return suggested.slice(0, 5); // Limit to top 5
}
