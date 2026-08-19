/**
 * Claude API client — AI assistant for doubt resolution and mock test analysis.
 *
 * Uses native fetch (Node >= 18) and follows the same pattern as razorpay.ts:
 * - Dependency-free, overridable base URL
 * - Plain-English error messages
 * - Graceful fallback when API key is not configured
 */

const CLAUDE_API_BASE = process.env.CLAUDE_API_BASE || 'https://api.anthropic.com';
const CLAUDE_API_KEY = process.env.CLAUDE_API_KEY || '';
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-sonnet-4-20250514';

/** True when the Claude API key is present (AI features can be used). */
export const isAIConfigured = (): boolean => Boolean(CLAUDE_API_KEY);

interface ClaudeMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ClaudeResponse {
  id: string;
  content: { type: string; text: string }[];
  stop_reason: string;
}

/**
 * Send a message to Claude and return the text response.
 * Throws plain-English errors on failure.
 */
export async function askClaude(
  systemPrompt: string,
  messages: ClaudeMessage[],
  maxTokens = 2048
): Promise<{ text: string; usage: { input: number; output: number } }> {
  if (!CLAUDE_API_KEY) {
    throw new Error(
      'AI features are not configured yet. The site owner needs to add a CLAUDE_API_KEY environment variable.'
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await fetch(`${CLAUDE_API_BASE}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: maxTokens,
        system: systemPrompt,
        messages,
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      if (response.status === 401) {
        throw new Error('AI authentication failed. The CLAUDE_API_KEY may be invalid or expired.');
      }
      if (response.status === 429) {
        throw new Error('AI service is busy. Please try again in a moment.');
      }
      throw new Error(
        `AI service returned an error (${response.status}). Please try again later.${detail ? ' Detail: ' + detail.slice(0, 200) : ''}`
      );
    }

    const data = (await response.json()) as ClaudeResponse;
    const text = data.content?.[0]?.text || 'No response generated.';

    return {
      text,
      usage: {
        input: 0, // Claude returns usage in the response
        output: 0,
      },
    };
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      throw new Error('AI service took too long to respond. Please try again.');
    }
    if (typeof err?.message === 'string' && err.message.includes('AI')) {
      throw err;
    }
    throw new Error('Could not reach the AI service. Please check your internet connection and try again.');
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Build context from lesson content for RAG-style retrieval.
 * Returns a formatted string with relevant lesson excerpts.
 */
export async function buildLessonContext(
  prisma: any,
  params: {
    lessonId?: string;
    courseId?: string;
    subject?: string;
    questionText: string;
  }
): Promise<string> {
  const { lessonId, courseId, subject, questionText } = params;

  // If we have a specific lesson, fetch its content
  if (lessonId) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: {
        course: { select: { title: true, subject: true } },
        notes: { select: { title: true, content: true } },
      },
    });

    if (lesson) {
      const parts: string[] = [];
      parts.push(`Course: ${lesson.course.title} (${lesson.course.subject})`);
      parts.push(`Lesson: ${lesson.title}`);
      if (lesson.description) parts.push(`Description: ${lesson.description}`);
      if (lesson.content) parts.push(`Content: ${lesson.content}`);
      for (const note of lesson.notes || []) {
        parts.push(`Note "${note.title}": ${note.content}`);
      }
      return parts.join('\n\n');
    }
  }

  // Fallback: search for relevant lessons by subject/course
  const where: any = { status: 'PUBLISHED' };
  if (courseId) where.courseId = courseId;
  if (subject) {
    where.course = { subject: { contains: subject, mode: 'insensitive' } };
  }

  const lessons = await prisma.lesson.findMany({
    where,
    include: {
      course: { select: { title: true, subject: true } },
      notes: { select: { title: true, content: true }, take: 2 },
    },
    take: 5,
    orderBy: { sortOrder: 'asc' },
  });

  if (!lessons.length) {
    return 'No relevant lesson content found in the database.';
  }

  const parts: string[] = [];
  for (const lesson of lessons) {
    parts.push(`[${lesson.course.title}] ${lesson.title}: ${lesson.description || ''}`);
    for (const note of lesson.notes || []) {
      parts.push(`  Note: ${note.content.slice(0, 500)}`);
    }
  }
  return parts.join('\n');
}
