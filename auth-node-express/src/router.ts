import { Router, Request, Response } from 'express';
import authRoute from './users/auth.route';
import userRoute from './users/user.route';
import { StatusCodes } from 'http-status-codes';
import { sendError } from './utils/apiResponse';

const router = Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);

router.use('*error', (req: Request, res: Response) => {
  sendError(res, StatusCodes.NOT_FOUND, 'Route Not found');
});

export default router;
