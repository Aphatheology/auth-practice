import express, { Router } from "express";
import passport from 'passport';
import validate from "../middlewares/validate";
import * as userController from "./user.controller";
import * as userValidation from "./user.validation";

const router: Router = express.Router();

router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  userController.googleCallback
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  userController.githubCallback
);

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
