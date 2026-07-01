import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';

export const tenantMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  // Verify that the user has a valid company ID
  if (!req.companyId) {
    return res.status(403).json({
      error: 'Company context required',
    });
  }

  // Add company context to request
  req.companyId = req.companyId;

  next();
};
