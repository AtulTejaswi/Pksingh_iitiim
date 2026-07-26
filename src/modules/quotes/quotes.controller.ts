import { Request, Response } from 'express';
import { prisma } from '../../config/db';

const premiumQuotes = [
  {
    text: "There is only one single-pointed determination; many-branched and endless are the thoughts of the indecisive.",
    source: "Bhagavad Gita",
    reference: "2.41",
    tags: ["focus", "determination", "exam_prep"],
    isVerified: true,
  },
  {
    text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    source: "Marcus Aurelius",
    reference: "Meditations",
    tags: ["stoicism", "mindset", "resilience"],
    isVerified: true,
  },
  {
    text: "He who says he can and he who says he can't are both usually right.",
    source: "Confucius",
    reference: "Traditional/Attributed",
    tags: ["mindset", "belief", "growth"],
    isVerified: false,
  },
  {
    text: "We suffer more often in imagination than in reality.",
    source: "Seneca",
    reference: "Letters from a Stoic",
    tags: ["stoicism", "anxiety", "perspective"],
    isVerified: true,
  },
  {
    text: "If you desire to be pure, have firm faith, and slowly go on with your devotion without wasting your energy in useless scriptural discussions and arguments.",
    source: "Ramakrishna Paramahamsa",
    reference: "Traditional/Attributed",
    tags: ["faith", "action", "focus"],
    isVerified: false,
  },
  {
    text: "The mind is everything. What you think you become.",
    source: "Buddha",
    reference: "Dhammapada",
    tags: ["mindset", "buddhism", "focus"],
    isVerified: true,
  },
  {
    text: "Knowing others is intelligence; knowing yourself is true wisdom. Mastering others is strength; mastering yourself is true power.",
    source: "Lao Tzu",
    reference: "Tao Te Ching",
    tags: ["wisdom", "taoism", "self-control"],
    isVerified: true,
  }
];

export async function getQuotes(req: Request, res: Response) {
  try {
    const allQuotes = await prisma.quote.findMany();
    if (allQuotes.length === 0) {
      return res.json({ success: true, quotes: [] });
    }
    const shuffled = allQuotes.sort(() => 0.5 - Math.random());
    const selectedQuotes = shuffled.slice(0, 10);
    return res.json({ success: true, quotes: selectedQuotes });
  } catch (error: any) {
    console.error("Fetch Quotes Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

export async function cronQuotes(req: Request, res: Response) {
  try {
    let newQuotesCount = 0;

    for (const quote of premiumQuotes) {
      const existing = await prisma.quote.findFirst({
        where: { text: quote.text },
      });
      if (!existing) {
        await prisma.quote.create({ data: quote });
        newQuotesCount++;
      }
    }

    try {
      const response = await fetch('https://zenquotes.io/api/random');
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const apiQuote = data[0];
          const existing = await prisma.quote.findFirst({
            where: { text: apiQuote.q },
          });
          if (!existing) {
            await prisma.quote.create({
              data: {
                text: apiQuote.q,
                source: apiQuote.a,
                reference: "ZenQuotes API",
                tags: ["daily_wisdom"],
                isVerified: false,
              }
            });
            newQuotesCount++;
          }
        }
      }
    } catch (apiError) {
      console.error("Failed to fetch from ZenQuotes API:", apiError);
    }

    return res.json({
      success: true,
      message: `Cron job executed successfully. Added ${newQuotesCount} new quotes.`
    });
  } catch (error: any) {
    console.error("Quotes Cron Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
