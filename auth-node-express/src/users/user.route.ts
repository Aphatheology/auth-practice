import express, { Router } from "express";
import validate from "../middlewares/validate";
import * as userValidation from "./user.validation";
import * as userController from "./user.controller";
import auth from '../middlewares/auth';

const router: Router = express.Router();

router
  .route("/")
  .get(auth, userController.getProfile);
  
router.route('/send-verification-email').post(auth, userController.sendVerificationEmail);
router.route('/verify-email').post(validate(userValidation.verifyEmail), auth, userController.verifyEmail);
router.route('/send-set-password-email').post(auth, userController.sendSetPasswordEmail);
router.route('/set-password').post(validate(userValidation.setPassword), auth, userController.setPassword);

router.route("/logout").post(auth, userController.logout);

export default router;
