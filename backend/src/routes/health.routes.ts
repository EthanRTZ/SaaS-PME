import { Router, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth.middleware';
import logger from '../utils/logger';

const router = Router();

// Health check
router.get('/', (req: AuthenticatedRequest, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
});

// Database check
router.get('/database', async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Implémenter check de la DB
    res.json({
      database: 'connected',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Database health check failed:', error);
    res.status(503).json({
      database: 'disconnected',
      error: 'Database connection failed',
    });
  }
});

// Cache check
router.get('/cache', async (req: AuthenticatedRequest, res: Response) => {
  try {
    // TODO: Implémenter check du cache Redis
    res.json({
      cache: 'operational',
      timestamp: new Date(),
    });
  } catch (error) {
    logger.error('Cache health check failed:', error);
    res.status(503).json({
      cache: 'unavailable',
      error: 'Cache connection failed',
    });
  }
});

export default router;
