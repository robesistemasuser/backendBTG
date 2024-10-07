import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (token) {
    jwt.verify(token, 'your_secret_key', (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user; // Aquí es donde asignamos la propiedad user
      next();
    });
  } else {
    res.sendStatus(401);
  }
};
