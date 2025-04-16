import express, { Router } from "express";
import validate from "../middlewares/validate";
import * as userController from "./user.controller";
import * as userValidation from "./user.validation";

const router: Router = express.Router();

router
  .route("/register")
  .post(validate(userValidation.register), userController.register);

router
  .route("/login")
  .post(validate(userValidation.login), userController.login);

router
  .route("/refresh")
  .post(validate(userValidation.refreshToken), userController.refreshAccessToken);

router.route('/forgot-password').post(validate(userValidation.forgotPassword), userController.forgotPassword);
router.route('/reset-password').post(validate(userValidation.resetPassword), userController.resetPassword);

export default router;
