import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
       res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }
    
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: number; username: string; role: string };
    
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token' 
    });
    return;   
  }
};

export const authorizeAdmin = (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
      return;
    }
    
    if (req.user.role !== 'ADMIN') {
      res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
      return;
    }
    
    next();
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
    return;
  }
}; 