import { Router, Request, Response } from 'express';
import authRoute from './users/auth.route';
import userRoute from './users/user.route';
import { StatusCodes } from 'http-status-codes';

const router = Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);

router.use('*error', (req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).send({ message: 'Route Not Found' });
});

export default router;
