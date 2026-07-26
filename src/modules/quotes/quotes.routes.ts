import { Router } from 'express';
import { getQuotes, cronQuotes } from './quotes.controller';

const router = Router();

router.get('/', getQuotes);
router.get('/cron', cronQuotes);

export default router;
